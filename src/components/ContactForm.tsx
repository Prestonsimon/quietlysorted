import { useState, type FormEvent, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Phone, MapPin, Send, Loader2, ShieldCheck } from 'lucide-react';
import ReCAPTCHA from 'react-google-recaptcha';

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!captchaToken) {
      setStatus('error');
      setMessage('Please verify that you are not a robot.');
      return;
    }

    setStatus('loading');
    
    const formData = new FormData(e.currentTarget);
    const data = {
      ...Object.fromEntries(formData.entries()),
      captchaToken
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (result.success) {
        setStatus('success');
        setMessage(result.message);
        (e.target as HTMLFormElement).reset();
        recaptchaRef.current?.reset();
        setCaptchaToken(null);
      } else {
        setStatus('error');
        setMessage(result.message || 'Something went wrong. Please try again.');
        recaptchaRef.current?.reset();
        setCaptchaToken(null);
      }
    } catch (err) {
      setStatus('error');
      setMessage('Failed to send message. Please check your connection.');
      recaptchaRef.current?.reset();
      setCaptchaToken(null);
    } finally {
      setTimeout(() => {
        if (status !== 'loading') setStatus('idle');
      }, 5000);
    }
  };

  const handleCaptchaChange = (token: string | null) => {
    setCaptchaToken(token);
    if (status === 'error' && token) {
      setStatus('idle');
      setMessage('');
    }
  };

  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY || 'YOUR_SITE_KEY_PLACEHOLDER';

  return (
    <section id="contact" className="py-32 px-8 md:px-16 bg-white">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-24">
        <div className="lg:w-1/3">
          <span className="text-xs uppercase tracking-[0.3em] font-semibold text-brand-accent mb-4 block">Get in touch</span>
          <h2 className="text-5xl font-light mb-12">Let's <span className="italic text-brand-muted">quietly sort</span> your future.</h2>
          
          <div className="space-y-8">
            <div className="flex items-center gap-6 group">
              <div className="w-12 h-12 rounded-full border border-brand-ink/10 flex items-center justify-center group-hover:border-brand-accent transition-colors">
                <Phone className="w-5 h-5 text-brand-accent" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-brand-muted mb-1 font-semibold">Phone</p>
                <p className="text-lg">+44 (0) 123 456 789</p>
              </div>
            </div>

            <div className="flex items-center gap-6 group">
              <div className="w-12 h-12 rounded-full border border-brand-ink/10 flex items-center justify-center group-hover:border-brand-accent transition-colors">
                <MapPin className="w-5 h-5 text-brand-accent" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-brand-muted mb-1 font-semibold">Location</p>
                <p className="text-lg">St Helier, Jersey</p>
              </div>
            </div>
            
            <div className="pt-8 border-t border-brand-ink/5">
              <div className="flex items-start gap-4 text-brand-muted text-sm leading-relaxed">
                <ShieldCheck className="w-5 h-5 text-brand-accent shrink-0 mt-0.5" />
                <p>We respect your privacy. Your information is only used to respond to your inquiry and will never be shared with third parties.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:w-2/3 bg-brand-cream p-12 md:p-16 rounded-[40px]">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label htmlFor="name" className="text-xs uppercase tracking-widest font-semibold ml-1">Full Name</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  required
                  placeholder="John Doe"
                  className="w-full bg-white border border-brand-ink/5 rounded-2xl p-4 focus:ring-2 focus:ring-brand-accent/20 outline-none transition-shadow"
                />
              </div>
              <div className="space-y-3">
                <label htmlFor="email" className="text-xs uppercase tracking-widest font-semibold ml-1">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  required
                  placeholder="john@example.com"
                  className="w-full bg-white border border-brand-ink/5 rounded-2xl p-4 focus:ring-2 focus:ring-brand-accent/20 outline-none transition-shadow"
                />
              </div>
            </div>
            
            <div className="space-y-3">
              <label htmlFor="message" className="text-xs uppercase tracking-widest font-semibold ml-1">How can we help?</label>
              <textarea 
                id="message" 
                name="message" 
                rows={5} 
                required
                placeholder="Tell us about your challenges..."
                className="w-full bg-white border border-brand-ink/5 rounded-2xl p-4 focus:ring-2 focus:ring-brand-accent/20 outline-none transition-shadow resize-none"
              ></textarea>
            </div>

            <div className="space-y-6">
              <div className="overflow-hidden rounded-xl">
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={siteKey}
                  onChange={handleCaptchaChange}
                />
              </div>

              <div className="flex flex-col gap-4">
                <button 
                  type="submit" 
                  disabled={status === 'loading'}
                  className="w-full md:w-auto bg-brand-ink text-brand-cream px-12 py-5 rounded-full text-sm uppercase tracking-widest font-medium transition-all hover:bg-brand-accent flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </button>
                
                <AnimatePresence>
                  {status === 'success' && (
                    <motion.p 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-green-600 font-medium text-center md:text-left"
                    >
                      {message}
                    </motion.p>
                  )}
                  {status === 'error' && (
                    <motion.p 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-red-600 font-medium text-center md:text-left"
                    >
                      {message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
