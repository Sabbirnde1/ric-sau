'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { Users, Target, Award, BookOpen, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      gsap.utils.toArray('.about-section').forEach((element: any, index) => {
        gsap.fromTo(
          element,
          { y: 100, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            delay: index * 0.2,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: element,
              start: 'top 80%',
              end: 'bottom 20%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-gray-50 pt-20">
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
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              About Us
            </h1>
            <p className="text-xl lg:text-2xl text-blue-100 max-w-4xl mx-auto">
              We are dedicated to innovation, research, and excellence in technology, 
              shaping the future with impactful projects and global collaborations.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission / Vision Section */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center about-section">
          <motion.img
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4 }}
            src="https://images.pexels.com/photos/3183173/pexels-photo-3183173.jpeg?auto=compress&cs=tinysrgb&w=800"
            alt="Our Team"
            className="w-full h-96 object-cover rounded-2xl shadow-2xl"
          />

          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission & Vision</h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              Our mission is to foster innovation, empower talent, and build solutions that 
              address real-world challenges. With a vision of becoming a global leader in 
              technology and research, we aim to create meaningful impact across industries 
              and communities.
            </p>
            <ul className="space-y-4 text-gray-700">
              <li className="flex items-center space-x-3">
                <Target className="h-5 w-5 text-blue-600" />
                <span>Innovation-driven solutions</span>
              </li>
              <li className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-blue-600" />
                <span>Collaboration & teamwork</span>
              </li>
              <li className="flex items-center space-x-3">
                <Award className="h-5 w-5 text-blue-600" />
                <span>Excellence & integrity</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-gray-100 about-section">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-blue-600 mb-2">10+</div>
            <div className="text-gray-600">Years of Experience</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
            <div className="text-gray-600">Expert Members</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-blue-600 mb-2">100+</div>
            <div className="text-gray-600">Projects Completed</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-blue-600 mb-2">30+</div>
            <div className="text-gray-600">Research Publications</div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 about-section">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Our Story</h2>
          <p className="text-lg text-gray-600 leading-relaxed text-center max-w-3xl mx-auto">
            Founded with the goal of bridging the gap between academia and industry, 
            our organization has grown into a hub of innovation and research. 
            From small beginnings, we have expanded globally, partnering with 
            leading institutions and industries to solve critical challenges 
            and create opportunities for the next generation.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-purple-600 text-white about-section">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Join Us in Shaping the Future
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Be part of our journey as we continue to innovate, research, and 
              build solutions for a better tomorrow.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link href="/contact">
                <Button size="lg"  variant="outline" className="border-white text-blue-600 hover:bg-blue-600 hover:text-white">
                  Get in Touch
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/research/projects">
                <Button size="lg" variant="outline" className="border-white text-blue-600 hover:bg-blue-600 hover:text-white">
                  Explore Our Work
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
