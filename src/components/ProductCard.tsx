import React, { useState, useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';
import { Product } from '../types';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

interface ProductCardProps {
  product: Product;
  onNavigateToProduct: (productId: string) => void;
}

export function ProductCard({ product, onNavigateToProduct }: ProductCardProps) {
  const [basePrice, setBasePrice] = useState<number>(product.basePrice);
  const [isOutOfStock, setIsOutOfStock] = useState<boolean>(false);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'product_prices', product.id));
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.basePrice !== undefined) setBasePrice(data.basePrice);
          if (data.isOutOfStock !== undefined) setIsOutOfStock(data.isOutOfStock);
        }
      } catch (err) {
        console.error("Error fetching product prices:", err);
      }
    };
    fetchPrices();
  }, [product.id]);

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden group">
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
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center backdrop-blur-[2px]">
            <span className="bg-red-600 text-white font-bold px-4 py-2 rounded-lg text-sm shadow-lg transform -rotate-12 border-2 border-white">
              STOC EPUIZAT
            </span>
          </div>
        )}
      </div>
      <div className="p-5 flex flex-col flex-grow relative">
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
                 <div className={`text-xl font-bold ${isOutOfStock ? 'text-gray-400 line-through' : 'text-brand-dark'}`}>{basePrice.toFixed(2)}</div>
                 <div className="text-xs font-medium text-gray-500 mb-[3px]">RON (Tva inclus)</div>
              </div>
           </div>
        </div>
        <button 
          onClick={() => onNavigateToProduct(product.id)}
          disabled={isOutOfStock}
          className={`w-full font-medium py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 text-sm shadow-sm ${
            isOutOfStock 
            ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed' 
            : 'bg-white border border-gray-200 text-brand-dark hover:border-brand-dark hover:bg-brand-dark hover:text-white'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          {isOutOfStock ? 'Indisponibil' : (product.options && product.options.length > 0 ? 'Vezi Dimensiuni' : 'Vezi Detalii')}
        </button>
      </div>
    </div>
  );
}
