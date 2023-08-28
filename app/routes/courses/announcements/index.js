const { Router } = require('express');

const router = new Router({
  mergeParams: true,
});

const { tryCatch } = require('../../../utils/tryCatch');
const { validateInput } = require('../../../middlewares/validateInput');

const AppError = require('../../../utils/AppError');

const db = require('../../../models');
const authenticateToken = require('../../../middlewares/currentUser');
const { createAnnouncementSchema } = require('./validators/schema');

router.get(
  '/',
  tryCatch(async (req, res) => {
    const courseId = req.params.id;
    const announcements = await db.sequelize.models.Announcement.findAll({
      include: [
        {
          model: db.sequelize.models.User,
        },
      ],
      where: {
        CourseId: courseId,
      },
    });

    return res.status(200).send({
      success: true,
      data: announcements,
    });
  })
);

router.get(
  '/:announcementId',
  tryCatch(async (req, res) => {
    const courseId = req.params.id;
    const announcementId = req.params.announcementId;
    const announcement = await db.sequelize.models.Announcement.findOne({
      where: {
        CourseId: courseId,
        id: announcementId,
      },
    });

    return res.status(200).send({
      success: true,
      data: announcement,
    });
  })
);
router.post(
  '/',
  (req, _, next) => {
    req.body.CourseId = Number(req.params.id);
    next();
  },
  validateInput(createAnnouncementSchema),
  tryCatch(async (req, res) => {
    const announcement = await db.sequelize.models.Announcement.create({
      ...req.body,
    });

    return res.status(200).send({
      success: true,
      data: announcement,
    });
  })
);

router.delete(
  '/:announcementId',
  tryCatch(async (req, res) => {
    const courseId = req.params.id;
    const announcementId = req.params.announcementId;
    const announcement = await db.sequelize.models.Announcement.findOne({
      where: {
        CourseId: courseId,
        id: announcementId,
      },
    });

    if (!announcement) {
      throw new AppError('Announcement not found', 404);
    }

    await announcement.destroy();

    return res.status(200).send({
      success: true,
      data: null,
    });
  })
);

module.exports = router;
