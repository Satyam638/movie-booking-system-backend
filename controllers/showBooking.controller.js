const showBookingModel = require('../models/showBooking.model');
const showModel = require('../models/show.model');
// create booking schema but it the user should be authenticated -> request should be validate -> check seat availability from database -> create booking -> move to payment
const createBooking = async (req, res) => {


    try {
        const { seats, showId } = req.body;
        // check is show available or not 
        const showData = await showModel.findById(showId);

        if (!showData) return res.status(404).json({
            success: false,
            message: "Show Not Found"
        });

        const bookings = await showBookingModel.find({
            showId,
            bookingStatus: {$in:["BOOKED",'IN_PROCESS']}
        });
        let bookedSeat = [];

        // fetch all seats allocated from booked ticket
        bookings.forEach(booking => {
            bookedSeat.push(...booking.seats);
        })

        // let's check is the any of the user selected seat is already booked or not, if booken then request will failed else request will approve and created a booking
        let seatTaken = false;

        for (let seat of seats) {
            if (bookedSeat.includes(seat)) {
                seatTaken = true;
                break;
            }
        }

        if (seatTaken) {
            return res.status(422).json({
                success: false,
                message: "Sorry Seat is not Available, Please book another seat"
            });
        }
        // let's calculate total amount and save for later payment
        const finalPrice = showData.ticketPrice * seats.length;

        console.log("price:", showData.ticketPrice);
        console.log("seats:", seats.length);
        console.log("final:", finalPrice);

        // let create booking
        const newBooking = await showBookingModel.create({
            ...req.body,
            userId: req.userId,
            totalAmt: finalPrice,
            noOfSeats: seats.length,
            bookingStatus:'IN_PROCESS'
        });
        const populateBookingusername = await newBooking.populate('userId','name');
        console.log(newBooking);
        res.status(201).json({
            success: true,
            message: `Booking is Created for ${populateBookingusername.userId.name}, Now let's move to Payment`,
            bookingData: newBooking
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }

}

// get all booking by particular userid
const getAllBookingByUser = async(req,res)=>{

    const allbookingByUser = await showBookingModel.find(
        {userId:req.params.id},
        {bookingStatus:"BOOKED"}
    )

    if(!allbookingByUser) return res.status(404).json({
        success:false,
        message:"No Booking Found"
    })

    res.status(200).json({
        success:true,
        message:"All your booking are",
        data:allbookingByUser
    });
}
// delete user booking
const cancelBooking = async(req,res)=>{

    const booking = await showBookingModel.findByIdAndDelete(req.params.id);

    if(!booking) return res.status(404).json({
        success:false,
        message:"Booking Not Found"
    });
    console.log("Booking Data:",booking)
    res.status(200).json({
        success:true,
        message:"Booking is Cancelled Successfully",
        data:booking
    });
};

module.exports = {
    createBooking,
    getAllBookingByUser,
    cancelBooking
};
