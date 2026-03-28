const jwt = require('jsonwebtoken');
require('dotenv').config()



function identifier(req,res,next){

    const token = req.cookie.userToken;

    // check is token present or not 
    if(!token) return res.status(422).json({success:false,message:"Token Missing"})

        console.log(token);
    // lets compare tokens 
    const decodeToken = jwt.verify(token,process.env.SECRET_KEY)

    if(decodeToken){
        next();
        return "You Can Perform Actions"
    }
}
module.exports = identifier;