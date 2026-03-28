const show = require('../models/show.model');

// create show
const createShow = async (req, res) => {
    try {
        const newShow = await show.create(req.body);

        console.log(newShow);
        res.status(201).json({
            success: true,
            message: `New Show Has Created in ${req.body.theatreId} for ${req.body.movieId}`,
            data: newShow
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

const getAllshowByTheatre = async (req, res) => {

    // find all show by theatre

    try {
        const allShowByTheatre = await show.find({ theatreId: req.params.id })
            .populate('theatreId', 'name')
            .populate('movieId', 'name');

        console.log(allShowByTheatre);
        res.status(200).json({
            success: true,
            message: "All Show With theatre",
            data: allShowByTheatre
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }

}

const cancelShowByID = async (req, res) => {

    try {
        const cancelShow = await show.findByIdAndDelete(req.params.id);
        console.log(cancelShow);
        res.status(200).json({
            success: true,
            message: `Show with ${req.params.id} id is deleted from database successfully`,
            data: cancelShow
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

module.exports = {
    createShow,
    getAllshowByTheatre,
    cancelShowByID
};