import { NextFunction, Router, Request, Response } from 'express';

import passport from 'passport';
import bcrypt from 'bcryptjs';
import User from '../models/User';

// Correctly type passport.authenticate


const router = Router();

// Add this route after the others
router.get('/me', (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated() && req.user) {
        const user = req.user as { _id: string; email: string };
        res.status(200).json({ user });
    } else {
           res.status(401).json({ message: 'Not authenticated' });
        // const err = new Error('Not authenticated');
        // (err as any).status = 401;
        // next(err); // Pass to error handler
    }
});




router.post('/register', async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/login', passport.authenticate('local'), (req: Request, res: Response) => {
    res.status(200).json({ message: 'Logged in successfully', user: req.user });
});

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: `${process.env.FRONTEND_URL}/login?error=true` }),
    (req, res) => {
        res.send(`
            <html>
              <body>
                <script>
                  // Notify opener window (your main app)
                  if (window.opener) {
                    window.opener.postMessage({ type: 'oauth-success' }, '*');
                    window.close();
                  } else {
                    window.location.href = '${process.env.FRONTEND_URL}'; // fallback
                  }
                </script>
              </body>
            </html>
          `);
    }
);

// GitHub OAuth
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get(
    '/github/callback',
    passport.authenticate('github', { failureRedirect: `${process.env.FRONTEND_URL}/` }),
    (req, res) => {
        res.send(`
            <html>
              <body>
                <script>
                  // Notify opener window (your main app)
                  if (window.opener) {
                    window.opener.postMessage({ type: 'oauth-success' }, '*');
                    window.close();
                  } else {
                    window.location.href = '${process.env.FRONTEND_URL}'; // fallback
                  }
                </script>
              </body>
            </html>
          `);
          
    }
);


router.post('/logout', (req: Request, res: Response) => {
    req.logout(() => {
        res.status(200).json({ message: 'Logged out successfully' });
    });
});

export default router;