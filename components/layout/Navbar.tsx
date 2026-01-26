'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { 
    name: 'Research', 
    href: '/research',
    submenu: [
      { name: 'Projects', href: '/research/projects' },
      { name: 'Publications', href: '/research/publications' },
      { name: 'Labs', href: '/research/labs' },
      { name: 'Resources', href: '/resources' },
    ]
  },
  { name: 'Innovators', href: '/innovators' },
  { name: 'RL-Committee', href: '/rl-committee' },
  { name: 'Events', href: '/events' },
  { name: 'News', href: '/news' },
  { name: 'Contact', href: '/contact' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Throttle scroll handler for better performance
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    setIsLoggedIn(token === 'loggedIn');
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsLoggedIn(false);
    router.push('/login');
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed p-2 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg border-b' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          {/* <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">R</span>
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Research & Innovation
            </span>
          </Link> */}

        <Link href="/" className="flex items-center space-x-2">
          {/* Logo Image */}
          <Image
            src="/RIC SAU logo.png"
            alt="Research & Innovation Logo"
            width={20}
            height={20}
            className="w-20 h-20 object-cover"
            priority
          />
          {/* Text */}
          <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            RIC-SAU
          </span>
        </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navigation.map((item) => (
              <div key={item.name} className="relative group">
                <Link
                  href={item.href}
                  prefetch={true}
                  className={`px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors ${
                    pathname === item.href
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  {item.name}
                  {item.submenu && <ChevronDown className="ml-1 h-4 w-4" />}
                </Link>

                {item.submenu && (
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    {item.submenu.map((subitem) => (
                      <Link
                        key={subitem.name}
                        href={subitem.href}
                        prefetch={true}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                      >
                        {subitem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Login/Logout Button */}
            {isLoggedIn ? (
              <Button onClick={handleLogout}>Logout</Button>
            ) : (
              <Link href="/login">
                <Button>Login</Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navigation.map((item) => (
                <div key={item.name}>
                  <Link
                    href={item.href}
                    prefetch={true}
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      pathname === item.href
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                  {item.submenu && (
                    <div className="ml-4 space-y-1">
                      {item.submenu.map((subitem) => (
                        <Link
                          key={subitem.name}
                          href={subitem.href}
                          prefetch={true}
                          className="block px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md"
                          onClick={() => setIsOpen(false)}
                        >
                          {subitem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Mobile Login/Logout */}
              {isLoggedIn ? (
                <Button
                  className="w-full mt-2"
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                >
                  Logout
                </Button>
              ) : (
                <Link href="/login" onClick={() => setIsOpen(false)}>
                  <Button className="w-full mt-2">Login</Button>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
