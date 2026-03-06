import mongoose, { Schema, model, models, Document } from 'mongoose';

export interface INews extends Document {
  title: string;
  content: string;
  excerpt: string;
  date: string;
  category: string;
  author: string;
  image?: string;
  readTime: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

const NewsSchema = new Schema<INews>(
  {
    title: { 
      type: String, 
      required: [true, 'News title is required'],
      trim: true 
    },
    content: { 
      type: String, 
      required: [true, 'News content is required'] 
    },
    excerpt: { 
      type: String, 
      required: [true, 'News excerpt is required'] 
    },
    date: { 
      type: String, 
      required: [true, 'Date is required'] 
    },
    category: { 
      type: String, 
      required: [true, 'Category is required'] 
    },
    author: { 
      type: String, 
      required: [true, 'Author is required'] 
    },
    image: { type: String },
    readTime: { 
      type: String, 
      default: '3 min read' 
    },
    slug: { 
      type: String, 
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true 
    },
  },
  { 
    timestamps: true 
  }
);

// Auto-generate slug from title if not provided
NewsSchema.pre('save', function() {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
});

export default models.News || model<INews>('News', NewsSchema);
