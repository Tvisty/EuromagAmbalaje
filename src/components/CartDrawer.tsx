import React from 'react';
import { X, Trash2, ShoppingBag } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
}

export function CartDrawer({ isOpen, onClose, cartItems, onRemoveItem, onCheckout }: CartDrawerProps) {
  if (!isOpen) return null;

  const totalOrderPrice = cartItems.reduce((acc, item) => acc + item.totalPrice, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md">
          <div className="h-full flex flex-col bg-white shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-6 sm:px-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <ShoppingBag className="w-6 h-6 mr-2" />
                Coșul tău
              </h2>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-500"
                onClick={onClose}
              >
                <span className="sr-only">Închide</span>
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <ShoppingBag className="w-10 h-10 text-gray-400" />
                  </div>
                  <p className="text-lg font-medium text-gray-900 mb-1">Coșul este gol</p>
                  <p className="text-gray-500 mb-6">Nu ai adăugat încă niciun produs.</p>
                  <button 
                    onClick={onClose}
                    className="bg-brand-dark text-white px-6 py-2 rounded-lg font-medium hover:bg-brand-dark/90 transition-colors"
                  >
                    Întoarce-te la magazin
                  </button>
                </div>
              ) : (
                <ul role="list" className="-my-6 divide-y divide-gray-200">
                  {cartItems.map((item) => (
                    <li key={item.id} className="py-6 flex">
                      <div className="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden bg-white flex items-center justify-center p-2">
                        <img
                          src={item.product.image}
                          alt={item.product.title}
                          className="w-full h-full object-contain"
                        />
                      </div>

                      <div className="ml-4 flex-1 flex flex-col">
                        <div>
                          <div className="flex justify-between text-base font-medium text-gray-900">
                            <h3 className="line-clamp-2 pr-4">{item.product.title}</h3>
                            <p className="ml-4 whitespace-nowrap">{item.totalPrice.toFixed(2)} RON</p>
                          </div>
                          <p className="mt-1 text-sm text-gray-500">
                            {Object.entries(item.selectedOptions).map(([key, val]) => val).join(' | ')}
                          </p>
                        </div>
                        <div className="flex-1 flex items-end justify-between text-sm">
                          <p className="text-gray-500 font-medium">Cantitate: {item.quantity}</p>

                          <div className="flex">
                            <button
                              type="button"
                              onClick={() => onRemoveItem(item.id)}
                              className="font-medium text-red-600 hover:text-red-500 flex items-center"
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              <span className="hidden sm:inline">Șterge</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="border-t border-gray-200 px-4 py-6 sm:px-6 bg-gray-50">
                <div className="flex justify-between text-base font-bold text-gray-900 mb-4">
                  <p>Total</p>
                  <p>{totalOrderPrice.toFixed(2)} RON</p>
                </div>
                <div className="mt-6">
                  <button
                    onClick={onCheckout}
                    className="w-full flex justify-center items-center px-6 py-4 border border-transparent rounded-lg shadow-sm text-base font-bold text-white bg-brand-dark hover:bg-brand-dark/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-light transition-colors"
                  >
                    Spre Finalizare Comandă
                  </button>
                </div>
                <div className="mt-6 flex justify-center text-sm text-center text-gray-500">
                  <p>
                    sau{' '}
                    <button
                      type="button"
                      className="text-brand-dark font-medium hover:text-brand-light"
                      onClick={onClose}
                    >
                      Continuă cumpărăturile<span aria-hidden="true"> &rarr;</span>
                    </button>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
