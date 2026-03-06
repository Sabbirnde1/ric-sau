import mongoose, { Schema, model, models, Document } from 'mongoose';

export interface IContact extends Document {
  address: string;
  phone: string;
  email: string;
  officeHours: string;
  createdAt: Date;
  updatedAt: Date;
}

const ContactSchema = new Schema<IContact>(
  {
    address: { 
      type: String, 
      required: [true, 'Address is required'] 
    },
    phone: { 
      type: String, 
      required: [true, 'Phone is required'] 
    },
    email: { 
      type: String, 
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true 
    },
    officeHours: { 
      type: String, 
      required: [true, 'Office hours are required'] 
    },
  },
  { 
    timestamps: true 
  }
);

export default models.Contact || model<IContact>('Contact', ContactSchema);
