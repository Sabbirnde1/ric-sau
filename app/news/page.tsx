import Link from 'next/link';
import { Calendar, User, ArrowRight, Newspaper } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MotionWrapper from '@/components/MotionWrapper';
import Image from 'next/image';
import prisma from '@/lib/prisma';

export const revalidate = 300;

async function getNewsArticles() {
  try {
    return await prisma.news.findMany({
      take: 24,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        excerpt: true,
        content: true,
        date: true,
        author: true,
        image: true,
        slug: true,
      },
    });
  } catch (error) {
    console.error('Error loading news page data:', error);
    return [];
  }
}

export default async function NewsPage() {
  const newsArticles = await getNewsArticles();

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Hero */}
      <section className="py-24 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white text-center">
        <MotionWrapper>
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">Latest News & Updates</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Stay updated with our latest research breakthroughs, events, and achievements.
          </p>
        </MotionWrapper>
      </section>

      {/* News List */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {newsArticles.length === 0 ? (
            <p className="text-center text-gray-500">No news articles yet.</p>
          ) : (
            <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
              {newsArticles.map((article, index) => (
                <MotionWrapper key={article.id} delay={index * 0.2}>
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col">
                    <div className="w-full h-52 relative overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50">
                      {article.image && article.image.trim() !== '' ? (
                        <Image
                          src={article.image}
                          alt={article.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover"
                          unoptimized={article.image.startsWith('data:') || (article.image.startsWith('http') && !article.image.includes('images.pexels.com'))}
                        />
                      ) : null}
                      <div className={`w-full h-full flex items-center justify-center ${article.image && article.image.trim() !== '' ? 'hidden' : ''}`}>
                        <Newspaper className="w-12 h-12 text-blue-200" />
                      </div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">{article.title}</h3>
                      <div className="flex items-center text-sm text-gray-500 mb-4 space-x-4">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{article.date}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span>{article.author}</span>
                        </div>
                      </div>
                      <p className="text-gray-600 flex-1">{article.excerpt || article.content}</p>
                      <div className="pt-6">
                        <Link href={`/news/${article.slug}`}>
                          <Button className="w-full flex items-center justify-center">
                            Read More <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </MotionWrapper>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
