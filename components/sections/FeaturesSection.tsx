'use client';

import { motion } from 'framer-motion';
import { Brain, Code, Database, Shield, Zap, Users } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'Artificial Intelligence',
    description: 'Advanced AI research including machine learning, deep learning, and neural networks for innovative solutions.',
    color: 'bg-blue-500',
  },
  {
    icon: Code,
    title: 'Software Engineering',
    description: 'Cutting-edge software development methodologies, frameworks, and best practices for scalable applications.',
    color: 'bg-green-500',
  },
  {
    icon: Database,
    title: 'Data Science',
    description: 'Big data analytics, data mining, and statistical modeling to extract meaningful insights from complex datasets.',
    color: 'bg-purple-500',
  },
  {
    icon: Shield,
    title: 'Cybersecurity',
    description: 'Advanced security research, threat detection, and protection mechanisms for digital infrastructure.',
    color: 'bg-red-500',
  },
  {
    icon: Zap,
    title: 'IoT & Embedded Systems',
    description: 'Internet of Things solutions, embedded systems design, and smart device integration technologies.',
    color: 'bg-yellow-500',
  },
  {
    icon: Users,
    title: 'Human-Computer Interaction',
    description: 'User experience research, interface design, and accessibility solutions for better human-technology interaction.',
    color: 'bg-indigo-500',
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 bg-white animate-on-scroll">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4"
          >
            Our Research Focus Areas
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg text-gray-600 max-w-3xl mx-auto"
          >
            We specialize in multiple cutting-edge research domains, pushing the boundaries 
            of technology and innovation to create solutions for tomorrow's challenges.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="group bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
              >
                <div className={`w-14 h-14 ${feature.color} rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="h-7 w-7 text-white" />
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>

                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: '100%' }}
                  transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
                  viewport={{ once: true }}
                  className="h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-6"
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}