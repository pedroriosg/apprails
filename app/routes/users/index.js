const { Router } = require('express');

const router = new Router();

const { tryCatch } = require('../../utils/tryCatch');
const { validateInput } = require('../../middlewares/validateInput');

const AppError = require('../../utils/AppError');

const db = require('../../models');
const authenticateToken = require('../../middlewares/currentUser');

router.get(
    '/',
    authenticateToken,
    tryCatch(async (req, res) => {
        const { currentUser } = req;
        const userAnswers = await db.sequelize.models.Answer.findAll({
            where: {
                UserId: currentUser.id,
            },
            include: [
                {
                    model: db.sequelize.models.Assessment,
                    required: true,
                    include: [
                        {
                            model: db.sequelize.models.AssessmentCourse,
                            required: true,
                            include: [
                                {
                                    model: db.sequelize.models.Course,
                                    required: true,
                                },
                            ],
                        },
                    ],
                },
            ],
        });

        console.log("ANSWERS");
        console.log(userAnswers);

        const latestUserCourseAnswers = userAnswers.reduce((acc, answer) => {
            const assessmentId = answer.Assessment.id;
            const existingAnswer = acc.find((a) => a.Assessment.id === assessmentId);
            if (!existingAnswer) {
                acc.push(answer);
            } else {
                const existingAnswerIndex = acc.findIndex(
                    (a) => a.Assessment.id === assessmentId
                );
                if (existingAnswer.createdAt < answer.createdAt) {
                    acc[existingAnswerIndex] = answer;
                }
            }
            return acc;
        }, []);

        const info = latestUserCourseAnswers.map((answer) => {
            const { score } = answer;
            const total = answer.total;
            const assessmentName = answer.Assessment.name;
            const courseName = answer.Assessment.AssessmentCourses[0].Course.name;
            const courseId = answer.Assessment.AssessmentCourses[0].Course.id;
            const answerInfo = { score, total, assessmentName, courseId, courseName };
            return answerInfo;
        });

        // Necesito el promedio de las respuestas de cada curso
        const courses = info.map((answer) => answer.courseId);
        const uniqueCourses = [...new Set(courses)];
        const courseScores = uniqueCourses.map((courseId) => {
            const courseAnswers = info.filter((answer) => answer.courseId === courseId);
            const courseScore = courseAnswers.reduce((acc, answer) => {
                return acc + answer.score;
            }, 0);
            const courseTotal = courseAnswers.reduce((acc, answer) => {
                return acc + answer.total;
            }, 0);
            const courseName = courseAnswers[0].courseName;
            // Percentage with 2 decimals
            const courseScorePercentage = Math.round((courseScore / courseTotal) * 10000) / 100;
            const courseInfo = { courseId, courseName, courseScore, courseTotal, courseScorePercentage };
            return courseInfo;
        });

        // Necesito el promedio de attencances de cada curso
        const attendances = await db.sequelize.models.Attendance.findAll({
            where: {
                UserId: currentUser.id,
            },
            include: [
                {
                    model: db.sequelize.models.Course,
                    required: true,
                },
            ],
        });

        const infoAttendances = attendances.map((attendance) => {
            const courseId = attendance.Course.id;
            const courseName = attendance.Course.name;
            const attendanceInfo = { courseId, courseName };
            return attendanceInfo;
        });

        // Contamos el total de classday
        const totalClassdays = await db.sequelize.models.Classday.count();


        // Necesito el contar las asistencias por curso
        const coursesAttendances = infoAttendances.map((attendance) => attendance.courseId);
        const uniqueCoursesAttendances = [...new Set(coursesAttendances)];
        const courseAttendances = uniqueCoursesAttendances.map((courseId) => {
            const courseAttendances = infoAttendances.filter((attendance) => attendance.courseId === courseId);
            const courseName = courseAttendances[0].courseName;
            const courseTotalAttendances = courseAttendances.length;
            const courseTotalClassdays = totalClassdays;
            const courseAttendancePercentage = Math.round((courseTotalAttendances / courseTotalClassdays) * 10000) / 100;
            const courseInfo = { courseId, courseName, courseTotalAttendances, courseTotalClassdays, courseAttendancePercentage };
            return courseInfo;
        });


        // Mandamos el usuario
        const user = await db.sequelize.models.User.findOne({
            attributes: ['id', 'email', 'firstName', 'lastName'],
            where: { id: req.currentUser.id },
        });

        


        return res.status(201).json({ status: 'success', data: {user, courseScores, courseAttendances} });
    })
);

module.exports = router;