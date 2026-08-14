import React from 'react';
import { motion } from 'motion/react';
import { SERVICES } from '../data/agriData';
import { Factory, Users, Settings, Truck, Wrench, LifeBuoy, Check, ArrowRight, ShieldCheck } from 'lucide-react';

interface ServicesSectionProps {
  onRequestQuote: () => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onRequestQuote }) => {
  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Factory':
        return <Factory className="w-6 h-6 text-emerald-600" />;
      case 'Users':
        return <Users className="w-6 h-6 text-emerald-600" />;
      case 'Settings':
        return <Settings className="w-6 h-6 text-emerald-600" />;
      case 'Truck':
        return <Truck className="w-6 h-6 text-emerald-600" />;
      case 'Wrench':
        return <Wrench className="w-6 h-6 text-emerald-600" />;
      case 'LifeBuoy':
        return <LifeBuoy className="w-6 h-6 text-emerald-600" />;
      default:
        return <ShieldCheck className="w-6 h-6 text-emerald-600" />;
    }
  };

  return (
    <section id="services" className="py-24 bg-slate-50 relative overflow-hidden">
      {/* Background Decorative Accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-100/40 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-100/80 text-emerald-900 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-emerald-200/80 shadow-xs"
          >
            <span className="flex h-2 w-2 rounded-full bg-emerald-600 animate-pulse"></span>
            End-To-End Support • SGB AGRO INDUSTRIES
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-light text-[#064e3b] tracking-tight leading-tight"
          >
            SGB Agro <span className="font-serif italic font-medium text-[#16a34a]">Services Workflow</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto"
          >
            From durable machinery manufacturing and expert consultation to nationwide delivery, genuine spare parts, and dedicated technical assistance.
          </motion.p>
        </div>

        {/* Workflow Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
          {SERVICES.map((srv, index) => (
            <motion.div
              key={srv.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              whileHover={{ y: -6 }}
              className="bg-white rounded-3xl p-7 border border-slate-200/80 hover:border-emerald-400 shadow-md hover:shadow-xl hover:shadow-emerald-900/10 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
            >
              {/* Subtle top brand highlight bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity" />

              <div>
                {/* Clean Service Icon Badge */}
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 w-fit mb-6 group-hover:bg-emerald-100/80 transition-colors">
                  {getServiceIcon(srv.icon)}
                </div>

                {/* Service Heading */}
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2.5 leading-snug group-hover:text-emerald-800 transition-colors">
                  {srv.title}
                </h3>

                {/* Description */}
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-5">
                  {srv.description}
                </p>

                {/* Highlights List */}
                {srv.details && srv.details.length > 0 && (
                  <ul className="space-y-2 mb-6 pt-3 border-t border-slate-100">
                    {srv.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs font-medium text-slate-700">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-slate-100">
                <button
                  onClick={onRequestQuote}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-600 hover:text-white transition-all flex items-center justify-center gap-2 group/btn cursor-pointer shadow-2xs"
                >
                  <span>Enquire Service</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

