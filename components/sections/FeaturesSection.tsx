'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Brain, Code, Database, Shield, Zap, Users, ArrowUpRight } from 'lucide-react';

const iconMap: Record<string, any> = { Brain, Code, Database, Shield, Zap, Users };

const defaultFeatures = [
  {
    icon: 'Brain',
    title: 'Artificial Intelligence',
    description: 'Advanced AI research including machine learning, deep learning, and neural networks for innovative solutions.',
    gradient: 'from-cyan-500/20 to-blue-600/20',
    iconColor: 'text-cyan-400',
  },
  {
    icon: 'Code',
    title: 'Software Engineering',
    description: 'Cutting-edge software development methodologies, frameworks, and best practices for scalable applications.',
    gradient: 'from-emerald-500/20 to-teal-600/20',
    iconColor: 'text-emerald-400',
  },
  {
    icon: 'Database',
    title: 'Data Science',
    description: 'Big data analytics, data mining, and statistical modeling to extract meaningful insights from complex datasets.',
    gradient: 'from-violet-500/20 to-purple-600/20',
    iconColor: 'text-violet-400',
  },
  {
    icon: 'Shield',
    title: 'Cybersecurity',
    description: 'Advanced security research, threat detection, and protection mechanisms for digital infrastructure.',
    gradient: 'from-rose-500/20 to-red-600/20',
    iconColor: 'text-rose-400',
  },
  {
    icon: 'Zap',
    title: 'IoT & Embedded Systems',
    description: 'Internet of Things solutions, embedded systems design, and smart device integration technologies.',
    gradient: 'from-amber-500/20 to-orange-600/20',
    iconColor: 'text-amber-400',
  },
  {
    icon: 'Users',
    title: 'Human-Computer Interaction',
    description: 'User experience research, interface design, and accessibility solutions for better human-technology interaction.',
    gradient: 'from-indigo-500/20 to-blue-600/20',
    iconColor: 'text-indigo-400',
  },
];

function FeatureCard({ feature, index }: { feature: typeof defaultFeatures[0], index: number }) {
  const Icon = iconMap[feature.icon] || Brain;
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true, margin: "-50px" }}
      onMouseMove={handleMouseMove}
      className={`group relative h-full rounded-2xl overflow-hidden bg-slate-900/50 border border-slate-800 p-8 hover:border-slate-700 transition-colors duration-500`}
    >
      {/* Dynamic Hover Spotlight */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: useTransform(
            [mouseX, mouseY],
            ([x, y]) => `radial-gradient(400px circle at ${x}px ${y}px, rgba(255,255,255,0.06), transparent 40%)`
          )
        }}
      />
      
      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`} />

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center justify-between mb-6">
          <div className={`w-14 h-14 rounded-xl bg-slate-800/80 border border-slate-700/50 flex items-center justify-center shadow-inner`}>
            <Icon className={`h-7 w-7 ${feature.iconColor}`} />
          </div>
          <ArrowUpRight className="text-slate-600 group-hover:text-white transition-colors duration-300 w-5 h-5" />
        </div>
        
        <h3 className="text-xl font-bold text-white mb-3 tracking-tight">
          {feature.title}
        </h3>
        
        <p className="text-slate-400 leading-relaxed font-light mt-auto">
          {feature.description}
        </p>

        {/* Animated Bottom Line */}
        <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent group-hover:w-full transition-all duration-700 ease-out" />
      </div>
    </motion.div>
  );
}

export function FeaturesSection() {
  const [features, setFeatures] = useState(defaultFeatures);

  useEffect(() => {
    fetch('/api/content?type=home')
      .then(res => res.json())
      .then(data => {
        if (data.data?.features && data.data.features.length > 0) {
          // Merge dynamic data with visual properties
          const merged = data.data.features.map((f: any, i: number) => ({
            ...f,
            gradient: defaultFeatures[i % defaultFeatures.length].gradient,
            iconColor: defaultFeatures[i % defaultFeatures.length].iconColor,
          }));
          setFeatures(merged);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section className="relative py-32 bg-[#020617] overflow-hidden">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.03) 1px, transparent 0)', backgroundSize: '32px 32px' }} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium tracking-wide mb-6 uppercase"
          >
            Core Capabilities
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight"
          >
            Research <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Focus Areas</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto font-light leading-relaxed"
          >
            We specialize in multiple cutting-edge domains, pushing the boundaries 
            of technology and innovation to create scalable solutions for tomorrow&apos;s challenges.
          </motion.p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
          {features.map((feature, index) => (
            <div 
              key={feature.title} 
              className={`
                ${index === 0 || index === 3 ? 'lg:col-span-2' : 'lg:col-span-1'}
                ${index === 0 ? 'md:col-span-2 lg:col-span-2' : ''}
              `}
            >
              <FeatureCard feature={feature} index={index} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}