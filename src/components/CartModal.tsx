import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingCart, ArrowRight, ShieldAlert } from 'lucide-react';
import { COMPANY_INFO } from '../data/agriData';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden"
        >
          {/* Modal Header */}
          <div className="bg-[#064e3b] text-white p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-emerald-300">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Shopping Cart</h3>
                <p className="text-xs text-emerald-200">SGB Agro Industries Catalog</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-8 text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-emerald-50 text-[#16a34a] flex items-center justify-center mx-auto shadow-inner border border-emerald-100">
              <ShoppingCart className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h4 className="text-xl font-bold text-slate-900">Your cart is currently empty.</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Add products from our catalog to your cart. Fully integrated checkout and WooCommerce/Razorpay payment gateway will be enabled after deployment on Hostinger.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold flex items-center gap-2.5 text-left">
              <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
              <span>Design Phase: Cart and payment integrations are currently in placeholder mode.</span>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3.5 px-6 rounded-2xl bg-[#064e3b] hover:bg-[#16a34a] text-white font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <span>Continue Browsing Products</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Modal Footer */}
          <div className="bg-slate-50 py-3 px-6 text-center text-[11px] text-slate-500 border-t border-slate-100">
            {COMPANY_INFO.name} • Koppa, Karnataka
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
