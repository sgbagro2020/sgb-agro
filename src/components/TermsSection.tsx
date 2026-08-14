import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, FileText, Truck, CheckCircle2, Mail, Phone, Globe, MapPin, ArrowUp } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export const TermsSection: React.FC = () => {
  const { t } = useLanguage();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section id="terms" className="py-20 bg-slate-50 border-t border-slate-200/80 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-green-200"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#16a34a]" /> {t('legalBadge')}
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-light text-[#064e3b] tracking-tight leading-tight"
          >
            {t('legalTitleMain')} <span className="font-serif italic font-medium text-[#16a34a]">{t('legalTitleHighlight')}</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed"
          >
            {t('legalSubtitle')}
          </motion.p>
        </div>

        {/* Sticky Table of Contents */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="sticky top-24 z-30 bg-white/95 backdrop-blur-md shadow-sm border border-slate-200/80 rounded-2xl p-4 mb-12"
        >
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 px-2">{t('quickNavText')}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            <button
              onClick={() => scrollToSection('privacy-policy')}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-[#064e3b] bg-emerald-50/60 hover:bg-emerald-100 transition-colors text-left"
            >
              <ShieldCheck className="w-4 h-4 text-[#16a34a] shrink-0" />
              <span className="truncate">{t('navPrivacy')}</span>
            </button>
            <button
              onClick={() => scrollToSection('terms-conditions')}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-[#064e3b] bg-emerald-50/60 hover:bg-emerald-100 transition-colors text-left"
            >
              <FileText className="w-4 h-4 text-[#16a34a] shrink-0" />
              <span className="truncate">{t('navTermsCond')}</span>
            </button>
            <button
              onClick={() => scrollToSection('shipping-policy')}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-[#064e3b] bg-emerald-50/60 hover:bg-emerald-100 transition-colors text-left"
            >
              <Truck className="w-4 h-4 text-[#16a34a] shrink-0" />
              <span className="truncate">{t('navShipping')}</span>
            </button>
            <button
              onClick={() => scrollToSection('return-warranty-policy')}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-[#064e3b] bg-emerald-50/60 hover:bg-emerald-100 transition-colors text-left"
            >
              <CheckCircle2 className="w-4 h-4 text-[#16a34a] shrink-0" />
              <span className="truncate">{t('navReturnWarranty')}</span>
            </button>
          </div>
        </motion.div>

        {/* Policies Content Container */}
        <div className="space-y-12">

          {/* 1. Privacy Policy */}
          <motion.div
            id="privacy-policy"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/80 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
              <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-[#16a34a] shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-[#064e3b]">{t('privTitle')}</h3>
            </div>

            <div className="space-y-6 text-slate-600 text-sm sm:text-base leading-relaxed">
              <p>{t('privIntro')}</p>

              <div>
                <h4 className="font-bold text-[#064e3b] text-base mb-2">{t('privSec1Title')}</h4>
                <p className="mb-2">{t('privSec1Sub')}</p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>{t('privSec1B1')}</li>
                  <li>{t('privSec1B2')}</li>
                  <li>{t('privSec1B3')}</li>
                  <li>{t('privSec1B4')}</li>
                  <li>{t('privSec1B5')}</li>
                  <li>{t('privSec1B6')}</li>
                  <li>{t('privSec1B7')}</li>
                  <li>{t('privSec1B8')}</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-[#064e3b] text-base mb-2">{t('privSec2Title')}</h4>
                <p className="mb-2">{t('privSec2Sub')}</p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>{t('privSec2B1')}</li>
                  <li>{t('privSec2B2')}</li>
                  <li>{t('privSec2B3')}</li>
                  <li>{t('privSec2B4')}</li>
                  <li>{t('privSec2B5')}</li>
                  <li>{t('privSec2B6')}</li>
                  <li>{t('privSec2B7')}</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-[#064e3b] text-base mb-2">{t('privSec3Title')}</h4>
                <p>{t('privSec3Text')}</p>
              </div>

              <div>
                <h4 className="font-bold text-[#064e3b] text-base mb-2">{t('privSec4Title')}</h4>
                <p>{t('privSec4Text')}</p>
              </div>

              <div>
                <h4 className="font-bold text-[#064e3b] text-base mb-2">{t('privSec5Title')}</h4>
                <p className="mb-2">{t('privSec5Sub')}</p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>{t('privSec5B1')}</li>
                  <li>{t('privSec5B2')}</li>
                  <li>{t('privSec5B3')}</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-[#064e3b] text-base mb-2">{t('privSec6Title')}</h4>
                <p>{t('privSec6Text')}</p>
              </div>

              <div>
                <h4 className="font-bold text-[#064e3b] text-base mb-2">{t('privSec7Title')}</h4>
                <p>{t('privSec7Text')}</p>
              </div>

              <div>
                <h4 className="font-bold text-[#064e3b] text-base mb-2">{t('privSec8Title')}</h4>
                <p className="mb-2">{t('privSec8Sub')}</p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>{t('privSec8B1')}</li>
                  <li>{t('privSec8B2')}</li>
                  <li>{t('privSec8B3')}</li>
                  <li>{t('privSec8B4')}</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-[#064e3b] text-base mb-2">{t('privSec9Title')}</h4>
                <p>{t('privSec9Text')}</p>
              </div>

              <div>
                <h4 className="font-bold text-[#064e3b] text-base mb-2">{t('privSec10Title')}</h4>
                <p className="mb-3">{t('privSec10Sub')}</p>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-slate-700 font-medium">
                  <p className="font-bold text-[#064e3b]">SGB Agro Industries</p>
                  <p>Ground Floor, Guthi Comforts Building</p>
                  <p>Main Road, Lowerpet, Koppa – 577126</p>
                  <p>Karnataka, India</p>
                  <p className="mt-2">Email: sgb.koppa@gmail.com</p>
                  <p>Phone: +91 8277009667</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 2. Terms & Conditions */}
          <motion.div
            id="terms-conditions"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/80 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
              <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-[#16a34a] shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-[#064e3b]">{t('termsTitle')}</h3>
            </div>

            <div className="space-y-6 text-slate-600 text-sm sm:text-base leading-relaxed">
              <p>{t('termsIntro')}</p>

              <div>
                <h4 className="font-bold text-[#064e3b] text-base mb-2">{t('termsSec1Title')}</h4>
                <p>{t('termsSec1Text')}</p>
              </div>

              <div>
                <h4 className="font-bold text-[#064e3b] text-base mb-2">{t('termsSec2Title')}</h4>
                <p>{t('termsSec2Text')}</p>
              </div>

              <div>
                <h4 className="font-bold text-[#064e3b] text-base mb-2">{t('termsSec3Title')}</h4>
                <p>{t('termsSec3Text')}</p>
              </div>

              <div>
                <h4 className="font-bold text-[#064e3b] text-base mb-2">{t('termsSec4Title')}</h4>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>{t('termsSec4B1')}</li>
                  <li>{t('termsSec4B2')}</li>
                  <li>{t('termsSec4B3')}</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-[#064e3b] text-base mb-2">{t('termsSec5Title')}</h4>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>{t('termsSec5B1')}</li>
                  <li>{t('termsSec5B2')}</li>
                  <li>{t('termsSec5B3')}</li>
                  <li>{t('termsSec5B4')}</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-[#064e3b] text-base mb-2">{t('termsSec6Title')}</h4>
                <p>{t('termsSec6Text')}</p>
              </div>

              <div>
                <h4 className="font-bold text-[#064e3b] text-base mb-2">{t('termsSec7Title')}</h4>
                <p>{t('termsSec7Text')}</p>
              </div>

              <div>
                <h4 className="font-bold text-[#064e3b] text-base mb-2">{t('termsSec8Title')}</h4>
                <p className="mb-2">{t('termsSec8Sub')}</p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>{t('termsSec8B1')}</li>
                  <li>{t('termsSec8B2')}</li>
                  <li>{t('termsSec8B3')}</li>
                  <li>{t('termsSec8B4')}</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-[#064e3b] text-base mb-2">{t('termsSec9Title')}</h4>
                <p>{t('termsSec9Text')}</p>
              </div>

              <div>
                <h4 className="font-bold text-[#064e3b] text-base mb-2">{t('termsSec10Title')}</h4>
                <p>{t('termsSec10Text')}</p>
              </div>

              <div>
                <h4 className="font-bold text-[#064e3b] text-base mb-2">{t('termsSec11Title')}</h4>
                <p>{t('termsSec11Text')}</p>
              </div>

              <div>
                <h4 className="font-bold text-[#064e3b] text-base mb-2">{t('termsSec12Title')}</h4>
                <p>{t('termsSec12Text')}</p>
              </div>

              <div>
                <h4 className="font-bold text-[#064e3b] text-base mb-2">{t('termsSec13Title')}</h4>
                <p>{t('termsSec13Text')}</p>
              </div>
            </div>
          </motion.div>

          {/* 3. Shipping & Delivery Policy */}
          <motion.div
            id="shipping-policy"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/80 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
              <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-[#16a34a] shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-[#064e3b]">{t('shipTitle')}</h3>
            </div>

            <div className="space-y-6 text-slate-600 text-sm sm:text-base leading-relaxed">
              <p>{t('shipIntro')}</p>

              <div>
                <h4 className="font-bold text-[#064e3b] text-base mb-2">{t('shipSec1Title')}</h4>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>{t('shipSec1B1')}</li>
                  <li>{t('shipSec1B2')}</li>
                  <li>{t('shipSec1B3')}</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-[#064e3b] text-base mb-2">{t('shipSec2Title')}</h4>
                <p>{t('shipSec2Text')}</p>
              </div>

              <div>
                <h4 className="font-bold text-[#064e3b] text-base mb-2">{t('shipSec3Title')}</h4>
                <p className="mb-2">{t('shipSec3Sub')}</p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>{t('shipSec3B1')}</li>
                  <li>{t('shipSec3B2')}</li>
                  <li>{t('shipSec3B3')}</li>
                </ul>
                <p className="mt-2 text-xs sm:text-sm text-slate-500 italic">{t('shipSec3Note')}</p>
              </div>

              <div>
                <h4 className="font-bold text-[#064e3b] text-base mb-2">{t('shipSec4Title')}</h4>
                <p>{t('shipSec4Text')}</p>
              </div>

              <div>
                <h4 className="font-bold text-[#064e3b] text-base mb-2">{t('shipSec5Title')}</h4>
                <p>{t('shipSec5Text')}</p>
              </div>

              <div>
                <h4 className="font-bold text-[#064e3b] text-base mb-2">{t('shipSec6Title')}</h4>
                <p>{t('shipSec6Text')}</p>
              </div>

              <div>
                <h4 className="font-bold text-[#064e3b] text-base mb-2">{t('shipSec7Title')}</h4>
                <p className="mb-2">{t('shipSec7Sub')}</p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>{t('shipSec7B1')}</li>
                  <li>{t('shipSec7B2')}</li>
                  <li>{t('shipSec7B3')}</li>
                </ul>
                <p className="mt-2 text-xs sm:text-sm text-slate-500 italic">{t('shipSec7Note')}</p>
              </div>

              <div>
                <h4 className="font-bold text-[#064e3b] text-base mb-2">{t('shipSec8Title')}</h4>
                <p>{t('shipSec8Text')}</p>
              </div>
            </div>
          </motion.div>

          {/* 4. Return, Refund, Warranty & Service Policy */}
          <motion.div
            id="return-warranty-policy"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/80 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
              <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-[#16a34a] shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-[#064e3b]">{t('retTitle')}</h3>
            </div>

            <div className="space-y-6 text-slate-600 text-sm sm:text-base leading-relaxed">
              <p>{t('retIntro')}</p>

              <div>
                <h4 className="font-bold text-[#064e3b] text-base mb-2">{t('retSec1Title')}</h4>
                <p className="mb-2">{t('retSec1Sub')}</p>
                <ul className="list-disc pl-5 space-y-1.5 mb-4">
                  <li>{t('retSec1B1')}</li>
                  <li>{t('retSec1B2')}</li>
                  <li>{t('retSec1B3')}</li>
                </ul>

                <h5 className="font-semibold text-[#064e3b] mb-1">{t('retCondHeading')}</h5>
                <p className="mb-1 text-xs sm:text-sm">{t('retCondSub')}</p>
                <ul className="list-disc pl-5 space-y-1.5 mb-4">
                  <li>{t('retCondB1')}</li>
                  <li>{t('retCondB2')}</li>
                </ul>

                <h5 className="font-semibold text-red-700 mb-1">{t('retNotHeading')}</h5>
                <p className="mb-1 text-xs sm:text-sm">{t('retNotSub')}</p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>{t('retNotB1')}</li>
                  <li>{t('retNotB2')}</li>
                  <li>{t('retNotB3')}</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-[#064e3b] text-base mb-2">{t('retSec2Title')}</h4>
                <p className="mb-2">{t('retSec2Text')}</p>
                <h5 className="font-semibold text-[#064e3b] mb-1">{t('retProcHeading')}</h5>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>{t('retProcB1')}</li>
                  <li>{t('retProcB2')}</li>
                  <li>{t('retProcB3')}</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-[#064e3b] text-base mb-2">{t('retSec3Title')}</h4>
                <p className="mb-2">{t('retSec3Sub')}</p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>{t('retSec3B1')}</li>
                  <li>{t('retSec3B2')}</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-[#064e3b] text-base mb-2">{t('retSec4Title')}</h4>
                <p className="mb-2">{t('retSec4Sub')}</p>
                <ul className="list-disc pl-5 space-y-1.5 mb-2">
                  <li>{t('retSec4B1')}</li>
                  <li>{t('retSec4B2')}</li>
                  <li>{t('retSec4B3')}</li>
                </ul>
                <p className="text-xs sm:text-sm text-slate-500 italic">{t('retSec4Note')}</p>
              </div>

              <div>
                <h4 className="font-bold text-[#064e3b] text-base mb-2">{t('retSec5Title')}</h4>
                <div className="space-y-4">
                  <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
                    <h5 className="font-bold text-[#064e3b] mb-1">{t('prodWarrTitle')}</h5>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>{t('prodWarrB1')}</li>
                      <li>{t('prodWarrB2')}</li>
                    </ul>
                    <p className="font-semibold text-slate-700 mt-3 mb-1 text-xs uppercase tracking-wider">{t('warrNotCover')}:</p>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600">
                      <li>{t('warrNotB1')}</li>
                      <li>{t('warrNotB2')}</li>
                      <li>{t('warrNotB3')}</li>
                      <li>{t('warrNotB4')}</li>
                    </ul>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <h5 className="font-bold text-[#064e3b] mb-1">{t('trolleyWarrTitle')}</h5>
                    <p className="text-sm text-slate-600">{t('trolleyWarrText')}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-[#064e3b] text-base mb-2">{t('retSec6Title')}</h4>
                <p className="mb-2">{t('servSub')}</p>
                <ul className="list-disc pl-5 space-y-1.5 mb-3">
                  <li>{t('servB1')}</li>
                  <li>{t('servB2')}</li>
                </ul>
                <h5 className="font-semibold text-[#064e3b] mb-1">{t('servTermsHeading')}</h5>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>{t('servTermsB1')}</li>
                  <li>{t('servTermsB2')}</li>
                  <li>{t('servTermsB3')}</li>
                  <li>{t('servTermsB4')}</li>
                  <li>{t('servTermsB5')}</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-[#064e3b] text-base mb-2">{t('retSec7Title')}</h4>
                <p className="mb-2">{t('genCondSub')}</p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>{t('genCondB1')}</li>
                  <li>{t('genCondB2')}</li>
                  <li>{t('genCondB3')}</li>
                  <li>{t('genCondB4')}</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-[#064e3b] text-base mb-2">{t('retSec8Title')}</h4>
                <p className="mb-2">{t('retSec8Sub')}</p>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-slate-700 font-medium">
                  <p className="font-bold text-[#064e3b]">SGB Agro Industries</p>
                  <p>Ground Floor, Guthi Comforts Building</p>
                  <p>Main Road, Lowerpet, Koppa – 577126</p>
                  <p>Karnataka, India</p>
                  <p className="mt-2">Email: sgb.koppa@gmail.com</p>
                  <p>Phone: +91 8277009667</p>
                </div>
              </div>
            </div>
          </motion.div>

        </div>

        {/* Professional Contact Information Card at the bottom */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 bg-[#064e3b] text-white p-8 sm:p-10 rounded-3xl shadow-xl relative overflow-hidden"
        >
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="max-w-xl relative z-10">
            <span className="inline-block bg-emerald-800/80 text-emerald-200 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-4 border border-emerald-700/50">
              {t('officialHq')}
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight mb-6">SGB Agro Industries</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-emerald-100">
              <div className="space-y-1">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
                  <div>
                    <p className="font-medium text-white">Ground Floor,</p>
                    <p>Guthi Comforts Building,</p>
                    <p>Main Road,</p>
                    <p>Lowerpet,</p>
                    <p>Koppa – 577126,</p>
                    <p>Karnataka,</p>
                    <p>India</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <p className="text-xs text-emerald-300 font-semibold uppercase">Email:</p>
                    <a href="mailto:sgb.koppa@gmail.com" className="hover:text-white transition-colors underline font-medium">
                      sgb.koppa@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <p className="text-xs text-emerald-300 font-semibold uppercase">Phone:</p>
                    <a href="tel:+918277009667" className="hover:text-white transition-colors underline font-medium">
                      +91 8277009667
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <Globe className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <p className="text-xs text-emerald-300 font-semibold uppercase">Website:</p>
                    <a href="https://sgbagroindustries.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors underline font-medium">
                      https://sgbagroindustries.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Back to top button inside section */}
        <div className="mt-12 text-center">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[#064e3b] border border-slate-200 rounded-full text-xs font-bold hover:bg-emerald-50 transition-colors shadow-sm"
          >
            <ArrowUp className="w-4 h-4 text-[#16a34a]" /> {t('backToTop')}
          </button>
        </div>

      </div>
    </section>
  );
};
