import mongoose, { Document, Schema, Model } from 'mongoose';

interface IRequestLog extends Document {
  userId?: mongoose.Types.ObjectId;
  ip?: string;
  endpoint: string;
  method: string;
  requestBody?: any;
  responseStatus: number;
  responseBody?: any;
  timestamp: Date;
  durationMs?: number;
  userAgent?: string;
}

const RequestLogSchema = new Schema<IRequestLog>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: false },
  ip: { type: String, required: false },
  endpoint: { type: String, required: true },
  method: { type: String, required: true },
  requestBody: { type: Schema.Types.Mixed, required: false },
  responseStatus: { type: Number, required: true },
  responseBody: { type: Schema.Types.Mixed, required: false },
  timestamp: { type: Date, default: Date.now },
  durationMs: { type: Number, required: false },
  userAgent: { type: String, required: false },
});

// Auto-delete logs older than 30 days
RequestLogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 30 });

const RequestLog: Model<IRequestLog> = mongoose.model<IRequestLog>('RequestLog', RequestLogSchema);

export default RequestLog;
