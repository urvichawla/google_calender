import mongoose, { Schema, Document } from 'mongoose';

export interface IDateTime {
  allDay: boolean;
  once: boolean;
  date: string;
  time: {
    start: number;
    end: number;
  };
}

export interface ISchedule extends Document {
  id: number;
  userId: string;
  title: string;
  description: string;
  calendarId: number;
  calendarType: 'default' | 'holiday';
  dateTime: IDateTime;
  type: 'task' | 'event';
  isExternal?: boolean;
  location?: string;
  colorOption?: string;
  completed?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ScheduleSchema = new Schema<ISchedule>({
  id: { type: Number, required: true },
  userId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  calendarId: { type: Number, required: true },
  calendarType: { type: String, enum: ['default', 'holiday'], required: true },
  dateTime: {
    allDay: { type: Boolean, required: true },
    once: { type: Boolean, required: true },
    date: { type: String, required: true },
    time: {
      start: { type: Number, required: true },
      end: { type: Number, required: true },
    },
  },
  type: { type: String, enum: ['task', 'event'], required: true },
  isExternal: { type: Boolean, default: false },
  location: { type: String },
  colorOption: { type: String },
  completed: { type: Boolean },
}, {
  timestamps: true
});

ScheduleSchema.index({ userId: 1, id: 1 }, { unique: true });

export default mongoose.model<ISchedule>('Schedule', ScheduleSchema);

