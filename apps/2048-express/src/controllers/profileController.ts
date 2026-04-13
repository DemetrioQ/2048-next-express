// controllers/profileController.ts
import leo from 'leo-profanity'
import { Request, Response } from 'express';
import User, { IUser } from 'src/models/User';

import { UTApi } from "uploadthing/server";
import { randomUUID } from 'crypto';
import sendEmail from 'src/utils/sendEmail';

const COOLDOWN_MINUTES = Number(process.env.EMAIL_VALIDATION_COOLDOWN_IN_MINUTES) || 5;

const utapi = new UTApi();
export const updateAvatar = async (req: Request, res: Response) => {
    const { imageUrl, imageKey } = req.body;

    if (!imageUrl || !imageKey) {
        res.status(400).json({ error: 'Missing imageUrl or imageKey' });
        return
    }

    try {
        const user = await User.findById(req.user?.id);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return
        }

        // Delete old avatar if it exists
        if (user.avatar?.imageKey) {
            try {
                await utapi.deleteFiles([user.avatar.imageKey]);
            } catch (err) {
                console.warn('Failed to delete old avatar:', err); // Not fatal
            }
        }

        // Update avatar
        user.avatar = {
            imageUrl,
            imageKey,
        };
        await user.save();

        res.json({ success: true, avatar: user.avatar });
    } catch (err) {
        console.error('Failed to update avatar:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const updateUsername = async (req: Request, res: Response) => {
    leo.loadDictionary("en");
    const { newUserName } = req.body;
    const user = req.user as IUser;
    if (
        !newUserName ||
        typeof newUserName !== 'string' ||
        newUserName.length < 3 ||
        newUserName.length > 20 ||
        !/^[a-zA-Z0-9_]+$/.test(newUserName) ||
        leo.check(newUserName)
    ) {
        res.status(400).json({
            message:
                'Username must be 3-20 characters, alphanumeric or "-", "_", and not contain profanity.',
        });
        return
    }
    const normalizedUsername = newUserName.trim().toLowerCase();


    const exists = await User.findOne({ username: new RegExp(`^${normalizedUsername}$`, "i") });
    if (exists) {
        res.status(409).json({ message: 'Username already taken' });
        return;
    }

    user.username = normalizedUsername;
    await user.save();

    res.json({ username: user.username });

}

export const checkUsernameAvailable = async (req: Request, res: Response) => {
    const { username } = req.query;
    if (typeof username !== "string" || !username.trim()) {
        res.status(400).json({ message: "Username is required" });
        return;
    }

    const exists = await User.exists({ username: new RegExp(`^${username.trim()}$`, "i"), });
    res.json({ available: !exists });
};


export const verifyEmail = async (req: Request, res: Response) => {
    const { token } = req.query;
    console.log(token)
    const user = await User.findOne({
        verificationToken: token,
        verificationExpires: { $gt: Date.now() },
    });

    if (!user) {
        res.status(400).send("Invalid or expired token.");
        return;
    }

    user.verified = true;
    user.verificationToken = null;
    user.verificationExpires = null;
    await user.save();

    res.send("Email verified successfully.");
}


export const resendEmailVerification = async (req: Request, res: Response) => {
  console.log('[resendEmailVerification] called, user:', (req.user as IUser)?._id);
  const user = req.user as IUser;

  if (user.verified) {
    res.status(400).json({ message: 'Email is already verified.' });
    return;
  }

  const now = new Date();
  const lastSent = user.lastVerificationEmailSent;

  if (lastSent && now.getTime() - lastSent.getTime() < COOLDOWN_MINUTES * 60 * 1000) {
    const secondsLeft = Math.ceil((COOLDOWN_MINUTES * 60 * 1000 - (now.getTime() - lastSent.getTime())) / 1000);
    res.status(429).json({ message: `Please wait ${secondsLeft} seconds before resending verification email.` });
    return;
  }

  const verificationToken = randomUUID();
  user.verified = false;
  user.verificationToken = verificationToken;
  user.verificationExpires = new Date(Date.now() + 1000 * 60 * 60 * 24);
  user.lastVerificationEmailSent = now;

  await user.save();

  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

  console.log('[resendEmailVerification] sending email to:', user.email);
  console.log('[resendEmailVerification] EMAIL_USER set:', !!process.env.EMAIL_USER);
  console.log('[resendEmailVerification] GMAIL_CLIENT_ID set:', !!process.env.GMAIL_CLIENT_ID);
  console.log('[resendEmailVerification] GMAIL_REFRESH_TOKEN set:', !!process.env.GMAIL_REFRESH_TOKEN);

  try {
    await sendEmail(
      user.email,
      "Verify your email",
      `
        <p>Hello ${user.username || 'there'},</p>
        <p>Please verify your email by clicking the link below:</p>
        <p><a href="${verificationUrl}" target="_blank" rel="noopener noreferrer">${verificationUrl}</a></p>
      `
    );
    console.log('[resendEmailVerification] email sent successfully');
    res.status(200).json({ message: 'Verification email sent.' });
  } catch (err) {
    console.error('[resendEmailVerification] sendEmail failed:', err);
    res.status(500).json({ message: 'Failed to send verification email. Please try again later.' });
  }
};
