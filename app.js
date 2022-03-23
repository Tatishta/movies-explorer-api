require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const cors = require('cors');
const helmet = require('helmet');
const limiter = require('./middlewares/limiter');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');
const router = require('./routes/index');

const { NODE_ENV, MONGO } = process.env;
const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

mongoose.connect(NODE_ENV === 'production' ? MONGO : 'mongodb://localhost:27017/moviesdb', {
  useNewUrlParser: true,
})
  .then(() => console.log('You are connected to MongoDB, yay!'))
  .catch((err) => console.log({ err }));

app.use(requestLogger);
app.use(cors({
  origin: ['https://mymovie.nomoredomains.work', 'http://mymovie.nomoredomains.work', 'http://localhost:3000'],
  allowedHeaders: ['Access-Control-Allow-Credentials', 'Access-Control-Allow-Origin', 'Content-Type'],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  credentials: true,
}));
app.use(helmet());
app.use(limiter);
app.use(router);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Hey, everybody, this is the PORT ${PORT} speaking!`);
});
