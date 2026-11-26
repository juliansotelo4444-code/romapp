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
  Dices
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
  const { profile, isJulian, toggleProfile, showProfileModal, setShowProfileModal } = useProfile();
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
    { id: 'games', label: 'Juegos & Retos', icon: Dices },
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
      <header className="sticky top-0 z-40 w-full bg-[#0c0812]/90 backdrop-blur-xl border-b border-white/[0.08] text-stone-100 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-17">
            
            {/* Logo & Dynamic Nickname */}
            <div 
              onClick={() => handleSelectTab('home')}
              className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group min-w-0"
            >
              <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden p-0.5 border border-amber-300/40 shadow-sm group-hover:scale-105 transition-transform shrink-0">
                <img 
                  src="/photos/beso-cafeteria.jpg" 
                  alt="Julián & Yanet" 
                  className="w-full h-full object-cover rounded-full"
                />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="font-serif-romantic text-base sm:text-xl font-bold tracking-tight text-stone-100 truncate">
                    Julián <span className="text-amber-300/90 font-serif font-light">&</span> Yanet
                  </span>
                  <span className="hidden lg:inline-block text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-full bg-white/[0.05] text-amber-200/90 font-medium border border-white/10">
                    Rumbo a Nuestra Boda
                  </span>
                </div>
                
                {/* Rotating Nickname Pill */}
                <div className="flex items-center gap-1 text-[11px] text-stone-400 truncate">
                  <span className="hidden sm:inline text-[10px]">{isJulian ? 'Para mi muñeca,' : 'Para mi rey,'}</span>
                  <span className="inline-block font-medium text-amber-200/90 font-serif-romantic italic truncate max-w-[110px] sm:max-w-none">
                    "{nicknames[nickIndex]}"
                  </span>
                </div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                
                if (item.isSpecial) {
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectTab(item.id)}
                      className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-300 cursor-pointer ${
                        isActive
                          ? 'bg-amber-950/40 text-amber-200 border border-amber-500/50 shadow-sm'
                          : 'bg-white/[0.03] border border-white/[0.08] text-amber-100/80 hover:text-amber-200 hover:border-amber-400/40'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-300 animate-pulse' : 'text-amber-300/70'}`} />
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
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                      isActive
                        ? 'bg-white/[0.08] text-stone-100 font-semibold border border-white/15 shadow-xs'
                        : 'text-stone-300 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-300' : 'text-stone-400'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Right Actions: Mimo Button & Profile Switcher & Spotify & Mobile Menu */}
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              {/* Mimo Button */}
              <button
                onClick={() => setIsPingModalOpen(true)}
                className={`relative flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all cursor-pointer border ${
                  unreadCount > 0
                    ? 'bg-rose-950/80 text-rose-200 border-rose-500/70 shadow-sm shadow-rose-950 animate-pulse'
                    : 'bg-white/[0.03] text-stone-300 border-white/10 hover:border-white/20 hover:text-white'
                }`}
                title={`Enviar o ver mimos para ${profile.partnerName}`}
              >
                <Heart className={`w-3.5 h-3.5 ${unreadCount > 0 ? 'text-rose-400 fill-rose-400 animate-bounce' : 'text-rose-400/80'}`} />
                <span className="hidden sm:inline">Mimo</span>
                {unreadCount > 0 && (
                  <span className="flex items-center justify-center w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Profile Pill with Real Photo */}
              <button
                onClick={() => setShowProfileModal(true)}
                className={`flex items-center gap-1.5 pl-1 pr-2 sm:pl-1.5 sm:pr-3 py-1 rounded-full text-xs font-semibold tracking-wide transition-all shadow-xs cursor-pointer border ${
                  isJulian
                    ? 'bg-amber-950/30 text-amber-200 border-amber-500/40 hover:border-amber-400/70'
                    : 'bg-rose-950/30 text-rose-200 border-rose-500/40 hover:border-rose-400/70'
                }`}
                title="Cambiar entre Julián y Yanet"
              >
                <div className="w-6 h-6 rounded-full overflow-hidden border border-white/30 shrink-0">
                  <img src={profile.photo} alt={profile.name} className="w-full h-full object-cover" />
                </div>
                <span className="hidden sm:inline">{profile.name}</span>
                <RefreshCw className="w-3 h-3 text-stone-400 hover:rotate-180 transition-transform opacity-70 hidden sm:inline" />
              </button>

              {/* Spotify Player Toggle */}
              <button
                onClick={() => setIsSpotifyOpen(!isSpotifyOpen)}
                className={`flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all cursor-pointer border ${
                  isSpotifyOpen 
                    ? 'bg-emerald-950/70 text-emerald-300 border-emerald-500/50 shadow-xs' 
                    : 'bg-white/[0.03] text-stone-300 border-white/10 hover:border-white/20'
                }`}
                title="Música de Nuestra Historia"
              >
                <Music className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden md:inline">Música</span>
                {isSpotifyOpen && <Volume2 className="w-3.5 h-3.5 animate-pulse" />}
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1.5 sm:p-2 rounded-xl text-stone-300 hover:text-stone-100 md:hidden hover:bg-white/[0.06] border border-transparent hover:border-white/10 transition-colors"
                aria-label="Abrir menú"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 bg-[#0c0812]/98 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-2 shadow-2xl">
            {/* Mobile Profile Switch Card */}
            <div 
              onClick={() => {
                setShowProfileModal(true);
                setMobileMenuOpen(false);
              }}
              className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer mb-2 transition-all ${
                isJulian 
                  ? 'bg-amber-950/30 border-amber-500/30 text-amber-200' 
                  : 'bg-rose-950/30 border-rose-500/30 text-rose-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/20 shrink-0">
                  <img src={profile.photo} alt={profile.name} className="w-full h-full object-cover" />
                </div>
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
                      ? 'bg-amber-950/30 text-amber-200 border border-amber-500/30 mt-2 shadow-inner'
                      : isActive
                      ? 'bg-white/[0.08] text-white font-bold border border-white/15'
                      : 'text-stone-300 hover:bg-white/[0.04] hover:text-stone-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${item.isSpecial ? 'text-amber-400' : isActive ? 'text-amber-300' : 'text-stone-400'}`} />
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

      {/* Mobile Bottom Quick Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#0c0812]/95 backdrop-blur-xl border-t border-white/10 md:hidden flex justify-around items-center py-2 px-1 shadow-[0_-8px_25px_rgba(0,0,0,0.6)]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          const shortLabels = {
            home: 'Inicio',
            games: 'Juegos',
            letters: 'Cartas',
            honeymoon: 'Viaje',
            coupons: 'Cupones',
            'wedding-eve': 'Víspera',
            intimate: 'Regalo'
          };
          const label = shortLabels[item.id] || item.label;

          return (
            <button
              key={item.id}
              onClick={() => handleSelectTab(item.id)}
              className={`flex flex-col items-center justify-center p-1 rounded-lg flex-1 min-w-0 transition-colors ${
                isActive ? 'text-amber-300 font-bold' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="text-[9px] mt-0.5 truncate w-full text-center">{label}</span>
            </button>
          );
        })}
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
