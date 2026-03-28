const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller');
const isAuthenticated = require('../middleware/authValidation');

router.post('/mba/api/v1/signup',
    authController.userRegister);
router.post('/mba/api/v1/login',
    authController.loginUser);
router.get('/mba/api/v1/all-users',isAuthenticated.isAuthenticated,isAuthenticated.isAdmin,authController.getAllUsers);
router.patch('/mba/api/v1/reset',
    isAuthenticated.isAuthenticated,
    authController.resetPassword);
router.post('/mba/api/v1/logout',
    isAuthenticated.isAuthenticated,
    authController.logoutUser);
router.post('/mba/api/v1/user/request-client',
    isAuthenticated.isAuthenticated,
    isAuthenticated.isCustomer,
    authController.customerClientReq);
router.put('/mba/api/v1/user/approve-client',
    isAuthenticated.isAuthenticated,
    isAuthenticated.isAdmin,
    authController.adminApproveClientReq);
router.patch('/mba/api/v1/update-user-info/:id',
    isAuthenticated.isAuthenticated,
    isAuthenticated.validateUserReq,
    isAuthenticated.isAdmin
    ,authController.updateUserInfo);
module.exports = router;