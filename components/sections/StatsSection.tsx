'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const stats = [
  { label: 'Active Research Projects', value: 45, suffix: '+' },
  { label: 'Published Papers', value: 180, suffix: '+' },
  { label: 'Research Team Members', value: 28, suffix: '+' },
  { label: 'Industry Partners', value: 12, suffix: '+' },
  { label: 'Patents Filed', value: 8, suffix: '' },
  { label: 'Awards Won', value: 15, suffix: '+' },
];

function AnimatedCounter({ value, suffix = '', duration = 2000 }: { value: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView({ threshold: 0.3, triggerOnce: true });

  useEffect(() => {
    if (!inView) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      setCount(Math.floor(progress * value));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [inView, value, duration]);

  return (
    <span ref={ref} className="text-4xl font-bold">
      {count}{suffix}
    </span>
  );
}

export function StatsSection() {
  return (
    <section className="py-24 bg-gradient-to-br from-blue-600 to-purple-700 text-white animate-on-scroll">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Our Impact in Numbers
          </h2>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto">
            Measuring our commitment to excellence in research and innovation 
            through quantifiable achievements and milestones.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center group"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 transition-all duration-300"
              >
                <div className="text-white mb-4 group-hover:text-yellow-300 transition-colors">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-blue-100 text-sm lg:text-base font-medium leading-tight">
                  {stat.label}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-blue-100 text-lg">
            🏆 Recognized globally for excellence in research and innovation
          </p>
        </motion.div>
      </div>
    </section>
  );
}