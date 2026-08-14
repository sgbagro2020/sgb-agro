import React from 'react';
import { motion } from 'motion/react';
import { Trophy, Award, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { ACHIEVEMENTS, COMPANY_INFO } from '../data/agriData';

export const AchievementsSection: React.FC = () => {
  return (
    <section id="achievements" className="py-24 bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900 text-white relative overflow-hidden">
      {/* Background Image Accent */}
      <div className="absolute inset-0 z-0 opacity-20 mix-blend-overlay">
        <img
          src={COMPANY_INFO.awardImage}
          alt="Elevate Award Background"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold uppercase tracking-widest mb-4 shadow-xl"
          >
            <Trophy className="w-4 h-4 text-amber-400" /> Major Milestones & Excellence
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-light text-white tracking-tight"
          >
            Recognized <span className="font-serif italic font-medium text-[#16a34a]">Excellence</span> & Innovation
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-base sm:text-lg text-emerald-100/80 leading-relaxed"
          >
            Honored for pioneering agricultural technology innovations that transform hill farming productivity in Karnataka.
          </motion.p>
        </div>

        {/* Highlighted Banner */}
        {ACHIEVEMENTS.map((ach) => (
          <motion.div
            key={ach.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-r from-emerald-900/90 via-slate-900/90 to-emerald-950/90 rounded-3xl p-8 sm:p-12 border border-emerald-500/30 shadow-2xl backdrop-blur-xl relative overflow-hidden"
          >
            {/* Top Right Decorative Trophy Glow */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Trophy Emblem */}
              <div className="lg:col-span-4 flex flex-col items-center justify-center text-center p-6 rounded-2xl bg-slate-950/60 border border-emerald-500/20">
                <div className="relative mb-4">
                  <div className="absolute inset-0 rounded-full bg-amber-500/20 blur-xl animate-pulse" />
                  <div className="relative p-6 rounded-full bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 text-slate-950 shadow-2xl">
                    <Trophy className="w-16 h-16" />
                  </div>
                </div>

                <span className="text-xs font-bold text-amber-300 uppercase tracking-widest px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 mb-2">
                  {ach.year}
                </span>

                <h3 className="text-2xl font-black text-white">{ach.title}</h3>
                <p className="text-xs font-bold text-emerald-400 mt-1">{ach.issuer}</p>
              </div>

              {/* Right Content Details */}
              <div className="lg:col-span-8 space-y-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
                    <Sparkles className="w-3.5 h-3.5" /> State Govt Startup Grant Winner
                  </div>
                  <h4 className="text-2xl sm:text-3xl font-extrabold text-white">
                    Official Recognition by Karnataka Innovation & Technology Society (KITS)
                  </h4>
                  <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
                    {ach.description}
                  </p>
                </div>

                {/* Highlights List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-emerald-800/50">
                  {ach.highlights.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="p-1 rounded-full bg-emerald-500/20 text-emerald-400 shrink-0 mt-0.5">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <span className="text-xs sm:text-sm text-slate-200 font-medium">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex items-center gap-2 text-xs text-amber-300/80 font-semibold">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Government of Karnataka Approved Agriculture Tech Manufacturer</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
