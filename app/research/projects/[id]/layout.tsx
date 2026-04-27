import { Metadata } from 'next';
import prisma from '@/lib/prisma';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    const project = await prisma.project.findUnique({
      where: { id: parseInt(params.id) }
    });

    if (!project) {
      return {
        title: 'Project Not Found | RIC-SAU',
        description: 'The requested research project could not be found.'
      };
    }

    const title = `${project.title} | RIC-SAU Projects`;
    const description = project.description?.substring(0, 160) || 'Research project details at Sher-e-Bangla Agricultural University.';

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: project.image && project.image !== '' ? [{ url: project.image }] : [],
      }
    };
  } catch (error) {
    return {
      title: 'Research Project | RIC-SAU',
      description: 'Research project details at Sher-e-Bangla Agricultural University.'
    };
  }
}

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
