'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Tag, ArrowRight, Newspaper, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

export function NewsSection() {
  const [news, setNews] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/content?type=news')
      .then(res => res.json())
      .then(data => setNews((data.data || []).slice(0, 3)))
      .catch(() => {});
  }, []);

  return (
    <section className="relative py-32 bg-[#020617] overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/5 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(ellipse_at_center,rgba(255,255,255,0.1),transparent)] opacity-20" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium tracking-wide mb-6 uppercase"
          >
            <Globe className="w-4 h-4" />
            Global Impact
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight"
          >
            Latest <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">News & Updates</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-light leading-relaxed"
          >
            Stay updated with our latest research breakthroughs, partnerships, 
            and achievements in the world of technology and innovation.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.length === 0 ? (
            <p className="col-span-full text-center text-slate-500 font-light">No news articles yet.</p>
          ) : (
          news.map((article, index) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true, margin: "-50px" }}
              className="group relative flex flex-col bg-slate-900/50 rounded-2xl overflow-hidden border border-white/[0.05] hover:border-white/[0.1] transition-all duration-500"
            >
              <div className="relative h-56 overflow-hidden bg-slate-800">
                <div className="absolute inset-0 bg-slate-900/20 mix-blend-multiply z-10 group-hover:bg-transparent transition-colors duration-500" />
                {article.image && article.image.trim() !== '' ? (
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover transform transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                    <Newspaper className="w-12 h-12 text-slate-600" />
                  </div>
                )}
                
                <div className="absolute top-4 left-4 z-20">
                  <span className="px-3 py-1 bg-black/50 backdrop-blur-md border border-white/10 text-indigo-300 text-xs font-medium rounded-full uppercase tracking-wider">
                    {article.category}
                  </span>
                </div>
              </div>

              <div className="p-6 md:p-8 flex flex-col flex-grow z-10">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-4 tracking-wide uppercase">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    <span>{new Date(article.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                  </div>
                  <span className="flex items-center gap-1.5"><Tag className="w-3.5 h-3.5" />{article.readTime || '5 min read'}</span>
                </div>

                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-indigo-400 transition-colors duration-300 line-clamp-2 tracking-tight">
                  {article.title}
                </h3>
                
                <p className="text-slate-400 mb-6 font-light leading-relaxed line-clamp-3">
                  {article.excerpt}
                </p>

                <div className="mt-auto pt-4">
                  <Link href={`/news/${article.slug || article.id}`} className="inline-flex items-center text-indigo-400 hover:text-indigo-300 font-medium transition-colors text-sm uppercase tracking-wide">
                    Read Full Story
                    <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </motion.article>
          ))
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Link href="/news">
            <Button size="lg" variant="outline" className="group bg-white/[0.03] border-white/10 text-white hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300 backdrop-blur-sm">
              View All News
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}