'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/hero.png" 
            alt="Premium Ice Cream" 
            className="w-full h-full object-cover scale-105 hover:scale-100 transition duration-700 opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            Hi Welcome, <span className="text-brand-400 capitalize">{user?.name || user?.username || 'Gourmet'}</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 font-light lead">
            Indulge in the finest artisanal creations at IceCream Hub. Your personalized dessert experience awaits.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/" className="px-8 py-4 bg-brand-600 hover:bg-brand-500 text-white rounded-full font-bold transition transform hover:scale-105 shadow-xl shadow-brand-500/20">
              Browse Collection
            </Link>
            <Link href="/orders" className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-full font-bold backdrop-blur-md border border-white/10 transition">
              My Orders
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass p-8 rounded-3xl border border-white/5 hover:border-brand-500/30 transition-all group">
            <div className="w-16 h-16 bg-brand-500/20 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition">🍦</div>
            <h3 className="text-2xl font-bold mb-4">Curated Flavors</h3>
            <p className="text-gray-400">Discover our 10 new premium flavors crafted with the finest ingredients from around the world.</p>
          </div>
          
          <div className="glass p-8 rounded-3xl border border-white/5 hover:border-brand-500/30 transition-all group">
            <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition">✨</div>
            <h3 className="text-2xl font-bold mb-4">Exclusive Access</h3>
            <p className="text-gray-400">As a member, you get first access to limited edition drops and seasonal surprises.</p>
          </div>

          <div className="glass p-8 rounded-3xl border border-white/5 hover:border-brand-500/30 transition-all group">
            <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition">🚀</div>
            <h3 className="text-2xl font-bold mb-4">Fast Delivery</h3>
            <p className="text-gray-400">Freshness guaranteed. We deliver straight to your doorstep so you can enjoy your treat at its best.</p>
          </div>
        </div>

        {/* Account Summary Snapshot */}
        <div className="mt-16 glass p-10 rounded-3xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-12 opacity-10 text-[200px] select-none pointer-events-none">🍨</div>
             <div className="relative z-10">
                <h2 className="text-3xl font-bold mb-6">Your Preference Profile</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="bg-white/5 p-6 rounded-2xl">
                        <span className="text-sm text-gray-400 block mb-1">Account Holder</span>
                        <span className="text-xl font-medium">{user?.username}</span>
                    </div>
                    <div className="bg-white/5 p-6 rounded-2xl">
                        <span className="text-sm text-gray-400 block mb-1">Member Status</span>
                        <span className="text-xl font-medium text-brand-400">Premium Member</span>
                    </div>
                </div>
             </div>
        </div>

        {/* Membership Section */}
        <div className="mt-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Elevate Your Experience</h2>
            <p className="text-gray-400">Join our exclusive membership program for ultimate dessert perks.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="glass p-10 rounded-3xl border border-white/5 flex flex-col">
              <h3 className="text-2xl font-bold mb-2">Silver Scoop</h3>
              <p className="text-brand-400 text-3xl font-bold mb-8">$9.99 <span className="text-sm text-gray-400 font-normal">/ month</span></p>
              <ul className="space-y-4 mb-10 flex-grow">
                <li className="flex items-center gap-3"><span className="text-brand-400">✓</span> 5% discount on all orders</li>
                <li className="flex items-center gap-3"><span className="text-brand-400">✓</span> Free delivery twice a month</li>
                <li className="flex items-center gap-3"><span className="text-brand-400">✓</span> Early access to new flavors</li>
              </ul>
              <button className="w-full py-4 rounded-2xl bg-white/10 hover:bg-white/20 transition font-bold">Choose Silver</button>
            </div>

            <div className="glass p-10 rounded-3xl border-2 border-brand-500/50 flex flex-col relative scale-105 shadow-2xl shadow-brand-500/10">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-500 text-white px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">Most Popular</div>
              <h3 className="text-2xl font-bold mb-2 text-brand-400">Gold Gourmet</h3>
              <p className="text-white text-3xl font-bold mb-8">$19.99 <span className="text-sm text-gray-400 font-normal">/ month</span></p>
              <ul className="space-y-4 mb-10 flex-grow">
                <li className="flex items-center gap-3"><span className="text-brand-400">✓</span> 15% discount on all orders</li>
                <li className="flex items-center gap-3"><span className="text-brand-400">✓</span> Unlimited free delivery</li>
                <li className="flex items-center gap-3"><span className="text-brand-400">✓</span> 1 Free custom pint every month</li>
                <li className="flex items-center gap-3"><span className="text-brand-400">✓</span> Exclusive member-only flavors</li>
              </ul>
              <button className="w-full py-4 rounded-2xl bg-brand-600 hover:bg-brand-500 transition font-bold shadow-lg shadow-brand-500/30">Go Gold</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
