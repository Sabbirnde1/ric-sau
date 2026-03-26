'use client';

import { motion } from 'framer-motion';
import { MapPin, Users, Calendar, ArrowRight, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import Image from 'next/image';

const defaultLabs = [
  {
    id: 1,
    name: 'Artificial Intelligence Research Lab',
    director: 'Dr. Sarah Johnson',
    location: 'Building A, Floor 3',
    established: 2018,
    members: 12,
    focus: ['Machine Learning', 'Deep Learning', 'Computer Vision', 'Natural Language Processing'],
    description:
      'Our AI Research Lab focuses on developing cutting-edge artificial intelligence technologies and applications.',
    equipment: ['High-Performance GPU Clusters', 'Quantum Computing Simulator', 'Advanced Workstations', 'Cloud Computing Resources'],
    projects: 8,
    publications: 45,
    image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
];

interface LabsClientProps {
  initialLabs: any[];
}

export default function LabsClient({ initialLabs }: LabsClientProps) {
  const labs = initialLabs.length > 0 ? initialLabs : defaultLabs;

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Hero Section */}
      <section className="py-24 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">Research Laboratories</h1>
            <p className="text-xl lg:text-2xl text-blue-100 max-w-4xl mx-auto">
              State-of-the-art research facilities equipped with cutting-edge technology and staffed by world-class researchers and scientists.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-yellow-300 mb-2">{labs.length}</div>
              <div className="text-blue-100">Research Labs</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-yellow-300 mb-2">{labs.reduce((sum, lab) => sum + lab.members, 0)}</div>
              <div className="text-blue-100">Researchers</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-yellow-300 mb-2">{labs.reduce((sum, lab) => sum + lab.projects, 0)}</div>
              <div className="text-blue-100">Active Projects</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-yellow-300 mb-2">{labs.reduce((sum, lab) => sum + lab.publications, 0)}</div>
              <div className="text-blue-100">Publications</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Labs Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Our Research Facilities</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Explore our world-class research laboratories where innovation meets excellence. Each lab is equipped with state-of-the-art technology and led by renowned experts.
            </p>
          </motion.div>

          <div className="space-y-16">
            {labs.map((lab, index) => (
              <motion.div
                key={lab.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className={`lab-card grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}
              >
                <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                  <div className="w-full h-80 relative rounded-2xl shadow-2xl overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50">
                    {lab.image && lab.image.trim() !== '' ? (
                      <Image
                        src={lab.image}
                        alt={lab.name}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover transition-transform duration-300 hover:scale-105"
                        unoptimized={lab.image.startsWith('data:') || (lab.image.startsWith('http') && !lab.image.includes('images.pexels.com'))}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-16 h-16 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611l-.772.13a18.142 18.142 0 01-6.126 0l-.772-.13c-1.717-.293-2.3-2.379-1.067-3.61L12.8 15.3"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>

                <div className={index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-3xl font-bold text-gray-900 mb-4">{lab.name}</h3>
                      <p className="text-lg text-gray-600 leading-relaxed">{lab.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="flex items-center space-x-3">
                        <Users className="h-5 w-5 text-blue-600" />
                        <div>
                          <div className="text-sm text-gray-500">Director</div>
                          <div className="font-medium">{lab.director}</div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <MapPin className="h-5 w-5 text-blue-600" />
                        <div>
                          <div className="text-sm text-gray-500">Location</div>
                          <div className="font-medium">{lab.location}</div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Calendar className="h-5 w-5 text-blue-600" />
                        <div>
                          <div className="text-sm text-gray-500">Established</div>
                          <div className="font-medium">{lab.established}</div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Users className="h-5 w-5 text-blue-600" />
                        <div>
                          <div className="text-sm text-gray-500">Team Size</div>
                          <div className="font-medium">{lab.members} members</div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Research Focus</h4>
                      <div className="flex flex-wrap gap-2">
                        {lab.focus.map((area: string) => (
                          <Badge key={area} variant="secondary">
                            {area}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Key Equipment</h4>
                      <ul className="list-disc list-inside text-gray-600 space-y-1">
                        {lab.equipment.map((item: string) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-center justify-between pt-4">
                      <div className="flex space-x-6 text-sm text-gray-500">
                        <div>
                          <span className="font-medium text-blue-600">{lab.projects}</span> Projects
                        </div>
                        <div>
                          <span className="font-medium text-green-600">{lab.publications}</span> Publications
                        </div>
                      </div>

                      <div className="flex space-x-3">
                        <Button variant="outline" size="sm">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Virtual Tour
                        </Button>
                        <Button size="sm">
                          Learn More
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
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
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">Visit Our Laboratories</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Schedule a visit to see our state-of-the-art facilities and meet our research teams. We welcome collaborations and partnerships.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link href="/contact">
                <Button size="lg" variant="outline" className="bg-white text-blue-600 hover:bg-gray-100">
                  Schedule Visit
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/research/projects">
                <Button size="lg" variant="outline" className="border-white text-blue-600 hover:bg-blue-600 hover:text-white">
                  View Lab Projects
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
