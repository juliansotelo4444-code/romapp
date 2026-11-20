import React from 'react';
import { Sparkles, X, Check } from 'lucide-react';
import { useProfile, PROFILES } from '../context/ProfileContext';
import { triggerLoveConfetti } from '../utils/confetti';

export default function ProfileModal({ isOpen, onClose }) {
  const { profileId, switchProfile } = useProfile();

  if (!isOpen) return null;

  const handleSelect = (id) => {
    switchProfile(id);
    triggerLoveConfetti();
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-md bg-[#110a16] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl text-stone-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle warm ambient lighting */}
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-stone-400 hover:text-stone-100 hover:bg-white/10 transition-colors cursor-pointer"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-medium text-amber-200/90 tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Perfil de Sesión</span>
          </div>
          <h2 className="text-2xl font-bold font-serif-romantic text-stone-100">
            ¿Quién está en Romapp?
          </h2>
          <p className="text-xs text-stone-400 max-w-xs mx-auto leading-relaxed">
            Personaliza saludos, cartas y la complicidad de cada rincón de nuestra historia.
          </p>
        </div>

        {/* Profile Options */}
        <div className="space-y-3">
          {/* Julián */}
          <button
            onClick={() => handleSelect('julian')}
            className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between group cursor-pointer ${
              profileId === 'julian'
                ? 'bg-amber-950/30 border-amber-500/60 shadow-lg shadow-amber-950/30 ring-1 ring-amber-400/30'
                : 'bg-white/[0.03] border-white/10 hover:border-amber-500/30 hover:bg-white/[0.06]'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div className="relative w-14 h-14 rounded-2xl overflow-hidden border-2 border-amber-500/40 shrink-0 shadow-md group-hover:scale-105 transition-transform">
                <img 
                  src={PROFILES.julian.photo} 
                  alt="Julián" 
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-amber-400 rounded-full border-2 border-[#110a16]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif-romantic text-lg font-bold text-stone-100 group-hover:text-amber-200 transition-colors">
                    Julián
                  </h3>
                  <span className="text-[10px] font-medium uppercase px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                    El Novio / Esposo
                  </span>
                </div>
                <p className="text-xs text-stone-400 mt-0.5">
                  Con todo mi amor para mi muñeca Yanet
                </p>
              </div>
            </div>

            {profileId === 'julian' && (
              <div className="w-6 h-6 rounded-full bg-amber-400 flex items-center justify-center text-stone-950 shrink-0 shadow-xs">
                <Check className="w-4 h-4 stroke-[3]" />
              </div>
            )}
          </button>

          {/* Yanet */}
          <button
            onClick={() => handleSelect('yanet')}
            className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between group cursor-pointer ${
              profileId === 'yanet'
                ? 'bg-rose-950/30 border-rose-500/60 shadow-lg shadow-rose-950/30 ring-1 ring-rose-400/30'
                : 'bg-white/[0.03] border-white/10 hover:border-rose-500/30 hover:bg-white/[0.06]'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div className="relative w-14 h-14 rounded-2xl overflow-hidden border-2 border-rose-500/40 shrink-0 shadow-md group-hover:scale-105 transition-transform">
                <img 
                  src={PROFILES.yanet.photo} 
                  alt="Yanet" 
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-rose-400 rounded-full border-2 border-[#110a16]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif-romantic text-lg font-bold text-stone-100 group-hover:text-rose-200 transition-colors">
                    Yanet
                  </h3>
                  <span className="text-[10px] font-medium uppercase px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30">
                    La Novia / Esposa
                  </span>
                </div>
                <p className="text-xs text-stone-400 mt-0.5">
                  La luz de los días de mi rey Julián
                </p>
              </div>
            </div>

            {profileId === 'yanet' && (
              <div className="w-6 h-6 rounded-full bg-rose-400 flex items-center justify-center text-stone-950 shrink-0 shadow-xs">
                <Check className="w-4 h-4 stroke-[3]" />
              </div>
            )}
          </button>
        </div>

        {/* Footer info */}
        <div className="mt-6 pt-4 border-t border-white/10 text-center text-[11px] text-stone-500">
          Ambos pueden escribir cartas, canjear cupones y enviarse mimos en vivo.
        </div>
      </div>
    </div>
  );
}
