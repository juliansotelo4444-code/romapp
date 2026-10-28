import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Mail, 
  MapPin, 
  Ticket, 
  Sparkles, 
  Flame, 
  Music, 
  Menu, 
  X,
  Lock,
  Unlock,
  Volume2,
  Gift
} from 'lucide-react';

const NICKNAMES = ['mi amor', 'mi muñeca', 'mi vida', 'mi bebota', 'bebé', 'memé'];

export default function Navbar({ 
  currentTab, 
  setCurrentTab, 
  isSpotifyOpen, 
  setIsSpotifyOpen,
  isIntimateUnlocked 
}) {
  const [nickIndex, setNickIndex] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Rotate nickname periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setNickIndex((prev) => (prev + 1) % NICKNAMES.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { id: 'home', label: 'Inicio', icon: Heart },
    { id: 'letters', label: 'Cartas', icon: Mail },
    { id: 'honeymoon', label: 'Bariloche', icon: MapPin },
    { id: 'coupons', label: 'Cupones', icon: Ticket },
    { id: 'wedding-eve', label: 'Víspera (7 Oct)', icon: Sparkles },
    { 
      id: 'intimate', 
      label: isIntimateUnlocked ? 'Modo Íntimo' : 'Caja de Regalo', 
      icon: isIntimateUnlocked ? Flame : Gift,
      isSpecial: true
    },
  ];

  const handleSelectTab = (tabId) => {
    setCurrentTab(tabId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#0e0712]/92 backdrop-blur-xl border-b border-rose-950/60 shadow-lg text-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18">
            
            {/* Logo & Dynamic Nickname */}
            <div 
              onClick={() => handleSelectTab('home')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-rose-500 via-pink-500 to-amber-400 p-0.5 shadow-md group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-[#120713] rounded-full flex items-center justify-center">
                  <Heart className="w-5 h-5 text-rose-500 fill-rose-500 animate-pulse" />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-serif-romantic text-xl font-bold tracking-tight text-white">
                    Julián <span className="text-rose-400 font-sans">&</span> Yanet
                  </span>
                  <span className="hidden sm:inline-block text-xs uppercase tracking-widest px-2 py-0.5 rounded-full bg-rose-950/70 text-rose-300 font-medium border border-rose-800/60">
                    Boda & Luna de Miel
                  </span>
                </div>
                
                {/* Rotating Nickname Pill */}
                <div className="flex items-center gap-1.5 text-xs text-stone-400">
                  <span>Para ti,</span>
                  <span className="inline-block font-semibold text-rose-400 transition-all duration-500 transform">
                    "{NICKNAMES[nickIndex]}"
                  </span>
                </div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                
                if (item.isSpecial) {
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectTab(item.id)}
                      className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                        isActive
                          ? 'bg-[#240d1c] text-amber-300 shadow-md ring-1 ring-amber-400/50'
                          : 'bg-[#1a0a14] border border-amber-900/40 text-amber-100/90 hover:text-amber-300 hover:border-amber-500/50 hover:shadow-md'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400 animate-pulse' : 'text-amber-300/80'}`} />
                      <span>{item.label}</span>
                      {!isIntimateUnlocked && (
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                      )}
                    </button>
                  );
                }

                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectTab(item.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-rose-50 text-rose-700 font-semibold shadow-xs'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-rose-600' : 'text-stone-400'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Right Action: Spotify Floating Toggle & Mobile Menu */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsSpotifyOpen(!isSpotifyOpen)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all shadow-sm ${
                  isSpotifyOpen 
                    ? 'bg-emerald-600 text-white shadow-emerald-500/20' 
                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                }`}
                title="Música de Nuestra Historia"
              >
                <Music className="w-4 h-4 text-emerald-600 group-hover:rotate-12 transition-transform" />
                <span className="hidden sm:inline">Spotify</span>
                {isSpotifyOpen && <Volume2 className="w-3.5 h-3.5 animate-pulse" />}
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-stone-300 hover:text-stone-100 md:hidden hover:bg-rose-950/40 border border-transparent hover:border-rose-900/50 transition-colors"
                aria-label="Abrir menú"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-rose-950/70 bg-[#0e0712]/98 backdrop-blur-xl px-4 pt-3 pb-6 space-y-1.5 shadow-2xl">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left text-sm font-medium transition-all ${
                    item.isSpecial
                      ? 'bg-gradient-to-r from-amber-950/40 to-rose-950/50 text-amber-200 border border-amber-500/30 mt-2 shadow-inner'
                      : isActive
                      ? 'bg-rose-950/60 text-rose-200 font-bold border border-rose-800/40'
                      : 'text-stone-300 hover:bg-rose-950/30 hover:text-stone-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${item.isSpecial ? 'text-amber-400' : isActive ? 'text-rose-400' : 'text-stone-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.isSpecial && (
                    <span className="text-[11px] bg-amber-950/80 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-500/40 font-serif">
                      {isIntimateUnlocked ? 'Abierto' : 'Abre el 8 Oct'}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* Mobile Bottom Quick Bar for Convenient Thumb Access */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#0c060f]/95 backdrop-blur-xl border-t border-rose-950/70 md:hidden flex justify-around items-center py-2 px-1 shadow-[0_-8px_25px_rgba(0,0,0,0.6)]">
        {navItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleSelectTab(item.id)}
              className={`flex flex-col items-center justify-center p-1 rounded-lg flex-1 transition-colors ${
                isActive ? 'text-rose-400 font-bold' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">{item.label}</span>
            </button>
          );
        })}
        <button
          onClick={() => handleSelectTab('intimate')}
          className={`flex flex-col items-center justify-center p-1 rounded-lg flex-1 transition-colors ${
            currentTab === 'intimate' ? 'text-amber-300 font-bold' : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <Flame className="w-5 h-5 text-amber-400" />
          <span className="text-[10px] mt-0.5">Regalo</span>
        </button>
      </div>
    </>
  );
}
