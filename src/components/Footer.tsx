export default function Footer() {
  return (
    <footer className="py-20 px-8 md:px-16 bg-brand-ink text-brand-cream/60 text-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="text-xl font-serif text-brand-cream">
          Quietly Sorted
        </div>
        
        <div className="flex gap-12 text-xs uppercase tracking-widest">
          <a href="#services" className="hover:text-white transition-colors">Services</a>
          <a href="#about" className="hover:text-white transition-colors">About</a>
          <a href="#contact" className="hover:text-white transition-colors">Contact</a>
        </div>
        
        <div className="font-light">
          &copy; {new Date().getFullYear()} Quietly Sorted. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
