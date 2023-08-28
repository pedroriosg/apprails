const jwt = require('jsonwebtoken');
const { User } = require('../models');

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  // Unauthorized, no token provided
  if (token == null) return res.sendStatus(401);

  return jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
    // Forbidden, invalid token
    if (err) {
      return res.status(403).send({
        status: 'Error',
        message: err.name,
      });
    }
    if (!user.id) {
      return res.status(401).send({
        status: 'Error',
        message: 'Token is not valid',
      });
    }

    req.currentUser = await User.findByPk(user.id);

    if (!req.currentUser) {
      return res.status(403).send({
        status: 'Error',
        message: 'JsonWebTokenError',
      });
    }
    return next();
  });
}

module.exports = authenticateToken;
