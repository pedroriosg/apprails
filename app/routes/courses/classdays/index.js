const { Router } = require('express');

const router = new Router({
  mergeParams: true,
});

const { tryCatch } = require('../../../utils/tryCatch');
const { validateInput } = require('../../../middlewares/validateInput');

const AppError = require('../../../utils/AppError');

const db = require('../../../models');
const authenticateToken = require('../../../middlewares/currentUser');

router.get(
    '/:classdayId',
    authenticateToken,
    tryCatch(async (req, res) => {
        console.log("WENA")
        const courseId = req.params.id;
        const classdayId = req.params.classdayId;
        const type = req.query.type;

        console.log(type)

        if (!type){
            throw new AppError('You are not allowed to do this action', 401);
        }

        // If type is attendances return all users that have an attendance with classdayId = classdayId
        if (type === 'attendances') {
            // Return all the users that have an attendance with classdayId = classdayId
            const attendances = await db.sequelize.models.Attendance.findAll({
                where: {
                    CourseId: courseId,
                    ClassdayId: classdayId,
                },
                include: {
                    model: db.sequelize.models.User,
                    attributes: ['id', 'firstName', 'lastName', 'email'],
                    required: true,
                },
            });

             return res.status(200).send({
                success: true,
                data: attendances,
            });
        }

        // If type is absences return all students of the course that don't have an attendance with classdayId = classdayId
        if (type === 'absences') {
            // Return all the users that have an attendance with classdayId = classdayId
            const attendances = await db.sequelize.models.Attendance.findAll({
                where: {
                    CourseId: courseId,
                    ClassdayId: classdayId,
                },
                include: {
                    model: db.sequelize.models.User,
                    attributes: ['id', 'firstName', 'lastName', 'email'],
                    required: true,
                },
            });

            
            // Get all the students of the course
            const students = await db.sequelize.models.UserCourse.findAll({
                where: {
                    CourseId: courseId,
                    role: 'student',
                },
                include: {
                    model: db.sequelize.models.User,
                    attributes: ['id', 'firstName', 'lastName', 'email'],
                    required: true,
                },
            });

            // Filter the students that have an attendance with classdayId = classdayId
            const absences = students.filter((student) => {
                const studentId = student.User.id;
                const attendance = attendances.find((attendance) => attendance.User.id === studentId);
                return !attendance;
            });

             return res.status(200).send({
                success: true,
                data: absences,
            });
    }
    })
);

module.exports = router;