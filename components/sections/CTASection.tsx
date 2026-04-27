'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Mail, Sparkles, Network } from 'lucide-react';
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
    <section className="relative py-32 bg-[#020617] overflow-hidden border-t border-white/[0.05]">
      {/* Background Orbs & Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-sm font-medium tracking-wide mb-8 uppercase backdrop-blur-sm">
            <Sparkles className="w-4 h-4" />
            Shape the Future
          </div>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-8 tracking-tight">
            {cta.title || 'Ready to Collaborate on '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              {cta.highlight || 'Groundbreaking Research?'}
            </span>
          </h2>
          
          <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto font-light leading-relaxed">
            {cta.description || 'Join us in pushing the boundaries of technology and innovation. Whether you\'re a researcher, industry partner, or student, we welcome collaboration opportunities.'}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
        >
          <Link href="/contact">
            <Button 
              size="lg" 
              className="group bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500 border-0 shadow-[0_0_40px_-10px_rgba(6,182,212,0.5)] hover:shadow-[0_0_60px_-10px_rgba(6,182,212,0.6)] px-8 py-6 text-lg font-medium transition-all duration-300 w-full sm:w-auto"
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
              className="group bg-white/[0.03] border-white/10 text-white hover:bg-white/[0.08] hover:border-white/20 backdrop-blur-sm px-8 py-6 text-lg font-medium transition-all duration-300 w-full sm:w-auto"
            >
              <Network className="mr-2 h-5 w-5" />
              View Research Areas
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center"
        >
          <div className="bg-slate-900/50 backdrop-blur-xl border border-white/[0.05] rounded-2xl p-8 hover:border-white/[0.1] transition-colors duration-300">
            <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-2">24/7</div>
            <div className="text-slate-400 text-sm tracking-wide uppercase font-medium">Research Support</div>
          </div>
          <div className="bg-slate-900/50 backdrop-blur-xl border border-white/[0.05] rounded-2xl p-8 hover:border-white/[0.1] transition-colors duration-300">
            <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500 mb-2">Global</div>
            <div className="text-slate-400 text-sm tracking-wide uppercase font-medium">Collaboration Network</div>
          </div>
          <div className="bg-slate-900/50 backdrop-blur-xl border border-white/[0.05] rounded-2xl p-8 hover:border-white/[0.1] transition-colors duration-300">
            <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500 mb-2">100%</div>
            <div className="text-slate-400 text-sm tracking-wide uppercase font-medium">Commitment to Innovation</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}