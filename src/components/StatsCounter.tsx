import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { STATS } from '../data/agriData';
import { Users, CheckCircle2, Layers, Calendar } from 'lucide-react';

export const StatsCounter: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section ref={ref} className="py-12 bg-[#f8fafc] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-white p-8 sm:p-10 rounded-[2.5rem] border border-slate-100 shadow-lg grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {STATS.map((stat, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${idx > 0 ? 'lg:border-l lg:border-slate-100 lg:pl-8' : ''}`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-[#16a34a] font-bold">
                  {idx === 0 && <Users className="w-5 h-5" />}
                  {idx === 1 && <CheckCircle2 className="w-5 h-5" />}
                  {idx === 2 && <Layers className="w-5 h-5" />}
                  {idx === 3 && <Calendar className="w-5 h-5" />}
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold text-[#064e3b] tracking-tight">
                  <Counter target={stat.value} isVisible={isInView} />
                  <span className="text-[#16a34a]">{stat.suffix}</span>
                </div>
              </div>

              <div className="text-xs sm:text-sm text-slate-500 uppercase font-semibold tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Counter: React.FC<{ target: number; isVisible: boolean }> = ({ target, isVisible }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    let start = 0;
    const duration = 1800; // ms
    const increment = target / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [isVisible, target]);

  return <span>{count}</span>;
};
