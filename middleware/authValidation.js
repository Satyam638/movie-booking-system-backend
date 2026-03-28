const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');
require('dotenv').config();

function loginAuthValidation(body) {


    const { email, password } = body;

    // if (!name || name.length < 3) {
    //     return "Aleast user name must be in length of 3 character"
    // }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
    if (!email || !emailRegex.test(email)) return "Invalid Email Address";
    if (!password || password.length < 6) return "Minimum Password length should be of 6 characters";
    // const validStatus = ['APPROVED', 'PENDING','REJECTED']
    // if (!userStatus || !validStatus.includes(userStatus.toUpperCase())) return "Invalid user Status";
    // const roles = ['ADMIN', 'CLIENT', 'CUSTOMER'];
    // if (!userRole || !roles.includes(userRole.toUpperCase())) return "Invalid User Role";
    else return null;
}

function RegisterAuthValidation(body) {


    const { name, email, password, userStatus, userRole } = body;

    if (!name || name.length < 3) {
        return "Aleast user name must be in length of 3 character"
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
    if (!email || !emailRegex.test(email)) return "Invalid Email Address";
    if (!password || password.length < 6) return "Minimum Password length should be of 6 characters";
    const validStatus = ['APPROVED', 'PENDING', 'REJECTED']
    if (!userStatus || !validStatus.includes(userStatus.toUpperCase())) return "Invalid user Status";
    const roles = ['ADMIN', 'CLIENT', 'CUSTOMER'];
    if (!userRole || !roles.includes(userRole.toUpperCase())) return "Invalid User Role";
    else return null;
}

// check for user is genuine or not
const isAuthenticated = async (req, res, next) => {

    try {
        const token = req.headers['token'];

        if (!token) return res.status(404).json({ message: 'Token is Missing' });

        const decode = jwt.verify(token, process.env.SECRET_KEY)

        if (!decode) return res.status(401).json({ message: "Token Not Verified" });

        console.log(decode);
        req.userId = decode.id;
        // const id = decode.id;
        // find user using id
        const user = await userModel.findById(decode.id)
        console.log("You are Allowed to perform CRUD Operations with",user);
        next();
    }
    catch (err) {
        console.log(err)
    }
}

// check for user Request
const validateUserReq = async(req,res,next)=>{

    const {userRole,userStatus} = req.body;

    let validRoles = ['ADMIN','CLIENT','CUSTOMER'];
    let validStatus = ['PENDING','APPROVED','REJECTED'];

    if(!userRole || !validRoles.includes(userRole.toUpperCase())){
        return res.status(400).json({
            success:false,
            message:"Your Role is not Valid"
        })
    }
    if(!userStatus || !validStatus.includes(userStatus.toUpperCase())){
        return res.status(400).json({
            success:false,
            message:"Your status is not Valid"
        })
    }
    req.body.userRole = userRole.toUpperCase();
    req.body.userStatus = userStatus.toUpperCase();
    console.log("Your entered information is correct now let's check are you valid User or not");
    next();
}


// check for authorization for the specific user
const isAdmin = async(req,res,next)=>{

    const user = await userModel.findById(req.userId).select('userRole');

    if(!user ||user.userRole.toUpperCase() !== 'ADMIN')
        return res.status(401).json({success:false,message:"You are not Admin, can not proceed"})

    next();
}

const isClient = async(req,res,next)=>{

    const user = await userModel.findById(req.userId).select('userRole');

    if(!user || user.userRole.toUpperCase()!== 'CLIENT')
        return res.status(401).json({success:false,message:"You are not Client, can not proceed"})

    console.log("userId:",req.userId);
    console.log("userRole:",user.userRole);
    next();
}

const isCustomer = async(req,res,next)=>{

    const user = await userModel.findById(req.userId).select('userRole');

    if(!user || user.userRole.toUpperCase()  !== 'CUSTOMER')
        return res.status(401).json({success:false,message:"You are not normal user, can not proceed"})

    next();
}

const isAdminOrClient = async(req,res,next)=>{


    // find user
    const user = await userModel.findById(req.userId).select('userRole');

    // check their role for authority
    const allowedRoles = ['ADMIN','CLIENT']

    if(!user || !allowedRoles.includes(user.userRole.toUpperCase())) return res.status(403).json({
        success:false,
        message:"Only Admin and Client Can Perform this Task"
    });
    // if they are admin or client then simply we move to next part
    console.log("You can Perform the task");
    next();
}

const isAdminOrClientOrCustomer = async(req,res,next)=>{


    // find user
    const user = await userModel.findById(req.userId).select('userRole');

    // check their role for authority
    const allowedRoles = ['ADMIN','CLIENT','CUSTOMER'];

    if(!user || !allowedRoles.includes(user.userRole.toUpperCase())) return res.status(403).json({
        success:false,
        message:"Only Admin and Client OR Customer Can Perform this Task"
    });
    // if they are admin or client then simply we move to next part
    console.log("You can Perform the task");
    next();
}

module.exports = {
    RegisterAuthValidation,
    loginAuthValidation,
    isAuthenticated,
    validateUserReq,
    isAdmin,
    isClient,
    isCustomer,
    isAdminOrClient,
    isAdminOrClientOrCustomer
};