import { motion } from 'motion/react';

export default function TermsOfService() {
  return (
    <div className="pt-40 pb-20 min-h-screen px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-serif mb-6 text-[var(--text-primary)]">Terms of Service</h1>
          <div className="h-[1px] w-24 bg-luxury-accent mb-8"></div>
                              <p className="text-[var(--text-primary)] opacity-50 text-sm uppercase tracking-widest font-bold">Last Updated: May 2026</p>
        </motion.div>

        <div className="space-y-12 text-[var(--text-primary)] opacity-80 leading-relaxed font-light">
          <section>
            <h2 className="text-2xl font-serif mb-4 text-luxury-accent">1. Acceptance of Terms</h2>
            <p>
              By accessing or using the AVNTAE platform, you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not access or use our services. These terms constitute a legally binding agreement between you and AVNTAE.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif mb-4 text-luxury-accent">2. Platform Rules & Vetting</h2>
            <p className="mb-4">
              AVNTAE is an exclusive, curated platform. We reserve the right to accept, reject, or remove any designer or enterprise from the platform at our sole discretion.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>You must provide accurate, current, and complete information.</li>
              <li>You must maintain the security of your account credentials.</li>
              <li>You must only submit original work for which you hold the intellectual property rights.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif mb-4 text-luxury-accent">3. Intellectual Property</h2>
            <p>
              Designers retain all ownership rights to the portfolios and materials they upload to AVNTAE. By uploading content, you grant AVNTAE a worldwide, non-exclusive license to display, reproduce, and distribute your content strictly within the platform for the purpose of connecting you with enterprises.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif mb-4 text-luxury-accent">4. Professional Conduct</h2>
            <p>
              Users must conduct themselves professionally. Any form of harassment, unauthorized scraping of data, circumvention of platform communication channels, or violation of confidentiality agreements will result in immediate termination of your account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif mb-4 text-luxury-accent">5. Limitation of Liability</h2>
            <p>
              AVNTAE serves solely as a connection platform. We are not a party to any contracts, agreements, or employment relationships formed between designers and enterprises. We are not responsible for the actions, omissions, or performance of any user on the platform.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
