'use client';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldCheck, Leaf, Star, ChevronDown, PlayCircle, MousePointerClick } from 'lucide-react';

const HeroAnimation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  const frameIndexRef = useRef(0);
  const totalFrames = 80;

  useEffect(() => {
    imagesRef.current = [];
    for (let i = 0; i < totalFrames; i++) {
        const img = new Image();
        const padded = i.toString().padStart(3, '0');
        img.src = `/assets/vio-icecream-video/White_cream_with_colorful_toppings_delpmaspu__${padded}.jpg`;
        img.decoding = 'async';
        imagesRef.current.push(img);
    }

    let animationFrameId: number;
    let lastTime = 0;
    const fps = 15; 
    const interval = 1000 / fps;

    const render = (time: number) => {
      animationFrameId = requestAnimationFrame(render);
      if (!lastTime) lastTime = time;
      const deltaTime = time - lastTime;
      
      if (deltaTime >= interval) {
        lastTime = time - (deltaTime % interval);
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        
        if (canvas && ctx) {
          const img = imagesRef.current[frameIndexRef.current];
          if (img && img.complete && img.naturalWidth) {
            const cw = canvas.width;
            const ch = canvas.height;
            const iw = img.naturalWidth;
            const ih = img.naturalHeight;
            const r = Math.max(cw / iw, ch / ih);
            const w = iw * r;
            const h = ih * r;
            const x = (cw - w) / 2;
            const y = (ch - h) / 2;
            ctx.drawImage(img, x, y, w, h);
          }
          frameIndexRef.current = (frameIndexRef.current + 1) % totalFrames;
        }
      }
    };

    animationFrameId = requestAnimationFrame(render);

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full object-cover z-0"
      width={1920}
      height={1080}
    />
  );
};

export default function Home() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.25], [0, -150]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.1]);
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, 300]);

  useEffect(() => {
    // Strict Routing: Authenticated users should never see the promotion page.
    const userStr = localStorage.getItem('user');
    if (userStr) {
      router.push('/products');
    } else {
      setCheckingAuth(false);
    }
  }, [router]);

  if (checkingAuth) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#020205]">
        <div className="flex flex-col items-center">
            <div className="h-1 w-48 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full overflow-hidden relative">
                <motion.div 
                  initial={{ x: '-100%' }} 
                  animate={{ x: '100%' }} 
                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                  className="h-full bg-white w-1/2 rounded-full blur-[2px]"
                />
            </div>
            <p className="text-gray-500 mt-4 text-sm font-semibold tracking-widest uppercase">Initializing Vault...</p>
        </div>
      </div>
    );
  }

  const flavors = [
    { name: 'Vanilla Dream', img: '/images/flavor_vanilla_dream_new.png', desc: 'Madagascar vanilla beans slow-churned to absolute perfection with 24k gold flakes.', color: 'from-amber-200 to-amber-500' },
    { name: 'Mint Symphony', img: '/images/mint.png', desc: 'Fresh garden mint folded seamlessly with rich dark Ecuadorian chocolate shards.', color: 'from-emerald-300 to-emerald-600' },
    { name: 'Midnight Espresso', img: '/images/espresso.png', desc: 'Cold-pressed Arabica layers spun intricately into a velvet twilight swirl.', color: 'from-zinc-400 to-zinc-700' },
    { name: 'Artisan Mango', img: '/images/mango.png', desc: 'Alphonso mangos whipped passionately into an airy, tropical luminous cloud.', color: 'from-orange-300 to-orange-600' }
  ];

  return (
    <div className="min-h-screen bg-[#020205] text-white font-sans selection:bg-pink-500/30 overflow-x-hidden">
      
      {/* BACKGROUND EFFECTS */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[150px] rounded-full mix-blend-screen opacity-50 sm:opacity-100" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-pink-600/10 blur-[150px] rounded-full mix-blend-screen opacity-50 sm:opacity-100" />
      </div>

      {/* SECTION 1: HYPER-CINEMATIC HERO */}
      <section className="relative min-h-[90svh] flex items-center overflow-hidden">
        {/* Mobile Background (keep a subtle animation) */}
        <div className="absolute inset-0 lg:hidden pointer-events-none">
           <div className="absolute inset-0 bg-gradient-to-b from-brand-500/10 via-transparent to-[#020205] z-0" />
        </div>

        <div className="container relative z-10 flex flex-col lg:flex-row items-center gap-8 lg:gap-12 py-10 sm:py-16">
          {/* Text Area */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="w-full lg:w-1/2 text-center lg:text-left space-y-4 sm:space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/5 border border-white/10 text-pink-300 text-[9px] sm:text-[10px] font-black tracking-widest uppercase">
              <Sparkles className="w-3 h-3 text-pink-400" />
              The New Standard of Dessert
            </div>
            
            <h1 className="text-fluid-h1 font-black tracking-tighter text-white">
              Taste <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400">
                The Future.
              </span>
            </h1>
            
            <p className="text-sm sm:text-lg lg:text-xl font-light leading-relaxed text-gray-400 max-w-xl mx-auto lg:mx-0">
              Experience the world's most luxurious, avant-garde ice cream flavors—designed for the ultimate connoisseurs. 
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/auth" className="px-8 sm:px-10 py-4 sm:py-5 font-black uppercase tracking-widest text-white rounded-full bg-brand-600 hover:bg-brand-500 transition-all shadow-xl hover:shadow-brand-500/40 text-center min-w-[180px] sm:min-w-[200px] text-xs sm:text-sm">
                Enter Vault
              </Link>
              <button className="flex items-center justify-center gap-3 px-6 sm:px-8 py-4 sm:py-5 font-bold text-gray-300 hover:text-white transition-colors text-sm sm:text-base">
                <PlayCircle className="w-5 h-5 sm:w-6 sm:h-6" /> Explore Story
              </button>
            </div>
          </motion.div>

          {/* Image/Animation Area */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="w-full lg:w-1/2 order-first lg:order-none"
          >
            <div className="relative aspect-square sm:aspect-[4/3] rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl bg-[#06060c]">
              <HeroAnimation />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 2: THE COLLECTION */}
      <section className="py-10 sm:py-16 bg-[#020205]">
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col lg:flex-row justify-between lg:items-end mb-8 sm:mb-12 gap-4 sm:gap-6 text-center lg:text-left"
          >
            <div className="space-y-2 sm:space-y-4">
              <div className="text-pink-500 font-bold tracking-widest uppercase text-[10px] sm:text-xs">The Collection</div>
              <h2 className="text-fluid-h2 font-black text-white tracking-tighter">Iconic Flavors</h2>
            </div>
            <p className="text-base sm:text-lg text-gray-400 max-w-lg font-light leading-relaxed mx-auto lg:mx-0">
              Meticulously engineered blends to transcend mere taste and evoke pure ecstasy.
            </p>
          </motion.div>

          {/* Grid: 1 col (mobile) -> 2 (tablet) -> 3 (laptop) -> 4 (desktop) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
            {flavors.map((flavor, idx) => (
              <motion.div 
                key={flavor.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="group flex flex-col items-center text-center space-y-3 sm:space-y-4"
              >
                <div className="w-full aspect-[4/3] relative rounded-[1rem] sm:rounded-[1.5rem] overflow-hidden bg-white/5 border border-white/10 group-hover:border-pink-500/50 transition-colors">
                  <img 
                    src={flavor.img} 
                    alt={flavor.name} 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000" 
                  />
                </div>
                <div className="space-y-1 sm:space-y-2">
                  <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">{flavor.name}</h3>
                  <p className="text-xs sm:text-sm text-gray-400 leading-relaxed font-light">{flavor.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-12 sm:py-20 overflow-hidden bg-black">
        <div className="absolute inset-0 bg-gradient-to-b from-[#020205] via-transparent to-[#020205]"></div>
        
        <div className="container flex flex-col lg:flex-row items-center gap-8 sm:gap-12 relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="w-full lg:w-1/2"
          >
            <div className="relative rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden aspect-[4/5] sm:aspect-square lg:aspect-[4/5] border border-white/5 shadow-[0_0_100px_rgba(236,72,153,0.15)] group">
              <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10 mix-blend-overlay"></div>
              <img src="/images/lifestyle_1.png" alt="Artisanal Quality" className="w-full h-full object-cover transform scale-100 group-hover:scale-110 transition-transform duration-[2s] ease-out brightness-75 group-hover:brightness-100" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-0 opacity-80"></div>
              
              <div className="absolute bottom-6 sm:bottom-12 left-6 sm:left-12 right-6 sm:right-12 z-20">
                <div className="glass px-5 sm:px-8 py-4 sm:py-6 rounded-2xl sm:rounded-3xl backdrop-blur-xl border border-white/10 bg-black/40">
                  <p className="text-white font-bold text-base sm:text-xl">&quot;The definition of decadence.&quot;</p>
                  <p className="text-pink-400 text-[10px] sm:text-sm mt-1 sm:mt-1.5 uppercase font-black tracking-widest">— Michelin Guide</p>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
            className="w-full lg:w-1/2 space-y-6 sm:space-y-10"
          >
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center gap-3 text-purple-400 font-black tracking-[0.3em] text-[9px] sm:text-xs uppercase">
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" /> Masterclass Craftsmanship
              </div>
              <h2 className="text-fluid-h2 font-black text-white leading-[1.05] tracking-tighter">
                Perfection is <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-600">Our Baseline.</span>
              </h2>
            </div>
            
            <p className="text-base sm:text-xl text-gray-400 font-light leading-relaxed">
              We&apos;ve discarded traditional churning methods in favor of sub-zero cryogenic infusion. By sourcing globally and producing microscopic batches, we ensure every molecular bite delivers euphoric intensity. 
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pt-4">
              <div className="group border border-white/10 p-4 sm:p-6 rounded-[1.5rem] bg-white/5 hover:bg-white/10 transition-all duration-500">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-pink-500/10 flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 group-hover:bg-pink-500/20 transition-all">
                  <Leaf className="w-5 h-5 sm:w-6 sm:h-6 text-pink-400" />
                </div>
                <h4 className="text-white font-black text-base sm:text-xl mb-2 uppercase tracking-tight">Pristine Source</h4>
                <p className="text-xs sm:text-sm text-gray-400 font-light leading-relaxed">Untouched, ethically harvested botanicals from remote landscapes.</p>
              </div>
              <div className="group border border-white/10 p-4 sm:p-6 rounded-[1.5rem] bg-white/5 hover:bg-white/10 transition-all duration-500">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 group-hover:bg-purple-500/20 transition-all">
                  <Star className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
                </div>
                <h4 className="text-white font-black text-base sm:text-xl mb-2 uppercase tracking-tight">Avant-Garde</h4>
                <p className="text-xs sm:text-sm text-gray-400 font-light leading-relaxed">Pushing the boundaries of culinary science and texture engineering.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 4: THE INVITATION */}
      <section className="relative py-12 sm:py-20 flex flex-col items-center text-center px-4 sm:px-6 overflow-hidden min-h-[50vh] sm:min-h-[60vh] justify-center">
        {/* Abstract shapes */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
            <div className="w-[300px] h-[300px] sm:w-[800px] sm:h-[800px] bg-gradient-to-r from-pink-600/20 via-purple-600/10 to-cyan-600/20 rounded-full blur-[60px] sm:blur-[100px] animate-pulse"></div>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="max-w-4xl w-full relative z-10"
        >
          <div className="relative border border-white/10 rounded-[1.5rem] sm:rounded-[2.5rem] p-6 sm:p-12 md:p-16 bg-[#050510]/80 backdrop-blur-2xl shadow-3xl overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
            
            {/* Hover spotlight effect */}
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-pink-500/20 blur-[80px] rounded-full group-hover:bg-pink-500/40 transition-colors duration-700"></div>

            <h2 className="text-fluid-h1 font-black text-white mb-4 sm:mb-6 tracking-tighter leading-none">Enter The Vault</h2>
            <p className="text-sm sm:text-lg text-gray-400 font-light mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed">
              Our full menu remains hidden from the public eye. Authenticate your identity to order the universe&apos;s most coveted ice cream.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
               <Link href="/auth" className="group relative inline-flex items-center justify-center w-full sm:w-auto min-w-[280px] sm:min-w-[300px] px-8 sm:px-12 py-5 sm:py-6 font-black tracking-[0.2em] sm:tracking-[0.3em] rounded-full bg-white hover:bg-pink-500 transition-all duration-500 hover:scale-105 active:scale-95 text-base sm:text-lg shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_60px_rgba(236,72,153,0.6)]">
                  <span className="absolute inset-0 flex items-center justify-center gap-2 text-gray-500 group-hover:opacity-0 transition-all duration-500 text-[8px] sm:text-[10px] uppercase font-black animate-pulse w-full text-center px-4 sm:px-6">
                    <MousePointerClick className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" /> Point your mouse or finger there
                  </span>
                  <span className="opacity-0 group-hover:opacity-100 transition-all duration-500 text-white uppercase">Authenticate Access</span>
               </Link>
            </div>
          </div>
        </motion.div>
      </section>

      <footer className="relative border-t border-white/10 bg-[#020205] py-16 sm:py-20 text-center z-10">
        <div className="container flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="flex flex-col items-center md:items-start group cursor-default">
                <div className="text-2xl sm:text-3xl font-black tracking-tighter text-white">
                    IceCream<span className="text-pink-500 group-hover:text-cyan-400 transition-colors duration-500">Hub</span>
                </div>
                <p className="text-[9px] sm:text-[10px] text-gray-600 font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] mt-2">Architecting Culinary Euphoria</p>
            </div>
            <p className="text-[9px] sm:text-[10px] text-gray-600 font-bold tracking-[0.2em] sm:tracking-[0.3em] uppercase order-3 md:order-2">
                &copy; {new Date().getFullYear()} The Premium Standard. All Rights Reserved.
            </p>
            <div className="flex gap-6 sm:gap-8 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 order-2 md:order-3">
                <span className="hover:text-white cursor-pointer transition-colors duration-300">Privacy</span>
                <span className="hover:text-white cursor-pointer transition-colors duration-300">Terms</span>
                <span className="hover:text-white cursor-pointer transition-colors duration-300">Manifesto</span>
            </div>
        </div>
      </footer>
    </div>
  );
}
