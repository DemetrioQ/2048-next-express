import mongoose, { Document, Schema } from 'mongoose';
import { PublicUser } from 'shared-2048-logic/types/User';
import dotenv from 'dotenv';



export interface IUser extends Document {
  email: string;
  username?: string;
  password?: string;
  oauth: {
    googleId?: string;
    githubId?: string;
  };
  avatar: {
    imageUrl?: string;
    imageKey?: string;
  };


  verified: boolean;
  verificationToken?: string | null;
  verificationExpires?: Date | null;
  lastVerificationEmailSent?: Date | null;

  toPublic: () => PublicUser;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    username: { type: String, required: false, unique: true, sparse: true },
    password: { type: String, required: false },

    oauth: {
      googleId: { type: String, required: false },
      githubId: { type: String, required: false },
    },

    avatar: {
      imageUrl: { type: String, required: false },
      imageKey: { type: String, required: false },
    },

    verified: { type: Boolean, default: false },
    verificationToken: { type: String, required: false },
    verificationExpires: { type: Date, required: false },
  },
  { timestamps: true }
);

UserSchema.methods.toPublic = function (): PublicUser {
  const providers: ('local' | 'google' | 'github')[] = [];

  if (this.password) providers.push('local');
  if (this.oauth?.googleId) providers.push('google');
  if (this.oauth?.githubId) providers.push('github');

  return {
    id: this._id,
    email: this.email,
    username: this.username,
    isVerified: this.verified,
    providers,
    avatar: this.avatar,
    createdAt: this.createdAt,
  };
};

export default mongoose.model<IUser>('User', UserSchema);
