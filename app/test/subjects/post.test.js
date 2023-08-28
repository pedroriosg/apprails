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

describe('Subjects', () => {
  it('Create subject works correctly', async () => {
    const res = await request.post(`/subjects`).send({
      name: 'Subject 1',
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('success');
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data).toHaveProperty('name');

    expect(res.body.success).toEqual(true);
    expect(res.body.data.name).toEqual('Subject 1');
  });

  it('Create subject fails when name is empty', async () => {
    const res = await request.post(`/subjects`).send({
      name: '',
    });
    expect(res.statusCode).toEqual(422);
    expect(res.body).toHaveProperty('errors');
  });

  it('Create subject fails when name is too long', async () => {
    const res = await request.post(`/subjects`).send({
      name: 'a'.repeat(256),
    });
    expect(res.statusCode).toEqual(422);
    expect(res.body).toHaveProperty('errors');
  });

  it('Create subject fails when name is too short', async () => {
    const res = await request.post(`/subjects`).send({
      name: 'aa',
    });
    expect(res.statusCode).toEqual(422);
    expect(res.body).toHaveProperty('errors');
  });

  it('Create subject fails when subject already exists', async () => {
    const res = await request.post(`/subjects`).send({
      name: 'Subject 1',
    });
    expect(res.statusCode).toEqual(409);
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('message');
    expect(res.body).toHaveProperty('details');

    expect(res.body.status).toEqual('error');
    expect(res.body.message).toEqual('Subject with that name alredy exists');
  });
});
