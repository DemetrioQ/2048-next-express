import './types/globalTypes'; 
import express from 'express';
import session from 'express-session';
import passport from './passport/config';
import mongoose from 'mongoose';
import authRoutes from './routes/auth';
import scoresRoutes from './routes/scores';
import profileRoutes from './routes/profile';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorHandler } from './middlewares/errorHandler';
import { notFoundHandler } from './middlewares/notFoundHandler';
import { requestLogger } from './middlewares/requestLogMiddleware';
import { registerProcessHandlers } from './utils/processHandlers';
import MongoStore from 'connect-mongo';
import cookieParser from 'cookie-parser';
import { REFRESH_TOKEN_EXPIRY_MS } from './config/constants';

dotenv.config();
registerProcessHandlers();
const app = express();
const PORT = Number(process.env.PORT) || 8000;

app.set('trust proxy', 1);

// backend app.ts
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

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
    maxAge: REFRESH_TOKEN_EXPIRY_MS,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  },
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/health', (_req, res) => {
  const dbReady = mongoose.connection.readyState === 1;
  res.status(dbReady ? 200 : 503).json({
    status: dbReady ? 'ok' : 'degraded',
    db: mongoose.connection.readyState,
  });
});

// ensure request logger runs before routes
app.use(requestLogger);

// register routes
app.use('/auth', authRoutes);
app.use('/scores', scoresRoutes);
app.use('/profile', profileRoutes);

// 404 for unmatched routes (must come after route registration)
app.use(notFoundHandler);

// error handler last
app.use(errorHandler);

mongoose.connect(process.env.MONGO_URI!)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('[startup] MongoDB connection failed:', err);
    process.exit(1);
  });

mongoose.connection.on('error', (err) => {
  console.error('[mongoose] connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.warn('[mongoose] disconnected');
});


