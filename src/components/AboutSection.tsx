import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, MapPin, Calendar, CheckCircle2, X, Sparkles, Factory, ArrowRight } from 'lucide-react';
import { COMPANY_INFO } from '../data/agriData';
import { useLanguage } from '../i18n/LanguageContext';

export const AboutSection: React.FC = () => {
  const [showDetailModal, setShowDetailModal] = useState(false);
  const { t } = useLanguage();

  const [winnerPhoto] = useState<string>(() => {
    return localStorage.getItem('sgb_winner_recognition_photo') || COMPANY_INFO.aboutImage;
  });
  const [notification] = useState<string | null>(null);

  return (
    <section id="about" className="py-20 bg-slate-50 relative overflow-hidden">
      {/* Background Subtle Grid Accent */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-60 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-green-200"
          >
            <span className="flex h-2 w-2 rounded-full bg-[#16a34a]"></span>
            {t('aboutBadge')}
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-light text-[#064e3b] tracking-tight leading-tight"
          >
            {t('aboutTitle')} <span className="font-serif italic font-medium text-[#16a34a]">{t('aboutTitleHighlight')}</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed"
          >
            {t('aboutSubtitle')}
          </motion.p>
        </div>

        {/* Content Layout - Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Image & Key Stats Showcase */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <img
                src={winnerPhoto}
                alt="SGB Agro Industries Winner Recognition"
                className="w-full h-[400px] sm:h-[480px] object-cover hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

              {/* Floating Badge on Image */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-xl flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-md">
                    <Award className="w-8 h-8" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block">Winner Recognition</span>
                    <p className="text-sm font-black text-slate-900">
                      Elevate 2024–25 Govt. of Karnataka (KITS)
                    </p>
                  </div>
                </div>
              </div>
            </div>



            {/* Accent Decorative Elements */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          </motion.div>

          {/* Text & Feature Points */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 flex flex-col justify-center"
          >
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-medium block">Established</span>
                  <span className="text-lg font-bold text-slate-900">Year 2020</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-medium block">Headquarters</span>
                  <span className="text-lg font-bold text-slate-900">Koppa, KA</span>
                </div>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              Engineered specifically for steep hill slopes, heavy rainfall, and multi-crop farms.
            </h3>

            <p className="text-slate-600 leading-relaxed mb-6">
              SGB AGRO INDUSTRIES was established with a singular mission: to eliminate the labor bottlenecks and water wastage experienced by farmers in Karnataka’s plantation belt. Through locally tested engineering, robust fabrication, and smart IoT-enabled controllers, we empower smallholders and estate owners to double efficiency while conserving vital natural resources.
            </p>

            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3 text-slate-700 text-sm font-medium">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Award-winning startup recognized by Karnataka Innovation & Technology Society (KITS).</span>
              </li>
              <li className="flex items-start gap-3 text-slate-700 text-sm font-medium">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span>State-of-the-art manufacturing workshop located right in Koppa Rural.</span>
              </li>
              <li className="flex items-start gap-3 text-slate-700 text-sm font-medium">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Over 500+ satisfied coffee, arecanut, cardamom, and spice planters across Western Ghats.</span>
              </li>
            </ul>

            <div>
              <button
                onClick={() => setShowDetailModal(true)}
                className="px-8 py-4 bg-[#064e3b] text-white rounded-xl font-bold text-sm hover:bg-[#16a34a] shadow-lg shadow-green-900/20 transition-all flex items-center gap-2 group"
              >
                <span>{t('readMore')}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Read More Modal */}
      <AnimatePresence>
        {showDetailModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative border border-slate-200"
            >
              <button
                onClick={() => setShowDetailModal(false)}
                className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-700">
                  <Factory className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">Company Story</span>
                  <h3 className="text-2xl font-black text-slate-900">SGB AGRO INDUSTRIES</h3>
                </div>
              </div>

              <div className="prose prose-emerald text-slate-600 text-sm leading-relaxed space-y-4 my-6">
                <p className="font-semibold text-slate-800 text-base">
                  "Building sustainable technology rooted in the soil of Karnataka."
                </p>
                <p>
                  SGB AGRO INDUSTRIES was established in 2020 in Koppa, Chikkamagaluru district — the heartland of Karnataka's agricultural and plantation region. Recognizing that generic imported farm machinery often fails in the rugged, sloped topography of the Malnad region, SGB set out to engineer customized solutions built specifically for local soil and crop dynamics.
                </p>
                <p>
                  Our product engineering encompasses precision micro-drip irrigation, solar-powered high-head water pumps, hill-slope power tillers, and automated fertigation systems. We take pride in maintaining 100% in-house manufacturing standards, ensuring every bolt, weld, and sensor meets rigorous durability benchmarks.
                </p>
                <p>
                  In 2024, SGB Agro Industries received top honors as a winner of the prestigious ELEVATE 2024-25 startup grant program, conducted by the Karnataka Innovation and Technology Society (KITS), Department of IT, Bt and S&T, Government of Karnataka.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-medium flex items-center justify-between">
                <span>Location: Koppa Rural, Karnataka 577126</span>
                <span className="font-bold">Phone: 08277009667</span>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-6 py-2.5 rounded-xl font-bold text-xs bg-slate-900 text-white hover:bg-slate-800 transition-colors"
                >
                  Close Window
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 bg-[#064e3b] text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-emerald-400/40 flex items-center gap-3"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="text-xs sm:text-sm font-bold">{notification}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

