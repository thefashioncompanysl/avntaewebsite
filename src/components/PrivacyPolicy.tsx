import { motion } from 'motion/react';

export default function PrivacyPolicy() {
  return (
    <div className="pt-40 pb-20 min-h-screen px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-serif mb-6 text-[var(--text-primary)]">Privacy Policy</h1>
          <div className="h-[1px] w-24 bg-luxury-accent mb-8"></div>
                              <p className="text-[var(--text-primary)] opacity-50 text-sm uppercase tracking-widest font-bold">Last Updated: May 2026</p>
        </motion.div>

        <div className="space-y-12 text-[var(--text-primary)] opacity-80 leading-relaxed font-light">
          <section>
            <h2 className="text-2xl font-serif mb-4 text-luxury-accent">1. Information We Collect</h2>
            <p className="mb-4">
              At AVNTAE, we collect information that you provide directly to us when you create an account, submit a portfolio, or communicate with us. This may include your name, email address, professional credentials, portfolio materials, and any other information you choose to provide.
            </p>
            <p>
              We also automatically collect certain information about your device and how you interact with our platform, including IP addresses, browser types, operating systems, and usage patterns to improve our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif mb-4 text-luxury-accent">2. How We Use Your Information</h2>
            <p className="mb-4">
              We use the information we collect to operate, maintain, and provide the features and functionality of the AVNTAE platform. This includes:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Facilitating connections between designers and enterprises.</li>
              <li>Reviewing and vetting portfolio submissions.</li>
              <li>Communicating with you regarding platform updates, security alerts, and administrative messages.</li>
              <li>Personalizing your experience on the platform.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif mb-4 text-luxury-accent">3. Information Sharing</h2>
            <p>
              We do not sell your personal information. We may share your professional profile and portfolio materials with vetted enterprise partners solely for the purpose of facilitating professional connections, as intended by the platform. We may also share information with third-party service providers who assist us in operating our platform, subject to strict confidentiality agreements.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif mb-4 text-luxury-accent">4. Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your personal information and intellectual property. However, no method of transmission over the internet or electronic storage is entirely secure, and we cannot guarantee absolute security.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
