// routes/authRoutes.js
import { Router } from 'express';
import { loginUser, signupUser, getSession, logoutUser } from '../controllers/authController.js';

const router = Router();

router.post('/login', loginUser);
router.post('/signup', signupUser);
router.get('/session', getSession);
router.post('/logout', logoutUser);

export default router;