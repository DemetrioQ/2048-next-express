// models/RefreshToken.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IRefreshToken extends Document {
  userId: mongoose.Types.ObjectId;
  token: string;
  expiresAt: Date;
  createdAt: Date;
  userAgent: string;
  ipAddress: string;
}

const RefreshTokenSchema = new Schema<IRefreshToken>({
  userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  token: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  userAgent: { type: String },
  ipAddress: { type: String },
});

export default mongoose.model<IRefreshToken>('RefreshToken', RefreshTokenSchema);
