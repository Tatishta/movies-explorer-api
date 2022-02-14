const jwt = require('jsonwebtoken');
const AuthError = require('../errors/AuthError');

module.exports = (req, res, next) => {
  const { jwt: token } = req.cookies;

  const { NODE_ENV, JWT_SECRET } = process.env;

  if (!token) {
    next(new AuthError('Сначала нужно авторизироваться'));
  } else {
    let payload;
    try {
      payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'secret-key');
    } catch (err) {
      next(new AuthError('Сначала нужно авторизироваться'));
    }
    req.user = payload;
    next();
  }
};
