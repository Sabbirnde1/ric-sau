import { MetadataRoute } from 'next'
import prisma from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ric-sau.kallanroy.xyz'

  // Static routes
  const staticRoutes = [
    '',
    '/about',
    '/research',
    '/research/projects',
    '/research/publications',
    '/research/labs',
    '/innovators',
    '/rl-committee',
    '/events',
    '/news',
    '/contact',
    '/resources',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  try {
    // Dynamic News Slugs
    const news = await prisma.news.findMany({ select: { slug: true, updatedAt: true } })
    const newsRoutes = news.map((article) => ({
      url: `${baseUrl}/news/${article.slug}`,
      lastModified: article.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))

    // Dynamic Event Slugs
    const events = await prisma.event.findMany({ select: { slug: true, updatedAt: true } })
    const eventRoutes = events.map((event) => ({
      url: `${baseUrl}/events/${event.slug}`,
      lastModified: event.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))

    // Dynamic Project IDs
    const projects = await prisma.project.findMany({ select: { id: true, updatedAt: true } })
    const projectRoutes = projects.map((project) => ({
      url: `${baseUrl}/research/projects/${project.id}`,
      lastModified: project.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))

    return [...staticRoutes, ...newsRoutes, ...eventRoutes, ...projectRoutes]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    return staticRoutes
  }
}
