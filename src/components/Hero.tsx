import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-24 px-8 md:px-16 overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="text-6xl md:text-8xl font-light leading-tight mb-8">
            The art of <span className="italic">quiet</span> efficiency.
          </h1>
          <p className="text-xl text-brand-muted max-w-lg mb-10 leading-relaxed font-light">
            Providing administrative and organizational support so you can focus on what you do best. I drop in, sort out, and support your business with total discretion and quiet efficiency.
          </p>
          <motion.a
            href="#contact"

            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-3 bg-brand-ink text-brand-cream px-8 py-5 rounded-full text-sm uppercase tracking-widest font-medium transition-shadow hover:shadow-xl group"
          >
            Start a Conversation
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.a>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative aspect-[4/5] lg:aspect-square overflow-hidden rounded-3xl"
        >
          <img 
            src="https://picsum.photos/seed/workspace/1200/1500" 
            alt="Organized workspace" 
            className="w-full h-full object-cover grayscale brightness-110"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-brand-accent/10 mix-blend-overlay" />
        </motion.div>
      </div>
      
      {/* Background decoration */}
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-brand-accent/5 rounded-full blur-3xl -z-10" />
    </section>
  );
}
