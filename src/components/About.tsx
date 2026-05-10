import { motion } from 'motion/react';

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
            src="https://picsum.photos/seed/about/1000/1200" 
            alt="Professional environment" 
            className="rounded-3xl shadow-2xl brightness-95"
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
            Expert support, <span className="italic">unobtrusively</span> delivered.
          </h2>
          <div className="space-y-6 text-brand-muted text-lg font-light leading-relaxed">
            <p>
              Quietly Sorted was born from a simple observation: Small businesses often have big ideas but get bogged down in the small tasks. 
            </p>
            <p>
              We provide the missing link—a professional, efficient, and approachable partner that drops in when you need it most. Whether it’s a one-off organizational overhaul or ongoing administrative support, we handle the logistics so you can handle the vision.
            </p>
            <p>
              Professionalism doesn't have to be loud. We pride ourselves on being the steady hand behind the scenes that keeps everything moving forward smoothly.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
