'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { HeroSection } from '@/components/sections/HeroSection';
import { FeaturesSection } from '@/components/sections/FeaturesSection';

// Lazy load below-the-fold components for better code splitting
const StatsSection = dynamic(() => import('@/components/sections/StatsSection').then(mod => ({ default: mod.StatsSection })), {
  ssr: true,
  loading: () => <div className="h-96 bg-gray-50 animate-pulse" />,
});
const ResearchHighlights = dynamic(() => import('@/components/sections/ResearchHighlights').then(mod => ({ default: mod.ResearchHighlights })), {
  ssr: true,
  loading: () => <div className="h-96 bg-gray-50 animate-pulse" />,
});
const NewsSection = dynamic(() => import('@/components/sections/NewsSection').then(mod => ({ default: mod.NewsSection })), {
  ssr: true,
  loading: () => <div className="h-96 bg-gray-50 animate-pulse" />,
});
const CTASection = dynamic(() => import('@/components/sections/CTASection').then(mod => ({ default: mod.CTASection })), {
  ssr: true,
  loading: () => <div className="h-96 bg-gray-50 animate-pulse" />,
});

// Lazy load GSAP only when needed
let gsap: any;
let ScrollTrigger: any;

const loadGSAP = async () => {
  if (typeof window !== 'undefined' && !gsap) {
    gsap = (await import('gsap')).default;
    ScrollTrigger = (await import('gsap/dist/ScrollTrigger')).ScrollTrigger;
    gsap.registerPlugin(ScrollTrigger);
  }
  return { gsap, ScrollTrigger };
};

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Delay GSAP loading until browser is idle for better initial load
      const loadAnimations = () => {
        loadGSAP().then(({ gsap }) => {
          if (gsap) {
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
        });
      };

      // Use requestIdleCallback if available, otherwise setTimeout
      if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(loadAnimations, { timeout: 2000 });
      } else {
        setTimeout(loadAnimations, 100);
      }
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