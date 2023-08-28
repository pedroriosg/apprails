const { Router } = require('express');

const router = new Router();

const { tryCatch } = require('../../utils/tryCatch');
const { validateInput } = require('../../middlewares/validateInput');
// const { assessmentSchema } = require('./validators/schema');

const AppError = require('../../utils/AppError');

const db = require('../../models');
const authenticateToken = require('../../middlewares/currentUser');

router.get(
  '/:id',
  authenticateToken,
  tryCatch(async (req, res) => {
    const assessment = await db.sequelize.models.Assessment.findOne({
      where: { id: req.params.id },
    });

    if (!assessment) {
      throw new AppError('Assessment not found', 404);
    }

    return res.status(200).json({
      success: true,
      data: {
        ...assessment.toJSON(),
        correctAnswer: assessment.correctAnswer.length,
      },
    });
  })
);

module.exports = router;
