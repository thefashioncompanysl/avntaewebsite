import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui';

interface NavbarProps {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

export default function Navbar({ theme, toggleTheme }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'How it Works', href: '/how-it-works' },
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 border-b ${scrolled ? 'glass-dark py-4 shadow-2xl border-[var(--border-primary)]' : 'bg-transparent py-8 border-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Link
          to="/"
          onClick={(e) => {
            if (location.pathname === '/') {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          className="text-2xl font-serif tracking-widest font-bold text-[var(--text-primary)] group"
        >
          AVN<span className="group-hover:text-luxury-accent transition-colors">T</span>AE
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.href || (link.href !== '/' && location.pathname.startsWith(link.href));
            return (
              <Link
                key={link.name}
                to={link.href}
                onClick={(e) => {
                  if (location.pathname === link.href) {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                className={`text-[10px] uppercase tracking-[0.3em] font-bold transition-all relative py-2 ${isActive ? 'text-luxury-accent' : 'text-[var(--text-primary)] opacity-40 hover:opacity-100'
                  }`}
              >
                {link.name}
                {isActive && (
                  <motion.div
                    layoutId="navUnderline"
                    className="absolute -bottom-1 left-0 w-full h-[1px] bg-luxury-accent"
                  />
                )}
              </Link>
            )
          })}

          <Button
            type="button"
            variant="ghost"
            className="group h-10 w-10 p-0 rounded-full text-luxury-accent border-[var(--border-primary)] bg-[var(--text-primary)]/6 hover:backdrop-blur-sm hover:bg-[rgba(255,255,255,0.08)] hover:text-[var(--text-primary)] relative flex items-center justify-center"
            onClick={toggleTheme}
            title="Toggle Theme (Ctrl/Cmd + T)"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-4 md:hidden">
          <Button
            type="button"
            variant="ghost"
            className="w-10 h-10 p-0 rounded-full text-luxury-accent border-[var(--border-primary)] bg-[var(--text-primary)]/6"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="p-0 text-[var(--text-primary)] opacity-70 hover:opacity-100"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            exit={{ opacity: 0, scaleY: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className={`md:hidden overflow-hidden origin-top absolute top-full left-0 w-full border-b border-[var(--border-primary)] ${scrolled ? 'glass-dark' : 'bg-[var(--bg-primary)] shadow-2xl'
              }`}
          >
            <div className="flex flex-col items-center py-12 gap-8">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.href || (link.href !== '/' && location.pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.name}
                    to={link.href}
                    onClick={(e) => {
                      setIsOpen(false);
                      if (location.pathname === link.href) {
                        e.preventDefault();
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}
                    className={`text-lg uppercase tracking-[0.4em] font-light transition-all ${isActive ? 'text-luxury-accent' : 'text-[var(--text-primary)] opacity-40 hover:opacity-100'
                      }`}
                  >
                    {link.name}
                  </Link>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
