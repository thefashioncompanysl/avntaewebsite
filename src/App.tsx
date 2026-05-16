/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Navbar from './components/Navbar';
import Designers from './components/Designers';
import HowItWorks from './components/HowItWorks';
import Portfolio from './components/Portfolio';
import DesignerDetail from './components/DesignerDetail';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Brands from './components/Brands';
import Stats from './components/Stats';
import TermsOfService from './components/TermsOfService';
import PrivacyPolicy from './components/PrivacyPolicy';
import AboutUs from './components/AboutUs';
import PageTransition from './components/PageTransition';
import AdminDashboard from './components/AdminDashboard';
import { motion, useScroll, useSpring, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { ChevronUp, type LucideIcon } from 'lucide-react';
import { Routes, Route, useLocation, Link } from 'react-router-dom';
import { Button } from './components/ui/Button';
import { Reveal } from './components/ui/Reveal';

import {
  ArrowRight,
  Building2,
  CircleUserRound,
  Globe2,
  MessageSquare,
  Rocket,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";

type FeatureCard = {
  icon: LucideIcon;
  title: string;
  text: string;
};

type RouteCard = {
  href: string;
  label: string;
  text: string;
};

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

const featureCards: FeatureCard[] = [
  {
    icon: ShieldCheck,
    title: "Curated Excellence",
    text: "Vetted designer pool ensuring only high-caliber creative talent enters the ecosystem.",
  },
  {
    icon: Globe2,
    title: "Global Network",
    text: "Bridging the gap between international fashion houses and visionary creators worldwide.",
  },
  {
    icon: MessageSquare,
    title: "Fluid Synergy",
    text: "Direct communication channels between brands and talent for seamless creative alignment.",
  },
  {
    icon: Sparkles,
    title: "Aesthetic Integrity",
    text: "Focusing on avant-garde and luxury segments to maintain a premium standard of design.",
  },
];

const routeCards: RouteCard[] = [
  { href: "/", label: "Home", text: "Entry point to the ecosystem" },
  { href: "/designers", label: "Designers", text: "Browse our exclusive roster" },
  { href: "/how-it-works", label: "How it Works", text: "The collaborative process" },
  { href: "/portfolio", label: "Portfolio", text: "Showcase of masterworks" },
  { href: "/contact", label: "Contact", text: "Partner with our agency" },
  { href: "/about", label: "About Us", text: "Our mission and heritage" },
];

const roleCards = [
  {
    icon: UserRound,
    title: "Designers",
    text: "Visionary creators looking to connect with prestigious global fashion houses.",
  },
  {
    icon: Building2,
    title: "Fashion Houses",
    text: "Elite enterprises seeking to discover and collaborate with top-tier talent.",
  },
  {
    icon: CircleUserRound,
    title: "Curators",
    text: "Our internal team managing the selection and matching process for excellence.",
  },
];

const workflow = [
  "Initial discovery and vision submission from brands or talent.",
  "Meticulous curation and matching by our expert agency team.",
  "Collaborative atelier phase with direct creative dialogue.",
  "Final delivery of technical documentation and source files.",
];

function Home() {
  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-6 pt-12 pb-24">
        {/* Hero Section */}
        <section className="relative grid gap-12 lg:grid-cols-[1.25fr_0.75fr] items-center mb-24">
          <div className="pointer-events-none absolute right-[-3rem] top-[-2rem] h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.16)_0%,rgba(255,255,255,0.08)_28%,transparent_70%)] blur-[110px] opacity-70" />
          <div className="pointer-events-none absolute right-[2rem] top-[6rem] h-[18rem] w-[18rem] rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.18)_0%,transparent_68%)] blur-[100px] opacity-60" />
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease }}
            className="relative z-10"
          >
            <Reveal width="100%">
              <h2 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-serif font-bold leading-[1.1] md:leading-[0.9] tracking-tight pr-8">
                Connect with <br />
                <span className="text-gold-gradient">Visionaries</span>
              </h2>
            </Reveal>

            <p className="mt-8 max-w-2xl text-lg leading-relaxed opacity-70">
              AVNTAE is an exclusive ecosystem facilitating connections between global fashion houses and high-caliber creative minds. We curate excellence for the runway.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link to="/designers">
                <Button size="lg" className="w-full sm:w-auto">
                  Explore Roster <ArrowRight size={14} className="ml-3" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Partner with Us
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.85, delay: 0.1, ease }}
            className="relative z-10 rounded-[2.5rem] p-8 border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.04)] backdrop-blur-[72px] backdrop-saturate-[85%] backdrop-grayscale-[35%] shadow-[0_35px_120px_rgba(0,0,0,0.24)] overflow-hidden group"
          >
            <div className="pointer-events-none absolute inset-0 rounded-[2.5rem] bg-[linear-gradient(135deg,rgba(255,255,255,0.28)_0%,rgba(255,255,255,0.12)_18%,rgba(255,255,255,0.04)_48%,transparent_78%)] opacity-65 mix-blend-screen" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_42%),linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.004))] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 backdrop-blur-[96px]" />

            <div className="relative z-10">
              <div className="flex items-center justify-between border-b border-[var(--border-primary)] pb-6 mb-8">
                <div>
                  <p className="text-2xl font-serif">Global & Active</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Elite Talent", value: "500+" },
                  { label: "Partner Houses", value: "120+" },
                  { label: "Masterworks", value: "2.5k" },
                  { label: "Success Rate", value: "100%" },
                ].map((stat) => (
                  <div key={stat.label} className="relative rounded-2xl border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.04)] backdrop-blur-[72px] backdrop-saturate-[80%] backdrop-grayscale-[35%] shadow-[inset_0_1px_0_rgba(255,255,255,0.14)] p-5 overflow-hidden">
                    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.24)_0%,rgba(255,255,255,0.1)_20%,transparent_55%)] opacity-65 mix-blend-screen" />
                    <div className="relative">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40">{stat.label}</p>
                    <p className="mt-2 text-xl md:text-2xl font-serif text-gold-gradient">{stat.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="relative mt-8 overflow-hidden rounded-2xl bg-[rgba(255,255,255,0.035)] border border-[rgba(255,255,255,0.1)] backdrop-blur-[72px] backdrop-saturate-[80%] backdrop-grayscale-[35%] p-6">
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0.08)_20%,transparent_60%)] opacity-60 mix-blend-screen" />
                <div className="relative">
                <p className="text-xs leading-relaxed opacity-60 italic">
                  "Design is the silent ambassador of your brand." — Discover the synergy that defines the modern runway.
                </p>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="mb-32">
          <div className="mb-12">
            <Reveal width="100%">
              <h3 className="mt-4 text-4xl md:text-5xl font-serif italic tracking-tight">Orchestrating Excellence</h3>
            </Reveal>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {featureCards.map((card, index) => (
              <motion.article
                key={card.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.04 }}
                  className="rounded-[2rem] border border-[var(--border-primary)] glass p-8 transition-all duration-500 hover:-translate-y-2 hover:border-luxury-accent/30 group will-change-opt"
              >
                <div className="w-12 h-12 rounded-xl bg-luxury-accent/5 flex items-center justify-center text-luxury-accent mb-8 group-hover:backdrop-blur-lg group-hover:bg-[rgba(255,255,255,0.03)] group-hover:text-[var(--text-primary)] transition-all">
                  <card.icon className="h-6 w-6" />
                </div>
                <h4 className="text-xl font-serif mb-4">{card.title}</h4>
                <p className="text-sm leading-relaxed opacity-50">{card.text}</p>
              </motion.article>
            ))}
          </div>
        </section>

        {/* Workflow & Route Map */}
        <section className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] mb-32">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-[2.5rem] border border-[var(--border-primary)] glass p-8 md:p-10"
          >
            <Reveal width="100%">
              <h3 className="mt-4 text-4xl font-serif mb-8">The Ecosystem Workflow</h3>
            </Reveal>
            <div className="space-y-4">
              {workflow.map((step, index) => (
                <div key={step} className="flex gap-6 rounded-2xl border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.02)] backdrop-blur-2xl p-6 items-start group hover:border-luxury-accent/20 transition-all">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-luxury-accent text-[10px] font-bold text-[var(--bg-primary)]">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <p className="text-sm leading-relaxed opacity-60 group-hover:opacity-100 transition-opacity pt-2">{step}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-[2.5rem] border border-[var(--border-primary)] glass p-8 md:p-10"
          >
            <Reveal width="100%">
              <h3 className="mt-4 text-4xl font-serif mb-8">Navigate the Hub</h3>
            </Reveal>
            <div className="grid gap-4 sm:grid-cols-2">
              {routeCards.map((route) => (
                <Link
                  key={route.href}
                  to={route.href}
                  onClick={(e) => {
                    if (location.pathname === route.href) {
                      e.preventDefault();
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  className="group rounded-2xl border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.02)] backdrop-blur-2xl p-6 transition-all hover:border-luxury-accent/30 hover:backdrop-blur-3xl hover:bg-[rgba(255,255,255,0.03)]"
                >
                  <div className="flex items-center justify-between gap-3 mb-1">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-luxury-accent">{route.label}</p>
                    <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                  </div>
                  <p className="text-xs leading-relaxed opacity-40 group-hover:opacity-70 transition-opacity">{route.text}</p>
                </Link>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Roles Section */}
        <section className="mb-32">
          <div className="mb-12">
            <Reveal width="100%">
              <h3 className="mt-4 text-4xl md:text-5xl font-serif italic tracking-tight">Tailored for Every Connection</h3>
            </Reveal>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {roleCards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.04 }}
                className="relative overflow-hidden rounded-[2rem] border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.04)] backdrop-blur-[56px] backdrop-saturate-[85%] backdrop-grayscale-[30%] p-10 text-center will-change-opt"
              >
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0.05)_26%,transparent_64%)] opacity-55 mix-blend-screen" />
                <div className="relative w-16 h-16 rounded-2xl bg-[rgba(255,255,255,0.04)] backdrop-blur-xl flex items-center justify-center text-luxury-accent mx-auto mb-8">
                  <card.icon className="h-8 w-8" />
                </div>
                <h4 className="relative text-2xl font-serif mb-4">{card.title}</h4>
                <p className="relative text-sm leading-relaxed opacity-50">{card.text}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="rounded-[3rem] border border-luxury-accent/20 bg-gradient-to-br from-luxury-accent/10 via-transparent to-luxury-accent/5 p-10 md:p-16 text-center flex flex-col items-center justify-center">
          <Reveal width="100%" className="flex flex-col items-center justify-center">
            <h3 className="text-4xl md:text-6xl font-serif italic mb-10 max-w-4xl mx-auto text-center">Elevating the standards of creative collaboration</h3>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center w-full">
              <Link to="/contact">
                <Button size="lg">Begin Your Journey</Button>
              </Link>
              <Link to="/portfolio">
                <Button variant="outline" size="lg">Discover Masterpieces</Button>
              </Link>
            </div>
          </Reveal>
        </section>
      </div>

      <Brands />
      <Stats />
    </PageTransition>
  );
}

function DesignersPage() {
  return (
    <PageTransition>
      <Designers />
    </PageTransition>
  );
}

function DesignerDetailPage() {
  return (
    <PageTransition>
      <DesignerDetail />
    </PageTransition>
  );
}

function HowItWorksPage() {
  return (
    <PageTransition>
      <HowItWorks />
    </PageTransition>
  );
}

function PortfolioPage() {
  return (
    <PageTransition>
      <Portfolio />
    </PageTransition>
  );
}

function ContactPage() {
  return (
    <PageTransition>
      <Contact />
    </PageTransition>
  );
}

function AboutUsPage() {
  return (
    <PageTransition>
      <AboutUs />
    </PageTransition>
  );
}

function PrivacyPolicyPage() {
  return (
    <PageTransition>
      <PrivacyPolicy />
    </PageTransition>
  );
}

function TermsOfServicePage() {
  return (
    <PageTransition>
      <TermsOfService />
    </PageTransition>
  );
}

function AdminDashboardPage() {
  return (
    <PageTransition>
      <AdminDashboard />
    </PageTransition>
  );
}

export default function App() {
  const { scrollYProgress, scrollY } = useScroll();
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const location = useLocation();

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, [theme]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 't') {
        e.preventDefault();
        toggleTheme();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2400);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    return scrollY.on('change', (latest) => {
      setShowBackToTop(latest > 500);
    });
  }, [scrollY]);

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className={theme}>
      <div className="bg-[var(--bg-primary)] text-[var(--text-primary)] selection:bg-luxury-accent selection:text-[var(--bg-primary)] min-h-screen transition-colors duration-700">
        <AnimatePresence>
          {isLoading && (
            <motion.div
              key="loader"
              initial={{ opacity: 1 }}
              exit={{
                opacity: 0,
                scale: 1.1,
                transition: { duration: 0.8, ease: [0.65, 0, 0.35, 1] }
              }}
              className="fixed inset-0 z-[100] bg-[var(--bg-primary)] flex flex-col items-center justify-center pointer-events-auto"
            >
              <div className="relative">
                <motion.h1
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="text-4xl md:text-6xl font-serif font-bold tracking-[0.8em] text-[var(--text-primary)]"
                >
                  AVNTAE
                </motion.h1>
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1.8, ease: "easeInOut", delay: 0.2 }}
                  className="h-[1px] w-full bg-luxury-accent absolute -bottom-4 left-0 origin-left"
                />
              </div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="mt-12 text-[10px] uppercase tracking-[0.4em] text-[var(--text-primary)] opacity-30 font-bold"
              >
                Curating Creative Excellence
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div className="scroll-progress z-[60] fixed top-0 left-0 right-0 h-1 bg-luxury-accent origin-left" style={{ scaleX }} />

        {!isLoading && !isAdmin && <Navbar theme={theme} toggleTheme={toggleTheme} />}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoading ? 0 : 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="flex flex-col min-h-screen"
        >
          <main className={`flex-grow ${!isAdmin ? 'pt-24' : ''}`}>
            <AnimatePresence mode="wait">
              {/* @ts-ignore - React Router v7 RoutesProps doesn't explicitly include key, but AnimatePresence requires it */}
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Home />} />
                <Route path="/designers" element={<DesignersPage />} />
                <Route path="/designers/:designerId" element={<DesignerDetailPage />} />
                <Route path="/how-it-works" element={<HowItWorksPage />} />
                <Route path="/portfolio" element={<PortfolioPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/about" element={<AboutUsPage />} />
                <Route path="/privacy" element={<PrivacyPolicyPage />} />
                <Route path="/terms" element={<TermsOfServicePage />} />
                <Route path="/admin" element={<AdminDashboardPage />} />
              </Routes>
            </AnimatePresence>
          </main>
          {!isAdmin && <Footer />}
        </motion.div>

        <AnimatePresence>
          {showBackToTop && !isAdmin && (
            <motion.button
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              onClick={scrollToTop}
              className="fixed bottom-8 right-8 z-[60] w-12 h-12 glass rounded-full flex items-center justify-center text-luxury-accent hover:backdrop-blur-md hover:bg-[rgba(255,255,255,0.03)] hover:text-[var(--text-primary)] transition-all shadow-2xl overflow-hidden shadow-luxury-accent/20"
            >
              <ChevronUp size={24} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
