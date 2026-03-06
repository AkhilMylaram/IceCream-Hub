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
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      window.location.href = '/auth';
      return;
    }
    setUser(JSON.parse(userStr));
    fetchProducts()
      .then((data) => { setProducts(data); setFilteredProducts(data); })
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
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#050510', gap: '14px' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid rgba(99,102,241,0.15)', borderTopColor: '#818cf8', animation: 'spin 0.8s linear infinite' }} />
        <p style={{ color: '#475569', fontSize: '12px', letterSpacing: '0.2em', textTransform: 'uppercase', margin: 0 }}>Loading...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const badges = ['Best Seller', 'Artisanal', 'Top Rated', 'Unique', 'Staff Pick'];
  const badgeColors: Record<string, { bg: string; border: string; text: string }> = {
    'Best Seller': { bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)', text: '#fbbf24' },
    'Artisanal':   { bg: 'rgba(129,140,248,0.12)', border: 'rgba(129,140,248,0.3)', text: '#a5b4fc' },
    'Top Rated':   { bg: 'rgba(52,211,153,0.12)', border: 'rgba(52,211,153,0.3)', text: '#6ee7b7' },
    'Unique':      { bg: 'rgba(244,114,182,0.12)', border: 'rgba(244,114,182,0.3)', text: '#f9a8d4' },
    'Staff Pick':  { bg: 'rgba(34,211,238,0.12)', border: 'rgba(34,211,238,0.3)', text: '#67e8f9' },
  };

  return (
    <div style={{ background: '#050510', minHeight: '100vh', color: '#e2e8f0' }}>

      {/* ══════════════════════════════════════════
          COMPACT HERO — welcome + description
      ══════════════════════════════════════════ */}
      {user && (
        <div
          style={{
            position: 'relative',
            overflow: 'hidden',
            background: 'linear-gradient(160deg, #0c0c22 0%, #0a0a1e 100%)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          {/* Subtle hero bg */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'url("/images/floating_ice_cream_hero_new.png")',
            backgroundSize: 'cover', backgroundPosition: 'center top',
            opacity: 0.07,
          }} />
          {/* Left glow */}
          <div style={{ position: 'absolute', top: '-40px', left: '-60px', width: '300px', height: '300px', background: 'rgba(99,102,241,0.15)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />
          {/* Right glow */}
          <div style={{ position: 'absolute', bottom: '-40px', right: '-40px', width: '250px', height: '250px', background: 'rgba(34,211,238,0.08)', borderRadius: '50%', filter: 'blur(70px)', pointerEvents: 'none' }} />

          <div
            style={{
              position: 'relative', zIndex: 1,
              maxWidth: '1280px', margin: '0 auto',
              padding: '40px 28px 36px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            {/* Small label */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#818cf8', display: 'inline-block', flexShrink: 0, animation: 'pls 2s ease-in-out infinite' }} />
              <span style={{ color: '#6366f1', fontSize: '11px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                IceCream Hub
              </span>
            </div>

            {/* Welcome heading — compact size */}
            <h1 style={{ margin: 0, fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', fontWeight: 800, lineHeight: 1.15, color: '#fff', letterSpacing: '-0.02em' }}>
              Welcome back,{' '}
              <span style={{
                background: 'linear-gradient(90deg, #34d399, #22d3ee, #818cf8)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>
                {user.name}!
              </span>
            </h1>

            {/* Description */}
            <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem', lineHeight: 1.7, maxWidth: '560px' }}>
              Explore our full artisanal catalog — search by flavor, name, or ingredient and find your next favorite scoop.
            </p>
          </div>

          <style>{`@keyframes pls { 0%,100%{opacity:1} 50%{opacity:0.3} }`}</style>
        </div>
      )}

      {/* ══════════════════════════════════════════
          SEARCH + CATALOG
      ══════════════════════════════════════════ */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 28px 60px' }}>

        {/* Search bar */}
        <div style={{ position: 'relative', marginBottom: '32px', maxWidth: '480px' }}>
          <svg
            style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '17px', height: '17px', color: '#475569', pointerEvents: 'none' }}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            id="product-search"
            type="text"
            placeholder="Search by flavor, name, or ingredient..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%', boxSizing: 'border-box',
              padding: '11px 16px 11px 42px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '10px', color: '#fff', fontSize: '0.88rem', outline: 'none',
              transition: 'border-color 0.2s, box-shadow 0.2s',
            }}
            onFocus={(e) => { e.target.style.borderColor = 'rgba(99,102,241,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.08)'; }}
            onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }}
          />
        </div>

        {/* Catalog header row */}
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '22px', flexWrap: 'wrap', gap: '8px' }}>
          <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
            {searchTerm ? `Results for "${searchTerm}"` : 'All Flavors'}
          </h2>
          <span style={{ color: '#475569', fontSize: '0.82rem' }}>
            {filteredProducts.length} {filteredProducts.length === 1 ? 'flavor' : 'flavors'} found
          </span>
        </div>

        {/* Product grid */}
        {filteredProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#475569' }}>
            <p style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🍦</p>
            <p style={{ fontSize: '1rem', margin: 0 }}>No flavors found — try a different search.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {filteredProducts.map((product, idx) => {
              const badge = badges[idx % badges.length];
              const bc = badgeColors[badge];

              return (
                <Link href={`/products/${product.id}`} key={product.id} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
                  <div
                    style={{
                      background: 'rgba(255,255,255,0.025)',
                      border: '1px solid rgba(255,255,255,0.07)',
                      borderRadius: '16px', overflow: 'hidden',
                      height: '100%', display: 'flex', flexDirection: 'column',
                      transition: 'transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-5px)';
                      e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)';
                      e.currentTarget.style.boxShadow = '0 16px 48px rgba(99,102,241,0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {/* Image */}
                    <div style={{ height: '200px', position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg, #0f0f2a, #1a1a40)', flexShrink: 0 }}>
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl} alt={product.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease', display: 'block' }}
                          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.06)')}
                          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                        />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.5rem' }}>🍦</div>
                      )}
                      {/* Price */}
                      <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(5,5,16,0.82)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontWeight: 700, fontSize: '0.82rem', padding: '4px 10px', borderRadius: '999px' }}>
                        ${product.price ? product.price.toFixed(2) : '3.99'}
                      </div>
                      {/* Badge */}
                      <div style={{ position: 'absolute', top: '10px', left: '10px', background: bc.bg, border: `1px solid ${bc.border}`, color: bc.text, fontSize: '9px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '3px 9px', borderRadius: '999px' }}>
                        {badge}
                      </div>
                    </div>

                    {/* Info */}
                    <div style={{ padding: '16px 18px 18px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                      <h3 style={{ margin: '0 0 6px', fontSize: '0.97rem', fontWeight: 700, color: '#fff', lineHeight: 1.3 }}>
                        {product.name}
                      </h3>
                      <p style={{ margin: '0 0 14px', fontSize: '0.82rem', color: '#64748b', lineHeight: 1.6, flexGrow: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {product.description || 'A premium artisanal flavor crafted with the finest organic ingredients.'}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                        <div style={{ display: 'flex', gap: '2px' }}>
                          {[1,2,3,4,5].map((s) => (
                            <span key={s} style={{ color: s <= 4 ? '#f59e0b' : '#1e293b', fontSize: '11px' }}>★</span>
                          ))}
                        </div>
                        <span style={{ color: '#6366f1', fontSize: '12px', fontWeight: 600 }}>View →</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════
          LIFESTYLE STRIP — AI images
      ══════════════════════════════════════════ */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.01)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '48px 28px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
            {[
              { img: '/images/lifestyle_1.png', title: 'Artisanal Craft', sub: 'Every scoop — a masterpiece.' },
              { img: '/images/midnight_chocolate.png', title: 'Midnight Chocolate', sub: 'Rich, dark, utterly indulgent.' },
              { img: '/images/lifestyle_2.png', title: 'Organic Purity', sub: 'Finest ingredients, globally sourced.' },
            ].map((item) => (
              <div key={item.title} style={{ borderRadius: '14px', overflow: 'hidden', position: 'relative', height: '200px' }}
                onMouseEnter={(e) => { const img = e.currentTarget.querySelector('img') as HTMLImageElement; if (img) img.style.transform = 'scale(1.07)'; }}
                onMouseLeave={(e) => { const img = e.currentTarget.querySelector('img') as HTMLImageElement; if (img) img.style.transform = 'scale(1)'; }}
              >
                <img src={item.img} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.5s ease' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(5,5,16,0.88) 0%, transparent 55%)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '18px' }}>
                  <p style={{ margin: '0 0 3px', fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>{item.title}</p>
                  <p style={{ margin: 0, fontSize: '0.77rem', color: '#94a3b8' }}>{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '24px', textAlign: 'center', color: '#334155', fontSize: '12px' }}>
        <p style={{ margin: 0 }}>&copy; {new Date().getFullYear()} IceCream Hub — The Absolute Luxury Standard.</p>
      </footer>
    </div>
  );
}
