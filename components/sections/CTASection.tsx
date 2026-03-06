'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function CTASection() {
  const [cta, setCta] = useState<any>({});

  useEffect(() => {
    fetch('/api/content?type=home')
      .then(res => res.json())
      .then(data => {
        if (data.data?.cta) setCta(data.data.cta);
      })
      .catch(() => {});
  }, []);

  return (
    <section className="py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
            {cta.title || 'Ready to Collaborate on'}
            <span className="block text-yellow-300">{cta.highlight || 'Groundbreaking Research?'}</span>
          </h2>
          
          <p className="text-lg lg:text-xl text-blue-100 mb-12 max-w-3xl mx-auto">
            {cta.description || 'Join us in pushing the boundaries of technology and innovation. Whether you\'re a researcher, industry partner, or student, we welcome collaboration opportunities.'}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6"
        >
          <Link href="/contact">
            <Button 
              size="lg" 
              className="group bg-white text-blue-600 hover:bg-blue-400 hover:text-white  px-8 py-4 text-lg font-semibold"
            >
              <Mail className="mr-2 h-5 w-5" />
              Start Collaboration
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>

          <Link href="/research">
            <Button 
              variant="outline" 
              size="lg" 
              className="group border-blue-500 text-blue-500 hover:bg-blue-400 hover:text-white px-8 py-4 text-lg font-semibold"
            >
              View Research Areas
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <div className="text-3xl font-bold text-yellow-300 mb-2">24/7</div>
            <div className="text-blue-100">Research Support</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <div className="text-3xl font-bold text-yellow-300 mb-2">Global</div>
            <div className="text-blue-100">Collaboration Network</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <div className="text-3xl font-bold text-yellow-300 mb-2">100%</div>
            <div className="text-blue-100">Commitment to Innovation</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}