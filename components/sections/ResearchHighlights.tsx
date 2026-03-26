'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, User, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

const defaultHighlights = [
  {
    id: 1,
    title: 'Advanced Neural Network Architectures for Medical Diagnosis',
    description: 'Developing state-of-the-art deep learning models that can accurately diagnose medical conditions from medical imaging data with 95% accuracy.',
    category: 'AI & Healthcare',
    date: '2024-01-15',
    lead: 'Dr. Sarah Johnson',
    image: 'https://images.pexels.com/photos/356040/pexels-photo-356040.jpeg?auto=compress&cs=tinysrgb&w=800',
    status: 'Active'
  },
  {
    id: 2,
    title: 'Quantum-Enhanced Cybersecurity Protocols',
    description: 'Pioneering quantum cryptography solutions to create unbreakable security systems for next-generation digital infrastructure.',
    category: 'Cybersecurity',
    date: '2024-02-08',
    lead: 'Prof. Michael Chen',
    image: 'https://images.pexels.com/photos/518543/pexels-photo-518543.jpeg?auto=compress&cs=tinysrgb&w=800',
    status: 'Active'
  },
  {
    id: 3,
    title: 'Sustainable IoT Systems for Smart Cities',
    description: 'Creating energy-efficient Internet of Things solutions that can monitor and optimize urban infrastructure while minimizing environmental impact.',
    category: 'IoT & Sustainability',
    date: '2024-01-22',
    lead: 'Dr. Emily Rodriguez',
    image: 'https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&w=800',
    status: 'Active'
  }
];

export function ResearchHighlights() {
  const [highlights, setHighlights] = useState(defaultHighlights);

  useEffect(() => {
    fetch('/api/content?type=projects')
      .then(res => res.json())
      .then(data => {
        if (data.data && data.data.length > 0) {
          setHighlights(data.data.slice(0, 3).map((p: any) => ({
            id: p.id,
            title: p.title,
            description: p.description,
            category: p.category,
            date: p.startDate || p.createdAt,
            lead: p.lead,
            image: p.image,
            status: p.status,
          })));
        }
      })
      .catch(() => {});
  }, []);
  return (
    <section className="py-24 bg-gray-50 animate-on-scroll">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Featured Research Projects
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover our most impactful research initiatives that are shaping 
            the future of technology and solving real-world challenges.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {highlights.map((project, index) => (
            <motion.article
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50">
                {project.image && project.image.trim() !== '' ? (
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  unoptimized={project.image.startsWith('data:') || (project.image.startsWith('http') && !project.image.includes('images.pexels.com'))}
                />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FileText className="w-12 h-12 text-blue-200" />
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-full">
                    {project.category}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 bg-green-500 text-white text-sm font-medium rounded-full">
                    {project.status}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {project.title}
                </h3>
                
                <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">
                  {project.description}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>{project.lead}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(project.date).toLocaleDateString()}</span>
                  </div>
                </div>

                <Link href={`/research/projects/${project.id}`}>
                  <Button 
                    variant="ghost" 
                    className="group-hover:bg-blue-50 group-hover:text-blue-600 w-full justify-between"
                  >
                    Learn More
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link href="/research/projects">
            <Button size="lg" variant="outline" className="group">
              View All Projects
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}