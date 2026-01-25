'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function RLCommitteePage() {
  const containerRef = useRef<HTMLDivElement>(null);

  const committeeMembers = [
    {
      name: 'Professor Md. Abul Bashar',
      role: 'Treasurer, SAU - Chair',
      type: 'Chair',
      img: '/committee/abul-bashar.jpg',
    },
    {
      name: 'Professor Dr. Md. Mahbubul Alam',
      role: 'Department of Agricultural Extension and Information System, SAU - Member',
      type: 'Member',
      img: '/committee/mahbubul-alam.jpg',
    },
    {
      name: 'Professor Dr. Md. Abdul Masum',
      role: 'Department of Anatomy, Histology and Physiology, SAU - Member',
      type: 'Member',
      img: '/committee/abdul-masum.jpg',
    },
    {
      name: 'Mir Mohammad Ali',
      role: 'Associate Professor, Aquaculture Department, SAU - Member',
      type: 'Member',
      img: '/committee/mir-mohammad-ali.jpg',
    },
    {
      name: 'Professor Dr. Dr. Abul Hasnat M. Solaiman',
      role: 'Department of Horticulture and Chief Coordinator, SAU - Focal Point',
      type: 'Focal Point',
      img: '/committee/abul-hasnat.jpg',
    },
  ];

  const badgeColors: Record<string, string> = {
    'Chair': 'bg-red-600 text-white',
    'Member': 'bg-green-600 text-white',
    'Focal Point': 'bg-yellow-500 text-white',
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      gsap.utils.toArray('.committee-card').forEach((element: any, index) => {
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
    <div ref={containerRef} className="min-h-screen bg-background pt-20">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center text-foreground overflow-hidden">
        <Image
          src="https://images.pexels.com/photos/3184322/pexels-photo-3184322.jpeg?auto=compress&cs=tinysrgb&w=1200"
          alt="RIC SAU Committee"
          fill
          className="object-cover brightness-50"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/70 via-purple-600/80 to-blue-800/90"></div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 text-center px-6"
        >
          <h1 className="text-4xl lg:text-6xl font-bold mb-4 text-white">
            RIC–SAU Leadership Committee
          </h1>
          <p className="text-lg lg:text-2xl text-primary-foreground max-w-3xl mx-auto">
            Meet the dedicated leaders driving research and innovation at Sher-e-Bangla Agricultural University.
          </p>
        </motion.div>
      </section>

      {/* Committee Members */}
      <section className="py-24 about-section">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-12">Committee Members</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            {committeeMembers.map((member, i) => (
              <motion.div
                key={i}
                className="committee-card relative bg-card rounded-xl shadow-lg p-6 hover:shadow-2xl transition-transform transform hover:scale-105"
              >
                {/* Role Badge */}
                <div
                  className={`absolute -top-3 -left-3 px-3 py-1 rounded-tr-lg rounded-br-lg font-semibold text-sm ${badgeColors[member.type]}`}
                >
                  {member.type}
                </div>

                <div className="w-32 h-32 mx-auto mb-4 relative rounded-full overflow-hidden shadow-inner">
                  <Image
                    src={member.img}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{member.name}</h3>
                <p className="text-muted-foreground text-center">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600/70 via-purple-600/80 to-blue-800/90 text-white about-section">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Be Part of the Innovation
            </h2>
            <p className="text-xl text-accent mb-8 max-w-2xl mx-auto">
              Contact RIC–SAU to collaborate or participate in our research and innovation programs.
            </p>
            <Link href="/contact">
              <Button
                size="lg" variant="outline" className="border-white text-blue-600 hover:bg-blue-600 hover:text-white"
              >
                Get in Touch
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
