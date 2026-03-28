const express = require('express');
const router = express.Router();
const showController = require('../controllers/show.controller');
const validation = require('../middleware/validators')
const authvalidation = require('../middleware/authValidation')

// create show
router.post('/mba/api/v1/create-show',authvalidation.isAuthenticated,authvalidation.isAdminOrClient,validation.createShowValidation,showController.createShow);
// getallshowby theatre
router.get('/mba/api/v1/theatre/:id',authvalidation.isAuthenticated,authvalidation.isAdminOrClient,showController.getAllshowByTheatre);
// cancel show
router.delete('/mba/api/v1/delete-show/:id',
    authvalidation.isAuthenticated,
    authvalidation.isAdminOrClient,
    showController.cancelShowByID);


module.exports = router;