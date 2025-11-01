import mongoose, { Schema, Document } from 'mongoose';

export interface ICalendar extends Document {
  id: number;
  userId: string;
  name: string;
  selected: boolean;
  removable: boolean;
  colorOption: string;
  type: 'default' | 'holiday';
  description?: string;
  timeZone?: string;
  region?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CalendarSchema = new Schema<ICalendar>({
  id: { type: Number, required: true },
  userId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  selected: { type: Boolean, default: true },
  removable: { type: Boolean, default: true },
  colorOption: { type: String, required: true },
  type: { type: String, enum: ['default', 'holiday'], required: true },
  description: { type: String },
  timeZone: { type: String },
  region: { type: String },
}, {
  timestamps: true
});

CalendarSchema.index({ userId: 1, id: 1 }, { unique: true });

export default mongoose.model<ICalendar>('Calendar', CalendarSchema);

