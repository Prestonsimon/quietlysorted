import { motion } from 'motion/react';
import leDonWhitehouse from '../lib/le-don-whitehouse.jpg';

export default function About() {
  return (
    <section id="about" className="py-32 px-8 md:px-16 bg-brand-cream overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
        <motion.div
           initial={{ opacity: 0, x: -50 }}
           whileInView={{ opacity: 1, x: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.8 }}
        >
           <img 
            src={leDonWhitehouse} 
            alt="Le Don Whitehouse" 
            className="rounded-3xl shadow-2xl brightness-95 grayscale hover:grayscale-0 transition-all duration-1000"
            referrerPolicy="no-referrer"
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-xs uppercase tracking-[0.3em] font-semibold text-brand-accent mb-4 block">About Quietly Sorted</span>
          <h2 className="text-5xl font-light leading-tight mb-8">
            Expert support, <span className="italic">discreetly</span> delivered.
          </h2>
          <div className="space-y-6 text-brand-muted text-lg font-light leading-relaxed">
            <p>
              Exceptional support doesn’t need to be visible to your clients, but they will feel the difference. My role is to work quietly in the background, ensuring. 
            </p>
            <p>
              every detail is handled seamlessly and efficiently. Confidentiality is non-negotiable. I handle your business information, personal affairs, client data, and
            </p>
            <p>
              internal processes with absolute discretion and uncompromising privacy. What you share with me remains strictly confidential—always.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
