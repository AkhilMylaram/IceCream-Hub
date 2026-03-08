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
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-10 text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-purple-400">
        My Orders
      </h1>

      {error ? (
        <div className="glass-strong border border-red-500/30 rounded-2xl p-6 text-center text-red-400">
          {error}
        </div>
      ) : orders.length === 0 ? (
        <div className="glass rounded-2xl p-16 text-center flex flex-col items-center">
          <div className="text-6xl mb-6 opacity-80">📦</div>
          <h2 className="text-2xl font-bold mb-3 text-white">No orders found</h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            You haven&apos;t placed any orders yet. Explore our premium catalog and discover your next favorite flavor.
          </p>
          <Link href="/products" className="px-8 py-3 rounded-full bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 text-white font-semibold transition-all">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="glass rounded-2xl overflow-hidden shadow-lg border border-white/5 transition-all hover:border-brand-500/20">
              {/* Order Header */}
              <div className="bg-white/5 px-6 py-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-white/10">
                <div>
                  <div className="text-sm text-gray-400 mb-1">Order #{order.id}</div>
                  <div className="font-medium text-white">Date: {new Date(order.createdAt).toLocaleString()}</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm text-gray-400 mb-1">Total Amount</div>
                    <div className="font-bold text-lg text-brand-300">${order.totalAmount.toFixed(2)}</div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-green-500/20 text-green-400 border border-green-500/30">
                    {order.status}
                  </span>
                </div>
              </div>
              
              {/* Order Items */}
              <div className="p-6">
                <h4 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">Order Items</h4>
                <div className="space-y-4">
                  {order.items && order.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between group">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-900/60 to-brand-900/60 flex items-center justify-center text-xl shadow-inner border border-white/5">
                          🍨
                        </div>
                        <div>
                          <p className="font-medium text-white group-hover:text-brand-300 transition-colors">{item.productName || 'Premium Ice Cream'}</p>
                          <p className="text-xs text-gray-500">Product ID: {item.productId}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-300">Qty: {item.quantity}</p>
                        <p className="text-xs text-gray-500">${item.price.toFixed(2)} each</p>
                      </div>
                    </div>
                  ))}
                  {(!order.items || order.items.length === 0) && (
                     <div className="text-gray-500 italic text-sm">Item details unavailable</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
