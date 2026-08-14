import React, { useState, useEffect } from 'react';
import { Sprout, Phone, Mail, MapPin, Award, ArrowUp, Send, CheckCircle2 } from 'lucide-react';
import { COMPANY_INFO } from '../data/agriData';
import { OFFICIAL_GEAR_LOGO, getSavedLogo } from '../lib/branding';

interface FooterProps {
  onOpenAdminLogin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdminLogin }) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [logoUrl, setLogoUrl] = useState(getSavedLogo());

  useEffect(() => {
    const updateLogo = () => setLogoUrl(getSavedLogo());
    window.addEventListener('sgb_logo_updated', updateLogo);
    return () => window.removeEventListener('sgb_logo_updated', updateLogo);
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setSubscribed(true);
      setNewsletterEmail('');
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-slate-400 text-xs sm:text-sm pt-16 pb-8 border-t border-slate-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 flex items-center justify-center">
                <img src={logoUrl} alt="SGB Agro Industries" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black text-white tracking-tight">
                  SGB AGRO <span className="text-[#16a34a]">INDUSTRIES</span>
                </span>
                <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-widest">
                  Est. 2020 • Koppa, KA
                </span>
              </div>
            </div>

            <p className="text-slate-400 leading-relaxed text-xs sm:text-sm max-w-sm">
              SGB AGRO INDUSTRIES is an Elevate 2024–25 award-winning manufacturer of precision micro-irrigation systems, power tillers, solar water pumps, and custom agricultural implements based in Koppa, Karnataka.
            </p>

            <div className="pt-2 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>Elevate 2024–25 Winner • KITS Recognized</span>
              </span>
              <a
                href="https://www.google.com/maps/place/SGB+AGRO+INDUSTRIES/@13.5392138,75.3671844,17z/data=!3m1!4b1!4m6!3m5!1s0x3bbb14eec826766d:0x2f72f8d3e45eb206!8m2!3d13.5392138!4d75.3697593!16s%2Fg%2F11cn0mjkn_?hl=en&entry=ttu"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-semibold transition-all hover:text-emerald-400"
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                <span>View on Google Maps</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Quick Navigation</h4>
            <ul className="space-y-2.5 font-medium">
              <li><a href="#home" className="hover:text-emerald-400 transition-colors">Home</a></li>
              <li><a href="#about" className="hover:text-emerald-400 transition-colors">About Us</a></li>
              <li><a href="#products" className="hover:text-emerald-400 transition-colors">Products Catalog</a></li>
              <li><a href="#services" className="hover:text-emerald-400 transition-colors">Field Services</a></li>
              <li><a href="#achievements" className="hover:text-emerald-400 transition-colors">Elevate Achievements</a></li>
              <li><a href="#gallery" className="hover:text-emerald-400 transition-colors">Project Gallery</a></li>
              <li><a href="#contact" className="hover:text-emerald-400 transition-colors">Contact Us</a></li>
              <li><a href="#terms" className="hover:text-emerald-400 transition-colors">Terms & Conditions</a></li>
            </ul>
          </div>

          {/* Product Categories */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Product Categories</h4>
            <ul className="space-y-2.5 font-medium">
              <li><a href="#products" className="hover:text-emerald-400 transition-colors">Agricultural Machinery</a></li>
              <li><a href="#products" className="hover:text-emerald-400 transition-colors">Garden Tools</a></li>
              <li><a href="#products" className="hover:text-emerald-400 transition-colors">Agricultural Equipment</a></li>
              <li><a href="#products" className="hover:text-emerald-400 transition-colors">Brush Cutter Accessories</a></li>
              <li><a href="#products" className="hover:text-emerald-400 transition-colors">Brush Cutter Attachments</a></li>
              <li><a href="#products" className="hover:text-emerald-400 transition-colors">Material Handling Equipment</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Agri Tech Newsletter</h4>
            <p className="text-xs text-slate-400 mb-4">
              Subscribe for farm machinery maintenance tips and Karnataka government agricultural subsidy updates.
            </p>

            {subscribed ? (
              <div className="p-3 rounded-xl bg-emerald-950 border border-emerald-500/50 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Subscribed! Thank you for joining.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-[#064e3b] hover:bg-[#16a34a] font-bold text-white text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-green-950/40"
                >
                  <Send className="w-3.5 h-3.5" /> Subscribe Now
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom copyright row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <span>© 2026 SGB AGRO INDUSTRIES. All rights reserved. • Koppa, Karnataka</span>
            <button
              onClick={onOpenAdminLogin}
              className="inline-flex items-center gap-1.5 text-slate-400 hover:text-emerald-400 transition-colors font-bold cursor-pointer bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800 self-start sm:self-auto"
            >
              <span>🔒 Admin Login</span>
            </button>
          </div>

          <div className="flex items-center gap-4">
            <a href="#privacy" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="#terms" className="hover:text-slate-400 transition-colors">Terms & Conditions</a>
            <span>•</span>
            <button onClick={scrollToTop} className="hover:text-emerald-400 transition-colors flex items-center gap-1 font-bold">
              <span>Back To Top</span> <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
