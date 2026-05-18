import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, CheckCircle, Mail, MapPin } from 'lucide-react';
import emailjs from '@emailjs/browser';
import AnimatedSection from './AnimatedSection';
import { Reveal, Input, Textarea, Label, Button } from './ui';
import { useLocation } from 'react-router-dom';

export default function Contact() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const state = (location as any).state as { message?: string } | null;
  const initialEmail = params.get('email') || '';
  const initialMessage = (state && state.message) || params.get('message') || '';

  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState('');

  const [nameVal, setNameVal] = useState('');
  const [emailVal, setEmailVal] = useState(initialEmail);
  const [messageVal, setMessageVal] = useState(initialMessage);

  useEffect(() => {
    const state = (location as any).state as { message?: string } | null;
    const msg = (state && state.message) || new URLSearchParams(location.search).get('message') || '';
    setMessageVal(msg);
    setEmailVal(new URLSearchParams(location.search).get('email') || '');
    setNameVal('');
    setErrors({});
    setSubmitError('');
    setFormState('idle');
  }, [location.key, location.search, (location as any).state?.message]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const name = nameVal.trim();
    const email = emailVal.trim();
    const message = messageVal.trim();

    const newErrors: Record<string, string> = {};
    if (!name) newErrors.name = 'Please provide your name';
    if (!email || !/\S+@\S+\.\S+/.test(email)) newErrors.email = 'A valid email is required';
    if (!message) newErrors.message = 'Please share your vision';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setFormState('submitting');
    setSubmitError('');

    try {
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      if (!serviceId || !templateId || !publicKey) {
        throw new Error('EmailJS configuration missing. Set VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, and VITE_EMAILJS_PUBLIC_KEY.');
      }

      const resp = await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: name,
          from_email: email,
          reply_to: email,
          message,
          to_email: 'avntae7@gmail.com',
        },
        publicKey
      );
      console.log('EmailJS send response:', resp);

      setNameVal('');
      setEmailVal('');
      setMessageVal('');
      setFormState('success');
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to send your message. Please try again.';
      setFormState('error');
      setSubmitError(errorMsg);
    }
  };

  return (
    <AnimatedSection id="contact" className="py-32 px-6 scroll-mt-32">
      <div className="max-w-6xl mx-auto glass rounded-[3rem] overflow-hidden flex flex-col md:flex-row shadow-2xl border border-[var(--border-primary)]">
        <div className="md:w-5/12 bg-[var(--text-primary)] text-[var(--bg-primary)] p-12 md:p-20 flex flex-col justify-between transition-colors duration-500">
          <div className="relative z-10">
            <Reveal width="100%">
              <h2 className="text-4xl md:text-6xl font-serif mb-10 italic leading-tight">Begin Your <br />Journey</h2>
            </Reveal>
            <p className="opacity-60 font-light mb-16 leading-relaxed text-lg">
              Whether you are looking to hire a visionary or showcase your craft, our concierge team is here to assist.
            </p>

            <div className="space-y-8">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-full bg-[var(--bg-primary)]/5 flex items-center justify-center">
                  <Mail size={20} className="opacity-60" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest opacity-40 font-bold mb-1">Private Inbox</p>
                  <p className="text-lg font-serif">Support@avntae.com</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-full bg-[var(--bg-primary)]/5 flex items-center justify-center">
                  <MapPin size={20} className="opacity-60" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest opacity-40 font-bold mb-1">Global Headquarters</p>
                  <p className="text-lg font-serif italic">Colombo, Sri Lanka</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="md:w-7/12 p-12 md:p-20 relative">
          <AnimatePresence mode="wait">
            {formState === 'success' ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="h-full flex flex-col items-center justify-center text-center space-y-8"
              >
                <div className="w-24 h-24 bg-luxury-accent/10 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle size={48} className="text-luxury-accent" />
                </div>
                <div>
                  <h3 className="text-4xl font-serif mb-4">Message Received</h3>
                  <p className="text-[var(--text-primary)] opacity-40 font-light max-w-sm mx-auto leading-relaxed">
                    Connecting your vision with excellence. Our team will review your submission and reach out within 24 hours.
                  </p>
                </div>
                <Button
                  onClick={() => setFormState('idle')}
                >
                  Send Another Inquiry
                </Button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                className="space-y-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="space-y-4 group">
                  <Label>Full Name</Label>
                  <Input
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Alexander McQueen"
                    value={nameVal}
                    onChange={(e) => setNameVal(e.target.value)}
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && <p className="text-[10px] text-red-500 tracking-widest">{errors.name}</p>}
                </div>

                <div className="space-y-4 group">
                  <Label>Email Address</Label>
                  <Input
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="name@company.com"
                    value={emailVal}
                    onChange={(e) => setEmailVal(e.target.value)}
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && <p className="text-[10px] text-red-500 tracking-widest">{errors.email}</p>}
                </div>

                <div className="space-y-4 group">
                  <Label>Inquiry Details</Label>
                  <Textarea
                    name="message"
                    placeholder="Tell us about your next visionary project..."
                    value={messageVal}
                    onChange={(e) => setMessageVal(e.target.value)}
                    className={errors.message ? 'border-red-500' : ''}
                  />
                  {errors.message && <p className="text-[10px] text-red-500 tracking-widest">{errors.message}</p>}
                </div>

                <Button
                  type="submit"
                  disabled={formState === 'submitting'}
                  className="w-full shadow-luxury-accent/20 shadow-xl"
                >
                  {formState === 'submitting' ? (
                    <div className="flex items-center gap-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-[var(--bg-primary)]/30 border-t-[var(--bg-primary)] rounded-full"
                      />
                      <span>Transmitting</span>
                    </div>
                  ) : (
                    <>Submit Inquiry <Send size={14} className="ml-3" /></>
                  )}
                </Button>

                {formState === 'error' && submitError && (
                  <p className="text-sm text-red-500 tracking-wide leading-relaxed">
                    {submitError}
                  </p>
                )}
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </AnimatedSection>
  );
}
