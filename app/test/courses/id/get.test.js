const supertest = require('supertest');
const app = require('../../../app');
const db = require('../../../models');
const jwt = require('jsonwebtoken');
const request = supertest(app);

beforeAll(async () => {
  await db.sequelize.authenticate();

  user = await db.User.findOne({
    where: {
      email: 'pedro@gmail.com',
    },
  });
  user.token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
});

afterAll(() => {
  db.sequelize.close();
});

describe('Courses', () => {
  it('Get the course by id works correctly when user is correct', async () => {
    const res = await request
      .get(`/courses/1`)
      .set('Authorization', `Bearer ${user.token}`);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('success');
    expect(res.body).toHaveProperty('data');

    expect(res.body.success).toEqual(true);
    expect(res.body.data).toHaveProperty('School');
    expect(res.body.data).toHaveProperty('Subject');
    expect(res.body.data).toHaveProperty('UserCourses');
  });

  it('Get the course by id fails when user is no logged', async () => {
    const res = await request.get(`/courses/1`);
    expect(res.statusCode).toEqual(401);
  });

  it('Get the course by id fails when course does not exist', async () => {
    const res = await request
      .get(`/courses/999999`)
      .set('Authorization', `Bearer ${user.token}`);
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('message');
    expect(res.body).toHaveProperty('details');

    expect(res.body.status).toEqual('error');
    expect(res.body.message).toEqual('Course not found');
  });
});
