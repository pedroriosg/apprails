const supertest = require('supertest');
const app = require('../../../app');
const db = require('../../../models');
const jwt = require('jsonwebtoken');
const request = supertest(app);

beforeAll(async () => {
  await db.sequelize.authenticate();

  mathTeacher = await db.User.create({
    email: 'teacherid@gmail.com',
    username: 'teacherid',
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
      email: 'tomas@gmail.com',
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
    title: 'Test Announcement For ID',
    content: 'Test Announcement For ID Content',
    CourseId: 1,
    UserId: mathTeacher.id,
  });
});

afterAll(() => {
  db.sequelize.close();
});

describe('Announcements', () => {
  it('Get announcement works correctly when user is correct', async () => {
    console.log(newAnnouncement.id);
    const res = await request
      .get(`/announcements/${newAnnouncement.id}`)
      .set('Authorization', `Bearer ${mathUser.token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('success');
    expect(res.body).toHaveProperty('data');

    expect(res.body.success).toEqual(true);
    expect(res.body.data).toHaveProperty('title');
    expect(res.body.data).toHaveProperty('content');
    expect(res.body.data).toHaveProperty('CourseId');
    expect(res.body.data).toHaveProperty('UserId');
    expect(res.body.data).toHaveProperty('createdAt');
    expect(res.body.data).toHaveProperty('updatedAt');
  });

  it('Get all announcements fails when user is not in the course', async () => {
    const res = await request
      .get(`/announcements/${newAnnouncement.id}`)
      .set('Authorization', `Bearer ${otherSchoolUser.token}`);
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('message');
    expect(res.body).toHaveProperty('details');

    expect(res.body.status).toEqual('error');
    expect(res.body.message).toEqual('Announcement not found');
  });

  it('Get all announcements fails when user is not logged in', async () => {
    const res = await request.get(`/announcements/${newAnnouncement.id}`);
    expect(res.statusCode).toEqual(401);
  });

  it('Get all announcements fails when announcement does not exist', async () => {
    const res = await request
      .get(`/announcements/999999`)
      .set('Authorization', `Bearer ${mathUser.token}`);
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('message');
    expect(res.body).toHaveProperty('details');

    expect(res.body.status).toEqual('error');
    expect(res.body.message).toEqual('Announcement not found');
  });
});
