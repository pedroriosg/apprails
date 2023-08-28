const supertest = require('supertest');
const app = require('../../../../app');
const db = require('../../../../models');
const jwt = require('jsonwebtoken');
const request = supertest(app);

beforeAll(async () => {
  await db.sequelize.authenticate();

  mathTeacher = await db.User.create({
    email: 'teachercourse@gmail.com',
    username: 'teachercourse',
    password: 'santiago',
    firstName: 'Teacher',
    lastName: 'Teacher',
    RoleId: 2,
    SchoolId: 1,
  });
  mathUser = await db.User.findOne({
    where: {
      email: 'pedro@gmail.com',
    },
  });
  mathUser.token = jwt.sign({ id: mathUser.id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  otherSchoolUser = await db.User.findOne({
    where: {
      email: 'diego@gmail.com',
    },
  });
  otherSchoolUser.token = jwt.sign(
    { id: otherSchoolUser.id },
    process.env.JWT_SECRET,
    {
      expiresIn: '1h',
    }
  );
  newAnnouncement = await db.Announcement.create({
    title: 'Test Announcement For course',
    content: 'Test Announcement For course',
    CourseId: 1,
    UserId: mathTeacher.id,
  });
});

afterAll(() => {
  db.sequelize.close();
});

describe('Announcements in course', () => {
  it('Get announcement works correctly when user is correct', async () => {
    console.log(newAnnouncement.id);
    const res = await request
      .get(`/courses/${newAnnouncement.CourseId}/announcements`)
      .set('Authorization', `Bearer ${mathUser.token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('success');
    expect(res.body).toHaveProperty('data');

    expect(res.body.success).toEqual(true);
    expect(res.body.data[0]).toHaveProperty('title');
    expect(res.body.data[0]).toHaveProperty('content');
    expect(res.body.data[0]).toHaveProperty('CourseId');
    expect(res.body.data[0]).toHaveProperty('UserId');
    expect(res.body.data[0]).toHaveProperty('createdAt');
    expect(res.body.data[0]).toHaveProperty('updatedAt');
  });

  it('Get all announcements fails when user is not logged in', async () => {
    const res = await request.get(
      `/courses/${newAnnouncement.CourseId}/announcements`
    );
    expect(res.statusCode).toEqual(401);
  });
});
