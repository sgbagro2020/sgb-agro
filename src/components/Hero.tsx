import React from 'react';
import { motion } from 'motion/react';
import { Award, ArrowRight, Phone, ChevronDown, CheckCircle2, ShieldCheck } from 'lucide-react';
import { COMPANY_INFO } from '../data/agriData';
import { useLanguage } from '../i18n/LanguageContext';

interface HeroProps {
  onExploreProducts: () => void;
  onContactUs: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreProducts, onContactUs }) => {
  const { t, language } = useLanguage();

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden">
      {/* Parallax Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={COMPANY_INFO.heroImage}
          alt="SGB Agro Industries Farmland"
          className="w-full h-full object-cover object-center scale-100 sm:scale-105 transition-transform duration-1000"
          referrerPolicy="no-referrer"
        />
        {/* Dark Vignette Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/75 to-slate-900/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40" />
      </div>

      {/* Hero Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white w-full text-left">
        <div className="max-w-3xl">


          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-[30px] min-[360px]:text-[34px] min-[390px]:text-[38px] min-[412px]:text-[42px] sm:text-6xl md:text-7xl font-light leading-[1.15] sm:leading-[1.1] tracking-tight text-white font-sans text-left"
          >
            {language === 'en' ? (
              <>
                Empowering <span className="font-serif italic font-medium text-[#16a34a] drop-shadow-md">Farmers</span> <br />
                through <span className="font-extrabold text-white">Innovation.</span>
              </>
            ) : (
              <>
                {t('heroTitle1')} <br />
                <span className="font-serif italic font-medium text-[#16a34a] drop-shadow-md">{t('heroTitleHighlight')}</span>
              </>
            )}
          </motion.h1>



          {/* Key Value Pill Highlights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-6 flex flex-col sm:flex-row sm:flex-wrap gap-y-3 gap-x-6 text-xs sm:text-sm text-slate-200 font-medium text-left items-start sm:items-center"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#16a34a] shrink-0" />
              <span>Koppa, Karnataka Headquarters</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#16a34a] shrink-0" />
              <span>500+ Happy Plantation Farmers</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#16a34a] shrink-0" />
              <span>Hill-Slope Micro-Irrigation</span>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-8 flex flex-col min-[480px]:flex-row items-stretch min-[480px]:items-center gap-3 sm:gap-4 w-full min-[480px]:w-auto"
          >
            <button
              onClick={onExploreProducts}
              className="px-6 py-3.5 min-[360px]:px-8 min-[360px]:py-4 bg-[#064e3b] text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-green-950/50 hover:bg-[#16a34a] transition-all transform hover:-translate-y-1 active:translate-y-0 group text-sm min-[360px]:text-base"
            >
              <span>{t('exploreProducts')}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onContactUs}
              className="px-6 py-3.5 min-[360px]:px-8 min-[360px]:py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl font-bold backdrop-blur-md transition-all flex items-center justify-center gap-2 transform hover:-translate-y-1 active:translate-y-0 text-sm min-[360px]:text-base"
            >
              <Phone className="w-5 h-5 text-[#16a34a]" />
              <span>{t('contactExperts')}</span>
            </button>
          </motion.div>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 cursor-pointer"
        onClick={onExploreProducts}
      >
        <span className="text-[11px] font-semibold tracking-widest text-emerald-300 uppercase">Scroll To Explore</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          className="p-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 shadow-md"
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </motion.div>
    </section>
  );
};

