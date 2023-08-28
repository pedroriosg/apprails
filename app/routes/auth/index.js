const { Router } = require('express');
const { loginSchema } = require('./validators/login');
const { tryCatch } = require('../../utils/tryCatch');
const { validateInput } = require('../../middlewares/validateInput');


const AppError = require('../../utils/AppError');
const db = require('../../models');
const jwt = require('jsonwebtoken');
const router = new Router();


router.post(
  '/login',
  validateInput(loginSchema),
  tryCatch(async (req, res) => {
    const data = req.body;

    const user = await db.sequelize.models.User.findOne({
      where: {
        email: data.email,
      },
    });

    if (!user) {
      throw new AppError('Email inválido', 404);
    }

    const isPasswordValid = await user.checkPassword(data.password);
    if (!isPasswordValid) {
      throw new AppError('Contraseña inválida', 401);
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });

    return res.status(200).send({
      status: 'success',
      token,
    });
  })
);


module.exports = router;
