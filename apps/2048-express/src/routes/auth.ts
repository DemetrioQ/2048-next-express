import { Router } from 'express';
import passport from 'passport';
import { authMiddleware } from 'src/middlewares/authMiddleware';
import { getMe, handleOAuthCallback, login, logout, refresh, register } from 'src/controllers/authController';

const router = Router();

router.get('/me', authMiddleware, getMe);

router.post('/refresh', refresh);

router.post('/register', register);

router.post('/login', passport.authenticate('local'), login);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: `${process.env.FRONTEND_URL}/login?error=true` }), handleOAuthCallback);
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get('/github/callback', passport.authenticate('github', { failureRedirect: `${process.env.FRONTEND_URL}/` }), handleOAuthCallback);

router.post('/logout', logout);

export default router;