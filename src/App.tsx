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

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentView, setCurrentView] = useState<'home' | 'category' | 'product' | 'admin' | 'account'>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
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

  const handleNavigateToCategory = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setCurrentView('category');
    window.scrollTo(0, 0);
  };

  const handleNavigateToProduct = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      setSelectedCategoryId(product.categoryId);
    }
    setSelectedProductId(productId);
    setCurrentView('product');
    window.scrollTo(0, 0);
  };

  const handleNavigateToHome = () => {
    setSelectedProductId(null);
    setSelectedCategoryId(null);
    setCurrentView('home');
    window.scrollTo(0, 0);
  };

  const handleNavigateToAdmin = () => {
    setCurrentView('admin');
    window.scrollTo(0, 0);
  };

  const currentProduct = products.find(p => p.id === selectedProductId);
  const currentCategory = categories.find(c => c.id === selectedCategoryId);
  const categoryProducts = products.filter(p => p.categoryId === selectedCategoryId);

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
                onClick={() => setCurrentView('account')}
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
                    onClick={() => { setCurrentView('account'); setIsMobileMenuOpen(false); }}
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
        
        {currentView === 'category' && currentCategory && (
          <CategoryPage 
            category={currentCategory} 
            products={categoryProducts} 
            onNavigateToProduct={handleNavigateToProduct}
            onNavigateBack={handleNavigateToHome}
          />
        )}

        {currentView === 'product' && currentProduct && (
          <ProductPage product={currentProduct} onAddToCart={handleAddToCart} />
        )}

        {currentView === 'admin' && (
          <AdminPage />
        )}

        {currentView === 'account' && (
          <AccountPage onBack={() => setCurrentView('home')} />
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
                <li><a href="#" className="hover:text-brand-dark transition-colors">Despre Noi</a></li>
                <li><a href="#" className="hover:text-brand-dark transition-colors">Cum Comand?</a></li>
                <li><a href="#" className="hover:text-brand-dark transition-colors">Livrare și Plată</a></li>
                <li><a href="#" className="hover:text-brand-dark transition-colors">Politica de Retur</a></li>
                <li><a href="#" className="hover:text-brand-dark transition-colors">Contact</a></li>
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
          
          <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              <span onClick={handleNavigateToAdmin} className="cursor-pointer">&copy;</span> {new Date().getFullYear()} Euromag Ambalaje. Toate drepturile rezervate.
            </p>
            <div className="flex gap-4 text-sm text-gray-400">
              <a href="#" className="hover:text-gray-600">Termeni și Condiții</a>
              <a href="#" className="hover:text-gray-600">Politica de Confidențialitate</a>
              <a href="#" className="hover:text-gray-600">ANPC</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
