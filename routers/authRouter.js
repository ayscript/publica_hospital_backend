import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { getUserProfile } from '../controllers/authController.js';

const authRouter = express.Router();


authRouter.post('/register', registerUser);
authRouter.post('/login', loginUser);


authRouter.get('/profile', verifyToken, getUserProfile);

export default authRouter;