'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Menu, X, ShoppingCart, User, LogOut, ChevronRight, Package, Grid } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const checkUser = () => {
    try {
      const stored = localStorage.getItem('user');
      setUser(stored ? JSON.parse(stored) : null);
    } catch (err) {
      console.error('Auth state sync failed', err);
      setUser(null);
    }
  };

  useEffect(() => {
    checkUser();
    window.addEventListener('auth-change', checkUser);
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);

    // Close dropdown on outside click
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as Element).closest('.navbar-container')) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    
    return () => {
      window.removeEventListener('auth-change', checkUser);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    router.push('/');
    window.dispatchEvent(new Event('auth-change'));
  };

  const navLinks = [
    { name: 'Explore', href: '/products', icon: Grid },
    { name: 'Orders', href: '/orders', icon: Package },
    { name: 'Cart', href: '/cart', icon: ShoppingCart },
  ];

  return (
    <nav 
      className={`sticky top-0 left-0 w-full z-[1000] transition-all duration-300 ${
        scrolled 
          ? 'bg-[#0f172a]/98 border-b border-white/10 py-3 shadow-xl' 
          : 'bg-[#020205] py-5'
      }`}
    >
      <div className="container navbar-container">
        <div className="flex justify-between items-center h-full">
          {/* LOGO */}
          <Link href="/" className="relative z-[110] flex items-center space-x-2 group">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-white font-black text-xs sm:text-base transition-transform group-hover:scale-105">
              IH
            </div>
            <span className="text-lg sm:text-2xl font-black tracking-tighter text-white">
              IceCream<span className="text-brand-500">Hub</span>
            </span>
          </Link>
          
          {/* DESKTOP NAV (Laptop & Desktop) */}
          <div className="hidden lg:flex items-center space-x-8">
            <div className="flex items-center space-x-6">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href} 
                  className={`text-xs xl:text-sm font-bold tracking-widest uppercase transition-colors hover:text-brand-400 flex items-center gap-2 ${
                    pathname === link.href ? 'text-brand-500' : 'text-gray-300'
                  }`}
                >
                  <link.icon className="w-4 h-4 xl:w-5 xl:h-5" />
                  <span>{link.name}</span>
                </Link>
              ))}
            </div>
            
            {user ? (
              <div className="relative flex items-center pl-6 border-l border-white/10 ml-6">
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-3 group"
                >
                  <div className="w-8 h-8 xl:w-10 xl:h-10 rounded-full bg-gradient-to-br from-brand-600 to-purple-700 p-[2px]">
                    <div className="w-full h-full rounded-full bg-[#050510] flex items-center justify-center text-white font-bold text-xs xl:text-sm">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                  </div>
                  <div className="text-left hidden xl:block">
                    <p className="text-xs font-bold text-white leading-none truncate max-w-[120px]">{user.name?.split(' ')[0]}</p>
                  </div>
                </button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 top-full mt-4 w-56 bg-[#0a0a1a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden py-2"
                    >
                      <div className="px-4 py-3 border-b border-white/5 mb-1">
                        <p className="text-sm font-bold text-white truncate">{user.name}</p>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest truncate">{user.email || 'Member'}</p>
                      </div>
                      <Link href="/orders" className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
                        <Package className="w-4 h-4" /> <span>My Orders</span>
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="flex items-center space-x-3 w-full px-4 py-2.5 text-sm text-red-500 hover:text-red-400 hover:bg-red-500/5 transition-colors font-bold"
                      >
                        <LogOut className="w-4 h-4" /> <span>Sign Out</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link 
                href="/auth" 
                className="px-6 py-2.5 rounded-full bg-white text-black text-[10px] xl:text-xs font-black uppercase tracking-widest hover:bg-brand-500 hover:text-white transition-all shadow-lg active:scale-95 ml-4"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* MOBILE & TABLET NAV ACTIONS */}
          <div className="lg:hidden flex items-center space-x-3">
            {user && (
              <Link href="/cart" className="relative p-2 text-gray-300 hover:text-white transition-colors bg-white/5 rounded-full">
                <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-brand-500 rounded-full border border-[#020205]" />
              </Link>
            )}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-white bg-white/5 rounded-full transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6 sm:w-7 sm:h-7" /> : <Menu className="w-6 h-6 sm:w-7 sm:h-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-[900] lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 right-0 h-full w-[80%] max-w-sm bg-[#0a0a1a] border-l border-white/10 z-[1001] lg:hidden flex flex-col p-6 shadow-2xl overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-8 pt-2">
                 <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center text-white font-black text-xs">IH</div>
                    <span className="text-xl font-black text-white">IceCream<span className="text-brand-500">Hub</span></span>
                 </div>
                 <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-white bg-white/5 rounded-full">
                    <X className="w-5 h-5" />
                 </button>
              </div>

              {user ? (
                <div className="mb-8 p-5 rounded-3xl bg-white/5 border border-white/5">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-600 to-purple-700 flex items-center justify-center text-white font-bold text-xl">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg leading-tight">{user.name}</h3>
                      <p className="text-gray-400 text-xs truncate max-w-[150px]">{user.email}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <Link 
                  href="/auth"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="mb-8 w-full py-4 rounded-2xl bg-white text-black text-center font-black text-sm uppercase tracking-widest shadow-lg"
                >
                  Enter Vault
                </Link>
              )}

              <div className="flex flex-col space-y-2">
                <p className="text-[10px] text-gray-500 font-black tracking-widest uppercase mb-2 px-2">Navigation</p>
                {navLinks.map((link) => (
                  <Link 
                    key={link.name} 
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-4 p-4 rounded-2xl transition-all ${
                      pathname === link.href ? 'bg-brand-500/10 text-brand-400 border border-brand-500/10' : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <link.icon className="w-5 h-5" />
                    <span className="text-lg font-bold">{link.name}</span>
                  </Link>
                ))}
              </div>

              {user && (
                <div className="mt-auto pt-8 border-t border-white/5">
                  <button 
                    onClick={handleLogout}
                    className="flex items-center space-x-4 w-full p-4 rounded-2xl text-red-500 font-bold hover:bg-red-500/5 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="text-lg">Sign Out</span>
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}

