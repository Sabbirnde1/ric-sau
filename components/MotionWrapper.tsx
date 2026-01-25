'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

type MotionWrapperProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
};

export default function MotionWrapper({ children, delay = 0, className }: MotionWrapperProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay }}
      viewport={{ once: true }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
