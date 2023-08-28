const supertest = require('supertest');
const app = require('../../../app');
const db = require('../../../models');
const request = supertest(app);

beforeAll(async () => {
  await db.sequelize.authenticate();
});

afterAll(() => {
  db.sequelize.close();
});

describe('Signup', () => {
  it('Signup works correctly when user is correct', async () => {
    const res = await request.post(`/auth/signup`).send({
      username: 'testerCorrect',
      email: 'testercorrect@gmail.com',
      password: 'tester123',
      RoleId: 1,
      SchoolId: 1,
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('token');

    expect(res.body.status).toEqual('success');
    expect(res.body.token).toBeDefined();
  });

  it('Signup fails when email is used', async () => {
    const res = await request.post(`/auth/signup`).send({
      username: 'tester',
      email: 'pedro@gmail.com',
      password: 'tester123',
      RoleId: 1,
      SchoolId: 1,
    });
    expect(res.statusCode).toEqual(409);
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('message');
    expect(res.body).toHaveProperty('details');

    expect(res.body.status).toEqual('error');
    expect(res.body.message).toEqual('User with that email already exists');
  });

  it('Signup fails when username is too short', async () => {
    const res = await request.post(`/auth/signup`).send({
      username: 't',
      email: 'testerfail@gmail.com',
      password: 'tester123',
      RoleId: 1,
      SchoolId: 1,
    });
    expect(res.statusCode).toEqual(422);
    expect(res.body).toHaveProperty('errors');
  });

  it('Signup fails when username is too big', async () => {
    const res = await request.post(`/auth/signup`).send({
      username: 'a'.repeat(51),
      email: 'testerfail@gmail.com',
      password: 'tester123',
      RoleId: 1,
      SchoolId: 1,
    });
    expect(res.statusCode).toEqual(422);
    expect(res.body).toHaveProperty('errors');
  });

  it('Signup fails when email format is incorrect', async () => {
    const res = await request.post(`/auth/signup`).send({
      username: 'tester',
      email: 'tester',
      password: 'tester123',
      RoleId: 1,
      SchoolId: 1,
    });
    expect(res.statusCode).toEqual(422);
    expect(res.body).toHaveProperty('errors');
  });

  it('Signup fails when password is too short', async () => {
    const res = await request.post(`/auth/signup`).send({
      username: 'tester',
      email: 'testerfail@gmail.com',
      password: 'test',
      RoleId: 1,
      SchoolId: 1,
    });
    expect(res.statusCode).toEqual(422);
    expect(res.body).toHaveProperty('errors');
  });

  it('Signup fails when password is too big', async () => {
    const res = await request.post(`/auth/signup`).send({
      username: 'tester',
      email: 'testerfail@gmail.com',
      password: 't'.repeat(51),
      RoleId: 1,
      SchoolId: 1,
    });
    expect(res.statusCode).toEqual(422);
    expect(res.body).toHaveProperty('errors');
  });

  it('Signup fails when RoleId is not a number', async () => {
    const res = await request.post(`/auth/signup`).send({
      username: 'tester',
      email: 'testerfail@gmail.com',
      password: 'tester123',
      RoleId: 'a',
      SchoolId: 1,
    });
    expect(res.statusCode).toEqual(422);
    expect(res.body).toHaveProperty('errors');
  });

  it('Signup fails when SchoolId is not a number', async () => {
    const res = await request.post(`/auth/signup`).send({
      username: 'tester',
      email: 'testerfail@gmail.com',
      password: 'tester123',
      RoleId: 1,
      SchoolId: 'a',
    });
    expect(res.statusCode).toEqual(422);
    expect(res.body).toHaveProperty('errors');
  });
});
