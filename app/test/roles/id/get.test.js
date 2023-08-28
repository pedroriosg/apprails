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
  userToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
});

afterAll(() => {
  db.sequelize.close();
});

describe('Roles', () => {
  it('Get role by id works correctly', async () => {
    const res = await request
      .get(`/roles/1`)
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('success');
    expect(res.body).toHaveProperty('data');

    expect(res.body.success).toEqual(true);
    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data).toHaveProperty('name');

    expect(res.body.data.name).toEqual('student');
  });

  it('Get role by id fails when token is not provided', async () => {
    const res = await request.get(`/schools/1`);
    expect(res.statusCode).toEqual(401);
  });

  it('Get role by id fails when school does not exist', async () => {
    const res = await request
      .get(`/roles/999`)
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('message');
    expect(res.body).toHaveProperty('details');

    expect(res.body.status).toEqual('error');
    expect(res.body.message).toEqual('Role not found');
  });
});
