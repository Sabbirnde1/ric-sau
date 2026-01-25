'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { HeroSection } from '@/components/sections/HeroSection';
import { FeaturesSection } from '@/components/sections/FeaturesSection';
import { StatsSection } from '@/components/sections/StatsSection';
import { ResearchHighlights } from '@/components/sections/ResearchHighlights';
import { NewsSection } from '@/components/sections/NewsSection';
import { CTASection } from '@/components/sections/CTASection';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Smooth scrolling animation
      gsap.utils.toArray('.animate-on-scroll').forEach((element: any) => {
        gsap.fromTo(element, 
          { y: 100, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: element,
              start: 'top 80%',
              end: 'bottom 20%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      });
    }
  }, []);

  return (
    <div ref={containerRef} className="overflow-hidden">
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <ResearchHighlights />
      <NewsSection />
      <CTASection />
    </div>
  );
}