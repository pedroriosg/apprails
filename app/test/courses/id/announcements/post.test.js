const supertest = require('supertest');
const app = require('../../../../app');
const db = require('../../../../models');
const jwt = require('jsonwebtoken');
const request = supertest(app);

beforeAll(async () => {
  await db.sequelize.authenticate();

  mathTeacher = await db.User.create({
    email: 'teacherCreatingAnnounce@gmail.com',
    username: 'teacherCreatingAnnounce',
    password: 'santiago',
    firstName: 'Teacher',
    lastName: 'Teacher',
    RoleId: 2,
    SchoolId: 1,
  });
  mathTeacher.token = jwt.sign({ id: mathTeacher.id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
});

afterAll(() => {
  db.sequelize.close();
});

describe('Courses Announcements', () => {
  it('Post announcement works correctly when user is correct', async () => {
    const res = await request
      .post(`/courses/1/announcements`)
      .set('Authorization', `Bearer ${mathTeacher.token}`)
      .send({
        title: 'Test Announcement For course',
        content: 'Test Announcement Content For course',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('success');
    expect(res.body).toHaveProperty('data');
    expect(res.body.success).toEqual(true);
    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data).toHaveProperty('title');
    expect(res.body.data).toHaveProperty('content');
    expect(res.body.data).toHaveProperty('UserId');
    expect(res.body.data).toHaveProperty('CourseId');
  });

  it('Post announcement fails when user is no logged', async () => {
    const res = await request.post(`/courses/1/announcements`).send({
      title: 'Test Announcement For course',
      content: 'Test Announcement Content For course',
    });
    expect(res.statusCode).toEqual(401);
  });
});
