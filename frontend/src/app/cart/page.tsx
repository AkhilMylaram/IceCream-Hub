'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchCart } from '@/lib/api';

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
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-10 text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-purple-400">
        Your Cart
      </h1>
      
      {!cart || !cart.items || cart.items.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center">
          <div className="text-6xl mb-6">🛒</div>
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <p className="text-gray-400 mb-8">Looks like you haven&apos;t added any premium ice cream yet.</p>
          <Link href="/" className="px-8 py-3 rounded-full bg-brand-600 hover:bg-brand-500 text-white font-semibold transition-colors shadow-lg shadow-brand-500/30">
            Add the products
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="glass rounded-2xl p-6">
            {cart.items.map((item: any, i: number) => (
              <div key={item.product_id} className={`flex items-center gap-6 py-4 ${i !== 0 ? 'border-t border-white/10' : ''}`}>
                <div className="w-20 h-20 bg-gradient-to-br from-purple-900 to-brand-900 rounded-xl flex items-center justify-center text-3xl shrink-0">
                  🍨
                </div>
                <div className="flex-grow">
                  <h3 className="text-xl font-bold">{item.name}</h3>
                  <div className="text-gray-400">Qty: {item.quantity} &times; ${item.price.toFixed(2)}</div>
                </div>
                <div className="text-xl font-bold">
                  ${(item.quantity * item.price).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
          
          <div className="glass rounded-2xl p-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <div className="text-gray-400 mb-1">Total Amount</div>
              <div className="text-4xl font-extrabold text-white">${cart.total_price.toFixed(2)}</div>
            </div>
            <Link href="/checkout" className="w-full md:w-auto px-10 py-4 bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 text-white rounded-full font-bold text-lg shadow-lg text-center transition-all">
              Proceed to Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
