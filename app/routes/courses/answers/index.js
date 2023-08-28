const { Router } = require('express');

const router = new Router({
    mergeParams: true,
});

const { tryCatch } = require('../../../utils/tryCatch');
const { validateInput } = require('../../../middlewares/validateInput');

const AppError = require('../../../utils/AppError');

const db = require('../../../models');
const authenticateToken = require('../../../middlewares/currentUser');
const { assignCourseSchema } = require('../validators/schema');

/* GET users listing. */
// Ejemplo try/catch.js con manejo de errores

router.get(
    '/',
    authenticateToken,
    tryCatch(async (req, res) => {
        const courseId = req.params.id;
        const { currentUser } = req;
        // Find all the answers to each assessment in the course for the current user
        const userCourseAnswers = await db.sequelize.models.Answer.findAll({
            where: {
                UserId: currentUser.id,
            },
            include: [
                {
                    model: db.sequelize.models.Assessment,
                    required: true,
                    attributes: ['id', 'name'],
                    include: [
                        {
                            model: db.sequelize.models.AssessmentCourse,
                            required: true,
                            where: {
                                CourseId: courseId,
                            },
                        },
                    ],
                },
            ],
        });

        // Keep only the latest answer for each assessment, based on the attribute 'createdAt'
        const latestUserCourseAnswers = userCourseAnswers.reduce(
            (acc, answer) => {
                const assessmentId = answer.Assessment.id;
                const existingAnswer = acc.find(
                    (a) => a.Assessment.id === assessmentId
                );
                if (!existingAnswer) {
                    acc.push(answer);
                } else {
                    const existingAnswerIndex = acc.findIndex(
                        (a) => a.Assessment.id === assessmentId
                    );
                    if (
                        existingAnswer.createdAt <
                        answer.createdAt
                    ) {
                        acc[existingAnswerIndex] = answer;
                    }
                }
                return acc;
            },
            []
        );

        return res.status(200).send({
            success: true,
            data: latestUserCourseAnswers,
        });
    })
);
// router.post(
//     '/',
//     validateInput(assignCourseSchema),
//     tryCatch(async (req, res) => {
//         const courseId = req.params.id;
//         const data = req.body.UserId;

//         const courseExists = await db.sequelize.models.UserCourse.findOne({
//             where: {
//                 UserId: data.UserId,
//                 CourseId: courseId,
//             },
//         });

//         if (courseExists) {
//             throw new AppError(
//                 'The Student is already enrolled with the course',
//                 409
//             );
//         }

//         const assign = await db.sequelize.models.UserCourse.create({
//             UserId: data.UserId,
//             CourseId: courseId,
//         });

//         return res.status(200).send({
//             success: true,
//             data: assign,
//         });
//     })
// );

// router.delete(
//     '/',
//     authenticateToken,
//     validateInput(assignCourseSchema),
//     tryCatch(async (req, res) => {
//         const courseId = req.params.id;
//         const data = req.body.UserId;

//         const courseExists = await db.sequelize.models.UserCourse.findOne({
//             where: {
//                 UserId: data.UserId,
//                 CourseId: courseId,
//             },
//         });

//         if (!courseExists) {
//             throw new AppError('The Student is not enrolled with the course', 409);
//         }

//         await courseExists.destroy();

//         return res.status(200).send({
//             success: true,
//             data: null,
//         });
//     })
// );

module.exports = router;
