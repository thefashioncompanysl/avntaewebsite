import { motion } from 'motion/react';
import AnimatedSection from './AnimatedSection';
import { Reveal, Card } from './ui';

const PORTFOLIO = [
  { id: 1, title: 'Summer Collection 2024', category: 'Luxury Wear', image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop' },
  { id: 2, title: 'Urban Tech-Vibe', category: 'Streetwear', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2040&auto=format&fit=crop' },
  { id: 3, title: 'Eternal Lace', category: 'Bridal', image: 'https://images.unsplash.com/photo-1594552072238-b8a33785b261?q=80&w=1974&auto=format&fit=crop' },
  { id: 4, title: 'Minimalist Structure', category: 'Haute Couture', image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=2070&auto=format&fit=crop' },
  { id: 5, title: 'Silk Cascades', category: 'Evening Wear', image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=2016&auto=format&fit=crop' },
  { id: 6, title: 'Architectural Silhouettes', category: 'Avant-Garde', image: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?q=80&w=1972&auto=format&fit=crop' },
];

export default function Portfolio() {
  return (
    <AnimatedSection id="portfolio" className="py-32 bg-transparent scroll-mt-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div>
            <Reveal delay={0.4} width="100%">
              <h2 className="text-4xl md:text-6xl font-serif italic">Masterpieces</h2>
            </Reveal>
          </div>
          <Reveal delay={0.6}>
            <p className="text-[var(--text-primary)] opacity-40 max-w-sm text-sm font-light leading-relaxed tracking-wide italic border-l border-[var(--border-primary)] pl-6">
              "Design is the silent ambassador of your brand." — Discover a curated selection of our most groundbreaking collaborations.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PORTFOLIO.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
            >
                <Card className="aspect-[4/5] cursor-pointer will-change-opt">
                <div className="relative h-full">
                  <img
                    src={item.image}
                    alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
                    referrerPolicy="no-referrer"
                      loading="lazy"
                      decoding="async"
                  />
                  <div className="absolute inset-0 bg-[rgba(8,3,18,0.08)] opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out flex flex-col justify-end p-10 backdrop-blur-[2px] group-hover:backdrop-blur-xl group-hover:bg-[rgba(8,3,18,0.18)]">
                    <div className="overflow-hidden">
                      <motion.h3
                        className="text-2xl md:text-3xl font-serif text-[var(--text-primary)] transform translate-y-12 group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.2,1,0.3,1)]"
                      >
                        {item.title}
                      </motion.h3>
                    </div>

                    <div className="overflow-hidden mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 delay-500">
                      <span className="text-[8px] uppercase tracking-[0.4em] font-mono font-bold text-[var(--text-primary)]/60 flex items-center gap-2">
                        View Project <div className="w-4 h-[1px] bg-luxury-accent"></div>
                      </span>
                    </div>

                    <motion.div
                      className="w-0 h-[1px] bg-luxury-accent mt-4 group-hover:w-full transition-all duration-1000 delay-300"
                    />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
