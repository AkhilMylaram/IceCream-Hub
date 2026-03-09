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
    <div className="min-h-screen bg-[#020205] text-white">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] sm:min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/hero.png" 
            alt="Premium Ice Cream" 
            className="w-full h-full object-cover scale-105 hover:scale-100 transition duration-1000 opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-[#020205]"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl space-y-4">
          <h1 className="text-fluid-h1 font-black tracking-tighter text-white">
            Welcome <span className="text-brand-400 capitalize">{user?.username || user?.name || 'Gourmet'}</span>
          </h1>
          <p className="text-sm sm:text-base text-gray-300 font-light max-w-3xl mx-auto leading-relaxed">
            Indulge in the finest artisanal creations at IceCream Hub. Your personalized dessert experience awaits.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 pt-4">
            <Link href="/products" className="px-10 py-4 sm:py-5 bg-brand-600 hover:bg-brand-500 text-white rounded-full font-black uppercase tracking-widest text-[10px] sm:text-xs transition shadow-2xl active:scale-95">
              Browse Collection
            </Link>
            <Link href="/orders" className="px-10 py-4 sm:py-5 bg-white/5 hover:bg-white/10 text-white rounded-full font-black uppercase tracking-widest text-[10px] sm:text-xs backdrop-blur-md border border-white/10 transition active:scale-95">
              Mission History
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-white/5 p-4 sm:p-6 rounded-[1.5rem] border border-white/5 hover:border-brand-500/30 transition-all group">
            <div className="w-12 h-12 bg-brand-500/10 rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-all">🍦</div>
            <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight mb-2">Curated Flavors</h3>
            <p className="text-xs sm:text-sm text-gray-500 font-light leading-relaxed">Discover our new premium flavors crafted with the finest ingredients from around the world.</p>
          </div>
          
          <div className="bg-white/5 p-4 sm:p-6 rounded-[1.5rem] border border-white/5 hover:border-brand-500/30 transition-all group">
            <div className="w-12 h-12 bg-cyan-500/10 rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-all">✨</div>
            <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight mb-2">Exclusive Access</h3>
            <p className="text-xs sm:text-sm text-gray-500 font-light leading-relaxed">As a member, you get first access to limited edition drops and secret seasonal surprises.</p>
          </div>

          <div className="bg-white/5 p-4 sm:p-6 rounded-[1.5rem] border border-white/5 hover:border-brand-500/30 transition-all group sm:col-span-2 lg:col-span-1">
            <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-all">🚀</div>
            <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight mb-2">Fast Delivery</h3>
            <p className="text-xs sm:text-sm text-gray-500 font-light leading-relaxed">Freshness guaranteed. We deliver straight to your doorstep so you can enjoy your treat at its best.</p>
          </div>
        </div>

        {/* Account Summary Snapshot */}
        <div className="mt-8 bg-white/5 p-6 sm:p-8 rounded-[1.5rem] relative overflow-hidden border border-white/5">
             <div className="absolute top-0 right-0 p-12 opacity-5 text-[150px] sm:text-[250px] select-none pointer-events-none drop-shadow-2xl">🍨</div>
             <div className="relative z-10">
                <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight mb-6">Personal Profiling</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="bg-[#020205]/50 backdrop-blur-md p-4 sm:p-6 rounded-[1rem] border border-white/5">
                        <span className="text-[10px] sm:text-xs text-gray-500 font-black uppercase tracking-widest block mb-2">Authenticated User</span>
                        <span className="text-base sm:text-lg font-black text-white uppercase tracking-tight">{user?.username || user?.name}</span>
                    </div>
                    <div className="bg-[#020205]/50 backdrop-blur-md p-4 sm:p-6 rounded-[1rem] border border-white/5">
                        <span className="text-[10px] sm:text-xs text-gray-500 font-black uppercase tracking-widest block mb-2">Clearance Level</span>
                        <span className="text-base sm:text-lg font-black text-brand-400 uppercase tracking-tight">Premium Connoisseur</span>
                    </div>
                </div>
             </div>
        </div>

        {/* Membership Section */}
        <div className="mt-8">
          <div className="text-center mb-8 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter">Elevate Your Access</h2>
            <p className="text-sm sm:text-base text-gray-500 font-light">Join our exclusive membership program for ultimate dessert perks.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/5 p-6 sm:p-8 rounded-[1.5rem] border border-white/5 flex flex-col group">
              <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight mb-2">Silver Scoop</h3>
              <p className="text-brand-400 text-2xl sm:text-3xl font-black mb-6">${(9.99).toFixed(2)} <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">/ Month</span></p>
              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex items-center gap-3 text-xs sm:text-sm font-medium text-gray-400"><span className="w-5 h-5 rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center text-[10px] font-black">✓</span> 5% discount on all orders</li>
                <li className="flex items-center gap-3 text-xs sm:text-sm font-medium text-gray-400"><span className="w-5 h-5 rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center text-[10px] font-black">✓</span> Free delivery twice a month</li>
                <li className="flex items-center gap-3 text-xs sm:text-sm font-medium text-gray-400"><span className="w-5 h-5 rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center text-[10px] font-black">✓</span> Early access to new flavors</li>
              </ul>
              <button className="w-full py-4 rounded-full bg-white/5 group-hover:bg-white/10 text-white font-black uppercase tracking-widest text-[10px] transition active:scale-[0.98]">Choose Silver</button>
            </div>

            <div className="bg-[#0a0a1a] p-6 sm:p-8 rounded-[1.5rem] border-2 border-brand-500/50 flex flex-col relative sm:scale-105 shadow-[0_0_100px_rgba(236,72,153,0.1)] group">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-500 text-white px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">Most Coveted</div>
              <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight mb-2 text-brand-400">Gold Gourmet</h3>
              <p className="text-white text-2xl sm:text-3xl font-black mb-6">${(19.99).toFixed(2)} <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">/ Month</span></p>
              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex items-center gap-3 text-xs sm:text-sm font-medium text-gray-300"><span className="w-5 h-5 rounded-full bg-brand-500 group-hover:scale-110 transition-transform text-white flex items-center justify-center text-[10px] font-black">✓</span> 15% discount on all orders</li>
                <li className="flex items-center gap-3 text-xs sm:text-sm font-medium text-gray-300"><span className="w-5 h-5 rounded-full bg-brand-500 group-hover:scale-110 transition-transform text-white flex items-center justify-center text-[10px] font-black">✓</span> Unlimited free delivery</li>
                <li className="flex items-center gap-3 text-xs sm:text-sm font-medium text-gray-300"><span className="w-5 h-5 rounded-full bg-brand-500 group-hover:scale-110 transition-transform text-white flex items-center justify-center text-[10px] font-black">✓</span> 1 Free custom pint every month</li>
                <li className="flex items-center gap-3 text-xs sm:text-sm font-medium text-gray-300"><span className="w-5 h-5 rounded-full bg-brand-500 group-hover:scale-110 transition-transform text-white flex items-center justify-center text-[10px] font-black">✓</span> Exclusive member-only flavors</li>
              </ul>
              <button className="w-full py-4 rounded-full bg-brand-600 hover:bg-brand-500 text-white font-black uppercase tracking-widest text-[10px] transition shadow-2xl active:scale-[0.98]">Go Gold</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
