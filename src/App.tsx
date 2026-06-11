/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, ShoppingCart, User, Menu, ChevronLeft } from 'lucide-react';
import { HomePage } from './pages/HomePage';
import { ProductPage } from './pages/ProductPage';
import { CategoryPage } from './pages/CategoryPage';
import { AdminPage } from './pages/AdminPage';
import { products, categories } from './data';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentView, setCurrentView] = useState<'home' | 'category' | 'product' | 'admin'>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

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

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900 bg-white">
      {/* Top Banner */}
      <div className="bg-brand-dark text-white text-xs py-2 text-center font-medium tracking-wide">
        LIVRARE GRATUITĂ PENTRU COMENZI PESTE 500 RON
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
              <button className="hidden sm:flex flex-col items-center text-gray-500 hover:text-brand-dark transition-colors">
                <User className="w-6 h-6 mb-1" />
                <span className="text-xs font-medium">Contul meu</span>
              </button>
              <button className="flex flex-col items-center text-gray-500 hover:text-brand-dark transition-colors relative">
                <div className="relative">
                  <ShoppingCart className="w-6 h-6 mb-1" />
                  <span className="absolute -top-1 -right-2 bg-brand-light text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    0
                  </span>
                </div>
                <span className="text-xs font-medium">Coșul tău</span>
              </button>
              <button className="md:hidden text-gray-500">
                <Menu className="w-6 h-6" />
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
          <ProductPage product={currentProduct} />
        )}

        {currentView === 'admin' && (
          <AdminPage />
        )}
      </main>

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
                <p><strong>Email:</strong> contact@euromag-ambalaje.ro</p>
                <p><strong>Telefon:</strong> 0700 000 000</p>
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
