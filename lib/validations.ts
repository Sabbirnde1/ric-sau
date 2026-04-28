import { z } from 'zod';

export const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  status: z.string().optional().nullable(),
  lead: z.string().optional().nullable(),
  startDate: z.string().optional().nullable(),
  budget: z.number().or(z.string().transform(Number)).optional().nullable(),
  team: z.array(z.string()).optional().nullable(),
  technologies: z.array(z.string()).optional().nullable(),
  image: z.string().optional().nullable(),
});

export const newsSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().optional().nullable(),
  excerpt: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  readTime: z.string().optional().nullable(),
});

export const teamSchema = z.object({
  name: z.string().min(1, "Name is required"),
  position: z.string().optional().nullable(),
  department: z.string().optional().nullable(),
  email: z.string().email("Invalid email").or(z.literal('')).optional().nullable(),
  bio: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  specializations: z.array(z.string()).optional().nullable(),
});

export const eventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional().nullable(),
  date: z.string().optional().nullable(),
  time: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
});

export const innovatorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  title: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
  specialization: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  achievements: z.array(z.string()).optional().nullable(),
  ripd: z.string().optional().nullable(),
  pi: z.string().optional().nullable(),
  coPi: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
});

export const rlCommitteeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.string().optional().nullable(),
  department: z.string().optional().nullable(),
  email: z.string().email("Invalid email").or(z.literal('')).optional().nullable(),
  bio: z.string().optional().nullable(),
  imagePlacement: z.enum(['top', 'left', 'right']).optional().nullable(),
  image: z.string().optional().nullable(),
});

export const publicationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  authors: z.array(z.string()).optional().nullable(),
  journal: z.string().optional().nullable(),
  year: z.number().or(z.string().transform(Number)).optional().nullable(),
  category: z.string().optional().nullable(),
  type: z.string().optional().nullable(),
  citations: z.number().or(z.string().transform(Number)).optional().nullable(),
  abstract: z.string().optional().nullable(),
  doi: z.string().optional().nullable(),
  keywords: z.array(z.string()).optional().nullable(),
});

export const labSchema = z.object({
  name: z.string().min(1, "Name is required"),
  director: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  established: z.number().or(z.string().transform(Number)).optional().nullable(),
  members: z.number().or(z.string().transform(Number)).optional().nullable(),
  focus: z.array(z.string()).optional().nullable(),
  description: z.string().optional().nullable(),
  equipment: z.array(z.string()).optional().nullable(),
  image: z.string().optional().nullable(),
});

export const resourceSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
});

export const contactSchema = z.object({
  address: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  email: z.string().email("Invalid email").or(z.literal('')).optional().nullable(),
  officeHours: z.string().optional().nullable(),
});

// Utility to pick a schema based on type
export const getSchemaForType = (type: string) => {
  switch (type) {
    case 'project': return projectSchema;
    case 'news': return newsSchema;
    case 'team': return teamSchema;
    case 'event': return eventSchema;
    case 'innovator': return innovatorSchema;
    case 'rlCommittee': return rlCommitteeSchema;
    case 'publication': return publicationSchema;
    case 'lab': return labSchema;
    case 'resource': return resourceSchema;
    case 'contact': return contactSchema;
    default: return null;
  }
};
