import mongoose, { Schema, model, models, Document } from 'mongoose';

export interface ITeam extends Document {
  name: string;
  position: string;
  department: string;
  email: string;
  bio: string;
  image?: string;
  specializations?: string[];
  publications?: number;
  projects?: number[];
  createdAt: Date;
  updatedAt: Date;
}

const TeamSchema = new Schema<ITeam>(
  {
    name: { 
      type: String, 
      required: [true, 'Name is required'],
      trim: true 
    },
    position: { 
      type: String, 
      required: [true, 'Position is required'] 
    },
    department: { 
      type: String, 
      required: [true, 'Department is required'] 
    },
    email: { 
      type: String, 
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true 
    },
    bio: { 
      type: String, 
      required: [true, 'Bio is required'] 
    },
    image: { type: String },
    specializations: [{ type: String }],
    publications: { type: Number, default: 0 },
    projects: [{ type: Number }],
  },
  { 
    timestamps: true 
  }
);

export default models.Team || model<ITeam>('Team', TeamSchema);
