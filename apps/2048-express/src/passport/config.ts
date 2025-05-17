import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy, Profile as GitHubProfile } from 'passport-github2';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import dotenv from 'dotenv';

dotenv.config();
passport.use(
  new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });
        if (!user) return done(null, false, { message: 'Incorrect email.' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return done(null, false, { message: 'Incorrect password.' });

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: '/auth/google/callback',
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) return done(new Error("No email from Google"));

        let user = await User.findOne({ email });

        if (user) {
          if (!user.googleId) {
            user.googleId = profile.id;
            await user.save();
          }
        }
        else {
          user = await User.create({
            email,
            googleId: profile.id,
          });
        }

        done(null, user);
      } catch (err) {
        done(err);
      }
    }
  )
);



// GitHub Strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      callbackURL: '/auth/github/callback',
      scope: ['user:email'],
    },
    async (_accessToken: string | undefined, _refreshToken: string | undefined, profile: GitHubProfile, done: (err: any, user?: any) => void) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) return done(new Error("No email from Github"));

        let user = await User.findOne({ email });

         if (user) {
          if (!user.githubId) {
            user.githubId = profile.id;
            await user.save();
          }
        }
        else {
          user = await User.create({
            email,
            githubId: profile.id,
          });
        }

        done(null, user);
      } catch (err) {
        done(err);
      }
    }
  )
);




passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});


export default passport;
