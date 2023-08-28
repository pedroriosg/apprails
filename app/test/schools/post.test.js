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

describe('Schools', () => {
  it('Create school works correctly', async () => {
    const res = await request.post(`/schools`).send({
      name: 'School 1',
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('success');
    expect(res.body).toHaveProperty('data');

    expect(res.body.success).toEqual(true);
    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data).toHaveProperty('name');
    expect(res.body.data.name).toEqual('School 1');
  });

  it('Create school fails when name is too short', async () => {
    const res = await request.post(`/schools`).send({
      name: 'S',
    });
    expect(res.statusCode).toEqual(422);
    expect(res.body).toHaveProperty('errors');
  });

  it('Create school fails when name is too long', async () => {
    const res = await request.post(`/schools`).send({
      name: 'S'.repeat(256),
    });
    expect(res.statusCode).toEqual(422);
    expect(res.body).toHaveProperty('errors');
  });

  it('Create school fails when name is taken', async () => {
    const res = await request.post(`/schools`).send({
      name: 'School 1',
    });
    expect(res.statusCode).toEqual(409);
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('message');

    expect(res.body.status).toEqual('error');
    expect(res.body.message).toEqual('School with that name alredy exists');
  });
});
