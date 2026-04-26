// models/Score.ts
import mongoose, { Schema, Document } from 'mongoose';
import { GAME_MODES, GameMode } from 'shared-2048-logic/schemas/scoreSubmit';


export interface IScore extends Document {
  userId: mongoose.Types.ObjectId;
  score: number;
  mode: GameMode;
  gameHash: string;
  createdAt: Date;
}

const scoreSchema = new mongoose.Schema<IScore>({
  userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  score: { type: Number, required: true },
  mode: { type: String, required: true, enum: GAME_MODES, default: 'classic' },
  createdAt: { type: Date, default: Date.now },
  gameHash: { type: String, required: true, unique: true },
});

export default mongoose.model<IScore>('Score', scoreSchema);
