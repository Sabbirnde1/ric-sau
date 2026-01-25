'use client';

import { motion } from 'framer-motion';

export default function AnimatedTitle({ text }: { text: string }) {
  return (
    <motion.h1
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="text-4xl lg:text-5xl font-bold mb-6"
    >
      {text}
    </motion.h1>
  );
}
