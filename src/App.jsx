import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HomeHero from './components/HomeHero';
import LoveLetters from './components/LoveLetters';
import HoneymoonChecklist from './components/HoneymoonChecklist';
import GeneralCoupons from './components/GeneralCoupons';
import WeddingEve from './components/WeddingEve';
import IntimateSection from './components/IntimateSection';
import SpotifyPlayer from './components/SpotifyPlayer';
import { Heart, Sparkles, Music } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState('home');
  const [isSpotifyOpen, setIsSpotifyOpen] = useState(false);
  const [isIntimateUnlocked, setIsIntimateUnlocked] = useState(false);

  // Intimate area is sealed as a wedding gift until the countdown reaches 0
  useEffect(() => {
    setIsIntimateUnlocked(false);
    localStorage.removeItem('romapp_intimate_unlocked');
  }, []);

  const handleSetIntimateUnlocked = (val) => {
    setIsIntimateUnlocked(val);
  };

  const handleNavigate = (tab) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#0b0710] text-stone-100 relative overflow-x-hidden selection:bg-rose-500/30 selection:text-rose-200">
      
      {/* Global Ambient Romantic Lighting */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-rose-950/20 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-1/4 w-[600px] h-[600px] bg-amber-950/15 rounded-full blur-[160px] pointer-events-none -z-10" />

      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        isSpotifyOpen={isSpotifyOpen}
        setIsSpotifyOpen={setIsSpotifyOpen}
        isIntimateUnlocked={isIntimateUnlocked}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-20 md:pb-12 relative z-10">
        {currentTab === 'home' && (
          <HomeHero
            onNavigate={handleNavigate}
            isIntimateUnlocked={isIntimateUnlocked}
            onOpenSpotify={() => setIsSpotifyOpen(true)}
          />
        )}

        {currentTab === 'letters' && <LoveLetters />}

        {currentTab === 'honeymoon' && <HoneymoonChecklist />}

        {currentTab === 'coupons' && <GeneralCoupons />}

        {currentTab === 'wedding-eve' && (
          <WeddingEve onOpenSpotify={() => setIsSpotifyOpen(true)} />
        )}

        {currentTab === 'intimate' && (
          <IntimateSection
            isUnlocked={isIntimateUnlocked}
            setIsUnlocked={handleSetIntimateUnlocked}
          />
        )}
      </main>

      {/* Floating Spotify Player Widget */}
      <SpotifyPlayer
        isOpen={isSpotifyOpen}
        onClose={() => setIsSpotifyOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-rose-950/50 bg-[#070309]/90 text-stone-400 py-6 text-center text-xs relative z-10">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <div className="flex items-center justify-center gap-2 font-medium text-stone-300">
            <span className="text-stone-200 font-semibold">Julián</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline-block animate-pulse" />
            <span className="text-stone-200 font-semibold">Yanet</span>
            <span className="text-stone-600">•</span>
            <span className="text-amber-300 font-serif-romantic font-bold">
              8 & 9 de Octubre
            </span>
            <span className="text-stone-600">•</span>
            <span className="text-rose-300/90">Luna de Miel en Bariloche</span>
          </div>
          <p className="text-[11px] text-stone-500 font-light">
            Hecho con todo el amor, la complicidad y la música de Morat, Tan Biónica & Airbag.
          </p>
        </div>
      </footer>

    </div>
  );
}
