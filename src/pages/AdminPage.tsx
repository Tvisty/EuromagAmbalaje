import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc, setDoc } from 'firebase/firestore';
import { auth, db, loginWithEmail, logout, handleFirestoreError, OperationType } from '../lib/firebase';
import { products } from '../data';
import { Trash2 } from 'lucide-react';

export function AdminPage() {
  const [user, loading] = useAuthState(auth);
  const [orders, setOrders] = useState<any[]>([]);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'orders' | 'quotes' | 'settings'>('orders');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{id: string, type: 'order' | 'quote'} | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);
    try {
      await loginWithEmail(email, password);
    } catch (err: any) {
      setLoginError(err.message || 'Eroare la autentificare');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const ADMIN_EMAILS = ["gleczfalvi@gmail.com", "euromagambalaje@gmail.com"];
  const isAdmin = user && user.email && ADMIN_EMAILS.includes(user.email);

  useEffect(() => {
    if (!isAdmin) return;

    const ordersRef = collection(db, 'orders');
    const qOrders = query(ordersRef, orderBy('createdAt', 'desc'));
    
    const unsubscribeOrders = onSnapshot(qOrders, (snapshot) => {
      setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, 'orders');
      } catch (e) {
        console.error(e);
      }
    });

    const quotesRef = collection(db, 'quotes');
    const qQuotes = query(quotesRef, orderBy('createdAt', 'desc'));
    
    const unsubscribeQuotes = onSnapshot(qQuotes, (snapshot) => {
      setQuotes(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, 'quotes');
      } catch (e) {
        console.error(e);
      }
    });

    return () => {
      unsubscribeOrders();
      unsubscribeQuotes();
    };
  }, [isAdmin]);

  const updateOrderStatus = async (id: string, newStatus: string, currentOrder: any) => {
    try {
      await updateDoc(doc(db, 'orders', id), {
        status: newStatus
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `orders/${id}`);
    }
  };

  const updateQuoteStatus = async (id: string, newStatus: string, currentQuote: any) => {
    try {
      await updateDoc(doc(db, 'quotes', id), {
        status: newStatus
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `quotes/${id}`);
    }
  };

  const requestDeleteOrder = (id: string) => {
    setItemToDelete({ id, type: 'order' });
  };

  const requestDeleteQuote = (id: string) => {
    setItemToDelete({ id, type: 'quote' });
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      if (itemToDelete.type === 'order') {
        await deleteDoc(doc(db, 'orders', itemToDelete.id));
      } else if (itemToDelete.type === 'quote') {
        await deleteDoc(doc(db, 'quotes', itemToDelete.id));
      }
      setItemToDelete(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `${itemToDelete.type}s/${itemToDelete.id}`);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Se încarcă...</div>;
  }

  if (!user) {
    return (
      <div className="p-8 max-w-md mx-auto text-center border mt-8 rounded-lg bg-white shadow-sm">
        <h2 className="text-xl font-bold mb-4">Panou Administrator</h2>
        <p className="mb-6 text-gray-600">Autentificați-vă pentru a accesa această pagină.</p>
        <form onSubmit={handleLogin} className="space-y-4 text-left">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-brand-light focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Parolă</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-brand-light focus:outline-none"
            />
          </div>
          {loginError && (
            <div className="text-sm text-red-600 bg-red-50 p-2 rounded">{loginError}</div>
          )}
          <div className="flex flex-col gap-2 mt-4">
            <button 
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-brand-dark text-white font-bold px-6 py-3 rounded-lg hover:bg-brand-dark/90 transition-colors disabled:opacity-70"
            >
              {isLoggingIn ? 'Se autentifică...' : 'Autentificare'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="p-8 max-w-md mx-auto text-center border mt-8 rounded-lg bg-white shadow-sm">
        <h2 className="text-xl font-bold mb-4 text-red-600">Acces interzis</h2>
        <p className="mb-6 text-gray-600">Nu aveți permisiuni de administrator pentru acest cont ({user.email}).</p>
        <button 
          onClick={logout}
          className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold px-6 py-2 rounded-lg transition-colors"
        >
          Deconectare
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Panou de Administrare</h1>
          <p className="text-sm text-gray-500 mt-1">Autentificat ca: {user.email}</p>
        </div>
        <button onClick={logout} className="text-sm border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50">
          Deconectare
        </button>
      </div>

      <div className="flex gap-4 border-b border-gray-200 mb-8">
        <button 
          onClick={() => setActiveTab('orders')}
          className={`pb-4 px-2 font-medium text-sm transition-colors ${activeTab === 'orders' ? 'border-b-2 border-brand-dark text-brand-dark' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Comenzi ({orders.length})
        </button>
        <button 
          onClick={() => setActiveTab('quotes')}
          className={`pb-4 px-2 font-medium text-sm transition-colors ${activeTab === 'quotes' ? 'border-b-2 border-brand-dark text-brand-dark' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Cereri Ofertă ({quotes.length})
        </button>
        <button 
          onClick={() => setActiveTab('settings')}
          className={`pb-4 px-2 font-medium text-sm transition-colors ${activeTab === 'settings' ? 'border-b-2 border-brand-dark text-brand-dark' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Setări Prețuri
        </button>
      </div>

      {activeTab === 'orders' && (
        <div className="space-y-4">
          <h2 className="font-bold text-lg mb-4">Toate Comenzile</h2>
          {orders.length === 0 ? (
            <p className="text-gray-500 py-8 text-center border border-dashed rounded-lg">Nu există comenzi momentan.</p>
          ) : (
            orders.map(order => (
              <div key={order.id} className="border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold">{order.customerName}</span>
                    <span className="text-sm text-gray-400">({new Date(order.createdAt).toLocaleString('ro-RO')})</span>
                  </div>
                  <div className="text-sm text-gray-600 mb-1">
                    <span className="font-medium text-gray-900">Contact:</span> {order.customerEmail} | {order.customerPhone}
                  </div>
                  <div className="text-sm text-gray-600 mt-2 mb-2 bg-gray-50 p-2 rounded">
                    <span className="font-medium text-gray-900 block mb-1">Produse ({order.items?.length || 0}):</span>
                    <ul className="list-disc pl-4 space-y-1">
                      {order.items?.map((item: any, idx: number) => (
                        <li key={idx}>
                          <span className="font-medium">{item.productTitle}</span> x {item.quantity} buc 
                          <span className="text-gray-500 text-xs ml-1">
                            ({Object.entries(item.selectedOptions || {}).map(([k,v]) => v).join(' | ')})
                          </span>
                        </li>
                      ))}
                      {/* Fallback for older orders without items array */}
                      {!order.items && order.productTitle && (
                        <li>
                          <span className="font-medium">{order.productTitle}</span> x {order.quantity} buc
                        </li>
                      )}
                    </ul>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    <span className="font-medium text-gray-900">Total estimat:</span> {order.totalPrice?.toFixed(2)} RON
                  </div>
                  <div className="text-sm text-gray-600 mt-1 grid grid-cols-2 gap-2 mt-2">
                    <div>
                      <span className="font-medium text-gray-900 block">Metodă livrare:</span> 
                      <span className="capitalize">{order.deliveryMethod === 'ridicare' ? 'Ridicare personală' : 'Prin curier rapid'}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900 block">Metodă plată:</span> 
                      <span className="capitalize">{order.paymentMethod === 'card' ? 'Card bancar (Stripe)' : 'Ramburs / Numerar'}</span>
                    </div>
                  </div>
                  {order.deliveryAddress && order.deliveryMethod !== 'ridicare' && (
                    <div className="text-sm text-gray-600 mt-2">
                      <span className="font-medium text-gray-900">Adresa Livrare:</span> {order.deliveryAddress}
                    </div>
                  )}
                  {order.billingDetails && (
                    <div className="text-sm text-gray-600 mt-1">
                      <span className="font-medium text-gray-900">Date Facturare:</span> {order.billingDetails}
                    </div>
                  )}
                  {order.orderNotes && (
                    <div className="text-sm text-gray-600 mt-1">
                      <span className="font-medium text-gray-900">Observații:</span> {order.orderNotes}
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-end justify-between min-w-[200px]">
                  <select 
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value, order)}
                    className="border border-gray-300 rounded p-1 mb-2 text-sm w-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-light"
                  >
                    <option value="noua">Nouă</option>
                    <option value="plata_in_asteptare">Așteptare Plată</option>
                    <option value="platita">Plătită</option>
                    <option value="in_lucru">În Lucru</option>
                    <option value="finalizata">Finalizată</option>
                    <option value="anulata">Anulată</option>
                  </select>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      order.status === 'noua' ? 'bg-blue-100 text-blue-700' :
                      order.status === 'plata_in_asteptare' ? 'bg-orange-100 text-orange-700' :
                      order.status === 'platita' ? 'bg-emerald-100 text-emerald-700' :
                      order.status === 'in_lucru' ? 'bg-yellow-100 text-yellow-700' :
                      order.status === 'finalizata' ? 'bg-green-100 text-green-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {order.status}
                    </span>
                    <button 
                      onClick={() => requestDeleteOrder(order.id)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                      title="Șterge comanda"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'quotes' && (
        <div className="space-y-4">
          <h2 className="font-bold text-lg mb-4">Cereri de Ofertă</h2>
          {quotes.length === 0 ? (
            <p className="text-gray-500 py-8 text-center border border-dashed rounded-lg">Nu există cereri de ofertă momentan.</p>
          ) : (
            quotes.map(quote => (
              <div key={quote.id} className="border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold">{quote.companyName}</span>
                    <span className="text-xs border px-1.5 py-0.5 rounded text-gray-500">CUI: {quote.cui}</span>
                    <span className="text-sm text-gray-400">({new Date(quote.createdAt).toLocaleString('ro-RO')})</span>
                  </div>
                  <div className="text-sm text-gray-600 mb-1">
                    <span className="font-medium text-gray-900">Contact:</span> {quote.contactName} | {quote.email} | {quote.phone}
                  </div>
                  <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded mt-2 border">
                    <span className="font-medium text-gray-900 text-xs block mb-1">Mesaj Client:</span>
                    {quote.message || <span className="italic text-gray-400">Niciun mesaj suplimentar</span>}
                  </div>
                </div>
                <div className="flex flex-col items-end justify-between min-w-[200px]">
                  <select 
                    value={quote.status}
                    onChange={(e) => updateQuoteStatus(quote.id, e.target.value, quote)}
                    className="border border-gray-300 rounded p-1 mb-2 text-sm w-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-light"
                  >
                    <option value="noua">Nouă</option>
                    <option value="contactat">Contactat</option>
                    <option value="oferta_trimisa">Ofertă Trimisă</option>
                    <option value="inchisa">Închisă</option>
                  </select>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      quote.status === 'noua' ? 'bg-blue-100 text-blue-700' :
                      quote.status === 'contactat' ? 'bg-yellow-100 text-yellow-700' :
                      quote.status === 'oferta_trimisa' ? 'bg-purple-100 text-purple-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {quote.status}
                    </span>
                    <button 
                      onClick={() => requestDeleteQuote(quote.id)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                      title="Șterge cererea"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="space-y-8">
          <section>
            <h2 className="font-bold text-xl mb-4">Setări Globale</h2>
            <p className="text-gray-500 text-sm mb-4">Aici puteți configura setările globale ale magazinului.</p>
            <SettingsEditor />
          </section>
          
          <section>
            <h2 className="font-bold text-xl mb-4">Prețuri per Produs și Dimensiuni</h2>
            <p className="text-gray-500 text-sm mb-4">Stabiliți prețurile pentru fiecare variație în parte. Dacă lăsați un câmp gol, sistemul va folosi prețul de bază al produsului.</p>
            <ProductPricesEditor />
          </section>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-lg max-w-sm w-full p-6 animate-in fade-in zoom-in-95">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Confirmare Ștergere</h3>
            <p className="text-gray-600 mb-6 text-sm">
              Sigur doriți să ștergeți {itemToDelete.type === 'order' ? 'această comandă' : 'această cerere de ofertă'}? Această acțiune este ireversibilă.
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setItemToDelete(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Anulează
              </button>
              <button 
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                Șterge
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SettingsEditor() {
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'global'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setSettings({ minOrder: data.minOrder?.toString() || '500' });
      } else {
        setSettings({ minOrder: '500' });
      }
      setLoading(false);
    }, (err) => {
      console.error(err);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    try {
      const parsedSettings = {
        minOrder: settings.minOrder === '' ? 0 : Number(settings.minOrder)
      };
      await updateDoc(doc(db, 'settings', 'global'), parsedSettings).catch(async (err) => {
         await setDoc(doc(db, 'settings', 'global'), parsedSettings);
      });
      setSuccessMsg('Setările au fost salvate cu succes!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Se încarcă setările...</div>;

  return (
    <form onSubmit={handleSave} className="border border-gray-200 rounded-lg p-6 bg-white max-w-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Comandă minimă (RON)</label>
          <input 
            type="number" 
            name="minOrder"
            value={settings.minOrder || 0} 
            onChange={handleChange}
            className="w-full border border-gray-300 rounded p-2 focus:ring-brand-light focus:outline-none focus:ring-2"
          />
        </div>
      </div>
      <div className="mt-6 flex items-center gap-4">
        <button 
          type="submit" 
          disabled={saving}
          className="bg-brand-dark text-white px-6 py-2 rounded font-medium hover:bg-brand-dark/90 disabled:opacity-75"
        >
          {saving ? 'Se salvează...' : 'Salvează Setările'}
        </button>
        {successMsg && <span className="text-green-600 text-sm font-medium">{successMsg}</span>}
      </div>
    </form>
  );
}

function ProductPricesEditor() {
  const [productData, setProductData] = useState<Record<string, { prices: Record<string, number | string>, basePrice: number | string, discount: number | string, isOutOfStock?: boolean }>>({});
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'product_prices'), (snapshot) => {
      const data: Record<string, { prices: Record<string, number | string>, basePrice: number | string, discount: number | string, isOutOfStock?: boolean }> = {};
      snapshot.forEach(doc => {
        data[doc.id] = {
          prices: doc.data().prices || {},
          basePrice: doc.data().basePrice || 0,
          discount: doc.data().discount || 0,
          isOutOfStock: doc.data().isOutOfStock || false
        };
      });
      setProductData(data);
      setLoading(false);
    }, (err) => {
      console.error("Error fetching product prices:", err);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handlePriceChange = (productId: string, variantKey: string, value: string) => {
    setProductData(prev => ({
      ...prev,
      [productId]: {
        ...(prev[productId] || { prices: {}, basePrice: 0, discount: 0, isOutOfStock: false }),
        prices: {
          ...(prev[productId]?.prices || {}),
          [variantKey]: value
        }
      }
    }));
  };

  const handleDataChange = (productId: string, field: 'basePrice' | 'discount' | 'isOutOfStock', value: any) => {
    setProductData(prev => ({
      ...prev,
      [productId]: {
        ...(prev[productId] || { prices: {}, basePrice: 0, discount: 0, isOutOfStock: false }),
        [field]: value
      }
    }));
  };

  const handleSavePrices = async (productId: string) => {
    setSavingId(productId);
    setSuccessMsg('');
    try {
      const data = productData[productId] || { prices: {}, basePrice: 0, discount: 0, isOutOfStock: false };
      
      const parsedPrices: Record<string, number> = {};
      for (const [key, val] of Object.entries(data.prices)) {
        parsedPrices[key] = val === '' ? 0 : Number(val);
      }
      
      const formattedData = {
        prices: parsedPrices,
        basePrice: data.basePrice === '' ? 0 : Number(data.basePrice),
        discount: data.discount === '' ? 0 : Number(data.discount),
        isOutOfStock: Boolean(data.isOutOfStock)
      };

      await setDoc(doc(db, 'product_prices', productId), formattedData, { merge: true });
      setSuccessMsg('Setări salvate cu succes pentru acest produs!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSavingId(null);
    }
  };

  if (loading) return <div>Se încarcă lista de prețuri...</div>;

  return (
    <div className="space-y-6">
      {successMsg && <div className="p-3 bg-green-50 text-green-700 rounded-lg text-sm font-medium border border-green-200">{successMsg}</div>}
      
      {products.map(product => {
        const dimensiuni = product.options.find(o => o.id === 'dimensiune')?.values || [];
        const currentData = productData[product.id] || { prices: {}, basePrice: 0, discount: 0, isOutOfStock: false };
        
        return (
          <div key={product.id} className="border border-gray-200 rounded-lg p-6 bg-white overflow-hidden shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 pb-4 mb-4 gap-4">
              <div className="flex items-center gap-4">
                <img src={product.image} alt={product.title} className="w-12 h-12 rounded object-cover border" />
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{product.title}</h3>
                  <p className="text-sm text-gray-500">Preț implicit setat în cod: <span className="font-medium text-brand-dark">{product.basePrice.toFixed(2)} RON</span></p>
                </div>
              </div>
              <button 
                onClick={() => handleSavePrices(product.id)}
                disabled={savingId === product.id}
                className="px-5 py-2 bg-brand-dark text-white rounded font-medium hover:bg-brand-dark/90 disabled:opacity-50 text-sm whitespace-nowrap shadow-sm"
              >
                {savingId === product.id ? 'Se salvează...' : 'Salvează Setări Produs'}
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-amber-50/50 rounded-lg border border-amber-100/50">
              {dimensiuni.length === 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preț Unic Bază (RON)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder={product.basePrice.toString()}
                    value={currentData.basePrice || ''}
                    onChange={(e) => handleDataChange(product.id, 'basePrice', e.target.value)}
                    className="w-full border border-gray-300 rounded p-1.5 text-sm focus:ring-brand-light focus:outline-none focus:ring-2 font-medium"
                  />
                  <p className="text-xs text-gray-500 mt-1">Înlocuiește prețul implicit pentru produsele fără mărimi (ex: pungi).</p>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Discount Extra Produs (%)</label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  max="100"
                  placeholder="0"
                  value={currentData.discount || ''}
                  onChange={(e) => handleDataChange(product.id, 'discount', e.target.value)}
                  className="w-full border border-gray-300 rounded p-1.5 text-sm focus:ring-brand-light focus:outline-none focus:ring-2 font-medium"
                />
                <p className="text-xs text-gray-500 mt-1">Se aplică reducerii la toate variațiile acestui produs.</p>
              </div>

              <div className="flex items-center mt-4 sm:mt-0 sm:col-span-2">
                <label className="flex items-center cursor-pointer p-3 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-100 w-full">
                  <input
                    type="checkbox"
                    checked={Boolean(currentData.isOutOfStock)}
                    onChange={(e) => handleDataChange(product.id, 'isOutOfStock', e.target.checked)}
                    className="w-5 h-5 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  />
                  <div className="ml-3 flex flex-col">
                    <span className="text-sm font-bold text-red-900">Stoc Epuizat (Indisponibil)</span>
                    <span className="text-xs text-red-700">Blochează comanda pentru acest produs.</span>
                  </div>
                </label>
              </div>
            </div>

            {dimensiuni.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {dimensiuni.map(val => (
                  <div key={val} className="border border-gray-100 p-3 rounded-lg bg-gray-50 flex flex-col justify-between hover:border-gray-200 transition-colors">
                    <span className="text-sm font-medium text-gray-700 mb-3 truncate block border-b border-gray-200 pb-2" title={val}>{val}</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        step="0.01"
                        placeholder={product.basePrice.toString()}
                        value={currentData.prices[val] || ''}
                        onChange={(e) => handlePriceChange(product.id, val, e.target.value)}
                        className="w-full border border-gray-300 rounded p-1.5 text-sm focus:ring-brand-light focus:outline-none focus:ring-2 font-medium"
                      />
                      <span className="text-gray-500 text-sm font-medium">RON</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 italic py-2">Nu sunt mărimi variabile de setat. Prețul setat din "Preț Unic Bază" se va aplica.</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
