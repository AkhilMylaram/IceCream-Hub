'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchProduct, fetchRecommendations, addToCart } from '@/lib/api';
import { motion } from 'framer-motion';
import { Star, ShoppingCart, ArrowLeft } from 'lucide-react';

export default function ProductDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [recs, setRecs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    Promise.all([fetchProduct(id as string), fetchRecommendations().catch(() => [])])
      .then(([prod, recommendations]) => {
        setProduct(prod);
        setRecs(recommendations);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      router.push('/auth');
      return;
    }
    const user = JSON.parse(userStr);

    setAdding(true);
    try {
      await addToCart(user.userId.toString(), {
        product_id: product.id,
        name: product.name,
        price: product.price || 3.99,
        quantity: 1,
        image_url: product.imageUrl
      });
      router.push('/cart');
    } catch (e) {
      console.error(e);
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <div className="flex justify-center p-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div></div>;
  if (!product) return <div className="p-20 text-center">Product not found</div>;

  return (
    <div className="min-h-screen bg-[#020205] text-white pt-16 sm:pt-20 pb-12">
      
      {/* BACKGROUND DECOR */}
      <div className="fixed inset-0 pointer-events-none z-[-1]">
        <div className="absolute top-[20%] left-[-10%] w-[40%] sm:w-[50%] h-[40%] sm:h-[50%] bg-brand-600/10 blur-[100px] sm:blur-[150px] rounded-full" />
        <div className="absolute bottom-[20%] right-[-10%] w-[40%] sm:w-[50%] h-[40%] sm:h-[50%] bg-purple-600/10 blur-[100px] sm:blur-[150px] rounded-full" />
      </div>

      <div className="container py-4 sm:py-8">
        {/* BACK ACTION */}
        <motion.button 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.back()}
          className="flex items-center space-x-3 text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] text-gray-500 hover:text-white transition-colors mb-8 sm:mb-12 group"
        >
          <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Collection</span>
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-start">
          
          {/* IMAGE AREA */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative aspect-[4/3] rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden border border-white/10 shadow-3xl bg-[#06060c] group"
          >
            {product.imageUrl ? (
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-6xl sm:text-8xl">🍨</div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </motion.div>

          {/* PRODUCT INFO */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6 sm:space-y-8"
          >
            <div className="space-y-4 sm:space-y-6">
              <div className="inline-block px-3 py-1.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20 text-[9px] sm:text-[10px] font-black uppercase tracking-widest">
                {product.flavor || 'Artisanal Selection'}
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter uppercase leading-[0.9]">
                {product.name}
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-gray-400 font-light leading-relaxed max-w-2xl">
                {product.description || "A delicately balanced flavor profile combining rich ingredients to deliver an extraordinary tasting experience. Handcrafted with passion."}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between py-6 sm:py-8 border-y border-white/5 gap-4">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tighter">
                ${(product.price || 3.99).toFixed(2)}
              </div>
              <div className="flex items-center space-x-3 text-amber-500">
                 <div className="flex">
                    {[1,2,3,4,5].map(s => <Star key={s} className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" />)}
                 </div>
                 <span className="text-gray-500 font-black text-[10px] sm:text-xs uppercase tracking-widest leading-none pt-0.5">4.9 / 5.0 Rating</span>
              </div>
            </div>

            <div className="space-y-6">
              <button 
                onClick={handleAddToCart}
                disabled={adding}
                className="w-full py-4 sm:py-5 bg-brand-600 hover:bg-brand-500 disabled:bg-gray-800 text-white rounded-[1rem] sm:rounded-full font-black text-xs sm:text-sm uppercase tracking-widest shadow-2xl hover:shadow-brand-500/40 transition-all flex items-center justify-center space-x-4 active:scale-[0.98]"
              >
                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>{adding ? 'Processing...' : 'Secure Batch Acquisition'}</span>
              </button>
              
              <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 sm:p-6 rounded-[1rem] sm:rounded-[1.5rem] bg-white/5 border border-white/5 space-y-2 group hover:bg-white/10 transition-colors">
                      <p className="text-[9px] sm:text-[10px] text-gray-500 font-black uppercase tracking-widest">Delivery Protocol</p>
                      <p className="text-xs sm:text-sm font-black text-gray-200 uppercase tracking-tight">Global Cryogenic</p>
                  </div>
                  <div className="p-4 sm:p-6 rounded-[1rem] sm:rounded-[1.5rem] bg-white/5 border border-white/5 space-y-2 group hover:bg-white/10 transition-colors">
                      <p className="text-[9px] sm:text-[10px] text-gray-500 font-black uppercase tracking-widest">Storage Status</p>
                      <p className="text-xs sm:text-sm font-black text-gray-200 uppercase tracking-tight">-40° Deep Archive</p>
                  </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
