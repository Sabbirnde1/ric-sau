'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ResourcesPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  const resources = [
    { title: 'Lab Space', description: 'State-of-the-art laboratory space for research and development projects.' },
    { title: 'Machinery', description: 'Access to modern machinery and equipment for experimentation and prototyping.' },
    { title: 'Laboratory', description: 'Fully equipped laboratories to support scientific research and testing.' },
    { title: 'Access & Allocation', description: 'Proper allocation system to ensure fair access to all RIC–SAU resources.' },
  ];

  useEffect(() => {
    if (typeof window !== 'undefined') {
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
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }
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
              className="resource-card bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-transform transform hover:scale-105"
            >
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
