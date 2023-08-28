const { Router } = require('express');
const { tryCatch } = require('../../utils/tryCatch');

const AppError = require('../../utils/AppError');
const authenticateToken = require('../../middlewares/currentUser');
const db = require('../../models');
const router = new Router();


// Models routers
const announcementsRouter = require('./announcements');
const answersRouter = require('./answers');
const assessmentsRouter = require('./assessments')
const attendancesRouter = require('./attendances');
const classdaysRouter = require('./classdays');
const usersRouter = require('./users');


router.get(
  '/',
  authenticateToken,
  tryCatch(async (req, res) => {
    const courses = await db.sequelize.models.Course.findAll({
      include: [
        { model: db.sequelize.models.School },
        { model: db.sequelize.models.Subject },
        { model: db.sequelize.models.Grade },
        {
          model: db.sequelize.models.UserCourse,
          where: { UserId: req.currentUser.id },
        },
      ],
    });

    return res.status(201).json({ status: 'success', data: courses });
  })
);

router.get(
  '/:id',
  authenticateToken,
  tryCatch(async (req, res) => {
    const course = await db.sequelize.models.Course.findOne({
      where: { id: req.params.id },
      include: [
        { model: db.sequelize.models.School },
        { model: db.sequelize.models.Subject },
        { model: db.sequelize.models.Grade },
        {
          model: db.sequelize.models.UserCourse,
          where: { UserId: req.currentUser.id },
        },
      ],
    });
    
    if (!course) {
      throw new AppError('Curso no encontrado', 404);
    }

    return res.status(201).json({ status: 'success', data: course });
  })
);

router.use('/:id/announcements', authenticateToken, announcementsRouter);
router.use('/:id/answers', authenticateToken, answersRouter);
router.use('/:id/assessments', authenticateToken, assessmentsRouter);
router.use('/:id/attendances', authenticateToken, attendancesRouter);
router.use('/:id/classdays', authenticateToken, classdaysRouter);
router.use('/:id/users', authenticateToken, usersRouter);

module.exports = router;
