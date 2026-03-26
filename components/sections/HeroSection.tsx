'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { ChevronRight, Play, ChevronDown, Atom, FlaskConical, Microscope, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const defaultHeroStats = [
  { label: 'Research Projects', value: '50+', icon: 'flask' },
  { label: 'Publications', value: '200+', icon: 'microscope' },
  { label: 'Team Members', value: '30+', icon: 'atom' },
  { label: 'Awards', value: '15+', icon: 'cpu' },
];

const statAccents = [
  { color: 'text-cyan-400', glow: 'from-cyan-500/20', border: 'group-hover:border-cyan-500/30' },
  { color: 'text-emerald-400', glow: 'from-emerald-500/20', border: 'group-hover:border-emerald-500/30' },
  { color: 'text-violet-400', glow: 'from-violet-500/20', border: 'group-hover:border-violet-500/30' },
  { color: 'text-amber-400', glow: 'from-amber-500/20', border: 'group-hover:border-amber-500/30' },
];

const FLOATING_KEYWORDS = [
  'Machine Learning', 'Quantum Computing', 'Neural Networks', 'Biotechnology',
  'Data Science', 'Nanotechnology', 'Robotics', 'Genomics',
  'Deep Learning', 'Computer Vision', 'NLP', 'IoT',
];

/* ── Molecular Network Canvas ───────────────────────────── */
function MolecularNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const nodesRef = useRef<{ x: number; y: number; vx: number; vy: number; r: number; o: number; pulse: number; pulseSpeed: number }[]>([]);
  const timeRef = useRef(0);

  const init = useCallback((canvas: HTMLCanvasElement) => {
    const isMobile = canvas.offsetWidth < 640;
    const count = isMobile ? 35 : 90;
    nodesRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 2 + 0.5,
      o: Math.random() * 0.5 + 0.2,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: 0.01 + Math.random() * 0.02,
    }));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * devicePixelRatio;
      canvas.height = canvas.offsetHeight * devicePixelRatio;
      ctx.scale(devicePixelRatio, devicePixelRatio);
      init(canvas);
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);
      const pts = nodesRef.current;
      timeRef.current += 0.005;

      for (const p of pts) {
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += p.pulseSpeed;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
      }

      // connections with multi-color depth
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 160) {
            const alpha = (1 - dist / 160) * 0.15;
            const hue = (i + j) % 3 === 0 ? '139,92,246' : (i + j) % 3 === 1 ? '59,130,246' : '6,182,212';
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(${hue},${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // pulsing nodes
      for (const p of pts) {
        const glow = 0.3 + Math.sin(p.pulse) * 0.2;
        const r = p.r + Math.sin(p.pulse) * 0.4;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r + 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99,102,241,${glow * 0.08})`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(165,180,252,${p.o + Math.sin(p.pulse) * 0.15})`;
        ctx.fill();
      }

      // energy pulses traveling along connections
      const t = timeRef.current;
      for (let k = 0; k < 5; k++) {
        const idx = Math.floor((t * 30 + k * 17) % pts.length);
        const next = (idx + 1) % pts.length;
        const progress = ((t * 2 + k * 0.4) % 1);
        const px = pts[idx].x + (pts[next].x - pts[idx].x) * progress;
        const py = pts[idx].y + (pts[next].y - pts[idx].y) * progress;
        ctx.beginPath();
        ctx.arc(px, py, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(96,165,250,${0.6 - progress * 0.5})`;
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(draw);
    };
    animationRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [init]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ opacity: 0.5 }}
    />
  );
}

/* ── Animated Counter ───────────────────────────────────── */
function AnimatedCounter({ value }: { value: string }) {
  const numMatch = value.match(/^(\d+)/);
  const suffix = value.replace(/^\d+/, '');
  const target = numMatch ? parseInt(numMatch[1], 10) : 0;
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.5 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started || target === 0) return;
    const duration = 1600;
    const steps = 40;
    const increment = target / steps;
    let current = 0;
    const interval = setInterval(() => {
      current += increment;
      if (current >= target) { setCount(target); clearInterval(interval); }
      else setCount(Math.floor(current));
    }, duration / steps);
    return () => clearInterval(interval);
  }, [started, target]);

  if (!numMatch) return <span ref={ref}>{value}</span>;
  return <span ref={ref}>{count}{suffix}</span>;
}

/* ── Floating Keywords ──────────────────────────────────── */
function FloatingKeywords() {
  const keywords = useMemo(() =>
    FLOATING_KEYWORDS.map((word, i) => ({
      word,
      x: 5 + Math.random() * 85,
      y: 10 + Math.random() * 80,
      duration: 18 + Math.random() * 14,
      delay: i * 1.2,
      size: Math.random() > 0.7 ? 'text-xs' : 'text-[10px]',
    })),
    []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {keywords.map((k, i) => (
        <motion.span
          key={i}
          className={`absolute ${k.size} font-mono text-indigo-300/[0.07] whitespace-nowrap select-none`}
          style={{ left: `${k.x}%`, top: `${k.y}%` }}
          animate={{
            x: [0, 40, -20, 0],
            y: [0, -25, 15, 0],
            opacity: [0, 0.08, 0.05, 0],
          }}
          transition={{
            duration: k.duration,
            delay: k.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {k.word}
        </motion.span>
      ))}
    </div>
  );
}

/* ── Orbiting Ring around logo ──────────────────────────── */
function OrbitRing({ radius, duration, dotCount, color, reverse }: {
  radius: number; duration: number; dotCount: number; color: string; reverse?: boolean;
}) {
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      animate={{ rotate: reverse ? -360 : 360 }}
      transition={{ duration, repeat: Infinity, ease: 'linear' }}
    >
      <div
        className="absolute rounded-full border border-dashed"
        style={{
          width: radius * 2,
          height: radius * 2,
          borderColor: `rgba(${color},0.1)`,
        }}
      />
      {Array.from({ length: dotCount }).map((_, i) => {
        const angle = (i / dotCount) * 360;
        return (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: 4,
              height: 4,
              backgroundColor: `rgba(${color},0.4)`,
              boxShadow: `0 0 6px rgba(${color},0.3)`,
              transform: `rotate(${angle}deg) translateX(${radius}px)`,
              transformOrigin: '0 0',
              left: '50%',
              top: '50%',
            }}
          />
        );
      })}
    </motion.div>
  );
}

/* ── Typing Text Effect ─────────────────────────────────── */
function TypingText({ texts, className }: { texts: string[]; className?: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const text = texts[currentIndex];
    const speed = isDeleting ? 30 : 55;

    if (!isDeleting && displayed === text) {
      const pause = setTimeout(() => setIsDeleting(true), 2500);
      return () => clearTimeout(pause);
    }
    if (isDeleting && displayed === '') {
      setIsDeleting(false);
      setCurrentIndex((prev) => (prev + 1) % texts.length);
      return;
    }

    const timer = setTimeout(() => {
      setDisplayed(
        isDeleting
          ? text.substring(0, displayed.length - 1)
          : text.substring(0, displayed.length + 1)
      );
    }, speed);
    return () => clearTimeout(timer);
  }, [displayed, isDeleting, currentIndex, texts]);

  return (
    <span className={className}>
      {displayed}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
        className="inline-block w-[2px] h-[1em] bg-cyan-400 ml-0.5 align-middle"
      />
    </span>
  );
}

/* ── Stat Icon ──────────────────────────────────────────── */
function StatIcon({ type, className }: { type: string; className?: string }) {
  switch (type) {
    case 'flask': return <FlaskConical className={className} />;
    case 'microscope': return <Microscope className={className} />;
    case 'atom': return <Atom className={className} />;
    case 'cpu': return <Cpu className={className} />;
    default: return <Atom className={className} />;
  }
}

/* ── Hero Section ───────────────────────────────────────── */
export function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [logoUrl, setLogoUrl] = useState('/RIC SAU logo.png');
  const fallbackLogo = '/RIC SAU logo.png';
  const [heroData, setHeroData] = useState<any>({});
  const [heroStats, setHeroStats] = useState(defaultHeroStats);

  // mouse parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });
  const orbX = useTransform(springX, (v) => v * 0.02);
  const orbY = useTransform(springY, (v) => v * 0.02);

  const handleMouse = useCallback((e: React.MouseEvent) => {
    const rect = heroRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  }, [mouseX, mouseY]);

  useEffect(() => {
    fetch('/api/settings?section=general')
      .then(res => res.json())
      .then(data => { if (data.data?.logo) setLogoUrl(data.data.logo); })
      .catch(() => {});

    fetch('/api/content?type=home')
      .then(res => res.json())
      .then(data => {
        if (data.data?.hero) setHeroData(data.data.hero);
        if (data.data?.stats && data.data.stats.length > 0) {
          const icons = ['flask', 'microscope', 'atom', 'cpu'];
          setHeroStats(data.data.stats.map((s: any, i: number) => ({
            label: s.label,
            value: s.value,
            icon: icons[i % icons.length],
          })));
        }
      })
      .catch(() => {});
  }, []);

  const typingTexts = useMemo(() => [
    heroData.subtitle || 'Pioneering Research in Science & Technology',
    'Advancing AI, Machine Learning & Data Science',
    'Building Tomorrow\'s Innovations Today',
    'Empowering Researchers & Innovators Worldwide',
  ], [heroData.subtitle]);

  /* stagger children variants */
  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12, delayChildren: 0.4 } },
  };
  const fadeUp = {
    hidden: { opacity: 0, y: 40, filter: 'blur(10px)' },
    show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const } },
  };
  const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    show: { opacity: 1, scale: 1, transition: { duration: 1, ease: [0.22, 1, 0.36, 1] as const } },
  };

  return (
    <section
      ref={heroRef}
      onMouseMove={handleMouse}
      className="relative min-h-screen flex flex-col items-center overflow-hidden bg-[#020617] pt-20 sm:pt-24 pb-10"
    >
      {/* ── Layered Background ── */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#020617] via-indigo-950/60 to-[#020617]" />
        <div className="hero-grid-overlay absolute inset-0" />
      </div>

      {/* Molecular network */}
      <MolecularNetwork />

      {/* Floating research keywords */}
      <FloatingKeywords />

      {/* Animated gradient orbs — mouse-reactive */}
      <motion.div
        style={{ x: orbX, y: orbY }}
        className="absolute top-1/4 left-[15%] w-[200px] h-[200px] sm:w-[450px] sm:h-[450px] rounded-full hero-orb-blue pointer-events-none"
      />
      <motion.div
        style={{ x: useTransform(orbX, v => -v * 1.2), y: useTransform(orbY, v => -v * 1.2) }}
        className="absolute bottom-1/4 right-[15%] w-[180px] h-[180px] sm:w-[380px] sm:h-[380px] rounded-full hero-orb-purple pointer-events-none"
      />
      <motion.div
        style={{ x: useTransform(orbX, v => v * 0.5), y: useTransform(orbY, v => v * 0.5) }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] sm:w-[550px] sm:h-[550px] rounded-full hero-orb-center pointer-events-none"
      />

      {/* Gradient sweep */}
      <div className="hero-gradient-sweep absolute inset-0 pointer-events-none" />

      {/* Scanline */}
      <div className="hero-scanline absolute inset-0 pointer-events-none" />

      {/* ── Content ── */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
      >
        {/* Logo with orbiting rings */}
        <motion.div variants={scaleIn} className="mb-6 sm:mb-10 flex flex-col items-center justify-center">
          <div className="relative" style={{ width: 'fit-content' }}>
            {/* Orbiting rings — mobile optimized */}
            <div className="sm:hidden">
              <OrbitRing radius={62} duration={14} dotCount={6} color="99,102,241" />
              <OrbitRing radius={78} duration={18} dotCount={5} color="6,182,212" reverse />
            </div>

            {/* Orbiting rings — desktop */}
            <div className="hidden sm:block">
              <OrbitRing radius={110} duration={20} dotCount={8} color="99,102,241" />
              <OrbitRing radius={135} duration={28} dotCount={6} color="6,182,212" reverse />
            </div>

            {/* Glow ring */}
            <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500 opacity-50 blur-lg hero-glow-ring" />

            {/* Logo image */}
            <motion.div
              className="relative w-28 h-28 sm:w-40 sm:h-40 lg:w-48 lg:h-48 rounded-full overflow-hidden ring-2 ring-white/10 bg-slate-900/60 backdrop-blur-md shadow-2xl shadow-indigo-500/20"
              animate={{ scale: [1, 1.03, 1] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="absolute inset-2 rounded-full bg-slate-900/90" />
              <img
                src={logoUrl}
                alt="Research & Innovation Logo"
                className="relative z-10 w-full h-full object-contain p-3 sm:p-4"
                onError={() => setLogoUrl(fallbackLogo)}
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Badge */}
        <motion.div variants={fadeUp} className="mb-5 sm:mb-6">
          <motion.span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 backdrop-blur-sm"
            animate={{ boxShadow: ['0 0 0px rgba(99,102,241,0)', '0 0 20px rgba(99,102,241,0.15)', '0 0 0px rgba(99,102,241,0)'] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
            </span>
            Research &amp; Innovation Centre — SAU
          </motion.span>
        </motion.div>

        {/* Title */}
        <motion.h1
          variants={fadeUp}
          className="text-2xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-[1.1] tracking-tight px-2 sm:px-0"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-white">
            {heroData.title || 'Advancing the Future'}
          </span>
          <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400">
            of Science &amp; Technology
          </span>
        </motion.h1>

        {/* Decorative divider */}
        <motion.div variants={fadeUp} className="flex items-center justify-center gap-3 mb-5 sm:mb-8">
          <motion.div
            className="h-px bg-gradient-to-r from-transparent to-cyan-400/60"
            initial={{ width: 0 }}
            animate={{ width: 80 }}
            transition={{ duration: 1.2, delay: 1.2 }}
          />
          <motion.div
            className="w-2 h-2 rounded-full bg-cyan-400/80"
            animate={{ scale: [1, 1.3, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div
            className="h-px bg-gradient-to-l from-transparent to-violet-400/60"
            initial={{ width: 0 }}
            animate={{ width: 80 }}
            transition={{ duration: 1.2, delay: 1.2 }}
          />
        </motion.div>

        {/* Typing Subtitle */}
        <motion.div
          variants={fadeUp}
          className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-300/80 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed h-[3em] sm:h-[2em] flex items-center justify-center px-2 sm:px-0"
        >
          <TypingText texts={typingTexts} className="font-light" />
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          variants={fadeUp}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
        >
          <Link href="/research">
            <Button
              size="lg"
              className="group relative px-8 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 border-0 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10 flex items-center">
                Explore Research
                <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </span>
              {/* Shimmer */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3 }}
              />
            </Button>
          </Link>

          <Button
            variant="outline"
            size="lg"
            className="group px-8 py-3 bg-white/[0.03] border-white/10 text-white hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300 backdrop-blur-sm"
            onClick={() => {
              const url = heroData.videoUrl || 'https://www.youtube.com/shorts/65lF-4Du3qg?feature=share';
              window.open(url, '_blank');
            }}
          >
            <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
            Watch Demo
          </Button>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          variants={fadeUp}
          className="mt-12 sm:mt-20 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5"
        >
          {heroStats.map((stat, i) => {
            const accent = statAccents[i % statAccents.length];
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 + i * 0.15 }}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                className={`group hero-stat-card relative rounded-xl p-4 sm:p-5 border border-white/[0.06] bg-white/[0.02] backdrop-blur-md overflow-hidden ${accent.border}`}
              >
                {/* Glow on hover */}
                <div className={`absolute inset-0 bg-gradient-to-b ${accent.glow} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                {/* Icon */}
                <div className="relative mb-2 sm:mb-3">
                  <StatIcon type={stat.icon} className={`w-5 h-5 sm:w-6 sm:h-6 ${accent.color} opacity-60 group-hover:opacity-100 transition-opacity`} />
                </div>

                {/* Number */}
                <div className={`relative text-2xl sm:text-3xl md:text-4xl font-bold mb-1 ${accent.color}`}>
                  <AnimatedCounter value={stat.value} />
                </div>

                {/* Label */}
                <div className="relative text-[10px] sm:text-xs text-slate-400 tracking-wider uppercase">{stat.label}</div>

                {/* Top accent line */}
                <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent ${accent.glow.replace('/20', '/40')} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 hidden sm:flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
      >
        <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-4 h-4 text-slate-500" />
        </motion.div>
      </motion.div>
    </section>
  );
}