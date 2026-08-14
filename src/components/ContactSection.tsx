import React, { useState } from 'react';
import { motion } from 'motion/react';
import { COMPANY_INFO } from '../data/agriData';
import { ContactFormData } from '../types';
import { MapPin, Phone, Mail, Globe, MessageSquare, Send, CheckCircle2, Sparkles, Building2 } from 'lucide-react';

interface ContactSectionProps {
  initialProductInterest?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ initialProductInterest = '' }) => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    phone: '',
    email: '',
    location: '',
    productInterest: initialProductInterest || 'General Inquiry',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1000);
  };

  const whatsappMessage = encodeURIComponent(
    `Hello SGB AGRO INDUSTRIES! My name is ${formData.name || 'a farmer'}, located in ${formData.location || 'Karnataka'}. I would like to inquire about: ${formData.productInterest}. ${formData.message}`
  );

  return (
    <section id="contact" className="py-24 bg-slate-900 text-white relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-950 text-emerald-300 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-emerald-800"
          >
            <span className="flex h-2 w-2 rounded-full bg-[#16a34a]"></span>
            Get In Touch • Koppa Headquarters
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-light text-white tracking-tight"
          >
            Contact <span className="font-serif italic font-medium text-[#16a34a]">SGB AGRO</span> INDUSTRIES
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed"
          >
            Our Koppa engineering team is ready to assist you with equipment inquiries, farm water surveys, or custom price quotations.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Contact Cards & Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-800/80 rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-700">
                <div className="p-3 rounded-2xl bg-emerald-600 text-white">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{COMPANY_INFO.name}</h3>
                  <p className="text-xs text-emerald-400 font-semibold">{COMPANY_INFO.awardTitle}</p>
                </div>
              </div>

              <div className="space-y-5 text-sm">
                {/* Address */}
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-slate-700 text-emerald-400 shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Address</span>
                    <p className="text-slate-200 font-medium leading-snug mt-0.5">{COMPANY_INFO.address}</p>
                    <a
                      href="https://www.google.com/maps/place/SGB+AGRO+INDUSTRIES/@13.5392138,75.3671844,17z/data=!3m1!4b1!4m6!3m5!1s0x3bbb14eec826766d:0x2f72f8d3e45eb206!8m2!3d13.5392138!4d75.3697593!16s%2Fg%2F11cn0mjkn_?hl=en&entry=ttu"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 font-bold mt-1.5 transition-colors"
                    >
                      <span>Get Directions</span> →
                    </a>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-slate-700 text-emerald-400 shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Phone Line</span>
                    <a href={`tel:${COMPANY_INFO.phone}`} className="text-emerald-400 font-bold hover:underline text-base mt-0.5 block">
                      {COMPANY_INFO.phone}
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-slate-700 text-emerald-400 shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Email</span>
                    <a href={`mailto:${COMPANY_INFO.email}`} className="text-slate-200 font-medium hover:text-emerald-300">
                      {COMPANY_INFO.email}
                    </a>
                  </div>
                </div>

                {/* Website */}
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-slate-700 text-emerald-400 shrink-0">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Official Website</span>
                    <a href={COMPANY_INFO.website} target="_blank" rel="noopener noreferrer" className="text-emerald-400 font-medium hover:underline">
                      {COMPANY_INFO.website}
                    </a>
                  </div>
                </div>
              </div>

              {/* Direct Quick Action Buttons */}
              <div className="mt-8 pt-6 border-t border-slate-700 grid grid-cols-2 gap-3">
                <a
                  href={`tel:${COMPANY_INFO.phone}`}
                  className="py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-600 font-bold text-xs text-white flex items-center justify-center gap-2 transition-all shadow-lg"
                >
                  <Phone className="w-4 h-4" /> Direct Call
                </a>

                <a
                  href={`https://wa.me/${COMPANY_INFO.whatsapp}?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 rounded-xl bg-green-600 hover:bg-green-500 font-bold text-xs text-white flex items-center justify-center gap-2 transition-all shadow-lg"
                >
                  <MessageSquare className="w-4 h-4" /> WhatsApp
                </a>
              </div>
            </div>

            {/* Google Map Card */}
            <div className="space-y-4">
              <div className="bg-slate-800/80 rounded-3xl overflow-hidden border border-slate-700/80 shadow-2xl h-64 relative group">
                <iframe
                  title="SGB AGRO INDUSTRIES Location Koppa"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3880.5975232599727!2d75.3671844!3d13.5392138!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bbb14eec826766d%3A0x2f72f8d3e45eb206!2sSGB%20AGRO%20INDUSTRIES!5e0!3m2!1sen!2sin!4v1710000000000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="grayscale opacity-90 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                />
              </div>
              <a
                href="https://www.google.com/maps/place/SGB+AGRO+INDUSTRIES/@13.5392138,75.3671844,17z/data=!3m1!4b1!4m6!3m5!1s0x3bbb14eec826766d:0x2f72f8d3e45eb206!8m2!3d13.5392138!4d75.3697593!16s%2Fg%2F11cn0mjkn_?hl=en&entry=ttu"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-sm text-white flex items-center justify-center gap-2 transition-all shadow-lg text-center"
              >
                <MapPin className="w-5 h-5" /> Get Directions
              </a>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-slate-800/80 rounded-3xl p-6 sm:p-10 border border-slate-700/80 shadow-2xl backdrop-blur-xl">
              <h3 className="text-2xl font-bold text-white mb-2">Send Us an Inquiry</h3>
              <p className="text-slate-400 text-xs sm:text-sm mb-8">
                Fill out the form below for machinery estimates, custom water pump layouts, or technical consultation.
              </p>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-8 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-center space-y-4"
                >
                  <div className="p-4 rounded-full bg-emerald-500 text-slate-950 w-fit mx-auto shadow-xl">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h4 className="text-2xl font-bold text-white">Inquiry Received Successfully!</h4>
                  <p className="text-slate-300 text-sm max-w-md mx-auto">
                    Thank you, <span className="text-emerald-400 font-bold">{formData.name}</span>. Our engineering field team in Koppa will contact you at <span className="text-emerald-400 font-bold">{formData.phone}</span> shortly.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: '',
                        phone: '',
                        email: '',
                        location: '',
                        productInterest: 'General Inquiry',
                        message: ''
                      });
                    }}
                    className="mt-4 px-6 py-2.5 rounded-xl bg-emerald-700 text-white font-bold text-xs hover:bg-emerald-600 transition-colors"
                  >
                    Send Another Inquiry
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Ramesh Gowda"
                        className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="e.g. 0987654321"
                        className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="e.g. farmer@gmail.com"
                        className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Farm Location / District
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="e.g. Koppa / Chikkamagaluru"
                        className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Product / Solution Interest
                    </label>
                    <select
                      name="productInterest"
                      value={formData.productInterest}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Smart Micro-Drip & Sprinkler Systems">Irrigation Systems (Drip & Sprinkler)</option>
                      <option value="Hill-Slope Power Tillers & Weeders">Agricultural Machinery & Power Tillers</option>
                      <option value="High-Head Solar & Electric Water Pumps">Solar & Electric Water Pumps</option>
                      <option value="IoT Soil Moisture & Automated Fertigation Controller">Smart IoT Farming Equipment</option>
                      <option value="Heavy-Duty Sprayers & Polyhouse Accessories">Farm Accessories & Sprayers</option>
                      <option value="Custom Estate & Slope Farming Implement Engineering">Customized Farm Machinery</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Your Message / Requirements
                    </label>
                    <textarea
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Specify farm acreage, crop type, or required water discharge rate..."
                      className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 px-6 rounded-xl font-bold text-sm text-white bg-[#064e3b] hover:bg-[#16a34a] shadow-xl transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <span>Sending Inquiry...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Inquiry</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
