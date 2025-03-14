import express from 'express';
import { 
  searchMovies, 
  getMovieDetails, 
  addMovieToList, 
  removeMovieFromList, 
  deleteList 
} from '../controllers/movieController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// Public routes
router.get('/search', searchMovies);
router.get('/:id', getMovieDetails);

// Protected routes
router.post('/list', protect, addMovieToList);
router.delete('/list', protect, removeMovieFromList);
router.delete('/list/:listName', protect, deleteList);

export default router; 