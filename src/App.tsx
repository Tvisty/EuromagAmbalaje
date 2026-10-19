/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, User, Menu, ChevronLeft, X } from 'lucide-react';
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div 
              className="flex-shrink-0 flex items-center cursor-pointer h-full"
              onClick={handleNavigateToHome}
            >
              <img 
                src="https://i.imgur.com/AjSYx9L.png" 
                alt="Euromag Ambalaje Logo" 
                className="h-16 md:h-20 w-auto object-contain scale-[1.7] md:scale-[1.8] origin-left"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Search Bar (Desktop) */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  className="w-full bg-bg-light border border-gray-200 rounded-lg py-2.5 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-brand-light focus:border-transparent transition-all"
                  placeholder="Caută cutii pizza, cutii transport, accesorii..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="absolute right-0 top-0 h-full px-4 text-gray-400 hover:text-brand-dark transition-colors">
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-6">
              <button 
                className="flex flex-col items-center text-gray-500 hover:text-brand-dark transition-colors"
                onClick={handleNavigateToAccount}
              >
                <User className="w-6 h-6 mb-1" />
                <span className="text-xs font-medium hidden sm:inline">Contul meu</span>
              </button>
              <button 
                className="flex flex-col items-center text-gray-500 hover:text-brand-dark transition-colors relative"
                onClick={() => setIsCartOpen(true)}
              >
                <div className="relative">
                  <ShoppingCart className="w-6 h-6 mb-1" />
                  {cartItems.length > 0 && (
                    <span className="absolute -top-1 -right-2 bg-brand-light text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {cartItems.length}
                    </span>
                  )}
                </div>
                <span className="text-xs font-medium hidden sm:inline">Coșul tău</span>
              </button>
              <button 
                className="md:hidden text-gray-500"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
          
          {/* Search Bar (Mobile) */}
          <div className="md:hidden pb-4">
            <div className="relative w-full">
              <input
                type="text"
                className="w-full bg-bg-light border border-gray-200 rounded-lg py-2.5 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-brand-light focus:border-transparent"
                placeholder="Caută produse..."
              />
              <button className="absolute right-0 top-0 h-full px-4 text-gray-400">
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Mobile Menu Dropdown */}
          {isMobileMenuOpen && (
            <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-lg animate-in slide-in-from-top-2">
              <div className="px-4 pt-2 pb-6 space-y-1">
                <button
                  onClick={() => { handleNavigateToHome(); setIsMobileMenuOpen(false); }}
                  className="block w-full text-left px-3 py-3 text-base font-medium text-gray-900 rounded-md hover:bg-gray-50"
                >
                  Acasă
                </button>
                
                <div className="pt-4 pb-2">
                  <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Categorii Produse
                  </p>
                </div>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => { handleNavigateToCategory(category.id); setIsMobileMenuOpen(false); }}
                    className="block w-full text-left px-3 py-3 pl-6 text-base font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-brand-dark"
                  >
                    {category.title}
                  </button>
                ))}
                
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => { handleNavigateToAccount(); setIsMobileMenuOpen(false); }}
                    className="flex items-center w-full text-left px-3 py-3 text-base font-medium text-gray-900 rounded-md hover:bg-gray-50"
                  >
                    <User className="w-5 h-5 mr-3 text-gray-400" />
                    Contul meu
                  </button>
                </div>
              </div>
            </div>
          )}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div>
              <div 
                className="flex items-center mb-6 h-16 cursor-pointer"
                onClick={handleNavigateToHome}
              >
                <img 
                  src="https://i.imgur.com/AjSYx9L.png" 
                  alt="Euromag Ambalaje Logo" 
                  className="h-12 md:h-16 w-auto object-contain scale-[1.7] md:scale-[1.8] origin-left"
                  referrerPolicy="no-referrer"
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
            
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Newsletter</h4>
              <p className="text-sm text-gray-500 mb-4">Abonează-te pentru a primi oferte speciale și noutăți.</p>
              <form className="flex flex-col gap-2" onSubmit={(e) => e.preventDefault()}>
                <input 
                  type="email" 
                  placeholder="Adresa ta de email" 
                  className="bg-white border border-gray-200 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brand-light text-sm"
                />
                <button className="bg-brand-dark text-white font-medium py-2 rounded-lg hover:bg-brand-dark/90 transition-colors text-sm">
                  Abonează-mă
                </button>
              </form>
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
