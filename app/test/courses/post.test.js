const supertest = require('supertest');
const app = require('../../app');
const db = require('../../models');
const jwt = require('jsonwebtoken');
const request = supertest(app);

beforeAll(async () => {
  await db.sequelize.authenticate();
});

afterAll(() => {
  db.sequelize.close();
});

describe('Courses', () => {
  it('Create course works correctly when user is correct', async () => {
    const res = await request.post(`/courses`).send({
      subjectId: 1,
      name: 'Test Course',
      schoolId: 1,
      driveUrl: '09uu9yasdfqwe872adfasdf',
      GradeId: 1,
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('data');

    expect(res.body.status).toEqual('success');
    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data).toHaveProperty('name');
    expect(res.body.data.name).toEqual('Test Course');
  });

  it('Create course fails when name, schoolID and subjectId already exists', async () => {
    const res = await request.post(`/courses`).send({
      subjectId: 1,
      name: 'Test Course',
      schoolId: 1,
      driveUrl: '09uu9yasdfqwe872adfasdf',
      GradeId: 1,
    });
    expect(res.statusCode).toEqual(409);
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('message');
    expect(res.body).toHaveProperty('details');

    expect(res.body.status).toEqual('error');
    expect(res.body.message).toEqual('Course with that name alredy exists');
  });
});
