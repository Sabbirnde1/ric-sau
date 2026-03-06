import mongoose, { Schema, model, models, Document } from 'mongoose';

export interface IEvent extends Document {
  slug: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    slug: { 
      type: String, 
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true 
    },
    title: { 
      type: String, 
      required: [true, 'Event title is required'],
      trim: true 
    },
    description: { 
      type: String, 
      required: [true, 'Event description is required'] 
    },
    date: { 
      type: String, 
      required: [true, 'Date is required'] 
    },
    time: { 
      type: String, 
      required: [true, 'Time is required'] 
    },
    location: { 
      type: String, 
      required: [true, 'Location is required'] 
    },
    category: { 
      type: String, 
      required: [true, 'Category is required'] 
    },
    image: { type: String },
  },
  { 
    timestamps: true 
  }
);

// Auto-generate slug from title if not provided
EventSchema.pre('save', function() {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
});

export default models.Event || model<IEvent>('Event', EventSchema);
