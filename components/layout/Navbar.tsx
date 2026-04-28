'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, LayoutDashboard, LogOut } from 'lucide-react';
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
  { name: 'RLC committee', href: '/rl-committee' },
  { name: 'Events', href: '/events' },
  { name: 'News', href: '/news' },
  { name: 'Contact', href: '/contact' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [logoUrl, setLogoUrl] = useState('/RIC SAU logo.png');
  const fallbackLogo = '/RIC SAU logo.png';
  const pathname = usePathname();
  const router = useRouter();

  // Throttled scroll handler
  useEffect(() => {
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

  // Sync auth state on route change — login sets 'adminUser' in localStorage
  useEffect(() => {
    const user = localStorage.getItem('adminUser');
    setIsLoggedIn(!!user);
  }, [pathname]);

  // Load dynamic logo from settings
  useEffect(() => {
    fetch('/api/settings?section=general')
      .then(res => res.json())
      .then(data => { if (data.data?.logo) setLogoUrl(data.data.logo); })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.error('Logout error:', e);
    }
    localStorage.removeItem('adminUser');
    setIsLoggedIn(false);
    router.push('/login');
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#020617]/80 backdrop-blur-md shadow-lg border-b border-white/[0.05]' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <img
              src={logoUrl}
              alt="Research & Innovation Logo"
              width={32}
              height={32}
              className="w-8 h-8 object-contain"
              onError={() => setLogoUrl(fallbackLogo)}
            />
            <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
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
                      ? 'text-cyan-400 bg-white/[0.05]'
                      : 'text-slate-300 hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  {item.name}
                  {item.submenu && <ChevronDown className="ml-1 h-4 w-4" />}
                </Link>

                {item.submenu && (
                  <div className="absolute left-0 mt-2 w-48 bg-[#020617]/95 backdrop-blur-md rounded-md shadow-xl border border-white/[0.05] py-1 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    {item.submenu.map((subitem) => (
                      <Link
                        key={subitem.name}
                        href={subitem.href}
                        prefetch={true}
                        className="block px-4 py-2 text-sm text-slate-300 hover:bg-white/[0.05] hover:text-white transition-colors"
                      >
                        {subitem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Auth Buttons */}
            {isLoggedIn ? (
              <div className="flex items-center space-x-2">
                <Link href="/dashboard">
                  <Button variant="outline" size="sm" className="flex items-center space-x-1">
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Link href="/login">
                <Button size="sm">Login</Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)} className="text-slate-300 hover:text-white hover:bg-white/[0.05]">
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
            className="md:hidden bg-[#020617]/95 backdrop-blur-xl border-t border-white/[0.05]"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navigation.map((item) => (
                <div key={item.name}>
                  <Link
                    href={item.href}
                    prefetch={true}
                    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      pathname === item.href
                        ? 'text-cyan-400 bg-white/[0.05]'
                        : 'text-slate-300 hover:text-white hover:bg-white/[0.05]'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                  {item.submenu && (
                    <div className="ml-4 space-y-1 border-l border-white/[0.05] pl-2 mt-1">
                      {item.submenu.map((subitem) => (
                        <Link
                          key={subitem.name}
                          href={subitem.href}
                          prefetch={true}
                          className="block px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-white/[0.05] rounded-md transition-colors"
                          onClick={() => setIsOpen(false)}
                        >
                          {subitem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Mobile Auth */}
              {isLoggedIn ? (
                <div className="space-y-2 mt-2">
                  <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full flex items-center justify-center space-x-2">
                      <LayoutDashboard className="h-4 w-4" />
                      <span>Dashboard</span>
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 flex items-center justify-center space-x-2"
                    onClick={() => { handleLogout(); setIsOpen(false); }}
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </Button>
                </div>
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
