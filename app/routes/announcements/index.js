const { Router } = require('express');

const router = new Router();

const { tryCatch } = require('../../utils/tryCatch');
const { validateInput } = require('../../middlewares/validateInput');

const AppError = require('../../utils/AppError');

const db = require('../../models');
const authenticateToken = require('../../middlewares/currentUser');

/* GET users listing. */
// Ejemplo try/catch.js con manejo de errores

router.get(
  '/',
  authenticateToken,
  tryCatch(async (req, res) => {
    const announcements = await db.sequelize.models.Announcement.findAll({
      include: {
        model: db.sequelize.models.Course,
        required: true,
        include: {
          model: db.sequelize.models.UserCourse,
          required: true,
          where: { UserId: req.currentUser.id },
        },
      },
    });

    return res.status(200).send({
      success: true,
      data: announcements,
    });
  })
);

router.get(
  '/:id',
  authenticateToken,
  tryCatch(async (req, res) => {
    const announcementId = req.params.id;
    console.log('Este es el id del anuncio: ' + announcementId);
    console.log('Este es el current user: ' + req.currentUser.id);
    const announcement = await db.sequelize.models.Announcement.findOne({
      where: {
        id: announcementId,
      },
      include: [
        {
          model: db.sequelize.models.Course,
          required: true,
          include: {
            model: db.sequelize.models.UserCourse,
            required: true,
            where: { UserId: req.currentUser.id },
          },
        },
        {
          model: db.sequelize.models.User,
        },
      ],
    });

    if (!announcement) {
      throw new AppError('Announcement not found', 404);
    }

    return res.status(200).send({
      success: true,
      data: announcement,
    });
  })
);
module.exports = router;
