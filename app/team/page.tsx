'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { Linkedin, Twitter, Github, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

function TeamMemberCard({ member }: { member: any }) {
  const [imgError, setImgError] = useState(false);
  const hasValidImage = member.image && member.image.trim() !== '' && !imgError;

  return (
    <motion.div
      className="team-card bg-white rounded-2xl shadow-lg p-6 text-center flex flex-col items-center"
    >
      <div className="w-32 h-32 rounded-full overflow-hidden mb-6 shadow-md bg-gradient-to-br from-blue-50 to-purple-50 flex-shrink-0">
        {hasValidImage ? (
          <motion.img
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            src={member.image}
            alt={member.name}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <User className="w-12 h-12 text-blue-200" />
          </div>
        )}
      </div>
      <h3 className="text-xl font-semibold text-gray-900">{member.name}</h3>
      <p className="text-sm text-blue-600 mb-4">{member.position}</p>
      <p className="text-sm text-gray-600 leading-relaxed mb-6 line-clamp-3">{member.bio}</p>
    </motion.div>
  );
}

export default function TeamPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [team, setTeam] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/content?type=team')
      .then(res => res.json())
      .then(data => {
        setTeam(data.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!loading && team.length > 0 && typeof window !== 'undefined') {
      gsap.utils.toArray('.team-card').forEach((element: any, index) => {
        gsap.fromTo(
          element,
          { y: 80, opacity: 0 },
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
  }, [loading, team]);

  return (
    <div ref={containerRef} className="min-h-screen bg-gray-50 pt-20">
      {/* Hero Section */}
      <section className="py-24 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Meet Our Team
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              A diverse group of experts, innovators, and researchers working 
              together to shape the future of technology.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Our Leadership
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our leadership team brings decades of combined experience across 
              technology, research, and innovation.
            </p>
          </motion.div>

          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
            {loading ? (
              <div className="col-span-full flex justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>
            ) : team.length === 0 ? (
              <p className="col-span-full text-center text-gray-500">No team members yet.</p>
            ) : (
            team.map((member) => (
              <TeamMemberCard key={member.id} member={member} />
            ))
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Want to Join Our Team?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              We are always looking for passionate, talented people to grow with us. 
              Let’s shape the future together.
            </p>
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Explore Careers
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
