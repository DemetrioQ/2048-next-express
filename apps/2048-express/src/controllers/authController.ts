import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_EXPIRY_MS, REFRESH_TOKEN_EXPIRY_MS } from 'src/config/constants';
import RefreshToken from 'src/models/RefreshToken';
import User, { IUser } from 'src/models/User';
import { generateTokens } from 'src/utils/token';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import sendEmail from 'src/utils/sendEmail';
import passport from 'passport';
import { PublicUser } from 'shared-2048-logic/types/User';
import { baseCookieOptionsAccessToken, baseCookieOptionsRefreshToken } from 'src/config/cookies';

export const getMe = async (req: Request, res: Response) => {
    const user = req.user as IUser;
    if (!user) {
        res.status(401).json({ message: 'User not found' });
        return;
    }
    res.status(200).json({ user: user.toPublic() });
}


export const refresh = async (req: Request, res: Response) => {

    const token = req.cookies.refresh_token;
    if (!token) {
        res.sendStatus(401);
        return;
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as { id: string };
        const existingToken = await RefreshToken.findOne({ token });

        if (!existingToken || existingToken.userId.toString() !== payload.id) {
            res.sendStatus(403);
            return;
        }

        const user = await User.findById(payload.id);
        if (!user) {
            res.sendStatus(403);
            return;
        }

        const { accessToken, refreshToken } = generateTokens(user);

        // Replace old token with new one
        await existingToken.deleteOne();
        await RefreshToken.create({
            userId: user._id,
            token: refreshToken,
            expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS),
            userAgent: req.headers['user-agent'],
            ipAddress: req.ip,
        });

        res
            .cookie('access_token', accessToken, baseCookieOptionsAccessToken)
            .cookie('refresh_token', refreshToken, baseCookieOptionsRefreshToken)
            .json({ message: 'Tokens refreshed' });
    } catch (err) {
        res.sendStatus(403);
        return;
    }
}


export const register = async (req: Request, res: Response) => {
    const { email, username, password } = req.body;
    try {
        const normalizedUsername = username.trim().toLowerCase();
        const existingUser = await User.findOne({ $or: [{ email: email }, { username: normalizedUsername }] });
        if (existingUser) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        const verificationToken = randomUUID();

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            email: email,
            username: normalizedUsername,
            password: hashedPassword,
            avatar: {
                imageUrl: process.env.DEFAULT_AVATAR_IMAGE_URL
            },
            verified: false,
            verificationToken,
            verificationExpires: Date.now() + 1000 * 60 * 60 * 24, // 24 hours
            lastVerificationEmailSent: Date.now()
        });
        await newUser.save();

        const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

        await sendEmail(
            newUser.email,
            "Verify your email",
            `
            <p>Hello ${newUser.username || 'there'},</p>
            <p>Thank you for registering! Please verify your email by clicking the link below:</p>
            <p><a href="${verificationUrl}" target="_blank" rel="noopener noreferrer">${verificationUrl}</a></p>
            <p>If you did not sign up, you can ignore this email.</p>
        `
        );


        res.status(201).json({ message: 'User registered successfully. Verification email sent.' });
        return;
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Server error' });
        return;
    }
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('local', async (err: unknown, user: IUser, info: { message: string }) => {
        if (err) return next(err);
        const { accessToken, refreshToken } = generateTokens(user);

        if (!user) {
            return res.status(401).json({ error: info?.message || 'Login failed' });
        }
        await RefreshToken.create({
            userId: user._id,
            token: refreshToken,
            expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS),
            userAgent: req.headers['user-agent'],
            ipAddress: req.ip,
        });
        const publicUser: PublicUser = user.toPublic()
        res.cookie('access_token', accessToken, baseCookieOptionsAccessToken)
            .cookie('refresh_token', refreshToken, baseCookieOptionsRefreshToken)
            .status(200)
            .json({ message: 'Logged in successfully', user: publicUser });

    })(req, res, next);
}

export const handleOAuthCallback = async (req: Request, res: Response) => {
    console.log('[OAuth] handleOAuthCallback called, req.user:', req.user ? (req.user as IUser)._id : 'null');
    console.log('[OAuth] FRONTEND_URL env:', process.env.FRONTEND_URL);
    if (!req.user) {
        console.warn('[OAuth] No req.user in handleOAuthCallback — redirecting to failure');
        return res.redirect('/login?error=oauth');
    }
    const user = req.user as IUser;
    const { accessToken, refreshToken } = generateTokens(user);

    await RefreshToken.create({
        userId: user._id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS),
        userAgent: req.headers['user-agent'],
        ipAddress: req.ip,
    });

    res.cookie('access_token', accessToken, baseCookieOptionsAccessToken);

    res.cookie('refresh_token', refreshToken, baseCookieOptionsRefreshToken);

    // res.redirect(`${process.env.FRONTEND_URL}/oauth/success`);

    res.send(`
    <html>
        <body>
        <script>
            if (window.opener) {
            window.opener.postMessage({ type: 'oauth-success' }, '${process.env.FRONTEND_URL}');
            window.close();
            } else {
            window.location.href = '${process.env.FRONTEND_URL}';
            }
        </script>
        </body>
    </html>
    `);
};

export const logout = async (req: Request, res: Response) => {
    const token = req.cookies.refresh_token;
    res.clearCookie('access_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    });
    res.clearCookie('refresh_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    });
    if (token) {
        try {
            // const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as { id: string };
            await RefreshToken.deleteOne({ token });

        } catch { }
    }
    res.sendStatus(204);
}