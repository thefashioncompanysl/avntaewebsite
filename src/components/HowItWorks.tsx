import { motion } from 'motion/react';
import { Sparkles, MessageSquare, Briefcase, CheckCircle } from 'lucide-react';
import AnimatedSection from './AnimatedSection';
import { Reveal, Card } from './ui';

const STEPS = [
  { id: 1, title: 'Vision Submission', description: 'Enter our ecosystem by sharing your creative requirements and project scope.', icon: MessageSquare },
  { id: 2, title: 'Couture Matching', description: 'Our algorithms and curation experts hand-pick the most compatible design talent.', icon: Sparkles },
  { id: 3, title: 'Live Atelier', description: 'Access a private digital space for direct dialogue, sketching, and iterative feedback.', icon: Briefcase },
  { id: 4, title: 'Masterpiece Delivery', description: 'Receive high-fidelity source files and technical documentation ready for the runway.', icon: CheckCircle },
];

export default function HowItWorks() {
  return (
    <AnimatedSection id="how-it-works" className="py-40 border-y border-[var(--border-primary)] scroll-mt-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
          <div className="max-w-2xl">
            <Reveal delay={0.4} width="100%">
              <h2 className="text-4xl sm:text-5xl md:text-7xl font-serif italic leading-tight">Orchestrating <br />Excellence</h2>
            </Reveal>
          </div>
          <Reveal delay={0.6}>
            <p className="text-[var(--text-primary)] opacity-60 max-w-sm text-sm font-light leading-relaxed tracking-wide border-l border-[var(--border-primary)] pl-8 mb-4">
              We have redefined the synergy between global brands and avant-garde creators, ensuring every collaboration is a masterstroke.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {STEPS.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: index * 0.05 }}
            >
              <Card className="relative h-full">
                <div className="p-10 relative z-10">
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    <step.icon size={120} strokeWidth={0.5} />
                  </div>

                  <div className="w-14 h-14 bg-luxury-accent/5 rounded-2xl flex items-center justify-center mb-10 text-luxury-accent group-hover:backdrop-blur-md group-hover:bg-[rgba(255,255,255,0.02)] group-hover:text-[var(--text-primary)] transition-all duration-400 will-change-opt">
                    <step.icon size={24} />
                  </div>
                  <h3 className="text-2xl font-serif mb-4 flex items-center gap-4 group-hover:translate-x-2 transition-transform duration-700">
                    <span className="text-[10px] font-mono font-bold text-luxury-accent/60 bg-luxury-accent/5 w-8 h-8 rounded-full flex items-center justify-center -ml-2">{String(step.id).padStart(2, '0')}</span>
                    {step.title}
                  </h3>
                  <p className="text-[var(--text-primary)] opacity-40 text-sm font-light leading-relaxed group-hover:opacity-70 transition-opacity duration-700">
                    {step.description}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
