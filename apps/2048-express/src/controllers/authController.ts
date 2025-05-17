import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_EXPIRY_MS, REFRESH_TOKEN_EXPIRY_MS } from 'src/config/constants';
import RefreshToken from 'src/models/RefreshToken';
import User, { IUser } from 'src/models/User';
import { generateTokens } from 'src/utils/token';
import bcrypt from 'bcryptjs';

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
            .cookie('access_token', accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: ACCESS_TOKEN_EXPIRY_MS,
            })
            .cookie('refresh_token', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: REFRESH_TOKEN_EXPIRY_MS,
            })
            .json({ message: 'Tokens refreshed' });
    } catch (err) {
        res.sendStatus(403);
        return;
    }
}


export const register = async (req: Request, res: Response) => {
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
        return;
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
        return;
    }
}

export const login = async (req: Request, res: Response) => {
    if (!req.user) return res.redirect('/login?error=oauth');
    const user = req.user as IUser;
    const { accessToken, refreshToken } = generateTokens(user);

    await RefreshToken.create({
        userId: user._id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS),
        userAgent: req.headers['user-agent'],
        ipAddress: req.ip,
    });

    res
        .cookie('access_token', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: ACCESS_TOKEN_EXPIRY_MS,
        })
        .cookie('refresh_token', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: REFRESH_TOKEN_EXPIRY_MS,
        })
        .status(200)
        .json({ message: 'Logged in successfully', user });
}

export const handleOAuthCallback = async (req: Request, res: Response) => {
    if (!req.user) return res.redirect('/login?error=oauth');
    const user = req.user as IUser;
    const { accessToken, refreshToken } = generateTokens(user);

    await RefreshToken.create({
        userId: user._id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS),
        userAgent: req.headers['user-agent'],
        ipAddress: req.ip,
    });

    res.cookie('access_token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: ACCESS_TOKEN_EXPIRY_MS,
    });

    res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: REFRESH_TOKEN_EXPIRY_MS,
    });

    res.send(`
    <html>
      <body>
        <script>
          if (window.opener) {
            window.opener.postMessage({ type: 'oauth-success' }, '*');
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
    res.clearCookie('refresh_token', { path: '/' });
    if (token) {
        try {
            const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as { id: string };
            await RefreshToken.deleteOne({ token });
        } catch { }
    }
    res.sendStatus(204);
}