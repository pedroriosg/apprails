const AppError = require('../utils/AppError');

const errorHandler = (error, req, res, next) => {
  console.log(error);

  // Casos de usar joi para validar los datos de entrada
  if (error.name === 'ValidationError') {
    return res.status(400).send({
      status: 'error',
      message: 'ValidationError',
      details: error.details,
    });
  }

  if (error instanceof AppError) {
    return res.status(error.statusCode).send({
      status: 'error',
      message: error.message,
      details: [{}],
    });
  }

  return res.status(500).send('Something went wrong');
};

module.exports = errorHandler;
