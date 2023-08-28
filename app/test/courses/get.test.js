const supertest = require('supertest');
const app = require('../../app');
const db = require('../../models');
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
  it('Get all courses works correctly when user is correct', async () => {
    const res = await request
      .get(`/courses`)
      .set('Authorization', `Bearer ${user.token}`);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('data');

    expect(res.body.status).toEqual('success');
    expect(res.body.data[0]).toHaveProperty('id');
    expect(res.body.data[0]).toHaveProperty('name');
    expect(res.body.data[0].name).toEqual('Matemáticas');
  });

  it('Get all courses fails when user is no logged', async () => {
    const res = await request.get(`/courses`);
    expect(res.statusCode).toEqual(401);
  });
});
