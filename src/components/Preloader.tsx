import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { OFFICIAL_GEAR_LOGO, getSavedLogo } from '../lib/branding';

interface PreloaderProps {
  onComplete?: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [loading, setLoading] = useState(true);
  const [logoUrl] = useState(getSavedLogo());

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      if (onComplete) onComplete();
    }, 1200);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5, ease: 'easeInOut' } }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-900 text-white"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: [0.8, 1.1, 1], opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            <div className="relative mb-6 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-xl animate-pulse" />
              <img
                src={logoUrl}
                alt="SGB Agro Industries Logo"
                className="relative h-24 w-24 object-contain animate-spin"
                style={{ animationDuration: '8s' }}
              />
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold tracking-wider text-white">
              SGB <span className="text-emerald-400">AGRO</span>
            </h1>
            <p className="mt-1 text-xs md:text-sm text-slate-400 tracking-widest uppercase">
              Industries • Koppa
            </p>

            <div className="mt-6 w-48 h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1, ease: "easeInOut" }}
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-300"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
