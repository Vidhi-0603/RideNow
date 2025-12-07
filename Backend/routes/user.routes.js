import express from 'express';
const router = express.Router();
import { body } from "express-validator";
import { registerUser, loginUser, getUserProfile, logoutUser } from '../controllers/user.controller.js';
import {authUser} from '../middlewares/auth.middleware.js';

router.post('/register', [
    body("email").isEmail().withMessage("Invalid Email"),
    body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters long!")
], registerUser);

router.post('/login', [
    body("email").isEmail().withMessage("Invalid Email"),
    body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters long!")
], loginUser);

router.get('/profile', authUser, getUserProfile);
router.post('/logout', logoutUser);

export default router;