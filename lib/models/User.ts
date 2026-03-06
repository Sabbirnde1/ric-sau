import mongoose, { Schema, model, models, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'editor';
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    username: { 
      type: String, 
      required: [true, 'Username is required'], 
      unique: true,
      trim: true 
    },
    email: { 
      type: String, 
      required: [true, 'Email is required'], 
      unique: true,
      lowercase: true,
      trim: true 
    },
    password: { 
      type: String, 
      required: [true, 'Password is required'] 
    },
    role: { 
      type: String, 
      enum: ['admin', 'editor'], 
      default: 'admin' 
    },
  },
  { 
    timestamps: true 
  }
);

export default models.User || model<IUser>('User', UserSchema);
