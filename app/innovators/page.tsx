import prisma from '@/lib/prisma';
import InnovatorsClient from './InnovatorsClient';

export const revalidate = 300;

async function getInnovations() {
  try {
    return await prisma.innovator.findMany({
      take: 60,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        title: true,
        specialization: true,
        category: true,
        ripd: true,
        pi: true,
        coPi: true,
      },
    });
  } catch (error) {
    console.error('Error fetching innovators:', error);
    return [];
  }
}

export default async function InnovatorsPage() {
  const innovations = await getInnovations();
  return <InnovatorsClient initialInnovations={innovations} />;
}
