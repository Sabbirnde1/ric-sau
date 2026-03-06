import mongoose, { Schema, model, models, Document } from 'mongoose';

export interface IProject extends Document {
  title: string;
  description: string;
  category: string;
  status: string;
  lead: string;
  startDate: string;
  budget: number;
  team?: string[];
  technologies?: string[];
  publications?: number;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    title: { 
      type: String, 
      required: [true, 'Project title is required'],
      trim: true 
    },
    description: { 
      type: String, 
      required: [true, 'Project description is required'] 
    },
    category: { 
      type: String, 
      required: [true, 'Category is required'] 
    },
    status: { 
      type: String, 
      required: [true, 'Status is required'] 
    },
    lead: { 
      type: String, 
      required: [true, 'Project lead is required'] 
    },
    startDate: { 
      type: String, 
      required: [true, 'Start date is required'] 
    },
    budget: { 
      type: Number, 
      required: [true, 'Budget is required'],
      min: 0 
    },
    team: [{ type: String }],
    technologies: [{ type: String }],
    publications: { type: Number, default: 0 },
    image: { type: String },
  },
  { 
    timestamps: true 
  }
);

export default models.Project || model<IProject>('Project', ProjectSchema);
