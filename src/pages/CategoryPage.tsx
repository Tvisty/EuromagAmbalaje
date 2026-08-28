import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { Product, Category } from '../types';
import { ProductCard } from '../components/ProductCard';

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
            <ProductCard 
              key={product.id} 
              product={product} 
              onNavigateToProduct={onNavigateToProduct} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}
