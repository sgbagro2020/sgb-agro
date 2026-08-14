import React, { useState, useEffect } from 'react';
import { Preloader } from './components/Preloader';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FeatureCards } from './components/FeatureCards';
import { AboutSection } from './components/AboutSection';
import { ProductsSection } from './components/ProductsSection';
import { ServicesSection } from './components/ServicesSection';
import { AchievementsSection } from './components/AchievementsSection';
import { StatsCounter } from './components/StatsCounter';
import { GallerySection } from './components/GallerySection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { ContactSection } from './components/ContactSection';
import { TermsSection } from './components/TermsSection';
import { Footer } from './components/Footer';
import { QuoteModal } from './components/QuoteModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { CartModal } from './components/CartModal';
import { BackToTop } from './components/BackToTop';
import { BlogSection } from './components/BlogSection';
import { BlogReaderPage } from './components/BlogReaderPage';
import { MediaItem, getAllMediaItems } from './lib/galleryStore';

export default function App() {
  // Check if current URL is an individual blog article view
  const isBlogPage = window.location.pathname.startsWith('/blog/');
  const blogSlug = isBlogPage ? window.location.pathname.substring(6) : null;

  if (isBlogPage && blogSlug) {
    return <BlogReaderPage slug={blogSlug} />;
  }

  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [quoteModalProduct, setQuoteModalProduct] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [cartModalOpen, setCartModalOpen] = useState<boolean>(false);

  // Admin and Gallery states
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return sessionStorage.getItem('sgb_admin_logged_in') === 'true';
  });
  const [adminLoginOpen, setAdminLoginOpen] = useState<boolean>(false);
  const [adminDashboardOpen, setAdminDashboardOpen] = useState<boolean>(false);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  // Blog routing deep link state
  const [currentBlogId, setCurrentBlogId] = useState<string | null>(() => {
    return new URLSearchParams(window.location.search).get('blogId');
  });

  const loadMedia = async () => {
    const items = await getAllMediaItems();
    setMediaItems(items);
  };

  useEffect(() => {
    loadMedia();
  }, [refreshTrigger]);

  // Initial scroll if opening specific article
  useEffect(() => {
    if (currentBlogId) {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, []);

  // Listen to popstate for browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentBlogId(new URLSearchParams(window.location.search).get('blogId'));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Listen to hash changes to clear blog detail view if user clicks a navbar section
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash) {
        if (new URLSearchParams(window.location.search).has('blogId')) {
          window.history.pushState({}, '', window.location.origin + '/' + hash);
          setCurrentBlogId(null);
        }
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleBlogIdChange = (id: string | null) => {
    if (id) {
      window.history.pushState({}, '', `?blogId=${id}`);
      setCurrentBlogId(id);
      window.scrollTo({ top: 0, behavior: 'instant' });
    } else {
      window.history.pushState({}, '', `${window.location.origin}/#blog`);
      setCurrentBlogId(null);
      setTimeout(() => {
        const el = document.getElementById('blog');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const handleOpenQuoteModal = (productTitle: string = '') => {
    setQuoteModalProduct(productTitle);
    setQuoteModalOpen(true);
  };

  const handleExploreProducts = () => {
    const el = document.getElementById('products');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleContactUs = () => {
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFeatureCategoryClick = (cat: string) => {
    setSelectedCategory(cat);
    handleExploreProducts();
  };

  const handleOpenAdmin = () => {
    if (isAdminLoggedIn) {
      setAdminDashboardOpen(true);
    } else {
      setAdminLoginOpen(true);
    }
  };

  const handleLoginSuccess = () => {
    setIsAdminLoggedIn(true);
    sessionStorage.setItem('sgb_admin_logged_in', 'true');
    setAdminLoginOpen(false);
    setAdminDashboardOpen(true);
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    sessionStorage.removeItem('sgb_admin_logged_in');
    setAdminDashboardOpen(false);
  };

  const handleRefreshGallery = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans antialiased selection:bg-emerald-500 selection:text-white">
      {/* Brand Preloader */}
      <Preloader />

      {/* Navigation Bar */}
      <Navbar
        onOpenQuoteModal={() => handleOpenQuoteModal()}
        onOpenCart={() => setCartModalOpen(true)}
        currentBlogId={currentBlogId}
        onBlogIdChange={handleBlogIdChange}
      />

      {/* Main Content Sections */}
      <main>
        {currentBlogId ? (
          <div className="pt-24 pb-12 bg-slate-50">
            <BlogSection
              refreshTrigger={refreshTrigger}
              currentBlogId={currentBlogId}
              onBlogIdChange={handleBlogIdChange}
            />
          </div>
        ) : (
          <>
            {/* Hero Section */}
            <Hero
              onExploreProducts={handleExploreProducts}
              onContactUs={handleContactUs}
            />

            {/* Feature Cards Below Hero */}
            <FeatureCards onSelectCategory={handleFeatureCategoryClick} />

            {/* About Section */}
            <AboutSection />

            {/* Products Catalog Section */}
            <ProductsSection
              onRequestQuote={(title) => handleOpenQuoteModal(title)}
              selectedCategoryFromParent={selectedCategory}
            />

            {/* Services Section */}
            <ServicesSection onRequestQuote={() => handleOpenQuoteModal()} />

            {/* Achievements Spotlight (Elevate 2024-25 Winner) */}
            <AchievementsSection />

            {/* Animated Statistics Counter */}
            <StatsCounter />

            {/* Dynamic Gallery Section */}
            <GallerySection
              onOpenAdminLogin={handleOpenAdmin}
              refreshTrigger={refreshTrigger}
            />

            {/* Blog Publication Section */}
            <BlogSection
              refreshTrigger={refreshTrigger}
              currentBlogId={currentBlogId}
              onBlogIdChange={handleBlogIdChange}
            />

            {/* Testimonials Slider */}
            <TestimonialsSection />

            {/* Contact Section */}
            <ContactSection initialProductInterest={quoteModalProduct} />

            {/* Terms & Conditions Section */}
            <TermsSection />
          </>
        )}
      </main>

      {/* Footer */}
      <Footer onOpenAdminLogin={handleOpenAdmin} />

      {/* Quote Builder Modal */}
      <QuoteModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        selectedProductTitle={quoteModalProduct}
      />

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={adminLoginOpen}
        onClose={() => setAdminLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Admin Dashboard Modal */}
      <AdminDashboardModal
        isOpen={adminDashboardOpen}
        onClose={() => setAdminDashboardOpen(false)}
        mediaItems={mediaItems}
        onRefresh={handleRefreshGallery}
        onLogout={handleAdminLogout}
      />

      {/* Cart Modal (Design Preview) */}
      <CartModal
        isOpen={cartModalOpen}
        onClose={() => setCartModalOpen(false)}
      />

      {/* Floating Action Buttons */}
      <BackToTop />
    </div>
  );
}
