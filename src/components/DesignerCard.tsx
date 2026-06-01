import { motion } from 'motion/react';
import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { Designer } from '../types';
import { Badge } from './ui';

interface DesignerCardProps {
  designer: Designer;
  index: number;
}

const DesignerCard: FC<DesignerCardProps> = ({ designer, index }) => {
  return (
    <Link to={`/portfolio`} className="group flex flex-col h-full">
        <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.04, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true }}
        className="flex flex-col h-full will-change-opt"
      >
        <div className="relative aspect-[3/4] mb-6 overflow-hidden rounded-2xl bg-[var(--text-primary)]/5 shadow-2xl">
          <img
            src={designer.image || 'https://via.placeholder.com/900x1200?text=Designer'}
            alt={designer.name}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            referrerPolicy="no-referrer"
            loading="lazy"
            decoding="async"
            onError={(e) => {
              const target = e.currentTarget;
              target.onerror = null;
              target.src = 'https://via.placeholder.com/900x1200?text=Designer';
            }}
          />
          <div className="designer-card-hover-overlay absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8 backdrop-blur-sm">
            <span className="text-[var(--text-primary)] text-[10px] font-mono font-bold tracking-[0.3em] uppercase translate-y-4 group-hover:translate-y-0 transition-transform">
              View Portfolio
            </span>
          </div>
          {/* Category badge */}
          <Badge className="absolute top-4 right-4 bg-[var(--bg-primary)]/70 text-[var(--text-primary)] border-[var(--border-primary)] text-[10px] uppercase tracking-[0.2em] px-3 py-1.5 backdrop-blur-md">
            {designer.category}
          </Badge>
        </div>
        <h3 className="text-xl font-serif mb-2">{designer.name}</h3>
        <div className="text-luxury-accent text-xs font-bold uppercase tracking-[0.1em] mb-3">
          {designer.specialization}
        </div>
        <p className="text-[var(--text-primary)] opacity-55 text-sm font-light leading-relaxed mb-6 line-clamp-3 group-hover:opacity-100 transition-opacity duration-700">
          {designer.bio}
        </p>
      </motion.div>
    </Link>
  );
};

export default DesignerCard;
