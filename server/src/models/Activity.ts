import mongoose, { Schema, model } from 'mongoose';

export interface InterfaceActivity {
  _id: mongoose.Schema.Types.ObjectId;
  userId: mongoose.Schema.Types.ObjectId;
  name: string;
  category: string;
  carbonImpact: number;
  date: Date;
  notes?: string;
  createdAt?: Date;
}

const activitySchema = new Schema<InterfaceActivity>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  category: { type: String, enum: ['transport', 'energy', 'lifestyle', 'food', 'waste', 'other'], default: 'other' },
  carbonImpact: { type: Number, required: true },
  date: { type: Date, required: true },
  notes: { type: String },
  createdAt: { type: Date, default: () => new Date() },
});

export const Activity = model<InterfaceActivity>('Activity', activitySchema);
