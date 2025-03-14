import { Request, Response } from 'express';
import User, { IUser } from '../models/User';
import generateToken from '../utils/generateToken';

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
export const registerUser = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  try {
    // Check if user already exists
    const userExists = await User.findOne({ $or: [{ email }, { username }] });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create default movie lists
    const defaultLists = [
      { name: 'Watched', movies: [] },
      { name: 'Planning to watch', movies: [] },
      { name: 'Watching', movies: [] },
    ];

    // Create user
    const user = await User.create({
      username,
      email,
      password,
      lists: defaultLists,
    }) as IUser;

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        lists: user.lists,
        token: generateToken(user._id.toString()),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email }) as IUser | null;

    // Check if user exists and password matches
    if (user && (await user.comparePassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        lists: user.lists,
        token: generateToken(user._id.toString()),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user._id) as IUser | null;

    if (user) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        lists: user.lists,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user by username (for public profile)
// @route   GET /api/users/:username
// @access  Public
export const getUserByUsername = async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ username: req.params.username }) as IUser | null;

    if (user) {
      res.json({
        _id: user._id,
        username: user.username,
        lists: user.lists,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}; 