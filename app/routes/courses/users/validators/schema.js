const { Router } = require('express');

const router = new Router({
  mergeParams: true,
});

const { tryCatch } = require('../../../utils/tryCatch');
const { validateInput } = require('../../../middlewares/validateInput');
const { attendanceSchema } = require('../users/attendances/validators/schema');

const AppError = require('../../../utils/AppError');

const db = require('../../../models');
const authenticateToken = require('../../../middlewares/currentUser');

router.get(
  '/',
  authenticateToken,
  tryCatch(async (req, res) => {
    // I want all the users of a course, with role student
    const { currentUser } = req;
    const userId = req.currentUser.id;
    const courseId = req.params.id;

    // Return all the users of a course
    const users = await db.sequelize.models.User.findAll({
      attributes: ['id', 'firstName', 'lastName'],
      include: [
        {
          attributes: [],
          model: db.sequelize.models.UserCourse,
          where: { CourseId: courseId, role: 'student' },
        },
      ],
    });


    // Add to user attributes if they have an attendance today
    const currentDate = new Date().toISOString().slice(0, 10)
    const attendances = await db.sequelize.models.Attendance.findAll({
      attributes: ['UserId'],
      where: { date: currentDate, CourseId: courseId },
    });

    // return the users but with an attribute that says if they have an attendance today
    users.forEach(user => {
      attendances.forEach(attendance => {
        if (user.id === attendance.UserId) {
          user.dataValues.attendance = true;
        }
      })
    })
    
    return res.status(200).json({ success: true, data: users });
  })
);

router.use('/:userId/attendances', require('./attendances'));

module.exports = router;