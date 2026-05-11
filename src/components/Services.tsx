import { motion } from 'motion/react';
import { ClipboardCheck, Calendar, Users, LayoutDashboard } from 'lucide-react';

const services = [
  {
    title: "Administration",
    description: "Taking the weight of paperwork and day-to-day admin tasks off your shoulders.",
    icon: Calendar
  },
  {
    title: "Business Support",
    description: "A flexible partner to drop in and assist whenever you and/or your team needs an extra set of hands. Able to mould to your business style, establish relationships fast and maintain networks to ensure effective support across the board",
    icon: Users
  },
  {
    title: "Organization",
    description: "Decluttering digital and physical spaces to create a clear environment for productivity. Identify what needs finalising and how to do so to get it across the finish line and off the todo list",
    icon: ClipboardCheck
  },
  {
    title: "Project Support",
    description: "Coordinating logistics and keeping your projects on track from start to finish. Not afraid to speak up in new spaces and push to achieve clear deadlines. ",
    icon: LayoutDashboard
  }
];

export default function Services() {
  return (
    <section id="services" className="py-32 px-8 md:px-16 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
          <div className="max-w-2xl">
            <span className="text-xs uppercase tracking-[0.3em] font-semibold text-brand-accent mb-4 block">What I do</span>
            <h2 className="text-5xl md:text-6xl font-light leading-tight">
              Quietly sorting the details <span className="italic">behind the scenes.</span>
            </h2>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          {services.map((service, index) => (
            <motion.div 
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className="w-12 h-12 bg-brand-cream rounded-2xl flex items-center justify-center mb-8 group-hover:bg-brand-accent group-hover:text-brand-cream transition-colors duration-500">
                <service.icon className="w-6 h-6 stroke-[1.5]" />
              </div>
              <h3 className="text-2xl font-serif mb-4">{service.title}</h3>
              <p className="text-brand-muted leading-relaxed font-light">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
