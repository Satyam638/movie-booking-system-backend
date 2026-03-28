const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/showBooking.controller');
const Validation = require('../middleware/validators');
const authValidation = require('../middleware/authValidation');

router.post('/mba/api/v1/create-show-booking',
    authValidation.isAuthenticated,
    Validation.createShowBookingValidation,
    bookingController.createBooking);

router.get('/mba/api/v1/user/all-booking/:id',
    authValidation.isAuthenticated,
    bookingController.getAllBookingByUser);

router.delete('/mba/api/v1/user/booking/delete-booking/:id',
    authValidation.isAuthenticated,
    bookingController.cancelBooking);

module.exports = router;