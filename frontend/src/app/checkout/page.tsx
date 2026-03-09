'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createOrder } from '@/lib/api';

export default function CheckoutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderDetails, setOrderDetails] = useState<any>(null);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Get real user from localStorage
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      alert('You must be logged in to place an order.');
      router.push('/auth');
      return;
    }
    const user = JSON.parse(storedUser);

    setLoading(true);
    try {
      const order = await createOrder(user.userId || user.id);
      setOrderDetails(order);
      setSuccess(true);
    } catch (err) {
      console.error(err);
      alert('Checkout failed!');
    } finally {
      setLoading(false);
    }
  };

    if (success) {
      return (
        <div className="max-w-2xl mx-auto px-4 py-12 text-center">
          <div className="glass p-8 rounded-[1.5rem] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-green-500/20 to-transparent opacity-50"></div>
            <div className="text-5xl sm:text-7xl mb-4 sm:mb-6 relative z-10">🎉</div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 sm:mb-4 relative z-10">Order Confirmed!</h1>
            <p className="text-lg sm:text-xl text-gray-300 mb-6 sm:mb-8 relative z-10">
            Thank you for your purchase. Your order #{orderDetails?.id} is now processing.
          </p>
          <button onClick={() => router.push('/')} className="px-8 py-3 bg-white/10 hover:bg-white/20 rounded-full transition relative z-10">
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Checkout</h1>
      <form onSubmit={handleCheckout} className="glass p-6 sm:p-8 rounded-[1.5rem] space-y-4 sm:space-y-6">
        <div>
          <label className="block text-xs sm:text-sm text-gray-400 mb-1.5 sm:mb-2">Shipping Address</label>
          <textarea required className="w-full bg-black/40 border border-white/10 rounded-xl p-3 sm:p-4 text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 transition text-sm sm:text-base" rows={4} placeholder="123 IceCream Ave, Dessert City"></textarea>
        </div>
        <div>
          <label className="block text-xs sm:text-sm text-gray-400 mb-1.5 sm:mb-2">Payment Details</label>
          <input required type="text" className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 transition" placeholder="Card Number (Demo)" />
        </div>
        <button disabled={loading} type="submit" className="w-full py-4 bg-brand-600 hover:bg-brand-500 rounded-full font-bold text-lg disabled:opacity-50 transition shadow-lg shadow-brand-500/30">
          {loading ? 'Processing...' : 'Place Order'}
        </button>
      </form>
    </div>
  );
}
