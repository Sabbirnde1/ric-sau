'use client';

import { motion } from 'framer-motion';
import { Brain, Code, Database, Shield, Zap, Users, ArrowRight, Calendar, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const researchAreas = [
  {
    icon: Brain,
    title: 'Artificial Intelligence & Machine Learning',
    description: 'Advanced AI research including deep learning, neural networks, computer vision, and natural language processing for innovative solutions across various domains.',
    projects: 12,
    publications: 45,
    color: 'bg-blue-500',
    gradient: 'from-blue-500 to-blue-600'
  },
  {
    icon: Code,
    title: 'Software Engineering & Development',
    description: 'Cutting-edge software development methodologies, frameworks, agile practices, and best practices for scalable, maintainable applications.',
    projects: 8,
    publications: 32,
    color: 'bg-green-500',
    gradient: 'from-green-500 to-green-600'
  },
  {
    icon: Database,
    title: 'Data Science & Analytics',
    description: 'Big data analytics, data mining, statistical modeling, and business intelligence to extract meaningful insights from complex datasets.',
    projects: 10,
    publications: 38,
    color: 'bg-purple-500',
    gradient: 'from-purple-500 to-purple-600'
  },
  {
    icon: Shield,
    title: 'Cybersecurity & Privacy',
    description: 'Advanced security research, threat detection, cryptography, and protection mechanisms for digital infrastructure and data privacy.',
    projects: 6,
    publications: 28,
    color: 'bg-red-500',
    gradient: 'from-red-500 to-red-600'
  },
  {
    icon: Zap,
    title: 'IoT & Embedded Systems',
    description: 'Internet of Things solutions, embedded systems design, smart device integration, and edge computing technologies.',
    projects: 9,
    publications: 25,
    color: 'bg-yellow-500',
    gradient: 'from-yellow-500 to-yellow-600'
  },
  {
    icon: Users,
    title: 'Human-Computer Interaction',
    description: 'User experience research, interface design, accessibility solutions, and usability studies for better human-technology interaction.',
    projects: 7,
    publications: 22,
    color: 'bg-indigo-500',
    gradient: 'from-indigo-500 to-indigo-600'
  },
];

export default function ResearchPage() {

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Hero Section */}
      <section className="py-24 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Research Areas & Focus
            </h1>
            <p className="text-xl lg:text-2xl text-blue-100 mb-8 max-w-4xl mx-auto">
              Exploring cutting-edge technologies and methodologies to solve tomorrow&#39;s challenges 
              through innovative research and development initiatives.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-16"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="text-3xl font-bold text-yellow-300 mb-2">50+</div>
              <div className="text-blue-100">Active Projects</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="text-3xl font-bold text-yellow-300 mb-2">200+</div>
              <div className="text-blue-100">Publications</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="text-3xl font-bold text-yellow-300 mb-2">30+</div>
              <div className="text-blue-100">Researchers</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="text-3xl font-bold text-yellow-300 mb-2">15+</div>
              <div className="text-blue-100">Awards</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Research Areas */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Our Research Focus Areas
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We conduct research across multiple domains, pushing the boundaries of technology 
              and innovation to create impactful solutions for real-world challenges.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {researchAreas.map((area, index) => {
              const Icon = area.icon;
              return (
                <motion.div
                  key={area.title}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="research-card group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
                >
                  <div className="flex items-start space-x-6">
                    <div className={`w-16 h-16 ${area.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-2xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                        {area.title}
                      </h3>
                      
                      <p className="text-gray-600 leading-relaxed mb-6">
                        {area.description}
                      </p>

                      <div className="flex items-center justify-between mb-6">
                        <div className="flex space-x-6 text-sm text-gray-500">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span>{area.projects} Projects</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span>{area.publications} Publications</span>
                          </div>
                        </div>
                      </div>

                      <div className={`h-1 bg-gradient-to-r ${area.gradient} rounded-full mb-4`}></div>
                      
                      <Link href="/research/projects">
                        <Button variant="ghost" className="group-hover:bg-blue-50 group-hover:text-blue-600 p-0 h-auto font-medium">
                          View Projects
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Interested in Collaboration?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join us in advancing research and innovation. We welcome partnerships 
              with industry, academia, and government organizations.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link href="/contact">
                <Button size="lg" variant="outline" className="bg-white text-blue-600 hover:bg-blue-600 hover:text-white border-white">
                  Contact Us
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/research/projects">
                <Button size="lg" variant="outline" className="border-white text-blue-600 hover:bg-blue-600 hover:text-white">
                  View All Projects
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}