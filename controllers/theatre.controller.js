const mongoose = require('mongoose');
const theatreModel = require('../models/theatre.model')
const Movie = require('../models/movie.model');

// create theatre
const createTheatre = async (req, res) => {
    try {
        const newTheatre = await theatreModel.create(req.body)

        console.log(newTheatre);
        res.status(201).json({
            success: true,
            message: "Theatre is Created Successfully",
            data: newTheatre
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal Service Error"
        })
    }
}

// add movies to the theatre <important Function>
const addMoviesToTheatre = async (req, res) => {

    try {
        let theatre;
        const { insert, movieIds } = req.body;
        const theatreId = req.params.id;

        if (!Array.isArray(movieIds)) {
            return res.status(400).json({
                success: false,
                message: "movieIds must be an array"
            });
        }

        if (insert) {
            // Add movies (no duplicates)
            theatre = await theatreModel.findByIdAndUpdate(
                { _id: theatreId },
                { $addToSet: { movies: { $each: movieIds } } },
                { returnDocument: 'after' }
            );
        } else {
            // Remove movies
            theatre = await theatreModel.findByIdAndUpdate(
                { _id: theatreId },
                { $pull: { movies: { $in: movieIds } } },
                { returnDocument: 'after' }
            );
        }
        // const theatre = await theatreModel.findById(theatreId);
        console.log(theatre);
        if (!theatre) {
            return res.status(404).json({
                success: false,
                message: "Theatre not found"
            });
        }

        await theatre.populate('movies');

        return res.status(200).json({
            success: true,
            message: "Changes Done",
            theatre
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};
// run movies in particular theatre - Need to work on this theatre
const allMovieRunningTheatre = async (req, res) => {

    try {
        const { theatreName, city } = req.query;
        if (!theatreName || !city) {
            return res.status(400).json({
                success: false,
                message: "theatreName and city are required"
            });
        }

        // find theatre and movies runnning in it using populate method exist or not
        const theatre = await theatreModel.findOne({
            name: { $regex: theatreName, $options: 'i' },
            city: { $regex: city, $options: 'i' }
        })
            .populate('movies', 'name');

        if (!theatre) return res.status(404).json({
            success: false,
            message: 'Theatre not Found'
        });

        console.log(theatre);
        return res.status(200).json({
            success: true,
            message: 'Movies running in this theatre',
            theatreName:theatre.name,
            city: theatre.city,
            movies:theatre.movies
        })
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal Service Error"
        })
    }
}

const movieRuninAllTheatre = async (req, res) => {

    try {
        const movieName = req.query.movieName;

        // write query to find all theatre run this movie
        if (!movieName) return res.status(422).json({ message: "Movie Name Must be Required" })

        const movieData = await Movie.findOne(
            { name: { $regex: movieName, $options: 'i' } });

        if (!movieData) {
            return res.status(404).json({
                success: false,
                message: "Movie Not Found:"
            })
        }

        const allTheatre = await theatreModel.find({ movies: movieData._id }).select('name');

        console.log(allTheatre);
        res.status(200).json({
            success: true,
            message: `All Theatre Which Run ${movieName} Movie:`,
            theatreData: allTheatre
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal Service Error"
        })
    }
}

const getAllTheatre = async (req, res) => {

    try {
        let query = {};
        const { city, pincode, name, address } = req.query;

        if (city) {
            query.city = { $regex: city, $options: 'i' }
        }
        if (pincode) {
            query.pincode = Number(pincode);
        }
        if (name) {
            query.name = { $regex: name, $options: 'i' }
        }
        if (address) {
            query.address = { $regex: address, $options: 'i' }
        }

        const allTheatres = await theatreModel.find(query);
        console.log(allTheatres);
        const totalDoc = await theatreModel.countDocuments({ city: query.city })
        console.log(`total Document for ${query.city}`, totalDoc);
        res.status(200).json({
            success: true,
            message: "All Theatres are",
            totalDoc,
            data: allTheatres
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal Service Error"
        })
    }

}

const deleteTheatre = async (req, res) => {
    try {
        const theatre = await theatreModel.findByIdAndDelete(req.params.id);
        console.log(theatre);
        res.status(200).json({
            status: true,
            message: "theatre is Deleted Successfully",
            data: theatre
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal Service Error"
        })
    }
}

const updateTheatre = async (req, res) => {

    try {

        const updateTheatre = await theatreModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                returnDocument: 'after', runValidators: true
            }
        )
        console.log(updateTheatre);
        res.status(200).json({
            status: true,
            message: "Your Theatre Info Has Updated Successfully",
            data: updateTheatre
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal Service Error"
        })
    }
}
// search theatree based on name, city or pincode
const theatreSearch = async (req, res) => {

    try {
        const { name, city, pincode, limit, skip, page, actor } = req.query;

        let query = {};
        let pagination = {};

        if (name) {
            query.name = { $regex: name, $options: 'i' }
        }
        if (city) {
            query.city = { $regex: city, $options: 'i' }
        }
        if (pincode) {
            query.pincode = pincode
        }
        if (limit) {
            pagination.limit = Number(limit);
        }
        if (skip && page) {
            pagination.Number(skip) = (Number(page) - 1) * limit;
        }
        // apply filter to find theatre with 
        if (actor) {
            query.actor = actor;
        }
        // find all theatre in for selected city from database
        console.log('query:', query);
        const theatre = await theatreModel.find(query, {}, pagination);
        console.log(theatre);
        res.status(200).json({
            status: true,
            message: `All Your Theatre based on search is`,
            totalTheatre: theatre.length,
            data: theatre
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal Service Error"
        })
    }


}
module.exports = {
    createTheatre,
    getAllTheatre,
    deleteTheatre,
    movieRuninAllTheatre,
    updateTheatre,
    theatreSearch,
    addMoviesToTheatre,
    allMovieRunningTheatre
}