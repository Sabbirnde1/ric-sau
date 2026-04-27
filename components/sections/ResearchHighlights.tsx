'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, User, FileText, Activity } from 'lucide-react';
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
    <section className="relative py-32 bg-[#020617] overflow-hidden">
      {/* Abstract Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[20%] right-[10%] w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] mix-blend-screen" />
        <div className="absolute bottom-[10%] left-[5%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-5" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-sm font-medium tracking-wide mb-6 uppercase">
              <Activity className="w-4 h-4" />
              Latest Breakthroughs
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
              Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Research</span>
            </h2>
            <p className="text-lg text-slate-400 font-light leading-relaxed">
              Discover our most impactful research initiatives that are shaping 
              the future of technology and solving real-world challenges.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="hidden md:block"
          >
            <Link href="/research/projects">
              <Button variant="outline" className="group bg-white/[0.03] border-white/10 text-white hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300 backdrop-blur-sm">
                View All Projects
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {highlights.map((project, index) => (
            <motion.article
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true, margin: "-50px" }}
              className="group relative flex flex-col bg-slate-900/50 rounded-2xl overflow-hidden border border-white/[0.05] hover:border-white/[0.1] transition-all duration-500 hover:-translate-y-2"
            >
              {/* Card Glow */}
              <div className="absolute inset-0 bg-gradient-to-b from-blue-500/0 via-blue-500/0 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              <div className="relative h-56 w-full overflow-hidden bg-slate-800">
                {project.image && project.image.trim() !== '' ? (
                  <>
                    <div className="absolute inset-0 bg-slate-900/20 mix-blend-multiply z-10 group-hover:bg-transparent transition-colors duration-500" />
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="object-cover transform transition-transform duration-700 group-hover:scale-110"
                      unoptimized={project.image.startsWith('data:') || (project.image.startsWith('http') && !project.image.includes('images.pexels.com'))}
                    />
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                    <FileText className="w-12 h-12 text-slate-600" />
                  </div>
                )}
                
                {/* Badges */}
                <div className="absolute top-4 left-4 z-20 flex gap-2">
                  <span className="px-3 py-1 bg-black/50 backdrop-blur-md border border-white/10 text-cyan-300 text-xs font-medium rounded-full uppercase tracking-wider">
                    {project.category}
                  </span>
                </div>
                <div className="absolute top-4 right-4 z-20">
                  <span className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-medium rounded-full uppercase tracking-wider backdrop-blur-md">
                    {project.status}
                  </span>
                </div>
              </div>

              <div className="p-6 md:p-8 flex flex-col flex-grow z-10">
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors duration-300 line-clamp-2 tracking-tight">
                  {project.title}
                </h3>
                
                <p className="text-slate-400 mb-6 font-light leading-relaxed line-clamp-3">
                  {project.description}
                </p>

                <div className="mt-auto pt-6 border-t border-white/[0.05]">
                  <div className="flex items-center justify-between text-sm text-slate-500 mb-6">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-slate-400" />
                      <span className="font-medium text-slate-300">{project.lead}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-slate-400" />
                      <span>{new Date(project.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}</span>
                    </div>
                  </div>

                  <Link href={`/research/projects/${project.id}`} className="block">
                    <Button 
                      className="w-full bg-white/[0.03] hover:bg-white/[0.08] text-white border border-white/10 group-hover:border-cyan-500/30 transition-all duration-300"
                    >
                      Explore Project
                      <ArrowRight className="ml-2 h-4 w-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-12 md:hidden"
        >
          <Link href="/research/projects">
            <Button variant="outline" className="bg-white/[0.03] border-white/10 text-white">
              View All Projects
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}