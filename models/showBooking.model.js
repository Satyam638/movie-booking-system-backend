const mongoose = require('mongoose');

const showBookingSchema = new mongoose.Schema({
    showId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'show',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    seats: {
        type: [String],
        required: true
    },
    noOfSeats: {
        type: Number,
        required: true
    },
    // add total amount of ticket by backend
    totalAmt: {
        type: Number
    },
    bookingStatus: {
        type:String,
        enum: {
            values: ['BOOKED', 'IN_PROCESS', 'CANCELLED'],
            default: 'IN_PROCESS'
        }
    }
}, {
    timestamps: true
})

const showBooking = mongoose.model('showBooking', showBookingSchema);

module.exports = showBooking;