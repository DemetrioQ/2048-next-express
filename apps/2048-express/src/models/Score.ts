// models/Score.ts
import mongoose, { Schema, Document } from 'mongoose';


export interface IScore extends Document {
  userId: mongoose.Types.ObjectId;
  score: number;
  gameHash: string;
  createdAt: Date;
}

const scoreSchema = new mongoose.Schema<IScore>({
  userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  score: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  gameHash: { type: String, required: true, unique: true },
});

export default mongoose.model<IScore>('Score', scoreSchema);
