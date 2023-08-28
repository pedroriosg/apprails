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
    // Return all the classdays
    const classdays = await db.sequelize.models.Classday.findAll()
    return res.status(200).send({
        success: true,
        data: classdays,
    });
  })
);

module.exports = router;