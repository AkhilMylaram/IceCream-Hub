'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchProducts } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Star, ShoppingBag, Sparkles, Filter, ChevronRight } from 'lucide-react';

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      window.location.href = '/auth';
      return;
    }
    setUser(JSON.parse(userStr));
    fetchProducts()
      .then((data) => { 
        // Enhance product data with some mock properties if missing
        const enhanced = data.map((p: any) => ({
          ...p,
          rating: 4 + Math.random(),
          reviews: Math.floor(Math.random() * 50) + 12,
          tag: ['Best Seller', 'New Arrival', 'Artisanal', 'Organic', 'Staff Pick'][Math.floor(Math.random() * 5)]
        }));
        setProducts(enhanced); 
        setFilteredProducts(enhanced); 
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredProducts(products);
    } else {
      const term = searchTerm.toLowerCase();
      setFilteredProducts(
        products.filter(
          (p) =>
            p.name?.toLowerCase().includes(term) ||
            p.flavor?.toLowerCase().includes(term) ||
            p.description?.toLowerCase().includes(term)
        )
      );
    }
  }, [searchTerm, products]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#050510] gap-6">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-2 border-brand-500/20 border-t-brand-500 animate-spin" />
          <div className="absolute inset-4 rounded-full border-2 border-purple-500/20 border-b-purple-500 animate-spin-slow" />
        </div>
        <p className="text-gray-500 text-xs font-bold tracking-[0.3em] uppercase animate-pulse">Synchronizing Flavors</p>
      </div>
    );
  }

  const displayName = user?.name || user?.username || (user?.email ? user.email.split('@')[0] : 'Artisan');

  return (
    <div className="min-h-screen bg-[#020205] text-white pb-12 selection:bg-brand-500/30">
      
      {/* BACKGROUND DECOR */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-[-1]">
        <div className="absolute top-0 left-[-20%] w-[60%] h-[40%] bg-pink-600/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/5 blur-[120px] rounded-full" />
      </div>

      <div className="container pt-2 sm:pt-4 pb-4 sm:pb-8">
        
        {/* HERO BANNER GRAPHIC */}
        <div className="relative w-full h-16 sm:h-20 lg:h-24 rounded-xl sm:rounded-2xl overflow-hidden mb-4 sm:mb-6 border border-white/10 shadow-3xl group flex items-center justify-center bg-[#06060c]">
          <img 
            src="/images/icecream_banner.png" 
            alt="The Vault Artifacts" 
            className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:scale-105 group-hover:opacity-90 transition-all duration-[2000ms] ease-out" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#020205] via-transparent to-transparent pointer-events-none"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-brand-500/10 via-transparent to-purple-500/10 mix-blend-overlay pointer-events-none"></div>
          
          <div className="relative z-10 text-center opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-700 pointer-events-none">
            <div className="text-[10px] sm:text-xs font-black uppercase tracking-[0.4em] text-white/80">Cryogenic Archives</div>
          </div>
        </div>

        {/* HERO HEADER */}
        <header className="py-2 sm:py-4 space-y-2 sm:space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-3 justify-center sm:justify-start"
          >
            <div className="h-[1px] w-8 sm:w-10 bg-brand-500" />
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] text-brand-400">The Vault</span>
          </motion.div>
          
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 sm:gap-6 text-center sm:text-left">
            <div className="space-y-2 sm:space-y-4 max-w-3xl">
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tighter leading-tight"
              >
                Welcome{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-purple-400 to-indigo-400">
                  {user?.username || user?.name || displayName}
                </span>
              </motion.h1>
              <p className="text-sm sm:text-base text-gray-400 font-light leading-relaxed max-w-2xl mx-auto sm:mx-0">
                <span className="text-white font-bold">{user?.username || user?.name || displayName}</span>, taste the best of the ice creams or explore the bests of the ice cream!
              </p>
            </div>

            {/* SEARCH COMPONENT */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="relative w-full lg:max-w-md group mx-auto lg:mx-0"
            >
              <div className="relative flex items-center bg-[#1a1a2e] border border-white/10 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-2 sm:py-3 focus-within:border-brand-500 transition-all shadow-2xl">
                <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                <input 
                  type="text" 
                  placeholder="Scan archives..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent border-none outline-none w-full px-3 sm:px-4 text-white placeholder:text-gray-600 font-bold text-xs sm:text-sm"
                />
                <button className="flex items-center space-x-2 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-gray-500 border-l border-white/10 pl-3 sm:pl-4">
                  <Filter className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden xs:block">Filter</span>
                </button>
              </div>
            </motion.div>
          </div>
        </header>

        {/* STATUS ROW */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-4 sm:mb-6 py-2 sm:py-4 border-b border-white/5 gap-2 sm:gap-4">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <h2 className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] text-white/50">
              {searchTerm ? 'Scan Results' : 'Prime Selection'}
            </h2>
            <div className="px-2 sm:px-3 py-1 sm:py-1.5 bg-white/5 rounded-full border border-white/5 text-[8px] sm:text-[9px] font-black text-gray-400 uppercase tracking-widest">
              {filteredProducts.length} RECORDS FOUND
            </div>
          </div>
          
          <div className="flex items-center space-x-3 sm:space-x-4 text-[9px] sm:text-[10px] font-black text-gray-500 uppercase tracking-widest">
            <span className="opacity-50">Sort:</span>
            <button className="text-brand-400">Popularity</button>
            <button className="hover:text-white transition-colors">Price</button>
          </div>
        </div>

        {/* PRODUCT GRID */}
        <AnimatePresence mode="popLayout">
          {filteredProducts.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-8 sm:py-12 text-center space-y-4">
              <Search className="w-10 h-10 sm:w-12 sm:h-12 text-gray-700 mx-auto" />
              <h3 className="text-xl sm:text-2xl font-black text-white uppercase">No records found</h3>
              <button 
                onClick={() => setSearchTerm('')} 
                className="px-6 sm:px-8 py-3 rounded-full bg-white/5 border border-white/10 text-[9px] sm:text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
              >
                Reset Search
              </button>
            </motion.div>
          ) : (
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredProducts.map((product, idx) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (idx % 8) * 0.05 }}
                  key={product.id}
                  className="group flex flex-col"
                >
                  <Link 
                    href={`/products/${product.id}`} 
                    className="block relative aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden bg-[#06060c] border border-white/5 group-hover:border-brand-500/30 transition-all duration-500"
                  >
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl} 
                        alt={product.name}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl sm:text-4xl opacity-10">🍦</div>
                    )}
                    <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
                        <div className="px-2 sm:px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-brand-400">
                            {product.tag || 'Artisanal'}
                        </div>
                    </div>
                    <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3">
                        <div className="px-3 py-1.5 bg-white text-black rounded-lg font-black text-xs shadow-xl">
                            ${(product.price || 3.99).toFixed(2)}
                        </div>
                    </div>
                  </Link>

                  <div className="mt-3 sm:mt-4 px-1 flex flex-col space-y-1">
                    <div className="flex items-center space-x-2">
                        <div className="flex text-amber-500">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <Star key={s} className="w-2.5 h-2.5 sm:w-3 sm:h-3" fill={s <= 4 ? "currentColor" : "none"} />
                            ))}
                        </div>
                        <span className="text-[9px] sm:text-[10px] font-bold text-gray-600">({product.reviews || 20})</span>
                    </div>
                    <h3 className="text-base sm:text-lg font-black text-white group-hover:text-brand-400 transition-colors uppercase truncate">
                      {product.name}
                    </h3>
                    <p className="text-xs text-gray-500 font-light line-clamp-2 leading-relaxed">
                      {product.description || 'Premium hyper-churned creation engineered for absolute transcendence.'}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* CALL TO ACTION STRIP */}
        <section className="mt-12 sm:mt-20 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-brand-600/20 to-purple-600/20 rounded-[1.5rem] sm:rounded-[2rem] blur-[60px] sm:blur-[100px] opacity-30" />
            <div className="relative bg-[#050510]/80 backdrop-blur-3xl border border-white/5 rounded-[1.5rem] sm:rounded-[2rem] p-6 sm:p-10 lg:p-16 overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-12 shadow-3xl">
                <div className="space-y-4 sm:space-y-6 max-w-2xl text-center lg:text-left">
                    <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tighter leading-[0.9]">
                      Become a <br/><span className="text-brand-500">Gold Connoisseur.</span>
                    </h2>
                    <p className="text-sm sm:text-lg text-gray-400 font-light leading-relaxed">
                      Unlock private invitations, secret batches, and free global cryogenic delivery on every order over $120.
                    </p>
                    <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center lg:justify-start">
                        <button className="px-6 sm:px-10 py-3 sm:py-4 bg-white text-black rounded-full font-black uppercase tracking-[0.1em] sm:tracking-[0.2em] text-[10px] sm:text-[11px] hover:bg-brand-500 hover:text-white transition-all duration-500 shadow-2xl active:scale-95">Join Inner Circle</button>
                        <button className="px-6 sm:px-10 py-3 sm:py-4 border border-white/10 rounded-full font-black uppercase tracking-[0.1em] sm:tracking-[0.2em] text-[10px] sm:text-[11px] hover:bg-white/5 transition-all duration-500 active:scale-95">Learn Rarity</button>
                    </div>
                </div>
                <div className="relative w-full max-w-[200px] sm:max-w-[250px] aspect-square hidden sm:block">
                    <div className="absolute inset-0 bg-brand-500 rounded-full blur-[100px] opacity-10 animate-pulse" />
                    <img src="/images/flavor_vanilla_dream_new.png" className="relative w-full h-full object-contain animate-float drop-shadow-[0_30px_50px_rgba(0,0,0,0.5)]" alt="Premium Promo" />
                </div>
            </div>
        </section>

      </div>

      <footer className="border-t border-white/5 bg-[#020205] py-12">
        <div className="container flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex flex-col items-center md:items-start group cursor-default">
            <div className="text-3xl font-black tracking-tighter text-white mb-2">IceCream <span className="text-brand-500">Hub</span></div>
            <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.4em]">Architecting Culinary Euphoria</p>
          </div>
          <div className="flex space-x-10 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
            <span className="hover:text-brand-400 cursor-pointer transition-all">Instagram</span>
            <span className="hover:text-brand-400 cursor-pointer transition-all">Lab Journal</span>
          </div>
          <p className="text-[10px] text-zinc-800 font-black uppercase tracking-[0.3em]">
            &copy; {new Date().getFullYear()} The Hub. All Rights Secure.
          </p>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0); }
          50% { transform: translateY(-30px) rotate(2deg); }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin 4s linear infinite;
        }
      `}</style>
    </div>
  );
}
