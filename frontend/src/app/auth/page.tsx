'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser, registerUser } from '@/lib/api';
import { motion } from 'framer-motion';

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: ''
  });
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    // Redirect loggined users
    const userStr = localStorage.getItem('user');
    if (userStr) {
      router.push('/products');
    } else {
      setCheckingAuth(false);
    }
  }, [router]);

  if (checkingAuth) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let data;
      if (isLogin) {
        data = await loginUser(formData.email, formData.password);
      } else {
        data = await registerUser(formData);
      }

      // loginUser/registerUser now throw on error, so if we reach here it succeeded
      localStorage.setItem('user', JSON.stringify(data));
      window.dispatchEvent(new Event('auth-change'));
      router.push('/products');
    } catch (err: any) {
      setError(err?.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-lg mx-auto px-4 py-8 sm:py-12">
      <div className="glass p-6 sm:p-8 rounded-[1.5rem] shadow-2xl border border-white/10">
        <h1 className="text-3xl sm:text-4xl font-black text-center mb-6 text-white uppercase tracking-tight">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h1>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-2xl mb-6 text-sm font-medium"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {!isLogin && (
            <>
              <div>
                <label className="block text-[10px] sm:text-xs text-gray-500 font-black uppercase tracking-widest mb-1.5 ml-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  className="w-full bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl px-4 py-3 sm:py-4 text-white placeholder:text-gray-700 focus:outline-none focus:border-brand-500 transition-all font-medium"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[10px] sm:text-xs text-gray-500 font-black uppercase tracking-widest mb-1.5 ml-1">Shipping Address</label>
                <input
                  type="text"
                  required
                  placeholder="123 Scoop St, Dessert City"
                  className="w-full bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl px-4 py-3 sm:py-4 text-white placeholder:text-gray-700 focus:outline-none focus:border-brand-500 transition-all font-medium"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-[10px] sm:text-xs text-gray-500 font-black uppercase tracking-widest mb-1.5 ml-1">Email Address</label>
            <input
              type="email"
              required
              placeholder="name@example.com"
              className="w-full bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl px-4 py-3 sm:py-4 text-white placeholder:text-gray-700 focus:outline-none focus:border-brand-500 transition-all font-medium"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-[10px] sm:text-xs text-gray-500 font-black uppercase tracking-widest mb-1.5 ml-1">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              className="w-full bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl px-4 py-3 sm:py-4 text-white placeholder:text-gray-700 focus:outline-none focus:border-brand-500 transition-all font-medium"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 sm:py-4 bg-brand-600 hover:bg-brand-500 rounded-[1rem] font-black text-white uppercase tracking-widest text-xs sm:text-sm transition-all shadow-xl shadow-brand-500/20 disabled:opacity-50 mt-4 active:scale-[0.98]"
          >
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <span className="text-gray-500 text-xs sm:text-sm font-medium">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </span>
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="ml-2 text-brand-400 hover:text-brand-300 font-black uppercase text-[10px] sm:text-xs tracking-widest"
          >
            {isLogin ? 'Sign Up' : 'Log In'}
          </button>
        </div>
      </div>
    </div>
  );
}
