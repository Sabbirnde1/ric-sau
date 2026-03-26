import prisma from '@/lib/prisma';
import PublicationsClient from './PublicationsClient';

export const revalidate = 300;

function parseJSON(value: string | null | undefined, fallback: any) {
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

async function getPublications() {
  try {
    const data = await prisma.publication.findMany({
      take: 50,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        authors: true,
        journal: true,
        year: true,
        category: true,
        type: true,
        citations: true,
        abstract: true,
        doi: true,
        keywords: true,
      },
    });
    return data.map((p) => ({
      ...p,
      authors: parseJSON(p.authors, []),
      keywords: parseJSON(p.keywords, []),
    }));
  } catch (error) {
    console.error('Error fetching publications:', error);
    return [];
  }
}

export default async function PublicationsPage() {
  const publications = await getPublications();
  return <PublicationsClient initialPublications={publications} />;
}