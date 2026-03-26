import prisma from '@/lib/prisma';
import LabsClient from './LabsClient';

export const revalidate = 300;

function parseJSON(value: string | null | undefined, fallback: any) {
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

async function getLabs() {
  try {
    const data = await prisma.lab.findMany({
      take: 24,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        director: true,
        location: true,
        established: true,
        members: true,
        focus: true,
        description: true,
        equipment: true,
        projects: true,
        publications: true,
        image: true,
      },
    });
    return data.map((lab) => ({
      ...lab,
      focus: parseJSON(lab.focus, []),
      equipment: parseJSON(lab.equipment, []),
    }));
  } catch (error) {
    console.error('Error fetching labs:', error);
    return [];
  }
}

export default async function LabsPage() {
  const labs = await getLabs();
  return <LabsClient initialLabs={labs} />;
}