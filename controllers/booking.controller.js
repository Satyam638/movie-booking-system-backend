const bookingModel = require('../models/booking.model');



// get all booking
const getAllBooking = async (req, res) => {
    try {
        const allbooking = await bookingModel.find()
            .populate('theatreId', 'name')
            .populate('movieId', 'name')
            .populate('userId', 'name')
            .select('noOfSeats timing totalCost');

        console.table("All booking are", allbooking)
        res.status(200).json({
            success: true,
            message: "All bookings are",
            data: allbooking
        })
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }

}

// get booking by id
const getSpecificBooking = async (req, res) => {

    try {
        const bookingId = req.params.id;

        const bookingbyId = await bookingModel.findById(bookingId)
        .populate('theatreId','name')
        .populate('movieId','name')
        .select('name');

        if (!bookingbyId) return res.status(404).json(
            {
                success: false,
                message: "Booking Not Found"
            }
        )

        res.status(200).json({
            success: true,
            message: `Your booking with booking id ${bookingId}`,
            data: bookingbyId
        })
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}


// create booking
const createBooking = async (req, res) => {


    try {
        let userId = req.userId;
        const newBooking = await bookingModel.create({ ...req.body, userId: userId });

        res.status(201).json({
            success: true,
            message: "Your Booking is Created Successfully",
            bookingData: newBooking
        })
    }
    catch (error) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}



// update booking

module.exports = {
    createBooking,
    getAllBooking,
    getSpecificBooking
};



