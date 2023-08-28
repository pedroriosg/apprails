const supertest = require('supertest');
const app = require('../../../../app');
const db = require('../../../../models');
const jwt = require('jsonwebtoken');
const request = supertest(app);

beforeAll(async () => {
  await db.sequelize.authenticate();

  userAdding = await db.User.findOne({
    where: {
      email: 'pedro@gmail.com',
    },
  });

  user = await db.User.findOne({
    where: {
      email: 'juan@gmail.com',
    },
  });
  userAdding.token = jwt.sign({ id: userAdding.id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
});

afterAll(() => {
  db.sequelize.close();
});

describe('Course Students', () => {
  it('Add a student to the course works correctly when user is correct', async () => {
    const res = await request
      .post(`/courses/1/students`)
      .set('Authorization', `Bearer ${userAdding.token}`)
      .send({
        UserId: 2,
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('success');
    expect(res.body).toHaveProperty('data');

    expect(res.body.success).toEqual(true);
  });

  it('Fails to add a student already in the course', async () => {
    const res = await request
      .post(`/courses/1/students`)
      .set('Authorization', `Bearer ${userAdding.token}`)
      .send({
        UserId: 2,
      });
    expect(res.statusCode).toEqual(409);
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('message');
    expect(res.body).toHaveProperty('details');

    expect(res.body.status).toEqual('error');
    expect(res.body.message).toEqual(
      'The Student is already enrolled with the course'
    );
  });
});
