const supertest = require('supertest');
const app = require('../../../app');
const db = require('../../../models');
const request = supertest(app);

beforeAll(async () => {
  await db.sequelize.authenticate();

  correctUser = await db.User.findOne({
    where: {
      email: 'pedro@gmail.com',
    },
  });
});

afterAll(() => {
  db.sequelize.close();
});

describe('Login', () => {
  it('Login works correctly when user is correct', async () => {
    const res = await request.post(`/auth/login`).send({
      email: correctUser.email,
      password: 'santiago',
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('token');

    expect(res.body.status).toEqual('success');
    expect(res.body.token).toBeDefined();
  });

  it('Login fails when email is incorrect', async () => {
    const res = await request.post(`/auth/login`).send({
      email: 'incorrect@gmail.com',
      password: 'santiago',
    });
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('message');
    expect(res.body).toHaveProperty('details');

    expect(res.body.status).toEqual('error');
    expect(res.body.message).toEqual('User not found');
  });

  it('Login fails when password is incorrect', async () => {
    const res = await request.post(`/auth/login`).send({
      email: correctUser.email,
      password: 'incorrect',
    });
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('message');
    expect(res.body).toHaveProperty('details');

    expect(res.body.status).toEqual('error');
    expect(res.body.message).toEqual('Invalid password');
  });

  it('Login fails when email has wrong format', async () => {
    const res = await request.post(`/auth/login`).send({
      email: 'pedro',
      password: 'santiago',
    });
    expect(res.statusCode).toEqual(422);
    expect(res.body).toHaveProperty('errors');
  });

  it('Login fails when password has wrong format', async () => {
    const res = await request.post(`/auth/login`).send({
      email: 'pedro@gmail.com',
      password: 's',
    });
    expect(res.statusCode).toEqual(422);
    expect(res.body).toHaveProperty('errors');
  });
});
