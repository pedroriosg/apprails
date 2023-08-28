const { Router } = require('express');

const router = new Router({
  mergeParams: true,
});

const { tryCatch } = require('../../../../utils/tryCatch');
const { validateInput } = require('../../../../middlewares/validateInput');
const {
  attendanceSchema,
} = require('../../users/attendances/validators/schema');

const AppError = require('../../../../utils/AppError');

const db = require('../../../../models');
const authenticateToken = require('../../../../middlewares/currentUser');

/* GET users listing. */
// Ejemplo try/catch.js con manejo de errores
router.post(
  '/',
  authenticateToken,
  validateInput(attendanceSchema),
  tryCatch(async (req, res) => {
    const { currentUser } = req;
    const curentUserId = req.currentUser.id;
    const courseId = req.params.id;
    const userId = req.params.userId;

    // Acá revisar si el usuario es efectivamente un profesor del curso
    const query = `  
      SELECT * 
      FROM "UserCourses" 
      WHERE "UserId" = :curentUserId 
        AND "CourseId" = :courseId 
        AND "role" = 'teacher'
      LIMIT 1;
    `;
    const [userCourse] = await db.sequelize.query(query, {
      replacements: { curentUserId, courseId },
      type: db.sequelize.QueryTypes.SELECT,
    });

    if (!userCourse) {
      throw new AppError('User without access', 403);
    }

    // Ahora revisamos que el alumno sea parte del curso
    const query2 = `
      SELECT *
      FROM "UserCourses"
      WHERE "UserId" = :userId
        AND "CourseId" = :courseId
        AND "role" = 'student'
      LIMIT 1;
    `;
    const [userCourse2] = await db.sequelize.query(query2, {
      replacements: { userId, courseId },
      type: db.sequelize.QueryTypes.SELECT,
    });

    if (!userCourse2) {
      throw new AppError('User not in course', 403);
    }

    // Revisamos si la fecha actual está en el classday (DATEONLY)

    const now = new Date();
    const today = now.toISOString().slice(0, 10);

    const classDay = await db.sequelize.models.Classday.findOne({
      where: {
        date: today,
      },
    });

    // Ahora revisamos que el alumno no tenga una asistencia con ese classday

    if (!classDay) {
      throw new AppError('No class today', 400);
    }

    // Ahora revisamos que el alumno no tenga una asistencia con ese classday
    const attendanceDay = await db.sequelize.models.Attendance.findOne({
      where: {
        UserId: userId,
        CourseId: courseId,
        ClassdayId: classDay.id,
      },
    });

    if (attendanceDay) {
      throw new AppError('User already has an attendance today', 400);
    }

    // Create attendance
    const attendance = await db.sequelize.models.Attendance.create({
      UserId: userId,
      CourseId: courseId,
      ClassdayId: classDay.id,
    });

    return res.status(200).send({
      status: 'success',
    });
  })
);

router.delete(
  '/',
  authenticateToken,
  validateInput(attendanceSchema),
  tryCatch(async (req, res) => {
    const { currentUser } = req;
    const curentUserId = req.currentUser.id;
    const courseId = req.params.id;
    const userId = req.params.userId;

    // Acá revisar si el usuario es efectivamente un profesor del curso
    const query = `
      SELECT *
      FROM "UserCourses"
      WHERE "UserId" = :curentUserId
        AND "CourseId" = :courseId
        AND "role" = 'teacher'
      LIMIT 1;
    `;
    const [userCourse] = await db.sequelize.query(query, {
      replacements: { curentUserId, courseId },
      type: db.sequelize.QueryTypes.SELECT,
    });

    if (!userCourse) {
      throw new AppError('User without access', 403);
    }

    // Ahora revisamos que el alumno sea parte del curso
    const query2 = `
      SELECT *
      FROM "UserCourses"
      WHERE "UserId" = :userId
        AND "CourseId" = :courseId
        AND "role" = 'student'
      LIMIT 1;
    `;

    const [userCourse2] = await db.sequelize.query(query2, {
      replacements: { userId, courseId },
      type: db.sequelize.QueryTypes.SELECT,
    });

    if (!userCourse2) {
      throw new AppError('User not in course', 403);
    }

    // Revisamos si la fecha actual está en el classday (DATEONLY)

    const now = new Date();
    const today = now.toISOString().slice(0, 10);

    const classDay = await db.sequelize.models.Classday.findOne({
      where: {
        date: today,
      },
    });

    // Ahora revisamos que el alumno no tenga una asistencia con ese classday

    if (!classDay) {
      throw new AppError('No class today', 400);
    }

    // Ahora revisamos que el alumno no tenga una asistencia con ese classday
    const attendanceDay = await db.sequelize.models.Attendance.findOne({
      where: {
        UserId: userId,
        CourseId: courseId,
        ClassdayId: classDay.id,
      },
    });

    if (!attendanceDay) {
      throw new AppError('User does not have an attendance today', 400);
    }

    // Delete attendance
    await db.sequelize.models.Attendance.destroy({
      where: {
        UserId: userId,
        CourseId: courseId,
        ClassdayId: classDay.id,
      },
    });

    return res.status(200).send({
      status: 'success',
    });
  })
);

module.exports = router;
