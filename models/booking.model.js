const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema({
    theatreId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "theatre"
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Users"
    },
    movieId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Movie"
    },
    timing: {
        type: String,
        required: true
    },
    noOfSeats: {
        type: Number,
        required: true,
    },
    totalCost: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum:{
            values:['IN_PROCESS','CANCELLED','SUCCESSFUL'],
            message:"Invalid Booking Status"
        },
        default:"IN_PROCESS"
    }

}, {
    timeStamps: true
})

const bookingModel = mongoose.model("Booking", bookingSchema);

module.exports = bookingModel;