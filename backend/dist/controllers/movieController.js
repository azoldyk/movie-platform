"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteList = exports.removeMovieFromList = exports.addMovieToList = exports.getMovieDetails = exports.searchMovies = void 0;
const axios_1 = __importDefault(require("axios"));
const Movie_1 = __importDefault(require("../models/Movie"));
const User_1 = __importDefault(require("../models/User"));
// @desc    Search movies from TMDB API
// @route   GET /api/movies/search
// @access  Public
const searchMovies = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { query } = req.query;
        if (!query) {
            return res.status(400).json({ message: 'Query parameter is required' });
        }
        const response = yield axios_1.default.get(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.TMDB_API_KEY}&query=${query}&language=en-US&page=1&include_adult=false`);
        res.json(response.data);
    }
    catch (error) {
        console.error('Error searching movies:', error);
        res.status(500).json({
            message: 'Something wrong with the API… most likely the API is down. Please try again later.'
        });
    }
});
exports.searchMovies = searchMovies;
// @desc    Get movie details from TMDB API
// @route   GET /api/movies/:id
// @access  Public
const getMovieDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const response = yield axios_1.default.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.TMDB_API_KEY}&language=en-US`);
        res.json(response.data);
    }
    catch (error) {
        console.error('Error getting movie details:', error);
        res.status(500).json({
            message: 'Something wrong with the API… most likely the API is down. Please try again later.'
        });
    }
});
exports.getMovieDetails = getMovieDetails;
// @desc    Add movie to user's list
// @route   POST /api/movies/list
// @access  Private
const addMovieToList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { movieId, listName } = req.body;
        if (!movieId || !listName) {
            return res.status(400).json({ message: 'Movie ID and list name are required' });
        }
        // Check if movie exists in our database
        let movie = yield Movie_1.default.findOne({ tmdbId: movieId });
        // If movie doesn't exist, fetch from TMDB and save to our database
        if (!movie) {
            const response = yield axios_1.default.get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.TMDB_API_KEY}&language=en-US`);
            const movieData = response.data;
            movie = (yield Movie_1.default.create({
                tmdbId: movieData.id,
                title: movieData.title,
                description: movieData.overview,
                imageUrl: `https://image.tmdb.org/t/p/w500${movieData.poster_path}`,
                rating: movieData.vote_average,
            }));
        }
        // Find user and update their list
        const user = yield User_1.default.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Check if list exists
        const listIndex = user.lists.findIndex(list => list.name === listName);
        if (listIndex === -1) {
            // Create new list if it doesn't exist
            user.lists.push({
                name: listName,
                movies: [movie._id],
            });
        }
        else {
            // Add movie to existing list if it's not already there
            if (!user.lists[listIndex].movies.includes(movie._id)) {
                user.lists[listIndex].movies.push(movie._id);
            }
        }
        yield user.save();
        res.status(201).json({ message: 'Movie added to list', list: user.lists });
    }
    catch (error) {
        console.error('Error adding movie to list:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.addMovieToList = addMovieToList;
// @desc    Remove movie from user's list
// @route   DELETE /api/movies/list
// @access  Private
const removeMovieFromList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { movieId, listName } = req.body;
        if (!movieId || !listName) {
            return res.status(400).json({ message: 'Movie ID and list name are required' });
        }
        // Find movie in our database
        const movie = yield Movie_1.default.findOne({ tmdbId: movieId });
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        // Find user and update their list
        const user = yield User_1.default.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Check if list exists
        const listIndex = user.lists.findIndex(list => list.name === listName);
        if (listIndex === -1) {
            return res.status(404).json({ message: 'List not found' });
        }
        // Remove movie from list
        user.lists[listIndex].movies = user.lists[listIndex].movies.filter(id => !id.equals(movie._id));
        yield user.save();
        res.json({ message: 'Movie removed from list', list: user.lists });
    }
    catch (error) {
        console.error('Error removing movie from list:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.removeMovieFromList = removeMovieFromList;
// @desc    Delete a user's list
// @route   DELETE /api/movies/list/:listName
// @access  Private
const deleteList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { listName } = req.params;
        // Find user
        const user = yield User_1.default.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Check if it's a default list
        const defaultLists = ['Watched', 'Planning to watch', 'Watching'];
        if (defaultLists.includes(listName)) {
            return res.status(400).json({ message: 'Cannot delete default lists' });
        }
        // Remove list
        user.lists = user.lists.filter(list => list.name !== listName);
        yield user.save();
        res.json({ message: 'List deleted', lists: user.lists });
    }
    catch (error) {
        console.error('Error deleting list:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.deleteList = deleteList;
