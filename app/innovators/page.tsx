import prisma from '@/lib/prisma';
import InnovatorsClient from './InnovatorsClient';
import { Metadata } from 'next';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Innovators & Innovations | RIC-SAU',
  description: 'Explore visionary ideas, researchers, and innovations shaping agriculture, technology, and sustainability at Sher-e-Bangla Agricultural University.',
  openGraph: {
    title: 'Innovators & Innovations | RIC-SAU',
    description: 'Explore visionary ideas, researchers, and innovations shaping agriculture, technology, and sustainability at Sher-e-Bangla Agricultural University.',
  }
};

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
