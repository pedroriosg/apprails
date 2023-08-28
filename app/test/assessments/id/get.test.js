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
  newAssessment = await db.Assessment.create({
    id: 1,
    name: 'testAssessment',
    dateIn: '2023-06-19T03:41:39.538Z',
    dateOut: '2023-06-19T03:41:39.538Z',
    correctAnswer: 'A',
    createdAt: '2023-06-19T03:41:39.538Z',
    updatedAt: '2023-06-19T03:41:39.538Z',
  });
});

afterAll(() => {
  db.sequelize.close();
});

describe('Assessments', () => {
  it('Get assessment by id works correctly', async () => {
    res = await request
      .get(`/assessments/1`)
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('success');
    expect(res.body).toHaveProperty('data');

    expect(res.body.success).toEqual(true);
    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data).toHaveProperty('name');
    expect(res.body.data).toHaveProperty('dateIn');
    expect(res.body.data).toHaveProperty('dateOut');
    expect(res.body.data).toHaveProperty('correctAnswer');
  });

  it('Get assessment by id fails when token is not provided', async () => {
    const res = await request.get(`/assessments/1`);
    expect(res.statusCode).toEqual(401);
  });

  it('Get assessment by id fails when assessment does not exist', async () => {
    const res = await request
      .get(`/assessments/999`)
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('message');
    expect(res.body).toHaveProperty('details');

    expect(res.body.status).toEqual('error');
    expect(res.body.message).toEqual('Assessment not found');
  });
});
