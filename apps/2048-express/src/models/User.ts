import mongoose, { Document, Schema } from 'mongoose';
import { PublicUser } from 'shared-2048-logic/types/User';

export interface IUser extends Document {
  email: string;
  password?: string;
  oauth?: {
    googleId?: string;
    githubId?: string;
  };
  profileImage?: string;
  toPublic: () => PublicUser;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    oauth: {
      googleId: { type: String, required: false },
      githubId: { type: String, required: false },
    },
    profileImage: { type: String, required: false },
  },
  { timestamps: true }
);


UserSchema.methods.toPublic = function (): PublicUser {
  const providers: ('local' | 'google' | 'github')[] = [];

  if (this.password) providers.push('local');
  if (this.oauth?.googleId) providers.push('google');
  if (this.oauth?.githubId) providers.push('github');

  return {
    email: this.email,
    providers,
    avatarUrl: this.profileImage,
    createdAt: this.createdAt,
  };
};


export default mongoose.model<IUser>('User', UserSchema);
