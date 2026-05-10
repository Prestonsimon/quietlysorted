import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 py-6 px-8 md:px-16 flex justify-between items-center bg-brand-cream/80 backdrop-blur-sm border-b border-brand-ink/5">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-2xl font-serif tracking-tight font-medium"
      >
        Quietly Sorted
      </motion.div>
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="hidden md:flex gap-8 text-sm uppercase tracking-widest font-medium"
      >
        <a href="#services" className="hover:text-brand-accent transition-colors">Services</a>
        <a href="#about" className="hover:text-brand-accent transition-colors">About</a>
        <a href="#contact" className="hover:text-brand-accent transition-colors">Contact</a>
      </motion.div>
    </nav>
  );
}
