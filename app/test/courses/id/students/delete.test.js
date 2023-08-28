const supertest = require('supertest');
const app = require('../../../../app');
const db = require('../../../../models');
const jwt = require('jsonwebtoken');
const request = supertest(app);

beforeAll(async () => {
  await db.sequelize.authenticate();
  user = await db.User.findOne({
    where: {
      email: 'pedro@gmail.com',
    },
  });
  user.token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  await db.UserCourse.create({
    CourseId: 6,
    UserId: user.id,
  });

  userToDelete = await db.User.findOne({
    where: {
      email: 'tomas@gmail.com',
    },
  });
});

afterAll(() => {
  db.sequelize.close();
});

describe('Course Students', () => {
  it('Delete a student from the course works correctly when user is correct', async () => {
    const res = await request
      .delete(`/courses/6/students`)
      .send({
        UserId: userToDelete.id,
      })
      .set('Authorization', `Bearer ${user.token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('success');
    expect(res.body).toHaveProperty('data');

    expect(res.body.success).toEqual(true);
  });

  it('Fails to delete a student not in the course', async () => {
    const res = await request
      .delete(`/courses/10/students`)
      .send({
        UserId: userToDelete.id,
      })
      .set('Authorization', `Bearer ${user.token}`);
    expect(res.statusCode).toEqual(409);
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('message');

    expect(res.body.status).toEqual('error');
    expect(res.body.message).toEqual(
      'The Student is not enrolled with the course'
    );
  });
});
