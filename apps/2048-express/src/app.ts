import express from 'express';
import session from 'express-session';
import passport from './passport/config';
import mongoose from 'mongoose';
import authRoutes from './routes/auth';
import scoresRoutes from './routes/scores';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorHandler } from './middlewares/errorHandler';
import MongoStore from 'connect-mongo';
import cookieParser from 'cookie-parser';
import { REFRESH_TOKEN_EXPIRY_MS } from './config/constants';
import { requestLogger } from './middlewares/requestLogMiddleware';

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
app.use(cookieParser());

app.use(session({
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: REFRESH_TOKEN_EXPIRY_MS, // 1 week
  },
}));


app.use(passport.initialize());
// app.use(passport.session());
app.use(errorHandler);
app.use(requestLogger);


app.use('/auth', authRoutes);
app.use('/scores', scoresRoutes);

mongoose.connect(process.env.MONGO_URI!).then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
});

  
