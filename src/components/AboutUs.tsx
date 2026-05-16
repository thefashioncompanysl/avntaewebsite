import { Reveal, Card } from './ui';
import { motion } from 'motion/react';

export default function AboutUs() {
  return (
    <div className="pt-40 pb-20 min-h-screen px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h1 className="text-5xl md:text-7xl font-serif mb-6 text-[var(--text-primary)]">About AVNTAE</h1>
          <div className="h-[1px] w-24 bg-luxury-accent mx-auto mb-8"></div>
          <p className="text-xl text-[var(--text-primary)] opacity-60 font-light max-w-2xl mx-auto">
            Redefining the intersection of high fashion and elite enterprise.
          </p>
        </motion.div>

        <div className="space-y-16">
          <Reveal width="100%">
            <Card className="p-10 md:p-16 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-luxury-accent/5 rounded-full blur-3xl -z-10 transition-colors duration-1000 group-hover:backdrop-blur-xl group-hover:bg-[rgba(255,255,255,0.02)]"></div>
              <h2 className="text-3xl font-serif mb-6 text-[var(--text-primary)]">Our Vision</h2>
              <p className="text-[var(--text-primary)] opacity-70 leading-relaxed mb-6">
                AVNTAE was born from a singular vision: to create a frictionless, highly curated ecosystem where world-class fashion designers can connect directly with global enterprises, luxury houses, and visionary brands. We believe that true creative excellence deserves a platform that matches its quality.
              </p>
              <p className="text-[var(--text-primary)] opacity-70 leading-relaxed">
                We are not just a directory; we are a meticulously vetted network. Every talent on our platform has been reviewed for their extraordinary vision, technical mastery, and ability to push the boundaries of modern fashion.
              </p>
            </Card>
          </Reveal>

          <Reveal width="100%">
            <Card className="p-10 md:p-16 relative overflow-hidden group">
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-luxury-accent/5 rounded-full blur-3xl -z-10 transition-colors duration-1000 group-hover:backdrop-blur-xl group-hover:bg-[rgba(255,255,255,0.02)]"></div>
              <h2 className="text-3xl font-serif mb-6 text-[var(--text-primary)]">The Standard of Excellence</h2>
              <p className="text-[var(--text-primary)] opacity-70 leading-relaxed mb-6">
                Our selection process is famously rigorous. We look beyond basic portfolios, analyzing the conceptual depth, material understanding, and cultural impact of every designer's work. This ensures that when a brand partners with an AVNTAE designer, they are engaging with the absolute pinnacle of industry talent.
              </p>
              <p className="text-[var(--text-primary)] opacity-70 leading-relaxed">
                Whether you are a legacy luxury house looking for fresh direction, or a bold new enterprise seeking an iconic visual identity, AVNTAE provides the bridge to the creators who will define tomorrow's aesthetic.
              </p>
            </Card>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
