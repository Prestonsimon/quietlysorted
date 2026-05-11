import { motion } from 'motion/react';
import { Quote } from 'lucide-react';

export default function Experience() {
  return (
    <section id="experience" className="py-32 px-8 md:px-16 bg-brand-ink text-brand-cream overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-xs uppercase tracking-[0.3em] font-semibold text-brand-accent mb-6 block">My Experience</span>
            <h2 className="text-5xl md:text-6xl font-light leading-tight mb-10">
              Two decades-long, <span className="italic text-brand-muted">proven</span> track record.
            </h2>
            
            <div className="space-y-8 text-brand-cream/80 text-xl font-light leading-relaxed">
              <p>
                With nearly two decades of experience supporting senior executives across private equity, finance, property, senior level executive recruitment, and entrepreneurial businesses, I bring calm, capable support to even the most demanding environments.
              </p>
              <p>
                I’ve seen almost every challenge an executive can face, so very little surprises me. I am not driven by ego or titles, and I have no need to be in the spotlight.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:mt-32"
          >
            <div className="relative p-10 md:p-16 rounded-3xl border border-brand-accent/20 bg-brand-accent/5 backdrop-blur-sm">
              <Quote className="w-12 h-12 text-brand-accent/30 absolute -top-6 -left-6" />
              <p className="text-2xl md:text-3xl font-light italic leading-relaxed text-white">
                "My focus is simply to make your life easier, solve problems before they reach you, and ensure everything runs smoothly and discreetly in the background."
              </p>
              <div className="mt-8 flex items-center gap-4">
                <div className="h-px w-12 bg-brand-accent/40" />
                <span className="text-xs uppercase tracking-widest font-semibold text-brand-muted">Personal Commitment</span>
              </div>
            </div>
            
            <div className="mt-12 grid grid-cols-2 gap-8 invisible md:visible">
              <div className="border-l border-brand-accent/20 pl-6">
                <p className="text-3xl font-light text-white mb-1">20+</p>
                <p className="text-xs uppercase tracking-widest text-brand-muted">Years Experience</p>
              </div>
              <div className="border-l border-brand-accent/20 pl-6">
                <p className="text-3xl font-light text-white mb-1">100%</p>
                <p className="text-xs uppercase tracking-widest text-brand-muted">Confidentiality</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
