const express = require('express');
const router = express.Router();
const theatreController = require('../controllers/theatre.controller');
const schemaValidation = require('../middleware/theatreValidation');
const isValid = require('../middleware/authValidation');


router.post('/mba/api/v1/theatre',schemaValidation.theatreValidation,
    isValid.isAuthenticated,
    isValid.isClient,
    theatreController.createTheatre);
router.get('/mba/api/v1/theatre/search/',theatreController.theatreSearch);
router.get('/mba/api/v1/theatre/movie/',theatreController.movieRuninAllTheatre);
router.get('/mba/api/v1/all-theatre',theatreController.getAllTheatre);
// add movies to the theatre
router.get('/mba/api/v1/theatre/',theatreController.allMovieRunningTheatre);
router.patch('/mba/api/v1/theatres/:id/movies',isValid.isAuthenticated,isValid.isAdminOrClient,schemaValidation.updateMoviesValidation,theatreController.addMoviesToTheatre);
router.delete('/mba/api/v1/theatre/:id',isValid.isAuthenticated,isValid.isAdminOrClient,theatreController.deleteTheatre);
router.put('/mba/api/v1/theatre/:id',isValid.isAuthenticated,isValid.isAdminOrClient,theatreController.updateTheatre);


module.exports = router;

