'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const checkUser = () => {
    const stored = localStorage.getItem('user');
    setUser(stored ? JSON.parse(stored) : null);
  };

  useEffect(() => {
    checkUser();
    window.addEventListener('auth-change', checkUser);
    
    // Close dropdown on outside click
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as Element).closest('.profile-dropdown-container')) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    
    return () => {
      window.removeEventListener('auth-change', checkUser);
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    router.push('/');
    window.dispatchEvent(new Event('auth-change')); // Trigger update across tabs/components
  };

  return (
    <nav className="fixed w-full z-50 glass top-0 border-b border-white/5 backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center space-x-2 shrink-0">
            <span className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-purple-400 drop-shadow-sm">
              IceCream Hub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8 items-center">
            {user ? (
              <>
                <Link href="/products" className="text-gray-300 hover:text-white transition-colors font-medium">Products</Link>
                <Link href="/cart" className="text-gray-300 hover:text-white transition-colors font-medium">Cart</Link>
                
                {/* Profile Dropdown */}
                <div className="relative profile-dropdown-container">
                  <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-[0_0_15px_rgba(236,72,153,0.5)] hover:shadow-[0_0_25px_rgba(236,72,153,0.8)] transition-all transform hover:scale-105 active:scale-95"
                  >
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </button>
                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 glass border border-white/10 rounded-2xl shadow-xl overflow-hidden z-50">
                      <div className="px-4 py-3 bg-white/5 border-b border-white/10">
                        <p className="text-sm font-medium text-white truncate">{user.name}</p>
                        <p className="text-xs text-gray-400 truncate">{user.email || 'Premium Member'}</p>
                      </div>
                      <div className="py-2">
                        <Link href="/products" className="block px-4 py-2 text-sm text-gray-300 hover:bg-brand-500/20 hover:text-white transition" onClick={() => setIsDropdownOpen(false)}>
                          Browse Products
                        </Link>
                        <Link href="/orders" className="block px-4 py-2 text-sm text-gray-300 hover:bg-brand-500/20 hover:text-white transition" onClick={() => setIsDropdownOpen(false)}>
                          My Orders
                        </Link>
                        <div className="border-t border-white/10 my-1"></div>
                        <button 
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link href="/auth" className="px-6 py-2.5 rounded-full bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 text-white font-semibold transition-all shadow-lg hover:shadow-brand-500/30">
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            {user && (
               <Link href="/cart" className="relative p-2 text-gray-300 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
               </Link>
            )}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white transition-all transform active:scale-95"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden glass border-t border-white/5 animate-slide-down">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {user ? (
              <>
                <div className="flex items-center space-x-4 px-3 py-4 border-b border-white/5 mb-2">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-semibold text-white truncate">{user.name}</p>
                    <p className="text-xs text-gray-400 truncate">{user.email || 'Premium Member'}</p>
                  </div>
                </div>
                <Link 
                  href="/products" 
                  className="block px-4 py-3 rounded-xl text-gray-300 hover:bg-white/5 hover:text-white transition"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Browse Products
                </Link>
                <Link 
                  href="/orders" 
                  className="block px-4 py-3 rounded-xl text-gray-300 hover:bg-white/5 hover:text-white transition"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  My Orders
                </Link>
                <Link 
                  href="/cart" 
                  className="block px-4 py-3 rounded-xl text-gray-300 hover:bg-white/5 hover:text-white transition"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  My Cart
                </Link>
                <div className="pt-2">
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 rounded-xl text-red-400 bg-red-500/5 hover:bg-red-500/10 transition font-medium"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="p-2 space-y-4">
                 <Link 
                  href="/products" 
                  className="block px-4 py-3 rounded-xl text-gray-300 hover:bg-white/5 hover:text-white transition"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Browse Products
                 </Link>
                 <Link 
                  href="/auth" 
                  className="block w-full text-center py-4 rounded-2xl bg-gradient-to-r from-brand-600 to-purple-600 text-white font-bold text-lg shadow-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login / Join Now
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

