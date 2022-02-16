const Movie = require('../models/movie');
const ValidationError = require('../errors/ValidationError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.send({ movies }))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const owner = req.user._id;
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  })
    .then((movie) => res.status(201).send({ movie }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Для записи фильма отправлены некорректные данные.'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params._id)
    .orFail(new NotFoundError('Фильм не найден.'))
    .then((movie) => {
      if (movie.owner._id.toString() === req.user._id) {
        return Movie.findByIdAndRemove(req.params._id)
          .then(() => res.status(200).send({ message: 'Фильм успешно удалён из сохранённых!' }));
      }
      throw new ForbiddenError('Не вы сохранили этот фильм, не вам и удалять!');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Отправлены некорректные данные.'));
      } else {
        next(err);
      }
    });
};
