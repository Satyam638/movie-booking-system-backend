const theatreModel = require('../models/theatre.model');

const mongoose = require('mongoose');
const movieModel = require('../models/movie.model');

const badRequestResponse = {
    success: false,
    err: "",
    data: [],
    message: "Bad Request"
}
const validateCreateMovieReq = async (req, res, next) => {

    // validate movie name 

    if (!req.body.name) {

        badRequestResponse.err = "The name of the movie is not present in the request";
        return res.status(400).json(badRequestResponse);
    }

    // validate description
    if (!req.body.description) {

        badRequestResponse.err = "The description of the movie is not present in the request";
        return res.status(400).json(badRequestResponse);
    }

    // validate duration
    if (!req.body.duration) {

        badRequestResponse.err = "The duration of the movie is not present in the request";
        return res.status(400).json(badRequestResponse);
    }
    // validate casts
    if (!req.body.casts || (req.body.casts.length === 0) || !(req.body.casts instanceof Array)) {

        badRequestResponse.err = "The casts of the movie is not present in the request";
        return res.status(400).json(badRequestResponse);
    }
    // validate trailerUrl
    if (!req.body.trailerUrl) {

        badRequestResponse.err = "The trailer URL of the movie is not present in the request";
        return res.status(400).json(badRequestResponse);
    }
    // validate releaseDate
    if (!req.body.releaseDate) {

        badRequestResponse.err = "The release Date of the movie is not present in the request";
        return res.status(400).json(badRequestResponse);
    }
    // validate director
    if (!req.body.director) {

        badRequestResponse.err = "The director's name of the movie is not present in the request";
        return res.status(400).json(badRequestResponse);
    }
    // validate releaseStatus
    if (!req.body.releaseStatus) {

        badRequestResponse.err = "The release status of the movie is not present in the request";
        return res.status(400).json(badRequestResponse);
    }

    next();
}
const createBookingValidation = async(req,res,next)=>{

    if(!req.body.theatreId){
        badRequestResponse.err = "Theatre Id is not Present in Request";
        return res.status(422).json(badRequestResponse)
    }
    if(!mongoose.Types.ObjectId.isValid(req.body.theatreId)){
        badRequestResponse.err = "Theatre Id is not valid in Request";
        return res.status(422).json(badRequestResponse)
    }
    const theatreisExist = await theatreModel.findById(req.body.theatreId);
    if(!theatreisExist){
        badRequestResponse.err = "Theatre is not Found";
        return res.status(422).json(badRequestResponse)
    }
    // movies
    if(!req.body.movieId){
        badRequestResponse.err = "Movie Id is not Present in Request";
        return res.status(422).json(badRequestResponse)
    }
    if(!mongoose.Types.ObjectId.isValid(req.body.movieId)){
        badRequestResponse.err = "Movie Id is not valid in Request";
        return res.status(422).json(badRequestResponse)
    }
    const movieisExist = await movieModel.findById(req.body.movieId);
    if(!movieisExist){
        badRequestResponse.err = "Movies is not Found";
        return res.status(422).json(badRequestResponse)
    }

    if(!req.body.timing){
        badRequestResponse.err = "Timing is not valid in Request";
        return res.status(422).json(badRequestResponse)

    }
    if(!req.body.noOfSeats){
        badRequestResponse.err = "No of Seat  is not valid in Request";
        return res.status(422).json(badRequestResponse)

    }
    if(!req.body.totalCost){
        badRequestResponse.err = "total cost is not valid in Request";
        return res.status(422).json(badRequestResponse)

    }
    // const allowedStatus = ['IN_PROCESS','CANCELLED','SUCCESSFUL'];
    // if(!req.body.status || !allowedStatus.includes(req.body.status.toUpperCase())){
    //     badRequestResponse.err = "Status is not Present or Invalid in Request";
    //     return res.status(422).json(badRequestResponse)
    // }

    console.log("You Request is valid, lets proceed further");
    next();
}
const createShowValidation = async(req,res,next)=>{

    if(!req.body.theatreId){
        badRequestResponse.err = "Theatre Id is not Present in Request";
        return res.status(422).json(badRequestResponse)
    }
    if(!mongoose.Types.ObjectId.isValid(req.body.theatreId)){
        badRequestResponse.err = "Theatre Id is not valid in Request";
        return res.status(422).json(badRequestResponse)
    }
    const theatreisExist = await theatreModel.findById(req.body.theatreId);
    if(!theatreisExist){
        badRequestResponse.err = "Theatre is not Found";
        return res.status(422).json(badRequestResponse)
    }
    // movies
    if(!req.body.movieId){
        badRequestResponse.err = "Movie Id is not Present in Request";
        return res.status(422).json(badRequestResponse)
    }
    if(!mongoose.Types.ObjectId.isValid(req.body.movieId)){
        badRequestResponse.err = "Movie Id is not valid in Request";
        return res.status(422).json(badRequestResponse)
    }
    const movieisExist = await movieModel.findById(req.body.movieId);
    if(!movieisExist){
        badRequestResponse.err = "Movies is not Found";
        return res.status(422).json(badRequestResponse)
    }

    if(!req.body.showTime){
        badRequestResponse.err = "Show Timing is not valid in Request";
        return res.status(422).json(badRequestResponse)

    }
    if(!req.body.seatOccupancy){
        badRequestResponse.err = "Total Seat Occupancy is not valid in Request";
        return res.status(422).json(badRequestResponse)

    }
    if(!req.body.ticketPrice){
        badRequestResponse.err = "Ticket Price is not valid in Request";
        return res.status(422).json(badRequestResponse)

    }
    // const allowedStatus = ['IN_PROCESS','CANCELLED','SUCCESSFUL'];
    // if(!req.body.status || !allowedStatus.includes(req.body.status.toUpperCase())){
    //     badRequestResponse.err = "Status is not Present or Invalid in Request";
    //     return res.status(422).json(badRequestResponse)
    // }

    console.log("You Request is valid, lets proceed further");
    next();
}
const createShowBookingValidation = async(req,res,next)=>{

    if(!req.body.showId){
        badRequestResponse.err = "Show ID  is not present in request"
        return res.status(422).json(badRequestResponse);
    }

    if(!req.body.seats|| (req.body.seats.length === 0) || !(req.body.seats instanceof Array)){
        badRequestResponse.err = "Seat number is  is not present in request"
        return res.status(422).json(badRequestResponse);
    }
    console.log("Data is valid now let's create booking for you");
    next();
}

const isSeatAvailability  = async(req,res,next)=>{

}

module.exports = {
    validateCreateMovieReq,
    createBookingValidation,
    createShowValidation,
    createShowBookingValidation
};