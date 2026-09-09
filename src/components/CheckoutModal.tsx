import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { CartItem } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onClearCart: () => void;
}

export function CheckoutModal({ isOpen, onClose, cartItems, onClearCart }: CheckoutModalProps) {
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    deliveryAddress: '',
    billingDetails: '',
    orderNotes: '',
    paymentMethod: 'ramburs',
    deliveryMethod: 'curier'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const totalOrderPrice = cartItems.reduce((acc, item) => acc + item.totalPrice, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validare manuală pentru siguranță
    if (!formData.customerName || !formData.customerEmail || !formData.customerPhone) {
      alert("Te rugăm să completezi toate câmpurile obligatorii (Nume, Email, Telefon)!");
      return;
    }
    
    setIsSubmitting(true);
    console.log("=== START PROCESARE COMANDĂ ===");
    try {
      const isCardPayment = formData.paymentMethod === 'card';
      console.log("Metodă plată:", isCardPayment ? "Stripe (Card)" : "Ramburs");
      
      const newOrderRef = await addDoc(collection(db, 'orders'), {
        ...formData,
        deliveryAddress: formData.deliveryMethod === 'ridicare' ? 'Ridicare personală' : formData.deliveryAddress,
        items: cartItems.map(item => ({
          productId: item.product.id,
          productTitle: item.product.title,
          quantity: item.quantity,
          totalPrice: item.totalPrice,
          selectedOptions: item.selectedOptions
        })),
        totalPrice: totalOrderPrice,
        status: isCardPayment ? 'plata_in_asteptare' : 'noua',
        createdAt: serverTimestamp()
      });
      
      console.log("Comandă salvată în Firebase cu ID-ul:", newOrderRef.id);

      if (isCardPayment) {
        console.log("Se trimit datele către serverul intern pentru Stripe...");
        // Call backend to create Stripe Checkout session
        const response = await fetch('/api/create-checkout-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: cartItems.map(item => ({
              productTitle: item.product.title,
              selectedOptions: item.selectedOptions,
              quantity: item.quantity,
              totalPrice: item.totalPrice
            })),
            orderId: newOrderRef.id,
            customerEmail: formData.customerEmail
          })
        });

        const data = await response.json();
        console.log("Răspuns de la serverul Stripe:", data);
        
        if (data.url) {
          if (window.self !== window.top) {
             alert("Atenție: Deschide aplicația într-un tab nou pentru a finaliza plata.");
             window.open(data.url, '_blank');
          } else {
             console.log("Redirecționare către:", data.url);
             window.location.href = data.url; // Redirect to Stripe Checkout
          }
          return;
        } else {
          throw new Error(data.error || 'Failed to initialize payment');
        }
      }

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClearCart();
        onClose();
        setFormData({ ...formData, customerName: '', customerEmail: '', customerPhone: '', deliveryAddress: '', billingDetails: '', orderNotes: '' });
      }, 3000);
    } catch (error: any) {
      console.error("EROARE CATCH:", error);
      alert('Eroare la procesarea comenzii: ' + (error.message || 'Eroare necunoscută'));
      handleFirestoreError(error, OperationType.CREATE, 'orders');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl relative my-8">
        <div className="bg-brand-dark p-6 text-white text-center rounded-t-2xl">
          <h2 className="text-2xl font-bold">Finalizare Comandă</h2>
          <p className="text-gray-200 mt-1 text-sm">Completați datele pentru a plasa comanda.</p>
          <button onClick={onClose} className="absolute top-4 right-4 text-white hover:text-gray-300">&times;</button>
        </div>
        <div className="p-6">
          {isSuccess ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">✓</div>
              <h3 className="font-bold text-xl text-gray-900 mb-2">Comandă Plasată!</h3>
              <p className="text-gray-600 mb-4">Vă mulțumim. Vă vom contacta în curând pentru confirmare.</p>
              <button 
                onClick={() => { onClose(); onClearCart(); setIsSuccess(false); }}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-6 rounded-lg transition-colors"
              >
                Închide
              </button>
            </div>
          ) : (
            <>
              <div className="bg-gray-50 border border-gray-100 p-4 rounded-lg mb-6 max-h-48 overflow-y-auto">
                <h4 className="font-bold text-gray-800 mb-2 border-b pb-2">Sumar Produse ({cartItems.length})</h4>
                {cartItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm border-b border-gray-100 last:border-0 py-2">
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900">{item.product.title}</span>
                      <span className="text-xs text-gray-500">
                        Cantitate: {item.quantity} buc
                        {Object.entries(item.selectedOptions).map(([key, val]) => ` | ${val}`).join('')}
                      </span>
                    </div>
                    <span className="font-bold text-brand-dark min-w-[80px] text-right">{item.totalPrice.toFixed(2)} RON</span>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-3 mt-1 font-bold text-gray-900">
                  <span>Total:</span>
                  <span className="text-lg text-brand-dark">{totalOrderPrice.toFixed(2)} RON</span>
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
                {formData.deliveryMethod !== 'ridicare' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Adresa de livrare *</label>
                    <textarea required value={formData.deliveryAddress} onChange={e => setFormData({...formData, deliveryAddress: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-brand-light focus:outline-none" rows={2} />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date de facturare (opțional)</label>
                  <textarea placeholder="CUI, Nr. Reg. Com, Adresa sediu (dacă este firmă)" value={formData.billingDetails} onChange={e => setFormData({...formData, billingDetails: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-brand-light focus:outline-none" rows={2} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Observații comandă (opțional)</label>
                  <textarea value={formData.orderNotes} onChange={e => setFormData({...formData, orderNotes: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-brand-light focus:outline-none" rows={2} />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-b py-4 my-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-2">Metodă de livrare</label>
                    <div className="space-y-2">
                      <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                        <input type="radio" name="deliveryMethod" value="curier" checked={formData.deliveryMethod === 'curier'} onChange={e => setFormData({...formData, deliveryMethod: e.target.value})} className="text-brand-dark focus:ring-brand-dark" />
                        <span className="ml-2 text-sm text-gray-900 font-medium">Prin Curier Rapid</span>
                      </label>
                      <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                        <input type="radio" name="deliveryMethod" value="ridicare" checked={formData.deliveryMethod === 'ridicare'} onChange={e => setFormData({...formData, deliveryMethod: e.target.value})} className="text-brand-dark focus:ring-brand-dark" />
                        <span className="ml-2 text-sm text-gray-900 font-medium">Ridicare personală din depozit</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-2">Metodă de plată</label>
                    <div className="space-y-2">
                      <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                        <input type="radio" name="paymentMethod" value="ramburs" checked={formData.paymentMethod === 'ramburs'} onChange={e => setFormData({...formData, paymentMethod: e.target.value})} className="text-brand-dark focus:ring-brand-dark" />
                        <span className="ml-2 text-sm text-gray-900 font-medium">Ramburs la curier / Numerar</span>
                      </label>
                      <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                        <input type="radio" name="paymentMethod" value="card" checked={formData.paymentMethod === 'card'} onChange={e => setFormData({...formData, paymentMethod: e.target.value})} className="text-brand-dark focus:ring-brand-dark" />
                        <span className="ml-2 text-sm text-gray-900 font-medium">Plată online cu Cardul (Stripe)</span>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-4 mt-4">
                  <button 
                    type="button"
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="w-1/3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-4 rounded-lg transition-all"
                  >
                    Anulează
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSubmitting || cartItems.length === 0}
                    className="w-2/3 bg-brand-dark hover:bg-brand-dark/90 text-white font-bold py-3 px-8 rounded-lg transition-all shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Se procesează...' : 'Finalizează'}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
