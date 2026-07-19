import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { Package, LogOut, Loader2, ArrowLeft } from 'lucide-react';
import { auth, db, loginWithEmail, logout } from '../lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

interface AccountPageProps {
  onBack: () => void;
}

export function AccountPage({ onBack }: AccountPageProps) {
  const [user, loading] = useAuthState(auth);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [authError, setAuthError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const [orders, setOrders] = useState<any[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.email) return;
      setIsLoadingOrders(true);
      try {
        const q = query(
          collection(db, 'orders'),
          where('customerEmail', '==', user.email)
        );
        const querySnapshot = await getDocs(q);
        const ordersData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })).sort((a: any, b: any) => b.createdAt?.toMillis() - a.createdAt?.toMillis());
        setOrders(ordersData);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setIsLoadingOrders(false);
      }
    };

    if (user) {
      fetchOrders();
    } else {
      setOrders([]);
    }
  }, [user]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsAuthenticating(true);
    
    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await loginWithEmail(email, password);
      }
    } catch (err: any) {
      setAuthError(err.message || 'A apărut o eroare la autentificare');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'noua': return <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">Plasată</span>;
      case 'in_lucru': return <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">În curs de procesare</span>;
      case 'finalizata': return <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Livrată</span>;
      case 'anulata': return <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">Anulată</span>;
      default: return <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-brand-dark" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-12 px-4 sm:px-6">
        <button onClick={onBack} className="flex items-center text-gray-500 hover:text-brand-dark transition-colors mb-6">
          <ArrowLeft className="w-5 h-5 mr-1" />
          Înapoi la magazin
        </button>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            {isRegistering ? 'Creare Cont Nou' : 'Autentificare Cont'}
          </h2>
          <form onSubmit={handleAuth} className="space-y-4 text-left">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-brand-light focus:outline-none" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Parolă</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-brand-light focus:outline-none" 
              />
            </div>
            {authError && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">{authError}</div>
            )}
            
            <button 
              type="submit"
              disabled={isAuthenticating}
              className="w-full bg-brand-dark text-white font-bold px-6 py-3 rounded-lg hover:bg-brand-dark/90 transition-colors disabled:opacity-70 mt-2 flex justify-center"
            >
              {isAuthenticating ? <Loader2 className="w-5 h-5 animate-spin" /> : (isRegistering ? 'Creează cont' : 'Intră în cont')}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {isRegistering ? 'Ai deja cont?' : 'Nu ai un cont încă?'}
              <button 
                onClick={() => setIsRegistering(!isRegistering)}
                className="ml-1 font-medium text-brand-dark hover:underline focus:outline-none"
              >
                {isRegistering ? 'Autentifică-te aici' : 'Creează unul acum'}
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Contul meu</h1>
          <p className="text-gray-600">Autentificat ca <span className="font-medium text-brand-dark">{user.email}</span></p>
        </div>
        <button 
          onClick={logout}
          className="flex items-center text-gray-600 hover:text-red-600 transition-colors bg-white px-4 py-2 border border-gray-200 rounded-lg shadow-sm"
        >
          <LogOut className="w-4 h-4 mr-2" />
          <span className="font-medium text-sm">Deconectare</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50 flex items-center">
          <Package className="w-5 h-5 mr-2 text-brand-dark" />
          <h2 className="text-xl font-bold text-gray-900">Istoric Comenzi</h2>
        </div>
        
        <div className="p-6">
          {isLoadingOrders ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-xl bg-gray-50/50">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">Nu ai nicio comandă plasată încă.</p>
              <button onClick={onBack} className="mt-4 text-brand-dark font-medium hover:underline">
                Începe cumpărăturile
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="border border-gray-200 rounded-xl p-5 hover:border-brand-dark/30 transition-colors bg-white shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-3 border-b border-gray-100 pb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-sm text-gray-500 font-mono">#{order.id.slice(0,8)}</span>
                        {getStatusBadge(order.status)}
                      </div>
                      <p className="text-sm text-gray-500">
                        {order.createdAt?.toDate().toLocaleDateString('ro-RO', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-lg font-bold text-brand-dark">{order.totalPrice?.toFixed(2)} RON</p>
                      <p className="text-xs text-gray-500 capitalize">{order.paymentMethod === 'card' ? 'Card bancar (Stripe)' : 'Ramburs / Numerar'}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="text-sm font-bold text-gray-900 mb-2">Produse comandate:</h4>
                    <ul className="space-y-2">
                      {order.items?.map((item: any, idx: number) => (
                        <li key={idx} className="flex justify-between items-start text-sm">
                          <div>
                            <span className="font-medium text-gray-800">{item.productTitle}</span>
                            <span className="text-gray-500 mx-2">x {item.quantity}</span>
                            <div className="text-xs text-gray-500 mt-0.5">
                              {Object.entries(item.selectedOptions || {}).map(([k,v]) => v).join(' | ')}
                            </div>
                          </div>
                          <span className="font-medium text-gray-700 min-w-[70px] text-right">{item.totalPrice?.toFixed(2)} RON</span>
                        </li>
                      ))}
                      {!order.items && order.productTitle && (
                        <li className="flex justify-between items-start text-sm">
                          <div>
                            <span className="font-medium text-gray-800">{order.productTitle}</span>
                            <span className="text-gray-500 mx-2">x {order.quantity}</span>
                          </div>
                          <span className="font-medium text-gray-700 min-w-[70px] text-right">{order.totalPrice?.toFixed(2)} RON</span>
                        </li>
                      )}
                    </ul>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="font-bold text-gray-800 mb-1">Livrare ({order.deliveryMethod === 'ridicare' ? 'Ridicare' : 'Curier'})</p>
                      <p className="text-gray-600 truncate">{order.deliveryAddress}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="font-bold text-gray-800 mb-1">Contact</p>
                      <p className="text-gray-600 truncate">{order.customerName}</p>
                      <p className="text-gray-600 truncate">{order.customerPhone}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
