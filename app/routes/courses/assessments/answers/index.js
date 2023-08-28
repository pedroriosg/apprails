const { Router } = require('express');

const router = new Router({
  mergeParams: true,
});

const { tryCatch } = require('../../../../utils/tryCatch');
const { validateInput } = require('../../../../middlewares/validateInput');
const { answerSchema } = require('./validators/schema');

const AppError = require('../../../../utils/AppError');

const db = require('../../../../models');
const authenticateToken = require('../../../../middlewares/currentUser');

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

      // Only keep the attributes we need (answer's score and assessment's name)
        latestUserCourseAnswers.forEach((answer) => {
            answer.dataValues.score = answer.dataValues.score;
            answer.dataValues.assessmentName =
                answer.Assessment.dataValues.name;
            delete answer.dataValues.Assessment;
        });

      return res.status(200).send({
          success: true,
          data: latestUserCourseAnswers,
      });
  })
);

router.post(
    '/',
    authenticateToken,
    (req, res, next) => {
      req.body.userId = req.currentUser.id;
      req.body.assessmentId = Number(req.params.assessmentId);
      next();
    },
    validateInput(answerSchema),
    tryCatch(async (req, res) => {
      const data = req.body;
      const assessment = await db.sequelize.models.Assessment.findOne({
        where: { id: data.assessmentId },
      });
  
      const currentDate = new Date();
      const assessmentDateOut = new Date(assessment.dateOut);

      // Verificar si la fecha actual es mayor que la fecha límite del assessment
      if (currentDate > assessmentDateOut) {
        throw new AppError('La fecha límite para este assessment ha expirado.', 400);
      }
  
      // Convertir las respuestas de cadena a arrays
      const answerArray = data.answer.split('');
      const correctAnswerArray = assessment.correctAnswer.split('');
  
      const score = answerArray
        .map((value, index) => {
          if (value === correctAnswerArray[index]) {
            return 1;
          }
          return 0;
        })
        .reduce((a, b) => a + b, 0);
  
      const answer = await db.sequelize.models.Answer.create({
        answer: data.answer,
        score,
        total: assessment.correctAnswer.length,
        UserId: data.userId,
        AssessmentId: data.assessmentId,
      });
  
      console.log(answer);
  
      return res.status(200).send({
        success: true,
        data: answer,
      });
    })
  );

module.exports = router;
