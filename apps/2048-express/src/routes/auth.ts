import { Router } from 'express';
import passport from 'passport';
import { authMiddleware } from 'src/middlewares/authMiddleware';
import { getMe, handleOAuthCallback, login, logout, refresh, register } from 'src/controllers/authController';

const router = Router();

router.get('/me', authMiddleware, getMe);

router.post('/refresh', refresh);

router.post('/register', register);

router.post('/login',  login);

router.get('/google', (req, res, next) => {
  console.log('[OAuth] Starting Google flow');
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});
router.get('/google/callback', (req, res, next) => {
  console.log('[OAuth] Google callback hit', { query: req.query, sessionID: req.sessionID });
  passport.authenticate('google', {
    failureRedirect: `${process.env.FRONTEND_URL}/oauth/failure`,
    failureMessage: true,
  }, (err: any, user: any, info: any) => {
    if (err) {
      console.error('[OAuth] Google callback error:', err);
      return next(err);
    }
    if (!user) {
      console.warn('[OAuth] Google auth failed — no user returned. Info:', info);
      return res.redirect(`${process.env.FRONTEND_URL}/oauth/failure`);
    }
    console.log('[OAuth] Google auth succeeded for user:', user._id);
    req.user = user;
    return handleOAuthCallback(req, res);
  })(req, res, next);
});

router.get('/github', (req, res, next) => {
  console.log('[OAuth] Starting GitHub flow');
  passport.authenticate('github', { scope: ['user:email'] })(req, res, next);
});
router.get('/github/callback', (req, res, next) => {
  console.log('[OAuth] GitHub callback hit', { query: req.query, sessionID: req.sessionID });
  passport.authenticate('github', {
    failureRedirect: `${process.env.FRONTEND_URL}/oauth/failure`,
    failureMessage: true,
  }, (err: any, user: any, info: any) => {
    if (err) {
      console.error('[OAuth] GitHub callback error:', err);
      return next(err);
    }
    if (!user) {
      console.warn('[OAuth] GitHub auth failed — no user returned. Info:', info);
      return res.redirect(`${process.env.FRONTEND_URL}/oauth/failure`);
    }
    console.log('[OAuth] GitHub auth succeeded for user:', user._id);
    req.user = user;
    return handleOAuthCallback(req, res);
  })(req, res, next);
});

router.post('/logout', authMiddleware, logout);

export default router;