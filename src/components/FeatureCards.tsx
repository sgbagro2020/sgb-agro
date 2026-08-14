import React from 'react';
import { motion } from 'motion/react';
import { Factory, Truck, Wrench, ArrowUpRight } from 'lucide-react';
import { FEATURE_CARDS } from '../data/agriData';
import { useLanguage } from '../i18n/LanguageContext';

interface FeatureCardsProps {
  onSelectCategory: (category: string) => void;
}

export const FeatureCards: React.FC<FeatureCardsProps> = ({ onSelectCategory }) => {
  const { t } = useLanguage();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Factory':
        return <Factory className="w-8 h-8 text-emerald-600 group-hover:text-white transition-colors" />;
      case 'Truck':
        return <Truck className="w-8 h-8 text-amber-600 group-hover:text-white transition-colors" />;
      case 'Wrench':
        return <Wrench className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors" />;
      default:
        return <Factory className="w-8 h-8 text-emerald-600 group-hover:text-white transition-colors" />;
    }
  };

  const getCardContent = (id: string) => {
    switch (id) {
      case 'sustainable':
        return { title: t('featDurability'), desc: t('featDurabilityDesc') };
      case 'machinery':
        return { title: t('featEfficiency'), desc: t('featEfficiencyDesc') };
      case 'irrigation':
        return { title: t('featService'), desc: t('featServiceDesc') };
      default:
        return { title: '', desc: '' };
    }
  };

  return (
    <section className="relative z-20 -mt-10 sm:-mt-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {FEATURE_CARDS.map((card, index) => {
          const content = getCardContent(card.id);
          return (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              whileHover={{ y: -8 }}
              onClick={() => {
                if (card.id === 'sustainable') onSelectCategory('Smart Tech');
                else if (card.id === 'machinery') onSelectCategory('Machinery');
                else if (card.id === 'irrigation') onSelectCategory('Irrigation');
              }}
              className="group cursor-pointer bg-white rounded-2xl p-6 sm:p-8 shadow-xl shadow-slate-200/60 border border-slate-100 hover:border-emerald-300 transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
            >
              {/* Top Accent Gradient Bar */}
              <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${card.color}`} />

              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-100/80 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 group-hover:rotate-6">
                    {getIcon(card.icon)}
                  </div>
                  <div className="w-9 h-9 rounded-full bg-slate-100 group-hover:bg-emerald-600 text-slate-400 group-hover:text-white flex items-center justify-center transition-all duration-300">
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>

                <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors mb-3">
                  {content.title}
                </h3>

                <p className="text-sm text-slate-600 leading-relaxed">
                  {content.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-bold text-emerald-700 group-hover:text-emerald-800">
                <span>Explore Solutions</span>
                <span className="text-base group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

