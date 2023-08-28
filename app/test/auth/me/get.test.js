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
  correctUserToken = jwt.sign({ id: correctUser.id }, process.env.JWT_SECRET, {
    expiresIn: '24h',
  });
  malwareToken = jwt.sign({ id: correctUser.id }, 'malware', {
    expiresIn: '24h',
  });
  expiredToken = jwt.sign({ id: correctUser.id }, process.env.JWT_SECRET, {
    expiresIn: '0s',
  });
  noIdToken = jwt.sign({ notId: correctUser.id }, process.env.JWT_SECRET, {
    expiresIn: '24h',
  });
  nonExistentIdToken = jwt.sign({ id: 999999999 }, process.env.JWT_SECRET, {
    expiresIn: '24h',
  });
});

afterAll(() => {
  db.sequelize.close();
});

describe('me', () => {
  it('Returns user info when token is correct', async () => {
    const res = await request
      .get(`/auth/me`)
      .set('Authorization', `Bearer ${correctUserToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('user');
    expect(res.body.user).toHaveProperty('id');
    expect(res.body.user).toHaveProperty('username');
    expect(res.body.user).toHaveProperty('email');
    expect(res.body.user).toHaveProperty('RoleId');
    expect(res.body.user).toHaveProperty('SchoolId');

    expect(res.body.status).toEqual('success');
    expect(res.body.user.username).toEqual(correctUser.username);
    expect(res.body.user.email).toEqual(correctUser.email);
    expect(res.body.user.firstName).toEqual(correctUser.firstName);
    expect(res.body.user.lastName).toEqual(correctUser.lastName);
    expect(res.body.user.RoleId).toEqual(correctUser.RoleId);
    expect(res.body.user.SchoolId).toEqual(correctUser.SchoolId);
  });

  it('Returns error when token is malware', async () => {
    const res = await request
      .get(`/auth/me`)
      .set('Authorization', `Bearer ${malwareToken}`);
    expect(res.statusCode).toEqual(403);
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('message');

    expect(res.body.status).toEqual('Error');
  });

  it('Returns error when token is expired', async () => {
    const res = await request
      .get(`/auth/me`)
      .set('Authorization', `Bearer ${expiredToken}`);
    expect(res.statusCode).toEqual(403);
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('message');

    expect(res.body.status).toEqual('Error');
  });

  it('Returns error when token has no id', async () => {
    const res = await request
      .get(`/auth/me`)
      .set('Authorization', `Bearer ${noIdToken}`);
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('message');

    expect(res.body.status).toEqual('Error');
    expect(res.body.message).toEqual('Token is not valid');
  });

  it('Returns error when token has non existent id', async () => {
    const res = await request
      .get(`/auth/me`)
      .set('Authorization', `Bearer ${nonExistentIdToken}`);
    expect(res.statusCode).toEqual(403);
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('message');

    expect(res.body.status).toEqual('Error');
    expect(res.body.message).toEqual('JsonWebTokenError');
  });
});
