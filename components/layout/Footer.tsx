'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';
import SocialIcons from '../SocialIcons';
import Image from 'next/image';
import { shouldUseUnoptimized } from '@/lib/utils';

export function Footer() {
  const [logoUrl, setLogoUrl] = useState('/RIC SAU logo.png');
  const [contact, setContact] = useState({ address: '', phone: '', email: '' });
  const fallbackLogo = '/RIC SAU logo.png';

  useEffect(() => {
    fetch('/api/settings?section=general')
      .then(res => res.json())
      .then(data => { if (data.data?.logo) setLogoUrl(data.data.logo); })
      .catch(() => {});

    fetch('/api/content?type=contact')
      .then(res => res.json())
      .then(data => { if (data.data) setContact(data.data); })
      .catch(() => {});
  }, []);

  return (
    <footer className="bg-[#020617] text-white border-t border-white/[0.05]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
            <Image
                src={logoUrl}
                alt="RIC-SAU Logo"
                width={40}
                height={40}
                className="w-10 h-10 object-contain"
                unoptimized={shouldUseUnoptimized(logoUrl)}
                onError={() => setLogoUrl(fallbackLogo)}
              />
              <span className="font-bold text-xl">RIC-SAU</span>
            </div>
            <p className="text-gray-300 mb-4">
              Leading research and innovation center focused on advancing technology 
              and creating solutions for tomorrow&#39;s challenges.
            </p>
            <SocialIcons />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/about" prefetch={true} className="text-gray-300 hover:text-white">About Us</Link></li>
              <li><Link href="/research" prefetch={true} className="text-gray-300 hover:text-white">Research</Link></li>
              <li><Link href="/team" prefetch={true} className="text-gray-300 hover:text-white">Team</Link></li>
              <li><Link href="/news" prefetch={true} className="text-gray-300 hover:text-white">News</Link></li>
              <li><Link href="/contact" prefetch={true} className="text-gray-300 hover:text-white">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Research Areas</h3>
            <ul className="space-y-2">
              <li><Link href="/research/projects" prefetch={true} className="text-gray-300 hover:text-white">AI & Machine Learning</Link></li>
              <li><Link href="/research/projects" prefetch={true} className="text-gray-300 hover:text-white">Software Engineering</Link></li>
              <li><Link href="/research/projects" prefetch={true} className="text-gray-300 hover:text-white">Data Science</Link></li>
              <li><Link href="/research/projects" prefetch={true} className="text-gray-300 hover:text-white">Cybersecurity</Link></li>
              <li><Link href="/research/projects" prefetch={true} className="text-gray-300 hover:text-white">IoT Systems</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300">{contact.address || '4th Floor, Central Library, Sher-e-Bangla Agricultural University, Dhaka-1207, Bangladesh'}</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-blue-400 flex-shrink-0" />
                <a href={`tel:${contact.phone || '0244814019'}`} className="text-gray-300 hover:text-white transition-colors">{contact.phone || '0244814019'}</a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-400 flex-shrink-0" />
                <a href={`mailto:${contact.email || 'info.sauric@gmail.com'}`} className="text-gray-300 hover:text-white transition-colors">{contact.email || 'info.sauric@gmail.com'}</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            &copy; {new Date().getFullYear()} Research &amp; Innovation Center. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}