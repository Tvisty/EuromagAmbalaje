/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { ShoppingCart, User, Menu, ChevronLeft, ChevronRight, ChevronDown, X } from 'lucide-react';
import { HomePage } from './pages/HomePage';
import { ProductPage } from './pages/ProductPage';
import { CategoryPage } from './pages/CategoryPage';
import { AdminPage } from './pages/AdminPage';
import { products, categories } from './data';
import { db } from './lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { CartItem } from './types';

import { AccountPage } from './pages/AccountPage';
import { InfoPage } from './pages/InfoPage';

interface RouteState {
  view: 'home' | 'category' | 'product' | 'admin' | 'account' | 'info';
  categoryId: string | null;
  productId: string | null;
  infoSection: 'shipping' | 'returns';
}

function parseUrl(path: string): RouteState {
  const cleanPath = path.replace(/^\/+|\/+$/g, '');
  if (!cleanPath) {
    return { view: 'home', categoryId: null, productId: null, infoSection: 'shipping' };
  }

  const [segment1, segment2] = cleanPath.split('/');

  if (segment1 === 'categorie' || segment1 === 'categorii') {
    return { view: 'category', categoryId: segment2 || null, productId: null, infoSection: 'shipping' };
  }

  if (segment1 === 'produs' || segment1 === 'produse') {
    const product = products.find(p => p.id === segment2);
    return {
      view: 'product',
      categoryId: product ? product.categoryId : null,
      productId: segment2 || null,
      infoSection: 'shipping',
    };
  }

  if (segment1 === 'cont') {
    return { view: 'account', categoryId: null, productId: null, infoSection: 'shipping' };
  }

  if (segment1 === 'admin') {
    return { view: 'admin', categoryId: null, productId: null, infoSection: 'shipping' };
  }

  if (segment1 === 'informatii' || segment1 === 'info') {
    const sec = segment2 === 'retur' || segment2 === 'returns' ? 'returns' : 'shipping';
    return { view: 'info', categoryId: null, productId: null, infoSection: sec };
  }

  return { view: 'home', categoryId: null, productId: null, infoSection: 'shipping' };
}

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const initialRoute = parseUrl(typeof window !== 'undefined' ? window.location.pathname : '/');
  const [currentView, setCurrentView] = useState<'home' | 'category' | 'product' | 'admin' | 'account' | 'info'>(initialRoute.view);
  const [infoSection, setInfoSection] = useState<'shipping' | 'returns'>(initialRoute.infoSection);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(initialRoute.productId);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(initialRoute.categoryId);
  const [minOrder, setMinOrder] = useState<number>(500);
  
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);
  const [activeDropdownCategory, setActiveDropdownCategory] = useState<string | null>(null);
  const [mobileExpandedCategory, setMobileExpandedCategory] = useState<string | null>(null);
  const productsDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (productsDropdownRef.current && !productsDropdownRef.current.contains(event.target as Node)) {
        setIsProductsDropdownOpen(false);
        setActiveDropdownCategory(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'global'), (docSnap) => {
      if (docSnap.exists() && docSnap.data().minOrder !== undefined) {
        setMinOrder(docSnap.data().minOrder);
      }
    }, (err) => {
      console.error(err);
    });
    return () => unsub();
  }, []);

  const navigateTo = (url: string, replace = false) => {
    if (typeof window !== 'undefined') {
      if (replace) {
        window.history.replaceState({}, '', url);
      } else {
        window.history.pushState({}, '', url);
      }
    }
    const route = parseUrl(url.split('?')[0]);
    setCurrentView(route.view);
    setSelectedCategoryId(route.categoryId);
    setSelectedProductId(route.productId);
    setInfoSection(route.infoSection);
    window.scrollTo(0, 0);
  };

  // Sync state on browser back/forward buttons (Chrome Back button)
  useEffect(() => {
    const handlePopState = () => {
      const route = parseUrl(window.location.pathname);
      setCurrentView(route.view);
      setSelectedCategoryId(route.categoryId);
      setSelectedProductId(route.productId);
      setInfoSection(route.infoSection);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigateToCategory = (categoryId: string) => {
    navigateTo(`/categorie/${categoryId}`);
  };

  const handleNavigateToProduct = (productId: string) => {
    navigateTo(`/produs/${productId}`);
  };

  const handleNavigateToHome = () => {
    navigateTo('/');
  };

  const handleNavigateToAdmin = () => {
    navigateTo('/admin');
  };

  const handleNavigateToAccount = () => {
    navigateTo('/cont');
  };

  const handleNavigateToInfo = (section: 'shipping' | 'returns') => {
    navigateTo(`/informatii/${section}`);
  };

  const currentProduct = products.find(p => p.id === selectedProductId);
  const currentCategory = categories.find(c => c.id === selectedCategoryId);
  const categoryProducts = products.filter(p => p.categoryId === selectedCategoryId);

  // Sync document title with current page
  useEffect(() => {
    if (currentView === 'product' && currentProduct) {
      document.title = `${currentProduct.title} | Euromag Ambalaje`;
    } else if (currentView === 'category' && currentCategory) {
      document.title = `${currentCategory.title} | Euromag Ambalaje`;
    } else if (currentView === 'account') {
      document.title = 'Contul Meu | Euromag Ambalaje';
    } else if (currentView === 'admin') {
      document.title = 'Panou Administrare | Euromag Ambalaje';
    } else if (currentView === 'info') {
      document.title = infoSection === 'returns' ? 'Politica de Retur | Euromag Ambalaje' : 'Livrare și Plată | Euromag Ambalaje';
    } else {
      document.title = 'Euromag Ambalaje - Producător Cutii Carton & Ambalaje';
    }
  }, [currentView, currentProduct, currentCategory, infoSection]);

  const handleAddToCart = (item: Omit<CartItem, 'id'>) => {
    setCartItems([...cartItems, { ...item, id: Date.now().toString() }]);
    setIsCartOpen(true);
  };
  
  const handleRemoveFromCart = (id: string) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paymentStatus = params.get('payment');
    const orderId = params.get('orderId');

    if (paymentStatus === 'success' && orderId) {
      alert('Plata a fost procesată cu succes! Comanda ta a fost plasată.');
      handleClearCart();
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (paymentStatus === 'cancel' && orderId) {
      alert('Plata a fost anulată. Comanda a rămas în stadiul "Așteptare Plată".');
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900 bg-white">
      {/* Top Banner */}
      <div className="bg-brand-dark text-white text-xs py-2 text-center font-medium tracking-wide">
        LIVRARE GRATUITĂ PENTRU COMENZI PESTE {minOrder} RON
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-2 sm:py-2.5 relative">
            {/* Left Side: Logo + Produse Dropdown side by side */}
            <div className="flex items-center gap-2.5 sm:gap-6 md:gap-8 min-w-0">
              {/* Logo */}
              <div 
                className="flex-shrink-0 flex items-center cursor-pointer"
                onClick={handleNavigateToHome}
              >
                <img 
                  src="/logo (1).webp" 
                  alt="Euromag Ambalaje Logo" 
                  className="h-12 sm:h-20 md:h-24 w-auto object-contain"
                />
              </div>

              {/* Produse Dropdown Trigger & Menu beside Logo */}
              <div 
                ref={productsDropdownRef}
                className="static md:relative flex-shrink-0"
                onMouseEnter={() => {
                  if (window.innerWidth >= 768) {
                    setIsProductsDropdownOpen(true);
                  }
                }}
                onMouseLeave={() => {
                  if (window.innerWidth >= 768) {
                    setIsProductsDropdownOpen(false);
                    setActiveDropdownCategory(null);
                  }
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setIsProductsDropdownOpen((prev) => {
                      const next = !prev;
                      if (!next) setActiveDropdownCategory(null);
                      return next;
                    });
                  }}
                  className="inline-flex items-center gap-1.5 sm:gap-2.5 bg-brand-dark hover:bg-brand-dark/95 text-white font-semibold text-xs sm:text-sm px-3 py-2 sm:px-4 sm:py-2 rounded-lg md:rounded-t-lg md:rounded-b-md shadow-xs transition-all cursor-pointer"
                >
                  <Menu className="w-4 h-4 text-brand-light flex-shrink-0" />
                  <span>Produse</span>
                  <ChevronDown className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200 flex-shrink-0 ${isProductsDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Panel (full width on mobile, anchored under button on desktop) */}
                {isProductsDropdownOpen && (
                  <div className="absolute left-0 right-0 md:right-auto top-full pt-1 md:pt-0.5 z-50 flex flex-col md:flex-row items-stretch md:items-start">
                    {/* Categories List */}
                    <div className="w-full md:w-72 max-h-[75vh] md:max-h-none overflow-y-auto md:overflow-visible bg-[#f4f5f7] border border-gray-200/90 shadow-xl rounded-xl md:rounded-t-none md:rounded-b-xl">
                      {categories.map((category) => {
                        const isActive = activeDropdownCategory === category.id;
                        const subProducts = products.filter((p) => p.categoryId === category.id);

                        return (
                          <div
                            key={category.id}
                            className="border-b border-gray-200/90 last:border-b-0"
                            onMouseEnter={() => {
                              if (window.innerWidth >= 768) {
                                setActiveDropdownCategory(category.id);
                              }
                            }}
                          >
                            <div
                              className={`flex items-center justify-between px-4 py-3.5 transition-colors cursor-pointer ${
                                isActive ? 'bg-white text-brand-dark' : 'hover:bg-white/80 text-gray-900'
                              }`}
                            >
                              {/* Clicking the category icon/title goes directly to the category page */}
                              <div
                                className="flex items-center gap-3.5 flex-1 min-w-0"
                                onClick={() => {
                                  handleNavigateToCategory(category.id);
                                  setIsProductsDropdownOpen(false);
                                  setActiveDropdownCategory(null);
                                }}
                              >
                                {/* Illustrated Category Icon */}
                                <div className="w-9 h-9 flex-shrink-0 flex items-center justify-center">
                                  {category.id === 'pizza' && (
                                    <svg viewBox="0 0 40 40" className="w-9 h-9" fill="none">
                                      {/* Pizza Box Base */}
                                      <polygon points="4,22 20,14 36,22 20,30" fill="#e5b887" />
                                      <polygon points="4,22 20,30 20,34 4,26" fill="#c58b59" />
                                      <polygon points="36,22 20,30 20,34 36,26" fill="#a36a3c" />
                                      {/* Open Top Lid */}
                                      <polygon points="4,22 20,14 32,7 16,15" fill="#f3d6b3" stroke="#c58b59" strokeWidth="0.8" />
                                      {/* Pizza Graphic on Box */}
                                      <circle cx="20" cy="22" r="5" fill="#d94e34" />
                                      <circle cx="19" cy="21" r="1" fill="#f9d46c" />
                                      <circle cx="22" cy="22.5" r="1" fill="#f9d46c" />
                                      <circle cx="19.5" cy="23.5" r="0.9" fill="#f9d46c" />
                                    </svg>
                                  )}
                                  {category.id === 'carton' && (
                                    <svg viewBox="0 0 40 40" className="w-9 h-9" fill="none">
                                      {/* 3D Isometric Cardboard Box */}
                                      <polygon points="20,6 35,13.5 20,21 5,13.5" fill="#dfb183" />
                                      <polygon points="5,13.5 20,21 20,35 5,27.5" fill="#c58b59" />
                                      <polygon points="35,13.5 20,21 20,35 35,27.5" fill="#9c6436" />
                                      {/* Top Flap Seam & Tape */}
                                      <line x1="12.5" y1="9.75" x2="27.5" y2="17.25" stroke="#6b4226" strokeWidth="2.2" />
                                    </svg>
                                  )}
                                  {category.id === 'pungi' && (
                                    <svg viewBox="0 0 40 40" className="w-9 h-9" fill="none">
                                      {/* Pouch / Bag Body */}
                                      <rect x="8" y="8" width="24" height="26" rx="3" fill="#e8edf3" stroke="#cbd5e1" strokeWidth="1" />
                                      <rect x="11" y="13" width="18" height="17" rx="1.5" fill="#ffffff" />
                                      {/* Top Seal Line */}
                                      <line x1="9" y1="10" x2="31" y2="10" stroke="#f5b841" strokeWidth="2" strokeLinecap="round" />
                                      {/* Label AccentLines */}
                                      <line x1="16" y1="20" x2="24" y2="20" stroke="#f5b841" strokeWidth="1.8" strokeLinecap="round" />
                                      <line x1="16" y1="23.5" x2="22" y2="23.5" stroke="#cbd5e1" strokeWidth="1.8" strokeLinecap="round" />
                                    </svg>
                                  )}
                                </div>

                                <span className="text-[15px] font-medium tracking-tight truncate">
                                  {category.title}
                                </span>
                              </div>

                              {/* Clicking the arrow toggles subcategories on touch/click */}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveDropdownCategory(isActive ? null : category.id);
                                }}
                                className="p-2 -mr-1 rounded-md hover:bg-gray-200/60 text-gray-800 transition-colors"
                                title="Vezi subcategoriile"
                              >
                                <ChevronRight
                                  className={`w-4 h-4 transition-transform duration-200 ${
                                    isActive ? 'rotate-90 md:rotate-0 text-brand-dark' : ''
                                  }`}
                                />
                              </button>
                            </div>

                            {/* Mobile Inline Subcategories (when opened on mobile screens) */}
                            {isActive && (
                              <div className="md:hidden bg-white border-t border-gray-100 py-1.5 px-3 space-y-1">
                                <button
                                  type="button"
                                  onClick={() => {
                                    handleNavigateToCategory(category.id);
                                    setIsProductsDropdownOpen(false);
                                    setActiveDropdownCategory(null);
                                  }}
                                  className="w-full text-left px-3 py-2 text-xs font-bold uppercase tracking-wider text-brand-dark hover:bg-gray-50 rounded-md flex items-center justify-between"
                                >
                                  <span>Vezi toate ({category.title})</span>
                                  <ChevronRight className="w-3.5 h-3.5" />
                                </button>
                                {subProducts.map((prod) => (
                                  <button
                                    key={prod.id}
                                    type="button"
                                    onClick={() => {
                                      handleNavigateToProduct(prod.id);
                                      setIsProductsDropdownOpen(false);
                                      setActiveDropdownCategory(null);
                                    }}
                                    className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-50 text-left transition-colors"
                                  >
                                    <img
                                      src={prod.image}
                                      alt={prod.title}
                                      className="w-9 h-9 rounded object-cover border border-gray-200 bg-white flex-shrink-0"
                                    />
                                    <div className="min-w-0 flex-1">
                                      <p className="text-sm font-medium text-gray-800 truncate">{prod.title}</p>
                                      <p className="text-xs text-brand-dark font-semibold">{prod.basePrice.toFixed(2)} RON / buc</p>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Desktop Subcategories Flyout Panel (opens to the right when hovering/clicking a category) */}
                    {activeDropdownCategory && (() => {
                      const activeCat = categories.find((c) => c.id === activeDropdownCategory);
                      const subProducts = products.filter((p) => p.categoryId === activeDropdownCategory);
                      if (!activeCat) return null;

                      return (
                        <div className="hidden md:block w-80 bg-white border border-gray-200 shadow-xl rounded-r-xl rounded-bl-xl ml-1 p-4 animate-in fade-in duration-150">
                          <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100">
                            <div>
                              <h4 className="font-bold text-gray-900 text-sm">{activeCat.title}</h4>
                              <p className="text-xs text-gray-500">{subProducts.length} modele disponibile</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                handleNavigateToCategory(activeCat.id);
                                setIsProductsDropdownOpen(false);
                                setActiveDropdownCategory(null);
                              }}
                              className="text-xs font-semibold text-brand-dark hover:underline flex items-center gap-0.5 cursor-pointer"
                            >
                              Vezi toate
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="space-y-1.5">
                            {subProducts.map((prod) => (
                              <button
                                key={prod.id}
                                type="button"
                                onClick={() => {
                                  handleNavigateToProduct(prod.id);
                                  setIsProductsDropdownOpen(false);
                                  setActiveDropdownCategory(null);
                                }}
                                className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-[#f4f5f7] text-left transition-colors group cursor-pointer"
                              >
                                <img
                                  src={prod.image}
                                  alt={prod.title}
                                  className="w-11 h-11 rounded-md object-cover border border-gray-200 bg-white flex-shrink-0 group-hover:border-brand-light transition-colors"
                                />
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm font-semibold text-gray-900 group-hover:text-brand-dark transition-colors leading-snug">
                                    {prod.title}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-0.5">
                                    De la <span className="font-semibold text-brand-dark">{prod.basePrice.toFixed(2)} RON</span> / buc
                                  </p>
                                </div>
                                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-brand-dark flex-shrink-0" />
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3.5 sm:gap-6 flex-shrink-0">
              <button 
                className="flex flex-col items-center text-gray-500 hover:text-brand-dark transition-colors cursor-pointer"
                onClick={handleNavigateToAccount}
              >
                <User className="w-6 h-6 sm:mb-1" />
                <span className="text-xs font-medium hidden sm:inline">Contul meu</span>
              </button>
              <button 
                className="flex flex-col items-center text-gray-500 hover:text-brand-dark transition-colors relative cursor-pointer"
                onClick={() => setIsCartOpen(true)}
              >
                <div className="relative">
                  <ShoppingCart className="w-6 h-6 sm:mb-1" />
                  {cartItems.length > 0 && (
                    <span className="absolute -top-1 -right-2 bg-brand-light text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {cartItems.length}
                    </span>
                  )}
                </div>
                <span className="text-xs font-medium hidden sm:inline">Coșul tău</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Breadcrumb / Back button when in product view */}
      {currentView === 'product' && currentProduct && (
        <div className="bg-bg-light border-b border-gray-200 py-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <button 
              onClick={() => handleNavigateToCategory(currentProduct.categoryId)}
              className="flex items-center text-gray-600 hover:text-brand-dark font-medium transition-colors text-sm"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Înapoi la categorie
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-grow">
        {currentView === 'home' && (
          <HomePage onNavigateToCategory={handleNavigateToCategory} />
        )}
        
        {currentView === 'category' && currentCategory ? (
          <CategoryPage 
            category={currentCategory} 
            products={categoryProducts} 
            onNavigateToProduct={handleNavigateToProduct}
            onNavigateBack={handleNavigateToHome}
          />
        ) : currentView === 'category' ? (
          <div className="py-20 text-center max-w-md mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Categoria nu a fost găsită</h2>
            <p className="text-gray-500 mb-6">Ne pare rău, dar categoria solicitată nu există.</p>
            <button 
              onClick={handleNavigateToHome}
              className="bg-brand-dark text-white font-medium px-6 py-2.5 rounded-lg hover:bg-brand-dark/90 transition-colors"
            >
              Înapoi la pagina principală
            </button>
          </div>
        ) : null}

        {currentView === 'product' && currentProduct ? (
          <ProductPage product={currentProduct} onAddToCart={handleAddToCart} />
        ) : currentView === 'product' ? (
          <div className="py-20 text-center max-w-md mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Produsul nu a fost găsit</h2>
            <p className="text-gray-500 mb-6">Ne pare rău, dar produsul solicitat nu există.</p>
            <button 
              onClick={handleNavigateToHome}
              className="bg-brand-dark text-white font-medium px-6 py-2.5 rounded-lg hover:bg-brand-dark/90 transition-colors"
            >
              Înapoi la pagina principală
            </button>
          </div>
        ) : null}

        {currentView === 'admin' && (
          <AdminPage />
        )}

        {currentView === 'account' && (
          <AccountPage onBack={handleNavigateToHome} />
        )}
        {currentView === 'info' && (
          <InfoPage section={infoSection} />
        )}
      </main>

      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={handleCheckout}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        onClearCart={handleClearCart}
      />

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <div>
              <div 
                className="flex items-center mb-6 cursor-pointer"
                onClick={handleNavigateToHome}
              >
                <img 
                  src="/logo (1).webp" 
                  alt="Euromag Ambalaje Logo" 
                  className="h-20 md:h-24 w-auto object-contain"
                />
              </div>
              <p className="text-gray-500 text-sm mb-6">
                Partenerul tău de încredere pentru soluții complete de ambalare. Calitate, promptitudine și prețuri de producător.
              </p>
              <div className="text-sm text-gray-600 space-y-2">
                <div>
                  <strong>Email:</strong>
                  <ul className="mt-1 space-y-1">
                    <li><a href="mailto:office@euromag-ambalaje.ro" className="hover:text-brand-dark transition-colors">office@euromag-ambalaje.ro</a></li>
                    <li><a href="mailto:sales@euromag-ambalaje.ro" className="hover:text-brand-dark transition-colors">sales@euromag-ambalaje.ro</a></li>
                    <li><a href="mailto:support@euromag-ambalaje.ro" className="hover:text-brand-dark transition-colors">support@euromag-ambalaje.ro</a></li>
                  </ul>
                </div>
                <p><strong>Telefon:</strong> <a href="tel:0740299451" className="hover:text-brand-dark transition-colors">0740299451</a></p>
                <p><strong>Program:</strong> L-V: 08:00 - 17:00</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Produse</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><button onClick={() => handleNavigateToProduct('pizza-box-white')} className="hover:text-brand-dark transition-colors">Cutii Pizza Albă</button></li>
                <li><button onClick={() => handleNavigateToProduct('pizza-box-kraft')} className="hover:text-brand-dark transition-colors">Cutii Pizza Natur</button></li>
                <li><button onClick={() => handleNavigateToProduct('carton-co3')} className="hover:text-brand-dark transition-colors">Cutii Carton CO3</button></li>
                <li><button onClick={() => handleNavigateToProduct('carton-co5')} className="hover:text-brand-dark transition-colors">Cutii Carton CO5</button></li>
                <li><button onClick={() => handleNavigateToProduct('saci-ldpe')} className="hover:text-brand-dark transition-colors">Saci LDPE 100x50</button></li>
                <li><button onClick={() => handleNavigateToProduct('sacose-maieu')} className="hover:text-brand-dark transition-colors">Sacoșe Maieu</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Informații Utile</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><button onClick={() => handleNavigateToInfo('shipping')} className="hover:text-brand-dark transition-colors">Livrare și Plată</button></li>
                <li><button onClick={() => handleNavigateToInfo('returns')} className="hover:text-brand-dark transition-colors">Politica de Retur</button></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-8 flex flex-col lg:flex-row justify-between items-center gap-6">
            <p className="text-sm text-gray-400 text-center lg:text-left order-2 lg:order-1">
              <span onClick={handleNavigateToAdmin} className="cursor-pointer">&copy;</span> {new Date().getFullYear()} Euromag Ambalaje. Toate drepturile rezervate.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-end gap-x-6 gap-y-4 text-sm text-gray-400 order-1 lg:order-2">
              <button onClick={() => handleNavigateToInfo('shipping')} className="hover:text-gray-600 transition-colors cursor-pointer">Termeni și Condiții</button>
              <button onClick={() => handleNavigateToInfo('returns')} className="hover:text-gray-600 transition-colors cursor-pointer">Politica de Confidențialitate</button>

              {/* ANPC Banners - side by side right next to Politica de Confidențialitate */}
              <div className="flex items-center gap-3 shrink-0">
                <a 
                  href="https://www.anpc.ro/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="transition-transform hover:scale-105 inline-block shrink-0"
                  title="Autoritatea Națională pentru Protecția Consumatorilor"
                >
                  <img 
                    src="/anpc-7olgttv.png" 
                    alt="ANPC - www.anpc.ro" 
                    className="h-10 sm:h-12 md:h-14 w-auto object-contain rounded-md border border-gray-200 bg-white p-1 hover:border-gray-300 transition-all shadow-xs"
                    loading="lazy"
                  />
                </a>
                <a 
                  href="https://eservicii.anpc.ro/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="transition-transform hover:scale-105 inline-block shrink-0"
                  title="ANPC E-Servicii"
                >
                  <img 
                    src="/anpc-ibpa8jn.png" 
                    alt="ANPC E-Servicii" 
                    className="h-10 sm:h-12 md:h-14 w-auto object-contain rounded-md border border-gray-200 bg-white p-1 hover:border-gray-300 transition-all shadow-xs"
                    loading="lazy"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
