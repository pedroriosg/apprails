const supertest = require('supertest');
const app = require('../../../../../app');
const db = require('../../../../../models');
const jwt = require('jsonwebtoken');
const request = supertest(app);

beforeAll(async () => {
  await db.sequelize.authenticate();

  mathUser = await db.User.findOne({
    where: {
      email: 'pedro@gmail.com',
    },
  });
  mathUser.token = jwt.sign({ id: mathUser.id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  newAnnouncement = await db.Announcement.create({
    title: 'Test delete Announcement For course',
    content: 'Test delete Announcement For course',
    CourseId: 1,
    UserId: mathUser.id,
  });
});

afterAll(() => {
  db.sequelize.close();
});

describe('Announcements in course', () => {
  it('Delete announcement works correctly when user is correct', async () => {
    const res = await request
      .delete(
        `/courses/${newAnnouncement.CourseId}/announcements/${newAnnouncement.id}`
      )
      .set('Authorization', `Bearer ${mathUser.token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('success');
    expect(res.body).toHaveProperty('data');

    expect(res.body.success).toEqual(true);
    expect(res.body.data).toEqual(null);
  });

  it('Delete all announcements fails when course does not exist', async () => {
    const res = await request
      .delete(`/courses/9999999/announcements/999999`)
      .set('Authorization', `Bearer ${mathUser.token}`);
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('message');
    expect(res.body).toHaveProperty('details');

    expect(res.body.status).toEqual('error');
    expect(res.body.message).toEqual('Announcement not found');
  });
});
