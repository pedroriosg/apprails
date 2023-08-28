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
  userToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
});

afterAll(() => {
  db.sequelize.close();
});

describe('Subjects', () => {
  it('Get subjects works correctly', async () => {
    const res = await request
      .get(`/subjects`)
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('data');

    expect(res.body.status).toEqual('success');
  });

  it('Get subjects fails when token is not provided', async () => {
    const res = await request.get(`/subjects`);
    expect(res.statusCode).toEqual(401);
  });
});
