import express from 'express';
import session from 'express-session';
import passport from './passport/config';
import mongoose from 'mongoose';
import authRoutes from './routes/auth';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorHandler } from './middlewares/errorHandler';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// backend app.ts
app.use(
    cors({
      origin: process.env.FRONTEND_URL!,
      credentials: true, // Allow cookies to be sent
    })
  );

app.use(express.json());
app.use(
    session({
      secret: process.env.SESSION_SECRET!,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      },
    })
  );
app.use(passport.initialize());
app.use(passport.session());
app.use(errorHandler);

app.use('/auth', authRoutes);

mongoose.connect(process.env.MONGO_URI!).then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
});

  
