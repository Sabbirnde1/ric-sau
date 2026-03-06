import mongoose, { Schema, model, models, Document } from 'mongoose';

export interface ISettings extends Document {
  general: {
    siteName: string;
    tagline: string;
    description: string;
    logo?: string;
    favicon?: string;
    footerText: string;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string;
    ogImage?: string;
  };
  social: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
    instagram?: string;
  };
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    darkMode: boolean;
  };
  features: {
    showNewsletterSignup: boolean;
    showVideoModal: boolean;
    enableComments: boolean;
    enableSearching: boolean;
    maintenanceMode: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const SettingsSchema = new Schema<ISettings>(
  {
    general: {
      siteName: { type: String, required: true },
      tagline: { type: String, required: true },
      description: { type: String, required: true },
      logo: { type: String },
      favicon: { type: String },
      footerText: { type: String, required: true },
    },
    seo: {
      metaTitle: { type: String, required: true },
      metaDescription: { type: String, required: true },
      metaKeywords: { type: String, required: true },
      ogImage: { type: String },
    },
    social: {
      facebook: { type: String },
      twitter: { type: String },
      linkedin: { type: String },
      youtube: { type: String },
      instagram: { type: String },
    },
    theme: {
      primaryColor: { type: String, default: '#3B82F6' },
      secondaryColor: { type: String, default: '#10B981' },
      accentColor: { type: String, default: '#F59E0B' },
      darkMode: { type: Boolean, default: false },
    },
    features: {
      showNewsletterSignup: { type: Boolean, default: true },
      showVideoModal: { type: Boolean, default: true },
      enableComments: { type: Boolean, default: false },
      enableSearching: { type: Boolean, default: true },
      maintenanceMode: { type: Boolean, default: false },
    },
  },
  { 
    timestamps: true 
  }
);

export default models.Settings || model<ISettings>('Settings', SettingsSchema);
