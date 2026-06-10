import React from 'react';
import { ChevronLeft, ShoppingCart } from 'lucide-react';
import { Product, Category } from '../types';

interface CategoryPageProps {
  category: Category;
  products: Product[];
  onNavigateToProduct: (productId: string) => void;
  onNavigateBack: () => void;
}

export function CategoryPage({ category, products, onNavigateToProduct, onNavigateBack }: CategoryPageProps) {
  return (
    <div className="bg-bg-light min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button 
          onClick={onNavigateBack}
          className="flex items-center text-gray-600 hover:text-brand-dark font-medium transition-colors text-sm mb-8"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Înapoi la categorii
        </button>

        <div className="mb-12 flex items-center gap-6">
          <div className="w-24 h-24 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex-shrink-0">
             <img src={category.image} alt={category.title} className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{category.title}</h1>
            <p className="text-gray-500 text-lg">{category.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
             <div key={product.id} className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden group">
              <div 
                className="relative w-full overflow-hidden bg-gray-50 cursor-pointer aspect-square"
                onClick={() => onNavigateToProduct(product.id)}
              >
                <img 
                  src={product.image} 
                  alt={product.title} 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <h4 
                  className="font-bold text-gray-900 text-lg mb-2 line-clamp-2 cursor-pointer hover:text-brand-dark transition-colors"
                  onClick={() => onNavigateToProduct(product.id)}
                >
                  {product.title}
                </h4>
                <div className="text-sm text-gray-500 mb-4 flex-grow space-y-1">
                  {product.features?.slice(0, 3).map((feature, idx) => (
                     <p key={idx} className="line-clamp-1 flex items-center">
                       <span className="w-1.5 h-1.5 rounded-full bg-brand-light/50 mr-2 flex-shrink-0"></span>
                       {feature}
                     </p>
                  ))}
                </div>
                <div className="mt-auto flex justify-between items-end mb-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
                   <div>
                      <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider mb-0.5">Preț minim per bucată</span>
                      <div className="flex items-end gap-1">
                         <div className="text-xl font-bold text-brand-dark">{product.basePrice.toFixed(2)}</div>
                         <div className="text-xs font-medium text-gray-500 mb-[3px]">RON +TVA</div>
                      </div>
                   </div>
                </div>
                <button 
                  onClick={() => onNavigateToProduct(product.id)}
                  className="w-full bg-white border border-gray-200 text-brand-dark hover:border-brand-dark hover:bg-brand-dark hover:text-white font-medium py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 text-sm shadow-sm"
                >
                  <ShoppingCart className="w-4 h-4" />
                  {product.options && product.options.length > 0 ? 'Vezi Dimensiuni' : 'Vezi Detalii'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
