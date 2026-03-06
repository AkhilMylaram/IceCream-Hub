'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchProduct, fetchRecommendations, addToCart } from '@/lib/api';

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
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="glass rounded-3xl overflow-hidden p-8 md:p-12 shadow-2xl relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -mr-20 -mt-20"></div>
        <div className="grid md:grid-cols-2 gap-12 relative z-10">
          <div className="bg-gradient-to-br from-purple-900/40 to-brand-900/40 rounded-2xl h-80 md:h-[500px] flex items-center justify-center border border-white/5 overflow-hidden">
            {product.imageUrl ? (
               <img src={product.imageUrl} alt={product.name} className="object-cover w-full h-full" />
            ) : (
               <span className="text-8xl">🍨</span>
            )}
          </div>
          <div className="flex flex-col justify-center">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">{product.name}</h1>
            <div className="inline-block px-4 py-1 rounded-full bg-brand-900/50 text-brand-200 border border-brand-500/30 w-max mb-6">
              {product.flavor || 'Signature Classic'}
            </div>
            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
              {product.description || "A delicately balanced flavor profile combining rich ingredients to deliver an extraordinary tasting experience. Handcrafted with passion."}
            </p>
            <div className="text-4xl font-bold text-white mb-8">${product.price ? product.price.toFixed(2) : '3.99'}</div>
            
            <button 
              onClick={handleAddToCart}
              disabled={adding}
              className="px-8 py-4 bg-brand-600 hover:bg-brand-500 disabled:bg-gray-600 text-white rounded-full font-bold text-lg shadow-[0_0_20px_rgba(236,72,153,0.4)] transition-all flex justify-center items-center"
            >
              {adding ? 'Adding...' : 'Add to Cart 🛒'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
