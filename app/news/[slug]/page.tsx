import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, User, ArrowLeft, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import prisma from '@/lib/prisma';
import { shouldUseUnoptimized } from '@/lib/utils';

export const revalidate = 300;

async function getArticle(slug: string) {
  try {
    return await prisma.news.findUnique({
      where: { slug },
      select: {
        id: true,
        title: true,
        excerpt: true,
        content: true,
        date: true,
        author: true,
        image: true,
        slug: true,
        category: true,
        readTime: true,
      },
    });
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const article = await getArticle(params.slug);
  if (!article) return { title: 'Article Not Found' };
  return {
    title: `${article.title} | RIC-SAU News`,
    description: article.excerpt || article.content?.slice(0, 160),
    openGraph: {
      title: article.title,
      description: article.excerpt || '',
      images: article.image ? [article.image] : [],
    },
  };
}

export async function generateStaticParams() {
  try {
    const articles = await prisma.news.findMany({ select: { slug: true } });
    return articles.map((a) => ({ slug: a.slug }));
  } catch {
    return [];
  }
}

export default async function NewsDetailsPage({ params }: { params: { slug: string } }) {
  const article = await getArticle(params.slug);

  if (!article) return notFound();

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Hero */}
      <section className="py-16 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          {article.category && (
            <span className="inline-flex items-center gap-1 px-3 py-1 mb-4 bg-white/20 rounded-full text-sm font-medium">
              <Tag className="w-3 h-3" />{article.category}
            </span>
          )}
          <h1 className="text-3xl lg:text-5xl font-bold mb-4 leading-tight">{article.title}</h1>
          <div className="flex items-center justify-center gap-4 text-blue-100 text-sm">
            <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{article.date}</span>
            <span className="flex items-center gap-1"><User className="w-4 h-4" />{article.author}</span>
            {article.readTime && <span>{article.readTime}</span>}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 max-w-4xl mx-auto px-6">
        {article.image && article.image.trim() !== '' && (
          <div className="relative w-full h-80 mb-8 rounded-2xl overflow-hidden shadow-lg">
            <Image
              src={article.image}
              alt={article.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              priority
              unoptimized={shouldUseUnoptimized(article.image)}
            />
          </div>
        )}

        {article.excerpt && (
          <p className="text-xl text-gray-600 leading-relaxed mb-6 font-medium border-l-4 border-blue-500 pl-4">
            {article.excerpt}
          </p>
        )}

        <div
          className="prose prose-lg prose-blue max-w-none text-gray-700"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        <div className="mt-12 pt-8 border-t">
          <Link href="/news">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Back to News
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
