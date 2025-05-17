import mongoose, { Document, Schema } from 'mongoose';
import { PublicUser } from 'shared-2048-logic/types/User'

export interface IUser extends Document {
  email: string;
  password: string;
  googleId: string;
  githubId: string;
  toPublic: () => PublicUser;
}


const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    googleId: { type: String, required: false },
    githubId: { type: String, required: false },
  },
  { timestamps: true });

UserSchema.methods.toPublic = function (): PublicUser {
  return {
    // id: this._id.toString(),
    email: this.email,
    createdAt: this.createdAt,
  };
};

export default mongoose.model<IUser>('User', UserSchema);