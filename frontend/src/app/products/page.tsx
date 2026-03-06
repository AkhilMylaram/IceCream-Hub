'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchProducts } from '@/lib/api';

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Auth Check
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      window.location.href = '/auth';
      return;
    }
    
    setUser(JSON.parse(userStr));

    fetchProducts()
      .then((data) => {
        setProducts(data);
        setFilteredProducts(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredProducts(products);
    } else {
      const lowercasedTerm = searchTerm.toLowerCase();
      const filtered = products.filter(p => 
        p.name?.toLowerCase().includes(lowercasedTerm) || 
        p.flavor?.toLowerCase().includes(lowercasedTerm)
      );
      setFilteredProducts(filtered);
    }
  }, [searchTerm, products]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {user && (
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-purple-400 mb-2">
            Welcome back, {user.name}
          </h1>
          <p className="text-gray-400 text-lg">Find your perfect flavor today.</p>
        </div>
      )}

      {/* Search Bar */}
      <div className="mb-10 relative max-w-2xl">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
           <span className="text-gray-400 text-xl">🔍</span>
        </div>
        <input 
          type="text" 
          placeholder="Search by flavor or name..." 
          className="w-full pl-12 pr-6 py-4 rounded-full glass-strong border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all shadow-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product, idx) => {
              const badges = ['Best Seller', 'Unique', 'More Flavored', 'Top Rated', 'Artisanal'];
              const badge = badges[idx % badges.length];
              
              return (
                <Link href={`/products/${product.id}`} key={product.id}>
                  <div className="glass rounded-2xl overflow-hidden card-hover h-full flex flex-col group cursor-pointer border border-white/5 hover:border-brand-500/30">
                    <div className="h-48 w-full bg-gradient-to-br from-purple-900/50 to-brand-900/50 flex items-center justify-center relative overflow-hidden">
                      {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name} className="object-cover w-full h-full group-hover:scale-110 transition duration-500" />
                      ) : (
                        <span className="text-4xl">🍦</span>
                      )}
                      <div className="absolute top-2 right-2 bg-brand-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                        ${product.price ? product.price.toFixed(2) : '3.99'}
                      </div>
                    </div>
                    <div className="p-5 flex-grow flex flex-col">
                      <div className="flex justify-between items-start mb-2 gap-2">
                        <h3 className="text-lg font-bold text-white leading-tight">{product.name}</h3>
                      </div>
                      <p className="text-gray-400 text-sm line-clamp-2 flex-grow mb-4">{product.description}</p>
                      <div className="pt-4 border-t border-white/10 flex justify-between items-center text-xs">
                        <span className="px-2 py-1 bg-white/5 text-brand-300 rounded-md font-bold uppercase tracking-wider border border-brand-500/20">
                          {badge}
                        </span>
                        <span className="text-gray-500 group-hover:text-brand-400 transition">Explore &rarr;</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Bottom Lifestyle Images */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative h-64 md:h-80 rounded-3xl overflow-hidden group">
              <img src="/images/lifestyle_1.png" alt="Experience" className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-8">
                <div>
                  <h4 className="text-2xl font-bold text-white mb-2">Artisanal Craftsmanship</h4>
                  <p className="text-gray-300 text-sm">Every scoop is a masterpiece of flavor and dedication.</p>
                </div>
              </div>
            </div>
            <div className="relative h-64 md:h-80 rounded-3xl overflow-hidden group">
              <img src="/images/lifestyle_2.png" alt="Luxury" className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-8">
                <div>
                  <h4 className="text-2xl font-bold text-white mb-2">Unmatched Purity</h4>
                  <p className="text-gray-300 text-sm">Sourced from the finest organic ingredients globally.</p>
                </div>
              </div>
            </div>
          </div>
    </div>
  );
}
