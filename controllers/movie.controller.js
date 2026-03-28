const mongoose = require('mongoose');
const MovieModel = require('../models/movie.model');
const Movie = require('../models/movie.model');
const redis = require('../config/redis')

const createMovie = async (req, res) => {

    try {
        const movie = await MovieModel.create(req.body);
        return res.status(201).json({
            success: true,
            movieData: movie,
            message: "Successfully Added New Movie"
        });

    } catch (error) {

        if (error.name === 'ValidationError') {
            res.status(422).json({
                success: false,
                message: error.message
            });
        }
        else {
            res.status(500).json({
                success: false,
                message: 'Internal Server Error'
            });
        }
    }
}
// all movies 
const listMovies = async (req, res) => {

    try {

        // check is thhe data present in cache or not

        // const cacheMovies = await redis.get("Movies")

        // if(cacheMovies) return res.status(200).json({
            // status: true,
            // message: 'Your Movies are',
            // data:cacheMovies
        // });

        // fetch from database
        const movie = await MovieModel.find();

        // now store movies into cache throgh cache and data is expire after 180 second automatically
        // await redis.set(JSON.stringify(movie),{EX:180});
        console.log(movie);
        res.status(200).json({
            status: true,
            message:'Movies are:',
            movie
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
}
// movie by id
const getMoviesById = async (req, res) => {
    try {
        const movieid = req.params.movieid;

        // check is movie created or not if

        const movie = await MovieModel.findById(movieid);
        if (!movie) {
            return res.status(404).
                json({
                    status: false,
                    message: 'Movie Not Found'
                });
        }
        res.status(200).
            json({
                status: true,
                movie
            })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
}
// delete movie by id
const deleteMovieById = async (req, res) => {

    try {
        const movieid = req.params.movieid;

        // check is movie created or not if

        const movie = await MovieModel.findById({ _id: movieid });
        if (!movie) {
            return res.status(404).
                json({
                    status: false,
                    message: 'Movie Not Found'
                });
        }
        // delete movie 
        await MovieModel.deleteOne({ _id: movieid });

        res.status(200).
            json({
                status: true,
                message: 'Movie is Deleted Successfully from Database',
                movie
            })
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
}
// update movie by id
const updateMoviebyId = async (req, res) => {
    const movieId = req.params.movieid;

    try {
        const movie = await MovieModel.findByIdAndUpdate(
            movieId,
            req.body,
            { returnDocument: 'after', runValidators: true }
        );
        // it means movie is updated
        res.status(200).json({
            status: true,
            message: 'Movie is Updated',
            movie
        });
    }
    catch (error) {

        if (error.name === 'ValidationError') {
            res.status(422).json({
                success: false,
                message: error.message
            });
        }
        else {
            res.status(500).json({
                success: false,
                message: 'Internal Server Error'
            });
        }
    }
}
// find movie by name 
const searchmovieByName = async (req, res) => {

    try {

        const movieName = req.query.name;

        if (!movieName) return res.status(400).json({
            status: false,
            message: "Movie name Must Required in query"
        });

        // find movie with given name
        const movie = await MovieModel.find({
            name: 
            { 
                $regex: movieName, 
                $options: 'i' 
            }
        });

        res.status(200).json({
            status: true,
            message: "Movies Found",
            movie
        });
    }
    catch (error) {

        if (error.name === 'ValidationError') {
            res.status(422).json({
                success: false,
                message: error.message
            });
        }
        else {
            res.status(500).json({
                success: false,
                message: 'Internal Server Error'
            });
        }
    }
}

module.exports = {
    createMovie,
    listMovies,
    getMoviesById,
    deleteMovieById,
    updateMoviebyId,
    searchmovieByName,
};