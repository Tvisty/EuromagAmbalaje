import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Product } from '../types';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  quantity: number;
  totalPrice: number;
  selectedOptions: Record<string, string>;
}

export function OrderModal({ isOpen, onClose, product, quantity, totalPrice, selectedOptions }: OrderModalProps) {
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    deliveryAddress: '',
    billingDetails: '',
    orderNotes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'orders'), {
        ...formData,
        productTitle: product.title,
        productId: product.id,
        quantity,
        totalPrice,
        selectedOptions,
        status: 'noua',
        createdAt: serverTimestamp()
      });
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
        setFormData({ customerName: '', customerEmail: '', customerPhone: '', deliveryAddress: '', billingDetails: '', orderNotes: '' });
      }, 3000);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'orders');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative">
        <div className="bg-brand-dark p-6 text-white text-center">
          <h2 className="text-2xl font-bold">Sumar Comandă</h2>
          <p className="text-gray-200 mt-1 text-sm">Completați datele pentru a plasa comanda rapidă.</p>
          <button onClick={onClose} className="absolute top-4 right-4 text-white hover:text-gray-300">&times;</button>
        </div>
        <div className="p-6">
          {isSuccess ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">✓</div>
              <h3 className="font-bold text-xl text-gray-900 mb-2">Comandă Plasată!</h3>
              <p className="text-gray-600 mb-4">Vă mulțumim. Vă vom contacta în curând pentru confirmare.</p>
              <button 
                onClick={onClose}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-6 rounded-lg transition-colors"
              >
                Închide
              </button>
            </div>
          ) : (
            <>
              <div className="bg-gray-50 border border-gray-100 p-4 rounded-lg mb-6">
                <p className="font-medium text-gray-900">{product.title}</p>
                <div className="flex justify-between text-sm text-gray-600 mt-1">
                  <span>Cantitate: {quantity} buc</span>
                  <span className="font-bold text-brand-dark">{totalPrice.toFixed(2)} RON</span>
                </div>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nume și Prenume (sau Companie) *</label>
                  <input required type="text" value={formData.customerName} onChange={e => setFormData({...formData, customerName: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-brand-light focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input required type="email" value={formData.customerEmail} onChange={e => setFormData({...formData, customerEmail: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-brand-light focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefon *</label>
                  <input required type="tel" value={formData.customerPhone} onChange={e => setFormData({...formData, customerPhone: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-brand-light focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Adresa de livrare *</label>
                  <textarea required value={formData.deliveryAddress} onChange={e => setFormData({...formData, deliveryAddress: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-brand-light focus:outline-none" rows={2} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date de facturare (opțional)</label>
                  <textarea placeholder="CUI, Nr. Reg. Com, Adresa sediu (dacă este firmă)" value={formData.billingDetails} onChange={e => setFormData({...formData, billingDetails: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-brand-light focus:outline-none" rows={2} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Observații comandă (opțional)</label>
                  <textarea value={formData.orderNotes} onChange={e => setFormData({...formData, orderNotes: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-brand-light focus:outline-none" rows={2} />
                </div>
                
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-brand-dark hover:bg-brand-dark/90 text-white font-bold py-3 px-8 rounded-lg transition-all shadow-md mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Se plasează comanda...' : 'Finalizează Comanda'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
