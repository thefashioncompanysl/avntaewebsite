import { motion } from 'motion/react';
import AnimatedSection from './AnimatedSection';
import { Reveal, Card } from './ui';

const STATS = [
  { label: 'Curation Experts', value: '500+' },
  { label: 'Global Fashion Houses', value: '120+' },
  { label: 'Launch Collaborations', value: '2.5k' },
  { label: 'Design Excellence', value: '100%' },
];

export default function Stats() {
  return (
    <AnimatedSection className="py-40 px-6 border-y border-[var(--border-primary)]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-24">
          {STATS.map((stat, i) => (
            <Card
              key={i}
              className="text-center group relative p-6 md:p-10"
            >
              <div className="absolute inset-0 bg-luxury-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 blur-3xl -z-10 rounded-full group-hover:backdrop-blur-lg group-hover:bg-[rgba(255,255,255,0.02)]"></div>
              <div className="flex justify-center w-full">
                <Reveal delay={i * 0.1} width="100%" className="mx-auto">
                  <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif mb-6 py-6 px-4 leading-tight text-gold-gradient transition-transform duration-700 tracking-normal text-center">
                    {stat.value}
                  </h3>
                </Reveal>
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                viewport={{ once: true }}
                className="flex justify-center"
              >
                <Reveal width="100%" className="mx-auto">
                  <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--text-primary)] opacity-50 font-bold group-hover:opacity-100 transition-all duration-500 max-w-[200px] text-center leading-relaxed">
                    {stat.label}
                  </p>
                </Reveal>
              </motion.div>
            </Card>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
