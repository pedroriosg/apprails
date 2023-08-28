const supertest = require('supertest');
const app = require('../../../../app');
const db = require('../../../../models');
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

describe('Course Students', () => {
  it('Get all students in the course works correctly when user is correct', async () => {
    const res = await request
      .get(`/courses/1/students`)
      .set('Authorization', `Bearer ${user.token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('success');
    expect(res.body).toHaveProperty('data');

    expect(res.body.success).toEqual(true);
    expect(res.body.data[0]).toHaveProperty('id');
    expect(res.body.data[0]).toHaveProperty('username');
    expect(res.body.data[0].username).toEqual('pedro');
  });

  it('Get all students in the course fails when user is no logged', async () => {
    const res = await request.get(`/courses/1/students`);
    expect(res.statusCode).toEqual(401);
  });
});
