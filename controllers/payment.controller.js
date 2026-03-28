const paymenModel = require('../models/payment.model');
const showBooking = require('../models/showBooking.model');

// create payment

const makePayment = async (req, res) => {
    try {

        const { bookingid, paymentStatus } = req.body;
        const booking = await showBooking.findById(bookingid)

        if (!booking) return res.status(404).json({
            success: false,
            message: "Booking Not Found"
        })

        // now check payment status and change status of booking acc to it 
        if (paymentStatus === 'SUCCESS') {
            booking.bookingStatus = "BOOKED"
        }

        if (paymentStatus === 'FAILED') {
            booking.bookingStatus = "REJECTED"
        }

        await booking.save();

        res.status(200).json({
            success: true,
            message: `Payment ${paymentStatus}`,
            data: booking
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

module.exports = {
    makePayment

}