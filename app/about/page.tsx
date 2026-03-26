'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
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

const defaultFunding = [
  { label: 'Financier', value: 'The World Bank' },
  { label: 'Implementing Agency', value: 'Bangladesh Computer Council (BCC)' },
  { label: 'Project', value: 'EDGE - Enhancing Digital Government and Economy' },
  { label: 'Outcome', value: 'Research & Innovation Center (RIC - SAU)' },
];
const defaultWhoCanApply = [
  'SAU Students (UG/PG), Faculty & Researchers',
  'Independent Innovators & Alumni',
  'Early-stage Startups & Industry Partners',
];
const defaultWhatYouGet = [
  'Modern laboratories & field testbeds',
  'One-to-one mentoring & investor connect',
  'End-to-end IP & commercialization support',
  'Training, technology transfer & pilot deployment',
];
const defaultFocusAreas = [
  'Agri-biotech, Food & Health, Climate-smart Farming',
  'Farm Mechanization & Smart Equipment',
  'Data, AI & IoT for Agriculture',
];
const defaultHowToApply = [
  'Prepare a brief concept note or problem statement.',
  'Email: info.sauric@gmail.com (Subject: "RIC–SAU Application")',
  'Process: Shortlisting → Mentoring → Lab Access → Pilot → Demo Day/Market',
];

const whoIcons = [Users, BookOpen, FlaskConical];
const whatIcons = [Award, Users, Target, BookOpen];

export default function RicSauAboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [about, setAbout] = useState<any>(null);
  const [logoUrl, setLogoUrl] = useState('/RIC SAU logo.png');
  const fallbackLogo = '/RIC SAU logo.png';

  useEffect(() => {
    fetch('/api/content?type=about')
      .then(res => res.json())
      .then(data => { if (data.data) setAbout(data.data); })
      .catch(() => {});
    fetch('/api/settings?section=general')
      .then(res => res.json())
      .then(data => { if (data.data?.logo) setLogoUrl(data.data.logo); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let disposed = false;

    const runAnimations = async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/dist/ScrollTrigger')
      ]);

      if (disposed) return;

      gsap.registerPlugin(ScrollTrigger);

      gsap.utils.toArray('.about-section').forEach((element: any) => {
        gsap.fromTo(
          element,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: element,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      });
    };

    void runAnimations();

    return () => {
      disposed = true;
    };
  }, [about]);

  const heroTitle = about?.heroTitle || 'Research & Innovation Center (RIC - SAU)';
  const heroSubtitle = about?.heroSubtitle || 'Fostering innovation, entrepreneurship, and agricultural technology for a sustainable future.';
  const heroImage = about?.heroImage || '/ric-sau-cover.jpg';
  const identity = about?.identity || 'Established under the <strong>EDGE Project</strong> (Enhancing Digital Government &amp; Economy) funded by <strong>The World Bank</strong> and implemented by the <strong>Bangladesh Computer Council (BCC)</strong>, the Research &amp; Innovation Center (RIC) at <strong>Sher-e-Bangla Agricultural University</strong> drives forward digital transformation and agri-tech innovation.';
  const funding = about?.funding?.length ? about.funding : defaultFunding;
  const fundingImage = about?.fundingImage || 'https://images.pexels.com/photos/3182756/pexels-photo-3182756.jpeg?auto=compress&cs=tinysrgb&w=800';
  const whoCanApply = about?.whoCanApply?.length ? about.whoCanApply : defaultWhoCanApply;
  const whatYouGet = about?.whatYouGet?.length ? about.whatYouGet : defaultWhatYouGet;
  const focusAreas = about?.focusAreas?.length ? about.focusAreas : defaultFocusAreas;
  const howToApply = about?.howToApply?.length ? about.howToApply : defaultHowToApply;
  const applyEmail = about?.applyEmail || 'info.sauric@gmail.com';
  const ctaTitle = about?.ctaTitle || 'Innovate. Collaborate. Transform Agriculture.';
  const ctaSubtitle = about?.ctaSubtitle || 'Join RIC–SAU to redefine agricultural innovation for a digital Bangladesh.';

  return (
    <div ref={containerRef} className="min-h-screen bg-gray-50 pt-20">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center text-white overflow-hidden">
        <Image
          src={heroImage}
          alt="SAU Campus"
          fill
          sizes="100vw"
          priority
          className="object-cover brightness-50"
          unoptimized={heroImage.startsWith('data:') || (heroImage.startsWith('http') && !heroImage.includes('images.pexels.com'))}
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
            className="mx-auto mb-6 w-28 h-28 rounded-full shadow-lg bg-white p-2 overflow-hidden"
          >
            <Image
              src={logoUrl}
              alt="RIC SAU Logo"
              width={112}
              height={112}
              sizes="112px"
              className="w-full h-full object-contain p-1"
              unoptimized={logoUrl.startsWith('data:') || (logoUrl.startsWith('http') && !logoUrl.includes('images.pexels.com'))}
              onError={() => setLogoUrl(fallbackLogo)}
            />
          </motion.div>
          <h1 className="text-4xl lg:text-6xl font-bold mb-4">
            {heroTitle}
          </h1>
          <p className="text-lg lg:text-2xl text-green-100 max-w-3xl mx-auto">
            {heroSubtitle}
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
          <div className="text-gray-600 text-lg leading-relaxed max-w-4xl mx-auto" dangerouslySetInnerHTML={{ __html: identity }} />
        </div>
      </section>

      {/* Funding & Governance */}
      <section className="py-24 bg-gray-100 about-section">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.4 }} className="relative w-full h-96 rounded-2xl shadow-2xl overflow-hidden">
            <Image
              src={fundingImage}
              alt="Innovation Governance"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              unoptimized={fundingImage.startsWith('data:') || (fundingImage.startsWith('http') && !fundingImage.includes('images.pexels.com'))}
            />
          </motion.div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Funding & Governance</h2>
            <ul className="space-y-3 text-lg text-gray-600">
              {funding.map((item: any, i: number) => (
                <li key={i}><strong>{item.label}:</strong> {item.value}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Who Can Apply */}
      <section className="py-24 about-section">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Who Can Apply</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {whoCanApply.map((text: string, i: number) => {
              const Icon = whoIcons[i % whoIcons.length];
              return (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white rounded-xl shadow-lg p-6"
                >
                  <Icon className="h-10 w-10 text-blue-600 mx-auto mb-4" />
                  <p className="text-gray-700 font-medium">{text}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section className="py-24 bg-gray-100 about-section">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">What You Get</h2>
            <ul className="space-y-4 text-gray-700 text-lg">
              {whatYouGet.map((text: string, i: number) => {
                const Icon = whatIcons[i % whatIcons.length];
                return (
                  <li key={i} className="flex items-center space-x-3">
                    <Icon className="h-5 w-5 text-blue-600 flex-shrink-0" />
                    <span>{text}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.4 }} className="relative w-full h-96 rounded-2xl shadow-2xl overflow-hidden">
            <Image
              src={about?.image || 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800'}
              alt="Innovation Labs"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              unoptimized={
                (about?.image || '').startsWith('data:') ||
                ((about?.image || '').startsWith('http') && !(about?.image || '').includes('images.pexels.com'))
              }
            />
          </motion.div>
        </div>
      </section>

      {/* Focus Areas */}
      <section className="py-24 about-section">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Focus Areas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {focusAreas.map((area: string, i: number) => (
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
            {howToApply.map((step: string, i: number) => (
              <li key={i}>{step}</li>
            ))}
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
              {ctaTitle}
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              {ctaSubtitle}
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
