'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import {
  Users,
  Target,
  Award,
  BookOpen,
  Mail,
  ArrowRight,
  FlaskConical,
  Globe,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function RicSauAboutPage() {
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
      <section className="relative h-[80vh] flex items-center justify-center text-white overflow-hidden">
        <Image
          src="/ric-sau-cover.jpg"
          alt="SAU Campus"
          fill
          className="object-cover brightness-50"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/70 via-purple-600/60 to-blue-800/80"></div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 text-center px-6"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="mx-auto mb-6 w-28 h-28 rounded-full shadow-lg bg-white p-2 relative"
          >
            <Image
              src="/RIC SAU logo.png"
              alt="RIC SAU Logo"
              fill
              className="object-contain rounded-full"
              priority
              sizes="112px"
            />
          </motion.div>
          <h1 className="text-4xl lg:text-6xl font-bold mb-4">
            Research & Innovation Center (RIC - SAU)
          </h1>
          <p className="text-lg lg:text-2xl text-green-100 max-w-3xl mx-auto">
            Fostering innovation, entrepreneurship, and agricultural technology for a sustainable future.
          </p>
        </motion.div>
      </section>

      {/* Identity Section */}
      <section className="py-20 bg-white about-section">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-gray-900 mb-6"
          >
            RIC–SAU Identity
          </motion.h2>
          <p className="text-gray-600 text-lg leading-relaxed max-w-4xl mx-auto">
            Established under the <strong>EDGE Project</strong> (Enhancing Digital Government & Economy) 
            funded by <strong>The World Bank</strong> and implemented by the <strong>Bangladesh Computer Council (BCC)</strong>, 
            the Research & Innovation Center (RIC) at <strong>Sher-e-Bangla Agricultural University</strong> 
            drives forward digital transformation and agri-tech innovation.
          </p>
        </div>
      </section>

      {/* Funding & Governance */}
      <section className="py-24 bg-gray-100 about-section">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.img
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4 }}
            src="https://images.pexels.com/photos/3182756/pexels-photo-3182756.jpeg?auto=compress&cs=tinysrgb&w=800"
            alt="Innovation Governance"
            className="w-full h-96 object-cover rounded-2xl shadow-2xl"
          />
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Funding & Governance</h2>
            <ul className="space-y-3 text-lg text-gray-600">
              <li><strong>Financier:</strong> The World Bank</li>
              <li><strong>Implementing Agency:</strong> Bangladesh Computer Council (BCC)</li>
              <li><strong>Project:</strong> EDGE - Enhancing Digital Government and Economy</li>
              <li><strong>Outcome:</strong> Research & Innovation Center (RIC - SAU)</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Who Can Apply */}
      <section className="py-24 about-section">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Who Can Apply</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Users, text: 'SAU Students (UG/PG), Faculty & Researchers' },
              { icon: BookOpen, text: 'Independent Innovators & Alumni' },
              { icon: FlaskConical, text: 'Early-stage Startups & Industry Partners' },
            ].map(({ icon: Icon, text }, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <Icon className="h-10 w-10 text-blue-600 mx-auto mb-4" />
                <p className="text-gray-700 font-medium">{text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section className="py-24 bg-gray-100 about-section">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">What You Get</h2>
            <ul className="space-y-4 text-gray-700 text-lg">
              <li className="flex items-center space-x-3">
                <Award className="h-5 w-5 text-blue-600" />
                <span>Modern laboratories & field testbeds</span>
              </li>
              <li className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-blue-600" />
                <span>One-to-one mentoring & investor connect</span>
              </li>
              <li className="flex items-center space-x-3">
                <Target className="h-5 w-5 text-blue-600" />
                <span>End-to-end IP & commercialization support</span>
              </li>
              <li className="flex items-center space-x-3">
                <BookOpen className="h-5 w-5 text-blue-600" />
                <span>Training, technology transfer & pilot deployment</span>
              </li>
            </ul>
          </div>

          <motion.img
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4 }}
            src="https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800"
            alt="Innovation Labs"
            className="w-full h-96 object-cover rounded-2xl shadow-2xl"
          />
        </div>
      </section>

      {/* Focus Areas */}
      <section className="py-24 about-section">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Focus Areas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              'Agri-biotech, Food & Health, Climate-smart Farming',
              'Farm Mechanization & Smart Equipment',
              'Data, AI & IoT for Agriculture',
            ].map((area, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
              >
                <Globe className="text-blue-600 w-8 h-8 mx-auto mb-3" />
                <p className="text-gray-700 font-medium">{area}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Apply */}
      <section className="py-24 bg-gray-100 about-section">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">How to Apply</h2>
          <ol className="list-decimal list-inside text-left text-lg text-gray-700 space-y-3 mb-10">
            <li>Prepare a brief concept note or problem statement.</li>
            <li>
              Email:{" "}
              <a
                href="mailto:info.sauric@gmail.com"
                className="text-blue-700 font-medium hover:underline"
              >
                info.sauric@gmail.com
              </a>{" "}
              (Subject: “RIC–SAU Application”)
            </li>
            <li>Process: Shortlisting → Mentoring → Lab Access → Pilot → Demo Day/Market</li>
          </ol>
          <Link href="/contact">
            <Button size="lg" className="bg-blue-700 hover:bg-blue-800 text-white">
              Apply Now
              <Mail className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white about-section">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Innovate. Collaborate. Transform Agriculture.
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join RIC–SAU to redefine agricultural innovation for a digital Bangladesh.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link href="/contact">
                <Button
                 size="lg" variant="outline" className="border-white text-blue-600 hover:bg-blue-600 hover:text-white"
                >
                  Get in Touch
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/research/projects">
                <Button
                  size="lg" variant="outline" className="border-white text-blue-600 hover:bg-blue-600 hover:text-white"
                >
                  Explore Projects
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
