import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  email: string;
  name?: string;
  photoURL?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  _id: { type: String, required: true }, // Using Firebase UID as _id
  email: { type: String, required: true, unique: true },
  name: { type: String },
  photoURL: { type: String },
}, {
  timestamps: true,
  _id: false // Since we're using custom _id
});

export default mongoose.model<IUser>('User', UserSchema);

