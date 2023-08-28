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

describe('Schools', () => {
  it('Get schools works correctly', async () => {
    const res = await request
      .get(`/schools`)
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('success');
    expect(res.body).toHaveProperty('data');

    expect(res.body.success).toEqual(true);
    expect(res.body.data[0]).toHaveProperty('id');
    expect(res.body.data[0]).toHaveProperty('name');

    expect(res.body.data[0].name).toEqual('RSL');
    expect(res.body.data[1].name).toEqual('JJP');
    expect(res.body.data[2].name).toEqual('LBI');
  });

  it('Get schools fails when token is not provided', async () => {
    const res = await request.get(`/schools`);
    expect(res.statusCode).toEqual(401);
  });
});
