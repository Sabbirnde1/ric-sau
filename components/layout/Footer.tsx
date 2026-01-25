import Link from 'next/link';
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Github } from 'lucide-react';
import SocialIcons from '../SocialIcons';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">R</span>
              </div>
              <span className="font-bold text-xl">Research & Innovation</span>
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
              <li><Link href="/about" className="text-gray-300 hover:text-white">About Us</Link></li>
              <li><Link href="/research" className="text-gray-300 hover:text-white">Research</Link></li>
              <li><Link href="/team" className="text-gray-300 hover:text-white">Team</Link></li>
              <li><Link href="/news" className="text-gray-300 hover:text-white">News</Link></li>
              <li><Link href="/contact" className="text-gray-300 hover:text-white">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Research Areas</h3>
            <ul className="space-y-2">
              <li><Link href="/research/projects" className="text-gray-300 hover:text-white">AI & Machine Learning</Link></li>
              <li><Link href="/research/projects" className="text-gray-300 hover:text-white">Software Engineering</Link></li>
              <li><Link href="/research/projects" className="text-gray-300 hover:text-white">Data Science</Link></li>
              <li><Link href="/research/projects" className="text-gray-300 hover:text-white">Cybersecurity</Link></li>
              <li><Link href="/research/projects" className="text-gray-300 hover:text-white">IoT Systems</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3">
                <MapPin className="h-12 w-14 text-blue-400" />
                <span className="text-gray-300">4th Floor, Central Library, Sher-e-Bangla Agricultural University, Dhaka-1207, Bangladesh</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-blue-400" />
                <span className="text-gray-300">0244814019</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-400" />
                <span className="text-gray-300">info.sauric@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2025 Research & Innovation Center. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}