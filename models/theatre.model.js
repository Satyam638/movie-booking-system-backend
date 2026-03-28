const mongoose = require('mongoose');

const theatreSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    pincode:{
        type:Number,
        required:true
    },
    // movies list run by theatre
    movies:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:'Movie' //related to movie model
    }
},{
    timestamps:true
})


const theatreModel = mongoose.model('theatre',theatreSchema);

module.exports = theatreModel;