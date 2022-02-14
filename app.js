require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');
const limiter = require('./middlewares/limiter');
const NotFoundError = require('./errors/NotFoundError');
const { validateAuth, validateLogin } = require('./middlewares/validate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

mongoose.connect('mongodb://localhost:27017/moviesdb', {
  useNewUrlParser: true,
})
  .then(() => console.log('You are connected to MongoDB, yay!'))
  .catch((err) => console.log({ err }));

app.use(requestLogger);
app.use(helmet());
app.use(limiter);

app.post('/signin', validateLogin, login);
app.post('/signup', validateAuth, createUser);
app.use(auth);
app.use(require('./routes/users'));
app.use(require('./routes/movies'));

app.post('/signout', (req, res) => {
  res.status(200).clearCookie('jwt').send({ message: 'Успешный выход из приложения' });
});

app.use('*', () => {
  throw new NotFoundError('Такой страницы не существует, проверьте адрес');
});

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Hey, everybody, this is the PORT ${PORT} speaking!`);
});
