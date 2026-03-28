const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const authValidation = require('../middleware/authValidation');


router.post('/mba/api/v1/payment',
    authValidation.isAuthenticated,
    paymentController.makePayment);



module.exports = router;
