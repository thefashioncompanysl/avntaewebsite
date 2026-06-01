import { Github, Instagram, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="py-20 border-t border-[var(--border-primary)] px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
        <div className="text-center md:text-left space-y-6">
          <Link to="/" className="text-3xl font-serif tracking-widest font-bold text-[var(--text-primary)] block">
            AVNTAE
          </Link>
          <p className="text-[var(--text-primary)] opacity-40 max-w-xs text-sm font-light leading-relaxed">
            The world's premier destination for connecting visionary fashion designers with elite enterprises.
          </p>
          <div className="flex justify-center md:justify-start gap-6 text-[var(--text-primary)] opacity-60">
            <a href="#" className="hover:text-luxury-accent transition-colors"><Instagram size={20} /></a>
            <a href="#" className="hover:text-luxury-accent transition-colors"><Twitter size={20} /></a>
            <a href="#" className="hover:text-luxury-accent transition-colors"><Github size={20} /></a>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-12 text-center md:text-left">
          <div className="space-y-6">
            <ul className="space-y-4 text-xs text-[var(--text-primary)] opacity-50 font-light pt-8">
              <li><Link to="/portfolio" className="hover:text-luxury-accent transition-colors hover:translate-x-1 inline-block transform">Find Portfolios</Link></li>
              <li><Link to="/how-it-works" className="hover:text-luxury-accent transition-colors hover:translate-x-1 inline-block transform">How it Works</Link></li>
              <li><Link to="/portfolio" className="hover:text-luxury-accent transition-colors hover:translate-x-1 inline-block transform">Portfolios</Link></li>
            </ul>
          </div>
          <div className="space-y-6">
            <ul className="space-y-4 text-xs text-[var(--text-primary)] opacity-50 font-light pt-8">
              <li><Link to="/about" className="hover:text-luxury-accent transition-colors hover:translate-x-1 inline-block transform">About Us</Link></li>
              <li><Link to="/" className="hover:text-luxury-accent transition-colors hover:translate-x-1 inline-block transform">Creative Hub</Link></li>
              <li><Link to="/contact" className="hover:text-luxury-accent transition-colors hover:translate-x-1 inline-block transform">Contact</Link></li>
            </ul>
          </div>
          <div className="space-y-6 col-span-2 md:col-span-1">
            <ul className="space-y-4 text-xs text-[var(--text-primary)] opacity-50 font-light pt-8">
              <li><Link to="/privacy" className="hover:text-luxury-accent transition-colors hover:translate-x-1 inline-block transform">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-luxury-accent transition-colors hover:translate-x-1 inline-block transform">Terms of Service</Link></li>
              {/* Admin panel removed */}
            </ul>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-[var(--border-primary)] text-center text-[10px] uppercase tracking-[0.3em] text-[var(--text-primary)] opacity-20 font-bold">
        &copy; {new Date().getFullYear()} AVNTAE. ALL RIGHTS RESERVED.
      </div>
    </footer>
  );
}
