const mongoose = require('mongoose');

const showSchema = new mongoose.Schema({
    movieId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Movie',
        required:true,
    },
    theatreId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'theatre',
        required:true,
    },
    showTime:{
        type:String,
        required:true
    },
    showDate:{
        type:Date,
        required:true
    },
    seatOccupancy:{
        type:Number,
        default:0,
        min:0,
        max:100
    },
    ticketPrice:{
        type:Number,
        required:true
    }
},{
    timestamps:true
});

const showModel = mongoose.model("show", showSchema);
module.exports = showModel;