const router = require('express').Router();
const {
  getMovies, createMovie, deleteMovie,
} = require('../controllers/movies');
const {
  validateMovie,
  validateMovieId,
} = require('../middlewares/validate');

router.get('/movies', getMovies);

router.post('/movies', validateMovie, createMovie);

router.delete('/movies/:_id', validateMovieId, deleteMovie);

module.exports = router;
