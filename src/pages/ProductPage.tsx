import React, { useState, useMemo, useEffect } from 'react';
import { ShoppingCart, Check, Package, ShieldCheck, Truck } from 'lucide-react';
import { Product } from '../types';
import { OrderModal } from '../components/OrderModal';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface ProductPageProps {
  product: Product;
}

export function ProductPage({ product }: ProductPageProps) {
  // Initialize state with the first value of each option
  const initialOptions = product.options.reduce((acc, option) => {
    acc[option.id] = option.values[0];
    return acc;
  }, {} as Record<string, string>);

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(initialOptions);
  const [quantity, setQuantity] = useState<number>(100);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [productPrices, setProductPrices] = useState<Record<string, number>>({});
  
  // Use product.images array if available, otherwise default to product.image
  const productImages = product.images && product.images.length > 0 ? product.images : [product.image];
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'product_prices', product.id));
        if (docSnap.exists()) {
          setProductPrices(docSnap.data().prices || {});
        }
      } catch (err) {
        console.error("Error fetching product prices:", err);
      }
    };
    fetchPrices();
  }, [product.id]);

  const handleOptionChange = (optionId: string, value: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [optionId]: value
    }));
  };

  const currentPricePerPiece = useMemo(() => {
    const dimensiune = selectedOptions['dimensiune'];
    if (dimensiune && productPrices[dimensiune] && productPrices[dimensiune] > 0) {
      return productPrices[dimensiune];
    }
    return product.basePrice;
  }, [product.basePrice, selectedOptions, productPrices]);

  const totalPrice = useMemo(() => {
    return currentPricePerPiece * quantity;
  }, [currentPricePerPiece, quantity]);

  return (
    <div className="bg-bg-light min-h-screen py-12">
      <OrderModal 
        isOpen={isOrderModalOpen} 
        onClose={() => setIsOrderModalOpen(false)} 
        product={product}
        quantity={quantity}
        totalPrice={totalPrice}
        selectedOptions={selectedOptions}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex flex-col md:flex-row">
            
            {/* Left: Image Gallery */}
            <div className="w-full md:w-1/2 md:border-r border-gray-100 flex flex-col p-8 lg:p-12">
              <div className="w-full relative bg-gray-50 rounded-xl overflow-hidden aspect-square mb-4">
                <img 
                  src={productImages[currentImageIndex]} 
                  alt={`${product.title} - Imagine ${currentImageIndex + 1}`} 
                  className="w-full h-full object-cover absolute inset-0"
                />
              </div>
              
              {/* Thumbnails */}
              {productImages.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {productImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                        currentImageIndex === idx ? 'border-brand-dark' : 'border-transparent hover:border-gray-300'
                      }`}
                    >
                      <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Product Details & Configurator */}
            <div className="w-full md:w-1/2 p-8 lg:p-12">
              <span className="inline-block py-1 px-3 rounded-full bg-brand-light/10 text-brand-dark text-xs font-bold mb-4 uppercase tracking-wider">
                Configurator Produs
              </span>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{product.title}</h1>
              <p className="text-gray-600 mb-6 text-lg tracking-wide leading-relaxed">
                {product.description}
              </p>

              {/* Price section */}
              <div className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium mb-1">Preț estimativ per bucată</p>
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-bold text-brand-dark">{currentPricePerPiece.toFixed(2)} RON</span>
                    <span className="text-gray-400 mb-1">+TVA</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500 font-medium mb-1">Ambalare</p>
                  <span className="font-semibold text-gray-800">{product.minimumOrder}</span>
                </div>
              </div>

              {/* Options */}
              <div className="space-y-6 mb-8">
                {product.options.map((option) => (
                  <div key={option.id}>
                    <label className="block text-sm font-bold text-gray-900 mb-3">
                      {option.name}
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {option.values.map((val) => {
                        const isSelected = selectedOptions[option.id] === val;
                        return (
                          <button
                            key={val}
                            onClick={() => handleOptionChange(option.id, val)}
                            className={`px-4 py-2.5 rounded-lg text-sm font-medium border transition-all duration-200 flex items-center gap-2 ${
                              isSelected 
                                ? 'border-brand-dark bg-brand-dark text-white shadow-md' 
                                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {isSelected && <Check className="w-4 h-4" />}
                            {val}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Quantity */}
              <div className="mb-8">
                <label className="block text-sm font-bold text-gray-900 mb-3">
                  Cantitate Dorită (BUC)
                </label>
                <div className="flex bg-white border border-gray-200 rounded-lg overflow-hidden w-48">
                  <button 
                    onClick={() => setQuantity(Math.max(100, quantity - 100))}
                    className="w-12 h-12 flex justify-center items-center text-gray-500 hover:bg-gray-50 hover:text-brand-dark transition-colors"
                  >
                    -
                  </button>
                  <input 
                    type="number" 
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full text-center font-bold text-gray-900 focus:outline-none"
                  />
                  <button 
                    onClick={() => setQuantity(quantity + 100)}
                    className="w-12 h-12 flex justify-center items-center text-gray-500 hover:bg-gray-50 hover:text-brand-dark transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <button 
                onClick={() => setIsOrderModalOpen(true)}
                className="w-full bg-brand-dark hover:bg-brand-dark/90 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3 text-lg"
              >
                <ShoppingCart className="w-6 h-6" />
                Trimite comanda rapidă
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 pt-8 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-light/10 text-brand-dark flex flex-shrink-0 items-center justify-center">
                    <Truck className="w-10 p-2" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Livrare rapidă din stoc sau la comandă</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex flex-shrink-0 flex items-center justify-center">
                    <ShieldCheck className="w-10 p-2" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Materiale de calitate garantată</span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {product.features && (
          <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Package className="text-brand-dark" /> Specificații și Avantaje
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {product.features.map((feature, idx) => (
                <li key={idx} className="flex items-start">
                  <Check className="w-5 h-5 text-brand-light mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
