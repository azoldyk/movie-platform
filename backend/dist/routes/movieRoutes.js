"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const movieController_1 = require("../controllers/movieController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// Public routes
router.get('/search', movieController_1.searchMovies);
router.get('/:id', movieController_1.getMovieDetails);
// Protected routes
router.post('/list', authMiddleware_1.protect, movieController_1.addMovieToList);
router.delete('/list', authMiddleware_1.protect, movieController_1.removeMovieFromList);
router.delete('/list/:listName', authMiddleware_1.protect, movieController_1.deleteList);
exports.default = router;
