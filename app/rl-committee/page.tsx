'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { User } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

function MemberCard({ member }: { member: any }) {
  const [imgError, setImgError] = useState(false);
  const hasValidImage = member.image && member.image.trim() !== '' && !imgError;
  const imagePlacement = member.imagePlacement || 'top';
  const isHorizontal = imagePlacement === 'left' || imagePlacement === 'right';
  const rowDirection = imagePlacement === 'right' ? 'sm:flex-row-reverse' : 'sm:flex-row';

  return (
    <motion.div
      className={`committee-card relative bg-card rounded-xl shadow-lg p-6 pt-8 hover:shadow-2xl transition-shadow duration-300 flex flex-col ${isHorizontal ? `${rowDirection} sm:items-start sm:gap-4` : 'items-center'}`}
    >
      {/* Role Badge */}
      <div className="absolute -top-3 left-3 px-3 py-1 rounded-full font-semibold text-xs bg-green-600 text-white shadow-md">
        {member.role}
      </div>

      {/* Image — always rendered for consistent layout */}
      <div className={`w-28 h-28 sm:w-32 sm:h-32 relative rounded-full overflow-hidden shadow-md bg-muted flex-shrink-0 ${isHorizontal ? 'mx-auto sm:mx-0 mb-4 sm:mb-0' : 'mx-auto mb-4'}`}>
        {hasValidImage ? (
          <Image
            src={member.image}
            alt={member.name}
            fill
            sizes="128px"
            className="object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/40 dark:to-purple-900/40">
            <User className="w-12 h-12 text-muted-foreground/50" />
          </div>
        )}
      </div>

      <div className={`${isHorizontal ? 'sm:flex-1 sm:text-left' : 'text-center'}`}>
        <h3 className={`text-xl font-semibold text-foreground mb-1 ${isHorizontal ? 'text-center sm:text-left' : 'text-center'}`}>{member.name}</h3>
        <p className={`text-sm text-muted-foreground ${isHorizontal ? 'text-center sm:text-left' : 'text-center'}`}>{member.department}</p>
        {member.bio && (
          <p className={`text-sm text-muted-foreground mt-3 line-clamp-3 ${isHorizontal ? 'text-center sm:text-left' : 'text-center'}`}>{member.bio}</p>
        )}
      </div>
    </motion.div>
  );
}

export default function RLCommitteePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [committeeMembers, setCommitteeMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/content?type=rlCommittee')
      .then(res => res.json())
      .then(data => {
        setCommitteeMembers(data.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!loading && committeeMembers.length > 0 && typeof window !== 'undefined') {
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
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      });
    }
  }, [loading, committeeMembers]);

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
            {loading ? (
              <div className="col-span-full flex justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>
            ) : committeeMembers.length === 0 ? (
              <p className="col-span-full text-center text-gray-500">No committee members yet.</p>
            ) : (
            committeeMembers.map((member, i) => (
              <MemberCard key={member.id || i} member={member} />
            ))
            )}
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
