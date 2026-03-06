import mongoose, { Schema, model, models, Document } from 'mongoose';

export interface IHome extends Document {
  hero: {
    title: string;
    subtitle: string;
    description: string;
    videoUrl?: string;
    backgroundImage?: string;
  };
  stats: Array<{
    label: string;
    value: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const HomeSchema = new Schema<IHome>(
  {
    hero: {
      title: { 
        type: String, 
        required: [true, 'Hero title is required'] 
      },
      subtitle: { 
        type: String, 
        required: [true, 'Hero subtitle is required'] 
      },
      description: { 
        type: String, 
        required: [true, 'Hero description is required'] 
      },
      videoUrl: { type: String },
      backgroundImage: { type: String },
    },
    stats: [
      {
        label: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
  },
  { 
    timestamps: true 
  }
);

export default models.Home || model<IHome>('Home', HomeSchema);
