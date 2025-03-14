import express from 'express';
import { registerUser, loginUser, getUserProfile, getUserByUsername } from '../controllers/userController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// Register a new user
router.post('/', registerUser);

// Login user
router.post('/login', loginUser);

// Get user profile (protected route)
router.get('/profile', protect, getUserProfile);

// Get user by username (public profile)
router.get('/:username', getUserByUsername);

export default router; 