const supertest = require('supertest');
const app = require('../../app');
const db = require('../../models');
const request = supertest(app);

beforeAll(async () => {
  await db.sequelize.authenticate();
});

afterAll(() => {
  db.sequelize.close();
});

describe('Roles', () => {
  it('Create role works correctly', async () => {
    const res = await request.post(`/roles`).send({
      name: 'testerRole',
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('data');

    expect(res.body.status).toEqual('success');
    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data).toHaveProperty('name');
    expect(res.body.data.name).toEqual('testerRole');
  });

  it('Create role fails when name is too short', async () => {
    const res = await request.post(`/roles`).send({
      name: 'S',
    });
    expect(res.statusCode).toEqual(422);
    expect(res.body).toHaveProperty('errors');
  });

  it('Create role fails when name is too long', async () => {
    const res = await request.post(`/roles`).send({
      name: 'S'.repeat(256),
    });
    expect(res.statusCode).toEqual(422);
    expect(res.body).toHaveProperty('errors');
  });

  it('Create role fails when name is taken', async () => {
    const res = await request.post(`/roles`).send({
      name: 'testerRole',
    });
    expect(res.statusCode).toEqual(409);
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('message');

    expect(res.body.status).toEqual('error');
    expect(res.body.message).toEqual('Role with that name alredy exists');
  });
});
