import mongoose, { Schema, model, models, Document } from 'mongoose';

export interface IAbout extends Document {
  mission: string;
  vision: string;
  description: string;
  established: string;
  image?: string;
  achievements: string[];
  createdAt: Date;
  updatedAt: Date;
}

const AboutSchema = new Schema<IAbout>(
  {
    mission: { 
      type: String, 
      required: [true, 'Mission is required'] 
    },
    vision: { 
      type: String, 
      required: [true, 'Vision is required'] 
    },
    description: { 
      type: String, 
      required: [true, 'Description is required'] 
    },
    established: { 
      type: String, 
      required: [true, 'Established year is required'] 
    },
    image: { type: String },
    achievements: [{ type: String }],
  },
  { 
    timestamps: true 
  }
);

export default models.About || model<IAbout>('About', AboutSchema);
