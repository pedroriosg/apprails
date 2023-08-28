const supertest = require('supertest');
const app = require('../../../app');
const db = require('../../../models');
const jwt = require('jsonwebtoken');
const request = supertest(app);

beforeAll(async () => {
  await db.sequelize.authenticate();

  correctUser = await db.User.findOne({
    where: {
      email: 'pedro@gmail.com',
    },
  });
  correctUser.token = jwt.sign({ id: correctUser.id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
});

afterAll(() => {
  db.sequelize.close();
});

describe('Subject', () => {
  it('Get subject by id works correctly when subject exists', async () => {
    const res = await request
      .get(`/subjects/1`)
      .set('Authorization', `Bearer ${correctUser.token}`);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data).toHaveProperty('name');

    expect(res.body.status).toEqual('success');
    expect(res.body.data.name).toEqual('Matemáticas');
  });

  it("Get subject by id fails when subject doesn't exist", async () => {
    const res = await request
      .get(`/subjects/999`)
      .set('Authorization', `Bearer ${correctUser.token}`);
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('message');
    expect(res.body).toHaveProperty('details');

    expect(res.body.status).toEqual('error');
    expect(res.body.message).toEqual('Subject not found');
  });

  it('Get subject by id fails when token is not provided', async () => {
    const res = await request.get(`/subjects/1`);
    expect(res.statusCode).toEqual(401);
  });
});
