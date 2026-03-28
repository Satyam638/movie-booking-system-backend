const mongoose = require('mongoose');



const userSchrma = mongoose.Schema({

    name:{
        type:String,
        required:true,
        trim:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true,
        lowercase:true,
        match:[/^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i,'Please Enter Valid Email Address']
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minLength:8
    },
    userRole:{
        type:String,
        required:true,
        default:'CUSTOMER'
    },
    userStatus:{
        type:String,
        required:true,
        default:"APPROVED"
    }
},{
    timestamps:true
})
const userModel = mongoose.model('Users',userSchrma);

module.exports = userModel;