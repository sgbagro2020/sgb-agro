import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PRODUCTS } from '../data/agriData';
import { Product } from '../types';
import { ProductModal } from './ProductModal';
import { Sparkles, ArrowRight, Eye, CheckCircle, Search, ShoppingCart, Zap } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { getEffectiveProduct } from '../lib/productStore';

interface ProductsSectionProps {
  onRequestQuote: (productName?: string) => void;
  selectedCategoryFromParent?: string;
}

export const ProductsSection: React.FC<ProductsSectionProps> = ({
  onRequestQuote,
  selectedCategoryFromParent
}) => {
  const [activeCategory, setActiveCategory] = useState<string>(selectedCategoryFromParent || 'All');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const { t } = useLanguage();

  const [effectiveProducts, setEffectiveProducts] = useState<Product[]>(() =>
    PRODUCTS.map((p) => getEffectiveProduct(p))
  );

  useEffect(() => {
    const handleUpdate = () => {
      setEffectiveProducts(PRODUCTS.map((p) => getEffectiveProduct(p)));
    };
    window.addEventListener('sgb_product_images_updated', handleUpdate);
    return () => window.removeEventListener('sgb_product_images_updated', handleUpdate);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const categories = ['All', ...Array.from(new Set(effectiveProducts.map((p) => p.category)))];

  const filteredProducts = effectiveProducts.filter((prod) => {
    const matchesCategory = activeCategory === 'All' || prod.category === activeCategory;
    const matchesSearch =
      prod.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="products" className="py-24 bg-white relative">
      {/* Toast Notification for Design Preview */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl border border-emerald-500/50 flex items-center gap-3 text-xs sm:text-sm font-bold"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#16a34a] animate-ping" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-green-200"
          >
            <span className="flex h-2 w-2 rounded-full bg-[#16a34a]"></span>
            {t('productsBadge')}
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-light text-[#064e3b] tracking-tight leading-tight"
          >
            Smart <span className="font-serif italic font-medium text-[#16a34a]">Agricultural</span> Solutions
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed"
          >
            {t('productsSubtitle')}
          </motion.p>
        </div>

        {/* Search Bar & Category Filter Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-12">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  activeCategory === cat
                    ? 'bg-[#064e3b] text-white shadow-md shadow-green-950/20'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 border border-slate-200 focus:outline-none focus:border-emerald-600 text-slate-800"
            />
          </div>
        </div>

        {/* Product Cards Grid */}
        <AnimatePresence mode="wait">
          {filteredProducts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-16 bg-slate-50 rounded-3xl border border-slate-200"
            >
              <p className="text-slate-500 font-medium text-base">No products match your filter criteria.</p>
              <button
                onClick={() => {
                  setActiveCategory('All');
                  setSearchQuery('');
                }}
                className="mt-4 px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold"
              >
                Reset Filters
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={activeCategory + searchQuery}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => setSelectedProduct(product)}
                  className="group bg-white rounded-3xl overflow-hidden border border-slate-200 hover:border-emerald-400 shadow-md hover:shadow-2xl hover:shadow-emerald-900/10 transition-all duration-300 flex flex-col justify-between cursor-pointer"
                >
                  <div>
                    {/* Image Thumbnail */}
                    <div className="relative h-56 w-full overflow-hidden bg-slate-100">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                      {/* Category Badge */}
                      <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-[11px] font-bold bg-white/90 backdrop-blur-md text-emerald-900 shadow-md">
                        {product.category}
                      </span>

                      {product.badge && (
                        <span className="absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950 shadow-md flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> {product.badge}
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                          {product.category}
                        </span>
                        {product.availability && (
                          <span className="text-[10px] font-bold text-[#16a34a] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                            {product.availability}
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#064e3b] transition-colors mb-1 line-clamp-1">
                        {product.title}
                      </h3>

                      {/* Product Price Display */}
                      <div className="flex items-baseline gap-2 mb-3">
                        <span className="text-lg font-extrabold text-[#16a34a]">
                          {product.price || "₹ --,---"}
                        </span>
                        {product.originalPrice && (
                          <span className="text-xs font-semibold text-slate-400 line-through">
                            {product.originalPrice}
                          </span>
                        )}
                      </div>

                      <p className="text-slate-600 text-xs sm:text-sm leading-relaxed line-clamp-3">
                        {product.shortDesc}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="p-6 pt-0 space-y-2.5">
                    <div className="flex items-center gap-2">
                      {/* Add to Cart Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          showToast(`"${product.title}" added to cart (Design preview mode)`);
                        }}
                        className="flex-1 py-2.5 px-3 rounded-xl text-xs font-bold text-white bg-[#16a34a] hover:bg-emerald-600 shadow-md transition-all flex items-center justify-center gap-1.5 transform active:scale-95"
                        title="Add to Cart"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>Add to Cart</span>
                      </button>

                      {/* Buy Now Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          showToast(`Buy Now: Checkout for "${product.title}" will be active after Hostinger deployment`);
                        }}
                        className="flex-1 py-2.5 px-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:brightness-110 shadow-md transition-all flex items-center justify-center gap-1.5 transform active:scale-95"
                        title="Buy Now"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>Buy Now</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProduct(product);
                        }}
                        className="flex-1 py-2 px-3 rounded-xl text-xs font-bold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 transition-all flex items-center justify-center gap-1"
                      >
                        <Eye className="w-3 h-3 text-[#16a34a]" />
                        <span>Details</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRequestQuote(product.title);
                        }}
                        className="flex-1 py-2 px-3 rounded-xl text-xs font-bold text-white bg-[#064e3b] hover:bg-[#16a34a] transition-all flex items-center justify-center gap-1"
                      >
                        <span>Get Quote</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Product Modal */}
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onRequestQuote={onRequestQuote}
          onSelectProduct={(p) => setSelectedProduct(p)}
        />
      </div>
    </section>
  );
};

