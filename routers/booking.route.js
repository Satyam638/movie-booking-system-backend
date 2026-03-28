const express = require('express');
const router = express.Router();
const authValidation = require('../middleware/authValidation');
const bookingController = require('../controllers/booking.controller');
const reqValidation = require('../middleware/validators');

router.post('/mba/api/v1/create-booking',authValidation.isAuthenticated,reqValidation.createBookingValidation,bookingController.createBooking);
router.get('/mba/api/v1/all-booking',authValidation.isAuthenticated,bookingController.getAllBooking);
router.get('/mba/api/v1/specific-booking/:id',authValidation.isAuthenticated,bookingController.getSpecificBooking);

module.exports = router;