import mongoose, { Schema, model, models, Document } from 'mongoose';

export interface IInnovator extends Document {
  name: string;
  title: string;
  bio: string;
  specialization: string;
  image?: string;
  achievements: string;
  createdAt: Date;
  updatedAt: Date;
}

const InnovatorSchema = new Schema<IInnovator>(
  {
    name: { 
      type: String, 
      required: [true, 'Name is required'],
      trim: true 
    },
    title: { 
      type: String, 
      required: [true, 'Title is required'] 
    },
    bio: { 
      type: String, 
      required: [true, 'Bio is required'] 
    },
    specialization: { 
      type: String, 
      required: [true, 'Specialization is required'] 
    },
    image: { type: String },
    achievements: { 
      type: String,
      default: '' 
    },
  },
  { 
    timestamps: true 
  }
);

export default models.Innovator || model<IInnovator>('Innovator', InnovatorSchema);
