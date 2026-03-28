const userModel = require('../models/user.model')
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const authValidation = require('../middleware/authValidation');

const userRegister = async (req, res) => {

    try {
        const { name, email, password, userRole, userStatus } = req.body;

        // validation

        const error = authValidation.RegisterAuthValidation(req.body);

        if (error) return res.status(422).json({ success: false, message: error });

        // check entry of user 
        const checkisExist = await userModel.findOne({ email });
        if (checkisExist) return res.status(409).json({ message: 'You Are Already Registered' });

        // hash password using bcrypt
        const hashPassword = await bcryptjs.hash(password, 10);

        // make entry of user in db
        const user = await userModel.create({
            name: name,
            email: email,
            password: hashPassword,
            userRole: userRole,
            userStatus: userStatus
        });
        // const token = jwt.sign({
        //     id: user._id,
        //     email,
        // }, process.env.SECRET_KEY);
        // return response
        // console.log("token", token);
        // res.cookie("token", token);
        res.status(201).json({
            success: true,
            message: "User Create SuccessFully",
            data: user
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const error = authValidation.loginAuthValidation(req.body);

        if (error) return res.status(400).json({ success: false, message: "Please Filled Field Carefully" });

        // check user exits or not 
        const user = await userModel.findOne({ email });

        if (!user) return res.status(409).json({ success: false, message: "You are not Registered" });

        // it means email is exist so now lets compare password
        // now compare password

        const isSame = await bcryptjs.compare(password, user.password);

        if (!isSame) return res.status(409).json({ success: false, message: "Please Enter Correct Password" });

        // now create token and send to user to future request from same user
        const token = jwt.sign({
            id: user._id,
            email: user.email,
            password: user.password
        },
            process.env.SECRET_KEY, { expiresIn: '1h' });

        console.log(jwt.verify(token, process.env.SECRET_KEY));
        // set token into cokkies
        res.cookie('userToken', token);
        // else it means user credential is correct so now lets return respinse
        console.log("User Token is", token);
        res.status(200).json({ success: true, message: "You are Successfully Logged" })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}
const resetPassword = async (req, res) => {

    try {

        const { email, oldpassword, newpassword } = req.body


        // check user is registred or not

        const user = await userModel.findOne({ email });

        if (!user) return res.status(404).json({ success: false, message: "USer is not Found" });


        // match stored password and oldpassword if match then allow reset password

        const isMatch = await bcryptjs.compare(oldpassword, user.password);

        if (!isMatch) return res.status(403).json({ success: false, message: "Please enter correct existing Password" });

        // it means password is correct so update old password woth new hash password

        const newHashPassword = await bcryptjs.hash(newpassword, 10);

        const resetUser = await userModel.findByIdAndUpdate(user._id,
            { password: newHashPassword },
            { returnDocument: 'after' }
        );
        await resetUser.save();

        res.status(200).json({
            success: true,
            message: "Your Password is updated Successfully",
            data: resetUser
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

const logoutUser = async (req, res) => {
    // remove token so that token is deletedn
    res.clearCookie('userToken');

    res.status(200).json({
        success: true,
        message: "Logged Out Successfully"
    });
};

// api to become client from customer to appli changes theatres
const customerClientReq = async (req, res) => {
    try {
        const userid = req.userId;
        const roleWantToBe = req.body.userRole;

        console.log(roleWantToBe);

        // check user exist or not 
        const user = await userModel.findById(userid);

        if (!user) return res.status(404).json({
            success: false,
            message: "User Not Found"
        });

        // chhheck is request already pending
        if (user.userStatus === 'PENDING') return res.status(400).json({
            success: false,
            message: "Request is Already Pending"
        });
        // change into pending request
        if (user.userRole.toUpperCase() === 'CUSTOMER' && roleWantToBe.toUpperCase() === 'CLIENT') {
            user.userStatus = 'PENDING'
        }
        await user.save();
        console.log(user);
        res.status(201).json({
            success: true,
            message: "Your request is paased to Admin for further Actions...",
            data: user
        });
    }
    catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }

}
// admin will approve req from custoner to client
const adminApproveClientReq = async (req, res) => {

    try {
        const userid = req.body.userId;

        // now find information for the user which need to approve

        const user = await userModel.findById(userid);

        // check is request already resolved or not
        if (user.userStatus.toUpperCase() === 'APPROVED' && user.userRole.toUpperCase() === 'CLIENT') {
            return res.status(200).json({
                success: true,
                message: "Your Request is Already Resolved"
            });
        }

        // lets update status and role
        user.userRole = 'CLIENT'.toUpperCase();
        user.userStatus = 'APPROVED'.toUpperCase();

        await user.save();
        console.log("Updated User After Geeting Approved Request From Admin", user);

        res.status(200).json({
            success: true,
            message: `Request for ${user.name} is Approved by Admin, Now You can Add your Movies to the theatre`
        });
    }
    catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

const updateUserInfo = async (req, res) => {

    try {
        const userId = req.params.id;
        let query = {};

        const { userStatus, userRole } = req.body;

        if (userStatus) query.userStatus = userStatus;
        if (userRole) query.userRole = userRole;

        console.log("update Query", query);

        const user = await userModel.findByIdAndUpdate(userId,
            query,
            { returnDocument: 'after' }
        );

        if (!user) return res.status(404).json({ success: false, message: "USer is not Found" });

        console.log(user);
        res.status(200).json({
            success: true,
            message: "Your information is updated Successfully",
            data: user
        });
    }
    catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

const getAllUsers = async (req, res) => {

    try {
        const allUser = await userModel.find().select('name').select('userRole');

        res.status(200).json({
            success: true,
            message: "All users are with the their role",
            data: allUser
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error });
    }
}

module.exports = {
    userRegister,
    loginUser,
    resetPassword,
    logoutUser,
    updateUserInfo,
    customerClientReq,
    adminApproveClientReq,
    getAllUsers
}