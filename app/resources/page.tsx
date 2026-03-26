'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const defaultResources = [
  { title: 'Lab Space', description: 'State-of-the-art laboratory space for research and development projects.' },
  { title: 'Machinery', description: 'Access to modern machinery and equipment for experimentation and prototyping.' },
  { title: 'Laboratory', description: 'Fully equipped laboratories to support scientific research and testing.' },
  { title: 'Access & Allocation', description: 'Proper allocation system to ensure fair access to all RIC–SAU resources.' },
];

export default function ResourcesPage() {
  const [resources, setResources] = useState<any[]>(defaultResources);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/content?type=resources')
      .then(res => res.json())
      .then(res => {
        if (res.data && res.data.length > 0) {
          setResources(res.data);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let disposed = false;

    const runAnimations = async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/dist/ScrollTrigger')
      ]);

      if (disposed) return;

      gsap.registerPlugin(ScrollTrigger);

      gsap.utils.toArray('.resource-card').forEach((element: any, index) => {
        gsap.fromTo(
          element,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            delay: index * 0.2,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: element,
              start: 'top 90%',
              toggleActions: 'play none none none',
            },
          }
        );
      });
    };

    void runAnimations();

    return () => {
      disposed = true;
    };
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-background pt-20">
      {/* Hero Section */}
      <section className="relative h-[40vh] flex items-center justify-center text-white overflow-hidden bg-gradient-to-r from-purple-600 to-blue-600">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 text-center px-6"
        >
          <h1 className="text-4xl lg:text-5xl font-bold mb-3">Resources at RIC–SAU</h1>
          <p className="text-lg lg:text-xl max-w-2xl mx-auto text-green-100">
            Explore the key resources available for innovators and researchers at the Research & Innovation Center.
          </p>
        </motion.div>
      </section>

      {/* Resources Cards */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {resources.map((item, i) => (
            <motion.div
              key={i}
              className="resource-card bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow duration-300"
            >
              <div className="w-full h-40 relative overflow-hidden rounded-lg mb-4 bg-gradient-to-br from-purple-50 to-blue-50">
                {item.image && item.image.trim() !== '' ? (
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover"
                    unoptimized={item.image.startsWith('data:') || (item.image.startsWith('http') && !item.image.includes('images.pexels.com'))}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-purple-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" /></svg>
                  </div>
                )}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
              <p className="text-gray-700">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">Make Use of RIC–SAU Resources</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto text-green-100">
            Access lab spaces, machinery, and dedicated support to bring your innovative ideas to life.
          </p>
        </motion.div>
      </section>
    </div>
  );
}
