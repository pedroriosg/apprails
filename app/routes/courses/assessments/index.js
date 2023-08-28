const { Router } = require('express');
const { tryCatch } = require('../../../utils/tryCatch');

const router = new Router({
  mergeParams: true,
});

const AppError = require('../../../utils/AppError');
const authenticateToken = require('../../../middlewares/currentUser');
const db = require('../../../models');


router.get(
  '/',
  authenticateToken,
  tryCatch(async (req, res) => {

    if (req.query.type === 'all') {

      console.log("BBB")
      assessments = await db.sequelize.models.Assessment.findAll({
        // Only include assessments that have a dateIn value less than or equal to today, at this time
        attributes: ['id', 'name', 'dateIn', 'dateOut'],
        where: { dateIn: { [db.Sequelize.Op.lte]: new Date() } },
        include: [
          { model: db.sequelize.models.AssessmentCourse,
            attributes: [],
            where: { CourseId: req.params.id},
            required: true,
          },
        ],
      });


      return res.status(200).json({ success: true, data: assessments });
    }

    else {

      const assessments = await db.sequelize.models.Assessment.findAll({
      // Only include assessments that have a dateIn value less than or equal to today, at this time and assessment type equal to req.query.type
      attributes: ['id', 'name', 'dateIn', 'dateOut'],
      where: { dateIn: { [db.Sequelize.Op.lte]: new Date() } },
      include: [
        { model: db.sequelize.models.AssessmentCourse,
          attributes: [],
          where: { CourseId: req.params.id},
          required: true,
        },
        {
          attributes: [],
          model: db.sequelize.models.AssessmentType,
          where: { type: req.query.type },
        }
      ],
    });
    return res.status(200).json({ success: true, data: assessments });
  }
  })
);

router.get(
  '/:assessmentId/teacheranswers',
  authenticateToken,
  tryCatch(async (req, res) => {

    const courseId = req.params.id;
    const assessmentId = req.params.assessmentId;
    const { currentUser } = req;

    // Check if the user is a teacher of the course
    const userCourse = await db.sequelize.models.UserCourse.findOne({
      where: { UserId: currentUser.id, CourseId: courseId, role: 'teacher' },
    });

    if (!userCourse) {
      throw new AppError('You are not a teacher of this course', 403);
    }
    
    // Need all the LAST users answers for this assessment of the users of that course (UserCourses)
    const assessmentAnswers = await db.sequelize.models.Answer.findAll({
      attributes: ['id', 'score', 'total', 'createdAt'],
      where: { AssessmentId: assessmentId },
      include: [
        {
          model: db.sequelize.models.User,
          attributes: ['id', 'firstName', 'lastName'],
          include: [
            {
              model: db.sequelize.models.UserCourse,
              attributes: [],
              where: { CourseId: courseId },
              required: true,
            },
          ],
        },
      ],
    });

    // Keep only the latest answer for each user, based on the attribute 'createdAt'
    const latestAssessmentAnswers = assessmentAnswers.reduce(
      (acc, answer) => {
        const userId = answer.User.id;
        const existingAnswer = acc.find((a) => a.User.id === userId);
        if (!existingAnswer) {
          acc.push(answer);
        } else {
          const existingAnswerIndex = acc.findIndex(
            (a) => a.User.id === userId
          );
          if (answer.createdAt > existingAnswer.createdAt) {
            acc[existingAnswerIndex] = answer;
          }
        }
        return acc;
      },
      []
    );


    // Return user fisrname, last name score ando total score of assessmentAnswers
    const answers = latestAssessmentAnswers.map((answer) => {
      return {
        id: answer.id,
        firstName: answer.User.firstName,
        lastName: answer.User.lastName,
        score: answer.score,
        total: answer.total,

      };
    });

    return res.status(200).json({ success: true, data: answers });
  })
);

router.use('/answers', require('./answers'));
router.use('/:assessmentId/answers', require('./answers'));

module.exports = router;
