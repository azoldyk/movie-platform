"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// Register a new user
router.post('/', userController_1.registerUser);
// Login user
router.post('/login', userController_1.loginUser);
// Get user profile (protected route)
router.get('/profile', authMiddleware_1.protect, userController_1.getUserProfile);
// Get user by username (public profile)
router.get('/:username', userController_1.getUserByUsername);
exports.default = router;
