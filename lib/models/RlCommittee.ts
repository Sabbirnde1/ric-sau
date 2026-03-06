import mongoose, { Schema, model, models, Document } from 'mongoose';

export interface IRlCommittee extends Document {
  name: string;
  role: string;
  department: string;
  email: string;
  bio: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

const RlCommitteeSchema = new Schema<IRlCommittee>(
  {
    name: { 
      type: String, 
      required: [true, 'Name is required'],
      trim: true 
    },
    role: { 
      type: String, 
      required: [true, 'Role is required'] 
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
  },
  { 
    timestamps: true 
  }
);

export default models.RlCommittee || model<IRlCommittee>('RlCommittee', RlCommitteeSchema);
