const router = require('express').Router();
const userRouter = require('./users');
const movieRouter = require('./movies');
const { validateAuth, validateLogin } = require('../middlewares/validate');
const { createUser, login, logOut } = require('../controllers/users');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/NotFoundError');

router.post('/signin', validateLogin, login);
router.post('/signup', validateAuth, createUser);
router.use(auth);
router.use('/', userRouter, movieRouter);
router.post('/signout', logOut);
router.use('*', () => {
  throw new NotFoundError('Такой страницы не существует, проверьте адрес');
});

module.exports = router;
