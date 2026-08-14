import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ArrowLeft,
  Check,
  CheckCircle2,
  MessageSquare,
  Phone,
  FileText,
  ShieldCheck,
  Download,
  Wrench,
  Sparkles,
  ChevronRight,
  Building2,
  Tag,
  Clock,
  Share2,
  Package,
  Send,
  Eye,
  ShoppingCart,
  Zap,
  Upload
} from 'lucide-react';
import { Product } from '../types';
import { COMPANY_INFO, PRODUCTS } from '../data/agriData';
import { getEffectiveProduct, saveCustomProductImages } from '../lib/productStore';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onRequestQuote: (productName: string) => void;
  onSelectProduct?: (product: Product) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product: rawProduct,
  onClose,
  onRequestQuote,
  onSelectProduct
}) => {
  const [effectiveProduct, setEffectiveProduct] = useState<Product | null>(() =>
    rawProduct ? getEffectiveProduct(rawProduct) : null
  );
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (rawProduct) {
      const eff = getEffectiveProduct(rawProduct);
      setEffectiveProduct(eff);
      const primaryImg = eff.images && eff.images.length > 0 ? eff.images[0] : eff.image;
      setSelectedImage(primaryImg);
    } else {
      setEffectiveProduct(null);
    }
  }, [rawProduct]);

  useEffect(() => {
    const handleImagesUpdate = () => {
      if (rawProduct) {
        const eff = getEffectiveProduct(rawProduct);
        setEffectiveProduct(eff);
        const primaryImg = eff.images && eff.images.length > 0 ? eff.images[0] : eff.image;
        setSelectedImage(primaryImg);
      }
    };
    window.addEventListener('sgb_product_images_updated', handleImagesUpdate);
    return () => window.removeEventListener('sgb_product_images_updated', handleImagesUpdate);
  }, [rawProduct]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const trolleyFileInputRef = useRef<HTMLInputElement>(null);

  const handleTrolleyImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !effectiveProduct) return;

    const fileList = Array.from(files);
    const newImages: string[] = [];
    let readCount = 0;

    fileList.forEach((file) => {
      if (!file.type.startsWith('image/')) {
        readCount++;
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        if (dataUrl) {
          newImages.push(dataUrl);
        }
        readCount++;
        if (readCount === fileList.length && newImages.length > 0) {
          const targetId = effectiveProduct.id;
          const success = saveCustomProductImages(targetId, newImages, effectiveProduct.title);
          if (success) {
            const updated = getEffectiveProduct(effectiveProduct);
            setEffectiveProduct(updated);
            const mainImg = updated.images && updated.images.length > 0 ? updated.images[0] : updated.image;
            setSelectedImage(mainImg);
            showToast('Product images uploaded successfully.');
          } else {
            showToast('Failed to save product images.');
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Enquiry form state
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    if (effectiveProduct) {
      setCopiedLink(false);
      setFormSubmitted(false);
      setFormName('');
      setFormPhone('');
      setFormEmail('');
      setFormLocation('');
      setFormMessage('');
      // Lock body scroll when product details page is open
      document.body.style.overflow = 'hidden';
      document.title = `${effectiveProduct.title} | ${COMPANY_INFO.name}`;
    } else {
      document.body.style.overflow = 'unset';
      document.title = `${COMPANY_INFO.name} | Empowering Farmers Through Smart Agricultural Innovation`;
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [effectiveProduct]);

  if (!effectiveProduct) return null;

  const product = effectiveProduct;

  const galleryImages = product.images && product.images.length > 0 ? product.images : [product.image];

  const whatsappMessage = encodeURIComponent(
    `Hello SGB Agro Industries! I am interested in getting details and quotation for "${product.title}" (SKU: ${product.sku || 'SGB-EQUIP'}). Please guide me with specs & pricing.`
  );

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formPhone) {
      alert('Please enter your name and phone number so our team can reach you.');
      return;
    }
    setFormSubmitted(true);
  };

  // Filter related products (exclude current)
  const relatedProducts = PRODUCTS.filter((p) => p.id !== product.id).slice(0, 3);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/90 backdrop-blur-md flex flex-col justify-between">
        {/* Top Header / Sticky Navigation Bar */}
        <div className="sticky top-0 z-20 bg-slate-950/95 backdrop-blur-lg border-b border-slate-800 text-white py-3.5 px-4 sm:px-8 flex items-center justify-between shadow-xl">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold transition-all border border-white/10"
            >
              <ArrowLeft className="w-4 h-4 text-[#16a34a]" />
              <span>Back to Products</span>
            </button>

            <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 border-l border-slate-800 pl-4">
              <span>Catalog</span>
              <ChevronRight className="w-3 h-3 text-slate-600" />
              <span className="text-emerald-400 font-semibold">{product.category}</span>
              <ChevronRight className="w-3 h-3 text-slate-600" />
              <span className="text-slate-200 line-clamp-1 max-w-[200px]">{product.title}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors text-xs font-semibold flex items-center gap-1.5 border border-slate-700"
              title="Share product link"
            >
              <Share2 className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">{copiedLink ? 'Link Copied!' : 'Share'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-red-900/40 text-slate-300 hover:text-white transition-colors border border-slate-700"
              aria-label="Close Product Page"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dedicated Product Details Page Container */}
        <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 my-4 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden"
          >
            {/* Top Product Overview Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 p-6 sm:p-8 lg:p-10 border-b border-slate-200/80">
              {/* LEFT SIDE: Image Viewer & Gallery Thumbnails */}
              <div className="lg:col-span-6 flex flex-col gap-4">
                {/* Main Image Viewport with Hover Zoom and Aspect Ratio Preservation */}
                <div className="relative h-80 sm:h-96 md:h-[450px] w-full rounded-2xl overflow-hidden bg-white border border-slate-200/90 shadow-inner group flex items-center justify-center p-2">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={selectedImage || product.image}
                      src={selectedImage || product.image}
                      alt={product.title}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.35, ease: 'easeOut' }}
                      className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                  </AnimatePresence>

                  {/* Top Floating Badges */}
                  <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2 z-10 pointer-events-none">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#064e3b] text-white uppercase tracking-wider shadow-md">
                      {product.category}
                    </span>

                    {product.badge && (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-slate-950 flex items-center gap-1 shadow-md">
                        <Sparkles className="w-3.5 h-3.5" /> {product.badge}
                      </span>
                    )}
                  </div>

                  {/* Availability Badge */}
                  <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-slate-900 flex items-center gap-1.5 shadow-lg border border-slate-200 z-10 pointer-events-none">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#16a34a] animate-pulse"></span>
                    <span>{product.availability || 'In Stock'}</span>
                  </div>
                </div>

                {/* Gallery Thumbnails List */}
                {galleryImages.length > 1 && (
                  <div>
                    <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-2">
                      Official Product Gallery & Views ({galleryImages.length})
                    </span>
                    <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 scrollbar-thin">
                      {galleryImages.map((img, idx) => {
                        const isSelected = selectedImage === img;
                        return (
                          <button
                            key={idx}
                            onClick={() => setSelectedImage(img)}
                            className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0 border-2 transition-all bg-white p-1 ${
                              isSelected
                                ? 'border-[#16a34a] shadow-md ring-2 ring-[#16a34a]/30 scale-105'
                                : 'border-slate-200 hover:border-slate-400 opacity-75 hover:opacity-100'
                            }`}
                          >
                            <img
                              src={img}
                              alt={`${product.title} view ${idx + 1}`}
                              className="w-full h-full object-contain"
                              referrerPolicy="no-referrer"
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Temporary Upload Product Images Button ONLY for SGB SIDE PACK BRUSH CUTTER TROLLEY */}
                {(product.id === 'sgb-brush-cutter-trolley' || product.id === 'sgb-side-pack-brush-cutter-trolley' || product.sku === 'SGB-BCT-001') && (
                  <div className="mt-2 flex items-center justify-between gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Product Image Gallery</span>
                    </span>
                    <input
                      type="file"
                      ref={trolleyFileInputRef}
                      onChange={handleTrolleyImageUpload}
                      multiple
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      onClick={() => trolleyFileInputRef.current?.click()}
                      className="py-2.5 px-4 bg-[#064e3b] hover:bg-[#16a34a] text-white rounded-xl font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer border border-emerald-500/30 shrink-0"
                    >
                      <Upload className="w-4 h-4 text-emerald-300" />
                      <span>📷 Upload Product Images</span>
                    </button>
                  </div>
                )}
              </div>

              {/* RIGHT SIDE: Product Details & Enquiry Action Panel */}
              <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
                <div>
                  {/* Brand & SKU Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-[#064e3b]">
                      <Building2 className="w-3.5 h-3.5 text-[#16a34a]" />
                      {product.brand || COMPANY_INFO.name}
                    </span>

                    <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                      SKU: {product.sku || 'SGB-AGR-2024'}
                    </span>
                  </div>

                  {/* Product Title */}
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-light text-[#064e3b] tracking-tight leading-tight mb-3">
                    {product.title}
                  </h1>

                  {/* Price Display with Original vs Offer Price */}
                  <div className="mb-6 bg-emerald-50/60 p-4 sm:p-5 rounded-2xl border border-emerald-100/90">
                    <div className="flex flex-wrap items-baseline gap-3 mb-2">
                      {product.originalPrice && (
                        <span className="text-base sm:text-lg font-bold text-slate-400 line-through">
                          {product.originalPrice}
                        </span>
                      )}
                      <span className="text-2xl sm:text-3xl font-black text-[#16a34a]">
                        {product.price || 'Contact for Price'}
                      </span>
                    </div>

                    {/* Below price display: In Stock status & Save tag */}
                    <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm font-bold text-[#16a34a]">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-[#16a34a]" />
                        <span>{product.availability || 'In Stock'}</span>
                      </div>
                      {product.saveTag && (
                        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-100 text-amber-900 border border-amber-200 text-xs font-extrabold">
                          <span>🏷 {product.saveTag}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Short Description */}
                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
                    {product.shortDesc}
                  </p>

                  {/* Key Highlights */}
                  {product.features && product.features.length > 0 && (
                    <div className="space-y-2.5 mb-6 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200/80">
                      <h4 className="text-xs font-bold text-[#064e3b] uppercase tracking-wider flex items-center gap-1.5 mb-2">
                        <Tag className="w-3.5 h-3.5 text-[#16a34a]" /> Key Performance Highlights
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {product.features.slice(0, 6).map((feat, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 font-medium">
                            <Check className="w-4 h-4 text-[#16a34a] shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Dedicated Action Buttons Grid including Add to Cart and Buy Now design placeholders */}
                <div className="space-y-3 pt-4 border-t border-slate-200 relative">
                  {/* Toast Notification */}
                  <AnimatePresence>
                    {toastMessage && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl border border-emerald-500/50 flex items-center gap-2.5 text-xs font-bold mb-2"
                      >
                        <span className="w-2 h-2 rounded-full bg-[#16a34a] animate-ping" />
                        <span>{toastMessage}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Add to Cart Button */}
                    <button
                      onClick={() => showToast(`"${product.title}" added to cart (Design preview mode)`)}
                      className="py-3.5 px-4 bg-[#16a34a] hover:bg-emerald-600 text-white rounded-2xl font-bold text-xs sm:text-sm shadow-lg transition-all duration-300 flex items-center justify-center gap-2 transform active:scale-95"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>Add to Cart</span>
                    </button>

                    {/* Buy Now Button */}
                    <button
                      onClick={() => showToast(`Buy Now: Checkout for "${product.title}" will be active after Hostinger deployment`)}
                      className="py-3.5 px-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:brightness-110 text-white rounded-2xl font-bold text-xs sm:text-sm shadow-lg transition-all duration-300 flex items-center justify-center gap-2 transform active:scale-95"
                    >
                      <Zap className="w-4 h-4" />
                      <span>Buy Now</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Get Quote Button */}
                    <button
                      onClick={() => {
                        const formElem = document.getElementById('enquiry-form-section');
                        if (formElem) {
                          formElem.scrollIntoView({ behavior: 'smooth' });
                        } else {
                          onRequestQuote(product.title);
                        }
                      }}
                      className="py-3 px-3 bg-[#064e3b] hover:bg-[#16a34a] text-white rounded-2xl font-bold text-xs shadow-lg transition-all duration-300 flex items-center justify-center gap-1.5 transform active:scale-95"
                    >
                      <Wrench className="w-3.5 h-3.5" />
                      <span>Get Quote</span>
                    </button>

                    {/* WhatsApp Enquiry Button */}
                    <a
                      href={`https://wa.me/${COMPANY_INFO.whatsapp}?text=${whatsappMessage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-3 px-3 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-bold text-xs shadow-lg transition-all duration-300 flex items-center justify-center gap-1.5 text-center transform active:scale-95"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>

                    {/* Call Now Button */}
                    <a
                      href={`tel:${COMPANY_INFO.phone}`}
                      className="py-3 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-2xl font-bold text-xs transition-all duration-300 flex items-center justify-center gap-1.5 text-center transform active:scale-95"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#16a34a]" />
                      <span>Call Now</span>
                    </a>
                  </div>

                  {/* Guarantee / Factory Assurance */}
                  <div className="p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200/80 flex items-center gap-3 text-emerald-950 text-xs font-semibold">
                    <ShieldCheck className="w-5 h-5 text-[#16a34a] shrink-0" />
                    <span>Official SGB Agro Warranty & Dedicated Field Support in Koppa, KA.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* PRODUCT DETAILS SECTIONS */}
            <div className="p-6 sm:p-8 lg:p-10 space-y-12 bg-slate-50/50">
              {/* 1. DESCRIPTION SECTION */}
              <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 rounded-xl bg-emerald-100 text-[#064e3b]">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#064e3b]">Description</h3>
                    <p className="text-xs text-slate-500">Comprehensive overview & operational performance</p>
                  </div>
                </div>
                <p className="text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-line mb-6">
                  {product.fullDesc || product.shortDesc}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-[#16a34a]" />
                    <span>Standard Factory Dispatch: 2–4 Business Days</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-[#16a34a]" />
                    <span>KITS / Govt. Recognized Agricultural Manufacturing Standards</span>
                  </div>
                </div>
              </section>

              {/* 2. PRODUCT FEATURES SECTION */}
              {product.features && product.features.length > 0 && (
                <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 rounded-xl bg-emerald-100 text-[#064e3b]">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#064e3b]">Product Features</h3>
                      <h4 className="text-xs text-slate-500">Engineered for endurance and ergonomics</h4>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {product.features.map((feature, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-slate-50 hover:bg-emerald-50/50 border border-slate-200/80 hover:border-emerald-300 transition-all flex items-start gap-3"
                      >
                        <CheckCircle2 className="w-5 h-5 text-[#16a34a] shrink-0 mt-0.5" />
                        <span className="text-xs sm:text-sm font-semibold text-slate-800">{feature}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* 3. SPECIFICATIONS SECTION */}
              {product.specifications && Object.keys(product.specifications).length > 0 && (
                <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 rounded-xl bg-emerald-100 text-[#064e3b]">
                      <Tag className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#064e3b]">Specifications</h3>
                      <h4 className="text-xs text-slate-500">Technical specifications and dimensions</h4>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 overflow-hidden text-xs sm:text-sm">
                    <table className="w-full text-left border-collapse">
                      <tbody>
                        {Object.entries(product.specifications).map(([key, val], idx) => (
                          <tr key={key} className={idx % 2 === 0 ? 'bg-slate-50/80' : 'bg-white'}>
                            <td className="py-3.5 px-5 font-bold text-slate-800 border-b border-slate-100 w-1/3 sm:w-1/4">
                              {key}
                            </td>
                            <td className="py-3.5 px-5 text-slate-700 border-b border-slate-100">{val}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}

              {/* 4. APPLICATIONS SECTION */}
              {product.applications && product.applications.length > 0 && (
                <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 rounded-xl bg-emerald-100 text-[#064e3b]">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#064e3b]">Applications</h3>
                      <h4 className="text-xs text-slate-500">Recommended farm & plantation use cases</h4>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {product.applications.map((app, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 text-center flex flex-col items-center justify-center gap-2 hover:bg-emerald-100/80 transition-colors"
                      >
                        <Check className="w-5 h-5 text-[#16a34a]" />
                        <span className="text-xs sm:text-sm font-bold text-emerald-950">{app}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* WHY CHOOSE THIS PRODUCT & PRODUCT BENEFITS */}
              {product.benefits && product.benefits.length > 0 && (
                <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 rounded-xl bg-emerald-100 text-[#064e3b]">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#064e3b]">Why Choose This Product & Benefits</h3>
                      <h4 className="text-xs text-slate-500">Engineered to deliver maximum performance with minimum maintenance</h4>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {product.benefits.map((benefit, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100/80 flex items-start gap-3"
                      >
                        <CheckCircle2 className="w-5 h-5 text-[#16a34a] shrink-0 mt-0.5" />
                        <span className="text-xs sm:text-sm font-semibold text-slate-800">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* 5. PACKAGE CONTENTS SECTION */}
              <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 rounded-xl bg-emerald-100 text-[#064e3b]">
                    <Package className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#064e3b]">Package Contents</h3>
                    <h4 className="text-xs text-slate-500">Items included in the product box</h4>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(product.packageContents || [
                    'Brush Cutter Trolley',
                    'Mounting Clamp',
                    'Rubber Bushes',
                    'Nut & Bolt Kit',
                    'Installation Accessories'
                  ]).map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-3"
                    >
                      <div className="w-8 h-8 rounded-xl bg-emerald-100 text-[#16a34a] flex items-center justify-center font-bold text-xs shrink-0">
                        {idx + 1}
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-slate-800">{item}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* TECHNICAL COMPATIBILITY SECTION */}
              {product.compatibility && product.compatibility.length > 0 && (
                <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 rounded-xl bg-emerald-100 text-[#064e3b]">
                      <Wrench className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#064e3b]">Technical Compatibility</h3>
                      <h4 className="text-xs text-slate-500">Supported engines & brush cutter machines</h4>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {product.compatibility.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-100 flex items-center gap-2.5"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#16a34a] shrink-0" />
                        <span className="text-xs sm:text-sm font-bold text-slate-800">{item}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* 6. ENQUIRY FORM SECTION */}
              <section
                id="enquiry-form-section"
                className="bg-gradient-to-br from-[#064e3b] to-slate-900 text-white p-6 sm:p-8 lg:p-10 rounded-3xl shadow-xl border border-emerald-800 scroll-mt-24"
              >
                <div className="max-w-3xl mx-auto space-y-6">
                  <div className="text-center space-y-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      <Wrench className="w-3.5 h-3.5" /> Direct Factory Enquiry
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-light tracking-tight text-white">
                      Request Quotation or Enquiry
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300">
                      Fill in your contact information below. Our team at SGB AGRO INDUSTRIES will contact you with pricing, delivery details, and technical guidance.
                    </p>
                  </div>

                  {formSubmitted ? (
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="p-8 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-center space-y-3"
                    >
                      <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                      <h4 className="text-xl font-bold text-white">Enquiry Submitted Successfully!</h4>
                      <p className="text-xs sm:text-sm text-emerald-200">
                        Thank you, <span className="font-bold text-white">{formName}</span>. Our technical sales executive from Koppa, KA will call you at <span className="font-bold text-white">{formPhone}</span> shortly regarding your request for <span className="font-bold text-emerald-300">{product.title}</span>.
                      </p>
                      <button
                        onClick={() => setFormSubmitted(false)}
                        className="mt-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold transition-all border border-white/20"
                      >
                        Submit Another Enquiry
                      </button>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleFormSubmit} className="space-y-4 text-slate-900">
                      {/* Pre-filled Interested Product */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-emerald-300 mb-1">
                          Interested Product
                        </label>
                        <input
                          type="text"
                          readOnly
                          value={product.title}
                          className="w-full px-4 py-3 rounded-xl bg-slate-800 text-emerald-300 font-bold border border-slate-700 focus:outline-none text-xs sm:text-sm cursor-not-allowed"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Name */}
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-200 mb-1">
                            Your Name *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Ramesh Kumar"
                            value={formName}
                            onChange={(e) => setFormName(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-white text-slate-900 font-medium border border-slate-300 focus:ring-2 focus:ring-[#16a34a] focus:outline-none text-xs sm:text-sm"
                          />
                        </div>

                        {/* Phone Number */}
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-200 mb-1">
                            Phone Number *
                          </label>
                          <input
                            type="tel"
                            required
                            placeholder="e.g. 9876543210"
                            value={formPhone}
                            onChange={(e) => setFormPhone(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-white text-slate-900 font-medium border border-slate-300 focus:ring-2 focus:ring-[#16a34a] focus:outline-none text-xs sm:text-sm"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Email */}
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-200 mb-1">
                            Email Address
                          </label>
                          <input
                            type="email"
                            placeholder="e.g. name@example.com"
                            value={formEmail}
                            onChange={(e) => setFormEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-white text-slate-900 font-medium border border-slate-300 focus:ring-2 focus:ring-[#16a34a] focus:outline-none text-xs sm:text-sm"
                          />
                        </div>

                        {/* Location */}
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-200 mb-1">
                            Your Location / District
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Chikmagalur, Karnataka"
                            value={formLocation}
                            onChange={(e) => setFormLocation(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-white text-slate-900 font-medium border border-slate-300 focus:ring-2 focus:ring-[#16a34a] focus:outline-none text-xs sm:text-sm"
                          />
                        </div>
                      </div>

                      {/* Message */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-200 mb-1">
                          Message / Specific Requirements
                        </label>
                        <textarea
                          rows={3}
                          placeholder="Please provide details about delivery location, quantity required, or questions about installation..."
                          value={formMessage}
                          onChange={(e) => setFormMessage(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-white text-slate-900 font-medium border border-slate-300 focus:ring-2 focus:ring-[#16a34a] focus:outline-none text-xs sm:text-sm"
                        />
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        className="w-full py-4 px-6 bg-[#16a34a] hover:bg-emerald-500 text-white font-bold rounded-2xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2 transform active:scale-98 text-sm"
                      >
                        <Send className="w-4 h-4" />
                        <span>Submit Factory Enquiry</span>
                      </button>
                    </form>
                  )}
                </div>
              </section>

              {/* 7. RELATED PRODUCTS SECTION */}
              {relatedProducts.length > 0 && (
                <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-[#064e3b]">Related Products</h3>
                      <p className="text-xs text-slate-500">More machinery and equipment from SGB AGRO INDUSTRIES</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {relatedProducts.map((relProd) => (
                      <div
                        key={relProd.id}
                        onClick={() => {
                          if (onSelectProduct) {
                            onSelectProduct(relProd);
                          }
                        }}
                        className="group bg-slate-50 rounded-2xl border border-slate-200 hover:border-emerald-400 p-4 transition-all duration-300 flex flex-col justify-between cursor-pointer hover:shadow-md"
                      >
                        <div>
                          <div className="h-40 w-full rounded-xl overflow-hidden bg-slate-900 mb-3 relative">
                            <img
                              src={relProd.image}
                              alt={relProd.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              referrerPolicy="no-referrer"
                            />
                            <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#064e3b] text-white">
                              {relProd.category}
                            </span>
                          </div>
                          <h4 className="font-bold text-slate-900 text-sm group-hover:text-[#064e3b] line-clamp-1 mb-1">
                            {relProd.title}
                          </h4>
                          <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                            {relProd.shortDesc}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                          <span className="text-sm font-black text-[#16a34a]">
                            {relProd.price || '₹ --,---'}
                          </span>
                          <span className="text-xs font-bold text-[#064e3b] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                            View <Eye className="w-3.5 h-3.5 text-[#16a34a]" />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar Footer */}
        <div className="bg-slate-950 py-4 px-6 text-center text-xs text-slate-400 border-t border-slate-800">
          For technical enquiries or custom estate modifications, contact our Koppa workshop at{' '}
          <a href={`tel:${COMPANY_INFO.phone}`} className="text-emerald-400 font-bold underline">
            {COMPANY_INFO.phone}
          </a>.
        </div>
      </div>
    </AnimatePresence>
  );
};
