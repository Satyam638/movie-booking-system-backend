const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movie.controller');
const validateMovie = require('../middleware/validators');
const authValidate = require('../middleware/authValidation');

router.post('/mba/api/v1/movies',authValidate.isAuthenticated,authValidate.isAdminOrClient,validateMovie.validateCreateMovieReq,movieController.createMovie);
router.get('/mba/api/v1/all-movies',authValidate.isAuthenticated,authValidate.isAdminOrClientOrCustomer,movieController.listMovies);
router.get('/mba/api/v1/movies/search',movieController.searchmovieByName);
router.get('/mba/api/v1/movies/:movieid',movieController.getMoviesById);
router.delete('/mba/api/v1/movies/:movieid',authValidate.isAuthenticated,authValidate.isAdminOrClient,movieController.deleteMovieById);
// these two function is work for partial update or full update
router.put('/mba/api/v1/movies/:movieid',authValidate.isAuthenticated,authValidate.isAdminOrClient,movieController.updateMoviebyId);
router.patch('/mba/api/v1/movies/:movieid',authValidate.isAuthenticated,authValidate.isAdminOrClient,movieController.updateMoviebyId);


module.exports = router;