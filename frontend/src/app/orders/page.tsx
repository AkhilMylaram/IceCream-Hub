'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchOrders } from '@/lib/api';

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      window.location.href = '/auth';
      return;
    }

    const user = JSON.parse(userStr);

    fetchOrders(user.userId.toString())
      .then(setOrders)
      .catch((err) => {
        console.error('Failed to fetch orders:', err);
        setError('Failed to load your orders.');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020205] text-white pt-16 sm:pt-20 pb-12">
      <div className="container py-4">
        <header className="mb-4 sm:mb-6">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tighter uppercase">
            Mission <span className="text-brand-500">History</span>
          </h1>
          <p className="text-gray-500 mt-2 font-bold tracking-widest uppercase text-[9px] sm:text-xs">Accessing your confirmed acquisitions</p>
        </header>

      {error ? (
        <div className="bg-red-500/10 border border-red-500/50 rounded-2xl p-6 sm:p-10 text-center text-red-500 font-bold uppercase tracking-widest text-xs">
          {error}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white/5 border border-white/5 rounded-[1.5rem] p-8 sm:p-12 text-center flex flex-col items-center space-y-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/5 flex items-center justify-center text-3xl sm:text-4xl border border-white/5">📦</div>
          <div className="space-y-2">
             <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">No archives found</h2>
             <p className="text-sm sm:text-base text-gray-500 font-light max-w-md mx-auto leading-relaxed">
               You haven&apos;t placed any orders yet. Explore our premium catalog and discover your next favorite flavor.
             </p>
          </div>
          <Link href="/products" className="px-8 py-3 rounded-[1rem] bg-white text-black font-black uppercase tracking-widest text-[10px] sm:text-xs hover:bg-brand-500 hover:text-white transition-all shadow-xl active:scale-95">
            Begin Experience
          </Link>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white/5 rounded-[1rem] sm:rounded-[1.5rem] overflow-hidden border border-white/5 shadow-2xl group">
              {/* Order Header */}
              <div className="bg-white/5 px-4 sm:px-6 py-4 sm:py-5 flex flex-col md:flex-row justify-between md:items-center gap-4 sm:gap-6 border-b border-white/5">
                <div className="space-y-1">
                  <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Order ID: #{order.id}</div>
                  <div className="text-xs sm:text-sm font-bold text-white uppercase tracking-tight">{new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                </div>
                <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                  <div className="space-y-1">
                    <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Investment</div>
                    <div className="text-lg sm:text-xl font-black text-brand-400">${order.totalAmount.toFixed(2)}</div>
                  </div>
                  <div className="px-4 py-2 rounded-[0.5rem] text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {order.status}
                  </div>
                </div>
              </div>
              
              {/* Order Items */}
              <div className="p-4 sm:p-6 bg-[#050510]">
                <h4 className="text-[10px] font-black text-gray-600 mb-4 sm:mb-6 uppercase tracking-widest">Manifest Contents</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {order.items && order.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-3 sm:gap-4 bg-white/5 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-white/5">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-[0.5rem] bg-[#0a0a1a] flex items-center justify-center text-xl sm:text-2xl border border-white/10 group-hover:border-brand-500/30 transition-colors">
                        🍨
                      </div>
                      <div className="flex-grow">
                        <p className="font-black text-white text-xs sm:text-sm uppercase tracking-tight mb-0.5">{item.productName || 'Premium Flavor'}</p>
                        <div className="flex justify-between items-center">
                           <span className="text-[10px] sm:text-xs text-brand-400 font-bold">Qty: {item.quantity}</span>
                           <span className="text-[10px] sm:text-xs text-gray-600 font-bold tracking-widest">${item.price.toFixed(2)} / UNIT</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {(!order.items || order.items.length === 0) && (
                     <div className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Item details classified</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}
