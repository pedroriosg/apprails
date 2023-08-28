const { Router } = require('express');

const router = new Router({
  mergeParams: true,
});

const { tryCatch } = require('../../../utils/tryCatch');

const AppError = require('../../../utils/AppError');

const db = require('../../../models');
const authenticateToken = require('../../../middlewares/currentUser');

router.get(
  '/',
  authenticateToken,
  tryCatch(async (req, res) => {

    const courseId = req.params.id;
    const currentDate = new Date().toISOString().slice(0, 10)

    const attendances = await db.sequelize.models.Attendance.findAll({
      // Need to see if createdAt date is equal to date and CourseId is equal to courseId
      where: { date: currentDate, CourseId: courseId },
    });

    return res.status(200).json({ success: true, data: attendances });
  })
);

module.exports = router;