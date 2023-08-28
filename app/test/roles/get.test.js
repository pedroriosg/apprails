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

describe('Roles', () => {
  it('Get roles works correctly', async () => {
    const res = await request
      .get(`/roles`)
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('data');

    expect(res.body.status).toEqual('success');
    expect(res.body.data[0]).toHaveProperty('id');
    expect(res.body.data[0]).toHaveProperty('name');

    expect(res.body.data[0].name).toEqual('student');
    expect(res.body.data[1].name).toEqual('teacher');
    expect(res.body.data[2].name).toEqual('tutor');
    expect(res.body.data[3].name).toEqual('head');
    expect(res.body.data[4].name).toEqual('director');
  });

  it('Get roles fails when token is not provided', async () => {
    const res = await request.get(`/roles`);
    expect(res.statusCode).toEqual(401);
  });
});
