import { Request, Response } from 'express';
import axios from 'axios';
import User, { IUser } from '../models/User';
import mongoose from 'mongoose';

// @desc    Search movies from TMDB API
// @route   GET /api/movies/search
// @access  Public
export const searchMovies = async (req: Request, res: Response) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: 'Query parameter is required' });
    }

    const response = await axios.get(
      `https://api.themoviedb.org/3/search/movie?api_key=${process.env.TMDB_API_KEY}&query=${query}&language=en-US&page=1&include_adult=false`
    );

    res.json(response.data);
  } catch (error) {
    console.error('Error searching movies:', error);
    res.status(500).json({ 
      message: 'Something wrong with the API… most likely the API is down. Please try again later.' 
    });
  }
};

// @desc    Get movie details from TMDB API
// @route   GET /api/movies/:id
// @access  Public
export const getMovieDetails = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.TMDB_API_KEY}&language=en-US`
    );

    res.json(response.data);
  } catch (error) {
    console.error('Error getting movie details:', error);
    res.status(500).json({ 
      message: 'Something wrong with the API… most likely the API is down. Please try again later.' 
    });
  }
};

// @desc    Add movie to user's list
// @route   POST /api/movies/list
// @access  Private
export const addMovieToList = async (req: Request, res: Response) => {
  try {
    const { movieId, listName } = req.body;
    
    if (!movieId || !listName) {
      return res.status(400).json({ message: 'Movie ID and list name are required' });
    }

    // Find user
    const user = await User.findById(req.user._id) as IUser | null;
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if list exists
    const listIndex = user.lists.findIndex(list => list.name === listName);
    
    if (listIndex === -1) {
      // Create new list if it doesn't exist
      user.lists.push({
        name: listName,
        movies: [movieId.toString()],
      });
    } else {
      // Add movie to existing list if it's not already there
      if (!user.lists[listIndex].movies.includes(movieId.toString())) {
        user.lists[listIndex].movies.push(movieId.toString());
      }
    }

    await user.save();

    res.status(201).json({ message: 'Movie added to list', list: user.lists });
  } catch (error) {
    console.error('Error adding movie to list:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Remove movie from user's list
// @route   DELETE /api/movies/list
// @access  Private
export const removeMovieFromList = async (req: Request, res: Response) => {
  try {
    const { movieId, listName } = req.body;
    
    if (!movieId || !listName) {
      return res.status(400).json({ message: 'Movie ID and list name are required' });
    }

    // Find user and update their list
    const user = await User.findById(req.user._id) as IUser | null;
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if list exists
    const listIndex = user.lists.findIndex(list => list.name === listName);
    
    if (listIndex === -1) {
      return res.status(404).json({ message: 'List not found' });
    }

    // Remove movie from list using TMDB ID
    user.lists[listIndex].movies = user.lists[listIndex].movies.filter(
      id => id !== movieId.toString()
    );

    await user.save();

    res.json({ message: 'Movie removed from list', list: user.lists });
  } catch (error) {
    console.error('Error removing movie from list:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a user's list
// @route   DELETE /api/movies/list/:listName
// @access  Private
export const deleteList = async (req: Request, res: Response) => {
  try {
    const { listName } = req.params;
    
    // Find user
    const user = await User.findById(req.user._id) as IUser | null;
    
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

    await user.save();

    res.json({ message: 'List deleted', lists: user.lists });
  } catch (error) {
    console.error('Error deleting list:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 