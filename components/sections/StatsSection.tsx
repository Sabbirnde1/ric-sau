'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const defaultStats = [
  { label: 'Active Research Projects', value: 45, suffix: '+', color: 'from-cyan-400 to-blue-500' },
  { label: 'Published Papers', value: 180, suffix: '+', color: 'from-purple-400 to-indigo-500' },
  { label: 'Research Team Members', value: 28, suffix: '+', color: 'from-emerald-400 to-teal-500' },
  { label: 'Industry Partners', value: 12, suffix: '+', color: 'from-amber-400 to-orange-500' },
  { label: 'Patents Filed', value: 8, suffix: '', color: 'from-rose-400 to-red-500' },
  { label: 'Awards Won', value: 15, suffix: '+', color: 'from-blue-400 to-cyan-500' },
];

function AnimatedCounter({ value, suffix = '', duration = 2000, gradient }: { value: number; suffix?: string; duration?: number, gradient: string }) {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView({ threshold: 0.3, triggerOnce: true });

  useEffect(() => {
    if (!inView) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Easing function for smoother counter
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * value));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [inView, value, duration]);

  return (
    <span ref={ref} className={`text-5xl md:text-6xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br ${gradient}`}>
      {count}{suffix}
    </span>
  );
}

export function StatsSection() {
  const [stats, setStats] = useState(defaultStats);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);

  useEffect(() => {
    fetch('/api/content?type=home')
      .then(res => res.json())
      .then(data => {
        if (data.data?.stats && data.data.stats.length > 0) {
          const merged = data.data.stats.map((s: any, i: number) => ({
            label: s.label,
            value: typeof s.value === 'number' ? s.value : parseInt(String(s.value).replace(/[^0-9]/g, '')) || 0,
            suffix: s.suffix ?? '+',
            color: defaultStats[i % defaultStats.length].color,
          }));
          setStats(merged);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section ref={containerRef} className="relative py-32 bg-[#020617] overflow-hidden">
      {/* Abstract Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[150px] mix-blend-screen" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-4xl lg:text-5xl font-bold text-white mb-6 tracking-tight"
          >
            Our Impact in <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500">Numbers</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg text-slate-400 max-w-2xl mx-auto font-light leading-relaxed"
          >
            Measuring our commitment to excellence in research and innovation 
            through quantifiable achievements and global milestones.
          </motion.p>
        </div>

        <motion.div style={{ y }} className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true, margin: "-50px" }}
              className="group relative rounded-2xl p-6 md:p-8 border border-white/[0.05] bg-white/[0.02] backdrop-blur-xl overflow-hidden hover:bg-white/[0.04] transition-colors duration-500"
            >
              <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${stat.color} opacity-30 group-hover:opacity-100 transition-opacity duration-500`} />
              
              <div className="flex flex-col items-center justify-center text-center h-full gap-2">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} gradient={stat.color} />
                <div className="text-slate-400 text-sm md:text-base font-medium tracking-wide uppercase mt-2 group-hover:text-white transition-colors duration-300">
                  {stat.label}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}