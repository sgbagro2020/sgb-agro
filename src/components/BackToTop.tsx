import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUp, MessageSquare, Phone } from 'lucide-react';
import { COMPANY_INFO } from '../data/agriData';

export const BackToTop: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const whatsappMessage = encodeURIComponent(
    'Hello SGB AGRO INDUSTRIES! I am visiting your website and would like to inquire about agricultural machinery and irrigation systems.'
  );

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-center gap-3">
      {/* Floating WhatsApp Button */}
      <a
        href={`https://wa.me/${COMPANY_INFO.whatsapp}?text=${whatsappMessage}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-3.5 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-xl shadow-green-950/40 hover:scale-110 transition-all duration-300 flex items-center justify-center group relative"
        aria-label="Chat on WhatsApp"
      >
        <MessageSquare className="w-6 h-6" />
        <span className="absolute right-14 bg-slate-900 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md pointer-events-none">
          WhatsApp Us
        </span>
      </a>

      {/* Floating Call Button */}
      <a
        href={`tel:${COMPANY_INFO.phone}`}
        className="p-3.5 rounded-full bg-[#064e3b] hover:bg-[#16a34a] text-white shadow-xl hover:scale-110 transition-all duration-300 flex items-center justify-center group relative md:hidden"
        aria-label="Call Now"
      >
        <Phone className="w-5 h-5" />
      </a>

      {/* Back to top button */}
      <AnimatePresence>
        {visible && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="p-3 rounded-full bg-[#064e3b] hover:bg-[#16a34a] text-white shadow-xl border border-emerald-700/50 hover:scale-110 transition-all"
            aria-label="Scroll back to top"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};
