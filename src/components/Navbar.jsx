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
  Volume2,
  Gift,
  RefreshCw,
  UserCheck,
  Send
} from 'lucide-react';
import { useProfile } from '../context/ProfileContext';
import { useLovePings } from '../context/LovePingsContext';
import ProfileModal from './ProfileModal';
import LovePingsModal from './LovePingsModal';

const JULIAN_NICKNAMES_FOR_YANET = ['mi muñeca', 'mi amor', 'mi vida', 'mi bebota', 'bebé', 'memé'];
const YANET_NICKNAMES_FOR_JULIAN = ['mi rey', 'mi amor', 'mi bombón', 'mi cielo', 'mi vida', 'mi osito'];

export default function Navbar({ 
  currentTab, 
  setCurrentTab, 
  isSpotifyOpen, 
  setIsSpotifyOpen,
  isIntimateUnlocked 
}) {
  const { profile, isJulian, isYanet, toggleProfile, showProfileModal, setShowProfileModal } = useProfile();
  const { unreadCount, isPingModalOpen, setIsPingModalOpen } = useLovePings();
  const [nickIndex, setNickIndex] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const nicknames = isJulian ? JULIAN_NICKNAMES_FOR_YANET : YANET_NICKNAMES_FOR_JULIAN;

  // Rotate nickname periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setNickIndex((prev) => (prev + 1) % nicknames.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [nicknames.length]);

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
                  <span>{isJulian ? 'Para mi muñeca,' : 'Para mi rey,'}</span>
                  <span className="inline-block font-semibold text-rose-400 transition-all duration-500 transform">
                    "{nicknames[nickIndex]}"
                  </span>
                </div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                
                if (item.isSpecial) {
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectTab(item.id)}
                      className={`relative flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-300 ${
                        isActive
                          ? 'bg-[#240d1c] text-amber-300 shadow-md ring-1 ring-amber-400/50'
                          : 'bg-[#1a0a14] border border-amber-900/40 text-amber-100/90 hover:text-amber-300 hover:border-amber-500/50 hover:shadow-md'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400 animate-pulse' : 'text-amber-300/80'}`} />
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
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-rose-950/70 text-rose-200 font-semibold border border-rose-800/50 shadow-xs'
                        : 'text-stone-300 hover:text-white hover:bg-rose-950/30'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-rose-400' : 'text-stone-400'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Right Actions: Mimo Button & Profile Switcher & Spotify & Mobile Menu */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Mimo Button */}
              <button
                onClick={() => setIsPingModalOpen(true)}
                className={`relative flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all shadow-sm cursor-pointer border ${
                  unreadCount > 0
                    ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white border-pink-400 shadow-rose-950/80 animate-pulse'
                    : 'bg-rose-950/40 text-rose-300 border-rose-800/50 hover:bg-rose-900/60 hover:border-rose-500/60'
                }`}
                title={`Enviar o ver mimos para ${profile.partnerName}`}
              >
                <Heart className={`w-3.5 h-3.5 ${unreadCount > 0 ? 'fill-white animate-bounce' : 'text-rose-400 fill-rose-400'}`} />
                <span className="hidden sm:inline">Mimo</span>
                {unreadCount > 0 && (
                  <span className="flex items-center justify-center w-4 h-4 rounded-full bg-amber-400 text-rose-950 text-[10px] font-black">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Profile Pill Button */}
              <button
                onClick={() => setShowProfileModal(true)}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all shadow-sm cursor-pointer border ${
                  isJulian
                    ? 'bg-gradient-to-r from-amber-950/70 to-purple-950/70 text-amber-200 border-amber-500/50 hover:border-amber-400 hover:shadow-amber-950/50'
                    : 'bg-gradient-to-r from-rose-950/70 to-pink-950/70 text-rose-200 border-rose-500/50 hover:border-rose-400 hover:shadow-rose-950/50'
                }`}
                title="Cambiar entre Julián y Yanet"
              >
                <span className="text-sm">{profile.emoji}</span>
                <span className="font-bold">{profile.name}</span>
                <span className="hidden lg:inline text-[10px] text-stone-400 font-normal">
                  ({profile.partnerName ? `con ${profile.partnerName}` : ''})
                </span>
                <RefreshCw className="w-3 h-3 text-stone-400 hover:rotate-180 transition-transform" />
              </button>

              <button
                onClick={() => setIsSpotifyOpen(!isSpotifyOpen)}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all shadow-sm cursor-pointer ${
                  isSpotifyOpen 
                    ? 'bg-emerald-600 text-white shadow-emerald-500/20' 
                    : 'bg-emerald-950/50 text-emerald-300 hover:bg-emerald-900/60 border border-emerald-800/60'
                }`}
                title="Música de Nuestra Historia"
              >
                <Music className="w-3.5 h-3.5 text-emerald-400 group-hover:rotate-12 transition-transform" />
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
          <div className="md:hidden border-t border-rose-950/70 bg-[#0e0712]/98 backdrop-blur-xl px-4 pt-3 pb-6 space-y-2 shadow-2xl">
            {/* Mobile Profile Switch Card */}
            <div 
              onClick={() => {
                setShowProfileModal(true);
                setMobileMenuOpen(false);
              }}
              className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer mb-2 transition-all ${
                isJulian 
                  ? 'bg-gradient-to-r from-amber-950/60 to-purple-950/60 border-amber-500/40 text-amber-200' 
                  : 'bg-gradient-to-r from-rose-950/60 to-pink-950/60 border-rose-500/40 text-rose-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-xl">{profile.emoji}</span>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm text-white">Sesión: {profile.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-black/40 text-stone-300 border border-white/10">
                      {profile.role.split('/')[0].trim()}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-400">Toca para cambiar a {profile.partnerName}</p>
                </div>
              </div>
              <RefreshCw className="w-4 h-4 text-stone-400" />
            </div>

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

      {/* Profile Selector Modal */}
      <ProfileModal 
        isOpen={showProfileModal} 
        onClose={() => setShowProfileModal(false)} 
      />

      {/* Love Pings / Mimos Modal */}
      <LovePingsModal
        isOpen={isPingModalOpen}
        onClose={() => setIsPingModalOpen(false)}
      />
    </>
  );
}
