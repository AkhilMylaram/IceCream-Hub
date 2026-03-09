'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchCart } from '@/lib/api';
import { ShoppingCart } from 'lucide-react';

export default function CartPage() {
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Auth Check
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      window.location.href = '/auth';
      return;
    }
    
    const user = JSON.parse(userStr);

    fetchCart(user.userId.toString())
      .then(setCart)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center p-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div></div>;

  return (
    <div className="min-h-screen bg-[#020205] text-white pt-16 sm:pt-20 pb-12">
      
      {/* BACKGROUND DECOR */}
      <div className="fixed inset-0 pointer-events-none z-[-1]">
        <div className="absolute top-[10%] right-[-10%] w-[40%] h-[40%] bg-pink-600/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/5 blur-[120px] rounded-full" />
      </div>

      <div className="container py-4">
        <header className="mb-4 sm:mb-6">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tighter uppercase">
            Secure <span className="text-brand-500">Inventory</span>
          </h1>
          <p className="text-gray-500 mt-2 font-bold tracking-widest uppercase text-[9px] sm:text-xs">Review your selection before authentication</p>
        </header>
        
        {!cart || !cart.items || cart.items.length === 0 ? (
          <div className="p-8 sm:p-12 rounded-[1.5rem] bg-white/5 border border-white/10 text-center space-y-4 sm:space-y-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/5">
              <ShoppingCart className="w-6 h-6 sm:w-8 sm:h-8 text-gray-700" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-black uppercase">Your vault is empty</h2>
              <p className="text-sm sm:text-base text-gray-500 font-light">Looks like you haven&apos;t added any premium ice cream yet.</p>
            </div>
            <Link href="/products" className="inline-block px-8 py-3 rounded-full bg-white text-black font-black uppercase tracking-widest text-[10px] sm:text-xs hover:bg-brand-500 hover:text-white transition-all shadow-xl active:scale-95">
              Browse Catalog
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              <div className="rounded-[1rem] sm:rounded-[1.5rem] bg-white/5 border border-white/5 divide-y divide-white/5 overflow-hidden">
                {cart.items.map((item: any) => (
                  <div key={item.product_id} className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 p-4 sm:p-6 group">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-[#06060c] border border-white/10">
                      {item.image_url ? (
                        <img src={item.image_url} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl sm:text-3xl">🍨</div>
                      )}
                    </div>
                    <div className="flex-grow text-center sm:text-left">
                      <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight group-hover:text-brand-400 transition-colors">{item.name}</h3>
                      <p className="text-gray-500 text-[10px] sm:text-sm font-bold mt-1 uppercase tracking-widest">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-lg sm:text-xl font-black text-white">
                      ${(item.quantity * item.price).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="sticky top-24 p-6 sm:p-8 rounded-[1rem] sm:rounded-[1.5rem] bg-[#0a0a1a] border border-white/5 space-y-6 sm:space-y-8 shadow-3xl">
                <div className="space-y-4">
                  <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Order Summary</p>
                  <div className="flex justify-between items-end">
                    <span className="text-gray-400 font-light text-sm sm:text-base">Total Investment</span>
                    <span className="text-3xl sm:text-4xl font-black text-white tracking-tighter">${cart.total_price.toFixed(2)}</span>
                  </div>
                </div>
                
                <Link href="/checkout" className="block w-full py-4 sm:py-5 bg-brand-600 hover:bg-brand-500 text-white rounded-[1rem] font-black text-xs sm:text-sm uppercase tracking-widest text-center shadow-2xl hover:shadow-brand-500/40 transition-all active:scale-95">
                  Confirm Shipment
                </Link>
                
                <p className="text-[9px] sm:text-[10px] text-center text-gray-600 font-bold uppercase tracking-widest">Cryogenic delivery included for members</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
