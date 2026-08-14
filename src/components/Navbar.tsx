import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sprout, Phone, Menu, X, Award, ChevronRight, ShoppingCart } from 'lucide-react';
import { COMPANY_INFO } from '../data/agriData';
import { getSavedLogo } from '../lib/branding';
import { useLanguage } from '../i18n/LanguageContext';
import { LanguageSelector } from './LanguageSelector';

interface NavbarProps {
  onOpenQuoteModal: () => void;
  onOpenCart: () => void;
  currentBlogId?: string | null;
  onBlogIdChange?: (id: string | null) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onOpenQuoteModal, 
  onOpenCart,
  currentBlogId,
  onBlogIdChange
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [logoUrl, setLogoUrl] = useState<string>(getSavedLogo());
  const { language, t } = useLanguage();

  useEffect(() => {
    const handleLogoSync = () => {
      setLogoUrl(getSavedLogo());
    };
    window.addEventListener('sgb_logo_updated', handleLogoSync);
    return () => window.removeEventListener('sgb_logo_updated', handleLogoSync);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      const sections = ['home', 'about', 'products', 'services', 'achievements', 'gallery', 'blog', 'contact', 'terms'];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent background body scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navItems = [
    { label: t('navHome'), href: '#home', id: 'home' },
    { label: t('navAbout'), href: '#about', id: 'about' },
    { label: t('navProducts'), href: '#products', id: 'products' },
    { label: t('navServices'), href: '#services', id: 'services' },
    { label: t('navAchievements'), href: '#achievements', id: 'achievements' },
    { label: t('navGallery'), href: '#gallery', id: 'gallery' },
    { label: t('navBlog') || 'Blog', href: '#blog', id: 'blog' },
    { label: t('navContact'), href: '#contact', id: 'contact' },
    { label: t('navTerms'), href: '#terms', id: 'terms' }
  ];

  const mobileNavItems = [
    { label: language === 'en' ? 'Home' : t('navHome'), href: '#home', id: 'home' },
    { label: language === 'en' ? 'About Us' : t('navAbout'), href: '#about', id: 'about' },
    { label: language === 'en' ? 'Products' : t('navProducts'), href: '#products', id: 'products' },
    { label: language === 'en' ? 'Services' : t('navServices'), href: '#services', id: 'services' },
    { label: language === 'en' ? 'Achievements' : t('navAchievements'), href: '#achievements', id: 'achievements' },
    { label: language === 'en' ? 'Gallery' : t('navGallery'), href: '#gallery', id: 'gallery' },
    { label: language === 'en' ? 'Blog' : (t('navBlog') || 'Blog'), href: '#blog', id: 'blog' },
    { label: language === 'en' ? 'Contact' : t('navContact'), href: '#contact', id: 'contact' },
    { label: language === 'en' ? 'Terms & Conditions' : (t('navTermsCond')?.replace(/^\d+\.\s*/, '') || t('navTerms')), href: '#terms-conditions', id: 'terms' },
    { label: language === 'en' ? 'Order Tracking' : (t('shipSec5Title')?.replace(/^\d+\.\s*/, '') || 'Order Tracking'), href: '#shipping-policy', id: 'tracking' }
  ];

  const handleNavClick = (href: string) => {
    // Immediately unlock body overflow so window scrolling works on mobile browsers
    document.body.style.overflow = '';
    setMobileMenuOpen(false);
    
    const targetId = href.startsWith('#') ? href.slice(1) : href;
    
    const performScroll = () => {
      const element = document.getElementById(targetId) || document.querySelector(href);
      if (element) {
        const headerOffset = 100;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
          top: Math.max(0, offsetPosition),
          behavior: 'smooth'
        });
      }
    };

    if (currentBlogId) {
      if (onBlogIdChange) {
        window.history.pushState({}, '', window.location.origin + '/' + href);
        onBlogIdChange(null);
        setTimeout(performScroll, 100);
      } else {
        window.location.href = '/' + href;
      }
      return;
    }

    // Slight delay ensures state update and body overflow unlock settle before scrolling
    setTimeout(performScroll, 50);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 transition-all duration-300">
      {/* Top Banner for Elevate Award */}
      <div className="bg-emerald-950/90 text-emerald-100 text-xs py-1.5 px-3 min-[375px]:px-4 backdrop-blur-md border-b border-emerald-800/40">
        <div className="max-w-7xl mx-auto flex flex-row items-center justify-between gap-1.5 sm:gap-4 flex-nowrap overflow-hidden">
          <div className="flex items-center gap-1 min-[360px]:gap-2 min-w-0">
            <span className="bg-amber-500/20 text-amber-300 px-1.5 py-0.5 sm:px-2.5 sm:py-0.5 rounded-full font-semibold flex items-center gap-0.5 min-[360px]:gap-1 border border-amber-500/30 text-[7px] min-[340px]:text-[8px] min-[360px]:text-[9px] min-[390px]:text-[10px] sm:text-[11px] whitespace-nowrap shrink-0">
              <Award className="w-2.5 h-2.5 min-[360px]:w-3 min-[360px]:h-3 sm:w-3.5 sm:h-3.5 text-amber-400 shrink-0" /> {t('topBarWinner')}
            </span>
            <span className="text-emerald-100 font-medium text-[7px] min-[340px]:text-[8px] min-[360px]:text-[9px] min-[390px]:text-[10px] sm:text-xs truncate sm:whitespace-normal shrink min-w-0">
              {t('topBarKits')}
            </span>
          </div>
          <div className="flex items-center gap-1 min-[360px]:gap-1.5 sm:gap-4 shrink-0">
            <a href="#" title="WhatsApp" className="text-white hover:text-emerald-300 transition-all duration-200 transform hover:scale-110 p-0.5">
              <svg className="w-2.5 h-2.5 min-[360px]:w-3 min-[360px]:h-3 sm:w-4 sm:h-4 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.198-.198.347-.764.968-.937 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
            </a>
            <a href="#" title="Instagram" className="text-white hover:text-emerald-300 transition-all duration-200 transform hover:scale-110 p-0.5">
              <svg className="w-2.5 h-2.5 min-[360px]:w-3 min-[360px]:h-3 sm:w-4 sm:h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a href="#" title="YouTube" className="text-white hover:text-emerald-300 transition-all duration-200 transform hover:scale-110 p-0.5">
              <svg className="w-2.5 h-2.5 min-[360px]:w-3 min-[360px]:h-3 sm:w-4 sm:h-4 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
            <a href="#" title="Facebook" className="text-white hover:text-emerald-300 transition-all duration-200 transform hover:scale-110 p-0.5">
              <svg className="w-2.5 h-2.5 min-[360px]:w-3 min-[360px]:h-3 sm:w-4 sm:h-4 fill-current" viewBox="0 0 24 24">
                <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.375 14.5 5 15.5 5H18V0h-3.808C10.5 0 9 1.5 9 4.75V8z"/>
              </svg>
            </a>
            <a href="#" title="LinkedIn" className="text-white hover:text-emerald-300 transition-all duration-200 transform hover:scale-110 p-0.5">
              <svg className="w-2.5 h-2.5 min-[360px]:w-3 min-[360px]:h-3 sm:w-4 sm:h-4 fill-current" viewBox="0 0 24 24">
                <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav
        className={`relative z-50 transition-all duration-300 py-3 px-2 min-[360px]:px-4 md:px-8 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md text-slate-800 py-2.5 border-b border-slate-100'
            : 'bg-gradient-to-b from-slate-950/80 via-slate-950/40 to-transparent text-white'
        }`}
      >
        <div className="max-w-[92rem] mx-auto flex items-center justify-between gap-1 sm:gap-2">
          {/* Logo */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('#home');
            }}
            className="flex items-center gap-1.5 sm:gap-2.5 group focus:outline-none min-w-0"
          >
            <div className="w-7 h-7 sm:w-10 sm:h-10 flex-shrink-0 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              <img src={logoUrl} alt="SGB Agro Industries" className="w-full h-full object-contain rounded-xs" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className={`text-[10px] min-[340px]:text-[11px] min-[360px]:text-[13px] min-[375px]:text-[14px] min-[390px]:text-[15px] min-[412px]:text-[16px] min-[430px]:text-[17px] sm:text-lg md:text-xl lg:text-[29px] font-black tracking-tight font-sans whitespace-nowrap transition-colors duration-300 ${isScrolled ? 'text-[#064e3b]' : 'text-white'}`}>
                SGB AGRO INDUSTRIES
              </span>
              <span className={`text-[7px] min-[360px]:text-[8px] min-[390px]:text-[9px] sm:text-[10px] lg:text-[12px] font-medium tracking-tight whitespace-normal leading-tight transition-colors duration-300 max-w-[135px] min-[360px]:max-w-[165px] min-[390px]:max-w-[190px] min-[412px]:max-w-[210px] sm:max-w-none ${isScrolled ? 'text-[#555555]' : 'text-emerald-200'}`}>
                Opp. Municipal Ground, Koppa Rural, Koppa, Chikkamagaluru, Karnataka – 577126
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-0.5 xl:gap-1.5 shrink">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.href);
                  }}
                  className={`px-2 xl:px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all relative whitespace-nowrap ${
                    isScrolled
                      ? isActive
                        ? 'text-[#16a34a] bg-emerald-50 font-bold'
                        : 'text-[#064e3b]/80 hover:text-[#16a34a] hover:bg-slate-50'
                      : isActive
                        ? 'text-emerald-300 bg-white/10 font-bold'
                        : 'text-slate-100 hover:text-emerald-300 hover:bg-white/10'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute bottom-0 left-2 right-2 xl:left-3 xl:right-3 h-0.5 bg-[#16a34a] rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </a>
              );
            })}
          </div>

          {/* Desktop Right CTA */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-3 shrink-0">
            {/* Language Selector */}
            <LanguageSelector isScrolled={isScrolled} />

            {/* Shopping Cart Icon with badge */}
            <button
              onClick={onOpenCart}
              className={`relative p-2.5 rounded-xl transition-all border flex items-center justify-center ${
                isScrolled
                  ? 'border-emerald-600/30 text-[#064e3b] bg-emerald-50/80'
                  : 'border-white/30 text-white bg-white/10 backdrop-blur-sm'
              }`}
              title="Shopping Cart"
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5 text-[#16a34a]" />
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#16a34a] text-white text-[10px] font-black flex items-center justify-center shadow-md">
                0
              </span>
            </button>
          </div>

          {/* Mobile Right Controls & Menu Button */}
          <div className="flex items-center gap-1 sm:gap-2 lg:hidden shrink-0">
            <LanguageSelector isScrolled={isScrolled} />
            <button
              onClick={onOpenCart}
              className={`relative p-2 rounded-xl transition-all border flex items-center justify-center shrink-0 ${
                isScrolled
                  ? 'border-emerald-600/30 text-[#064e3b] bg-emerald-50/80'
                  : 'border-white/30 text-white bg-white/10 backdrop-blur-sm'
              }`}
              title="Shopping Cart"
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-[#16a34a]" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#16a34a] text-white text-[9px] font-black flex items-center justify-center shadow-md">
                0
              </span>
            </button>

            <button
              onClick={() => {
                const nextState = !mobileMenuOpen;
                if (!nextState) {
                  document.body.style.overflow = '';
                }
                setMobileMenuOpen(nextState);
              }}
              className={`p-2 rounded-xl focus:outline-none transition-colors shrink-0 ${
                isScrolled ? 'text-slate-800 hover:bg-slate-100' : 'text-white hover:bg-white/10'
              }`}
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop for click outside */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-30 lg:hidden"
              onClick={() => {
                document.body.style.overflow = '';
                setMobileMenuOpen(false);
              }}
            />

            {/* Mobile Drawer Content */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="absolute left-0 right-0 top-full z-40 lg:hidden bg-slate-900/98 backdrop-blur-xl border-b border-emerald-900/50 text-white px-6 py-6 shadow-2xl overflow-y-auto max-h-[calc(100vh-140px)] pointer-events-auto"
            >
              <div className="flex flex-col gap-2">
                <div className="pb-3 mb-2 border-b border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                    SGB Agro Navigation
                  </span>
                  <span className="text-[11px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30">
                    Elevate Winner
                  </span>
                </div>

                {mobileNavItems.map((item) => {
                  const isActive = activeSection === item.id || 
                    (item.id === 'terms' && (activeSection === 'terms' || window.location.hash === '#terms-conditions')) ||
                    (item.id === 'tracking' && window.location.hash === '#shipping-policy');
                  
                  return (
                    <a
                      key={item.id}
                      href={item.href}
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavClick(item.href);
                      }}
                      className={`px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-between transition-all cursor-pointer active:scale-[0.99] ${
                        isActive
                          ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/30'
                          : 'text-slate-200 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <span className="pointer-events-none">{item.label}</span>
                      <ChevronRight className="w-4 h-4 text-slate-500 pointer-events-none" />
                    </a>
                  );
                })}

                <div className="pt-4 mt-2 border-t border-slate-800 flex flex-col gap-3">
                  <a
                    href={`tel:${COMPANY_INFO.phone}`}
                    className="w-full py-3 rounded-xl bg-slate-800 text-white text-center font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-700 transition-colors"
                  >
                    <Phone className="w-4 h-4 text-emerald-400" /> Call 08277009667
                  </a>
                  <button
                    onClick={() => {
                      document.body.style.overflow = '';
                      setMobileMenuOpen(false);
                      onOpenQuoteModal();
                    }}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 text-white text-center font-bold text-sm shadow-lg shadow-emerald-900/50 hover:brightness-110 transition-all cursor-pointer"
                  >
                    Request Product Quotation
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};
