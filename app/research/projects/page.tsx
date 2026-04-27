import prisma from '@/lib/prisma';
import ProjectsClient from './ProjectsClient';
import { Metadata } from 'next';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Research Projects | RIC-SAU',
  description: 'Discover the ongoing and completed research projects at Sher-e-Bangla Agricultural University.',
  openGraph: {
    title: 'Research Projects | RIC-SAU',
    description: 'Discover the ongoing and completed research projects at Sher-e-Bangla Agricultural University.',
  }
};

function parseJSON(value: string | null | undefined, fallback: any) {
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

async function getProjects() {
  try {
    const data = await prisma.project.findMany({
      take: 36,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        status: true,
        lead: true,
        startDate: true,
        budget: true,
        team: true,
        technologies: true,
        publications: true,
        image: true,
      },
    });
    return data.map((project) => ({
      ...project,
      team: parseJSON(project.team, []),
      technologies: parseJSON(project.technologies, []),
    }));
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

export default async function ProjectsPage() {
  const projects = await getProjects();
  return <ProjectsClient initialProjects={projects} />;
}