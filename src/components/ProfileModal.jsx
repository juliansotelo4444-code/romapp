import React from 'react';
import { Heart, Sparkles, X, Check, Crown, Flame } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-md bg-[#130818] border border-rose-900/60 rounded-3xl p-6 sm:p-8 shadow-2xl text-stone-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient background glows */}
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-rose-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-stone-400 hover:text-stone-100 hover:bg-white/10 transition-colors"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/70 border border-rose-800/50 text-[11px] font-semibold text-rose-300">
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            <span>Personalización de Sesión</span>
          </div>
          <h2 className="text-2xl font-bold font-serif-romantic text-white">
            ¿Quién está entrando hoy?
          </h2>
          <p className="text-xs text-stone-400 max-w-xs mx-auto">
            Selecciona tu perfil para personalizar saludos, cartas de amor, cupones y respuestas íntimas.
          </p>
        </div>

        {/* Profile Options */}
        <div className="space-y-3">
          {/* Julián */}
          <button
            onClick={() => handleSelect('julian')}
            className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between group cursor-pointer ${
              profileId === 'julian'
                ? 'bg-gradient-to-r from-[#24132b] to-[#1c0c29] border-amber-500/70 shadow-lg shadow-amber-950/40 ring-1 ring-amber-400/40'
                : 'bg-[#180a22]/70 border-rose-950/70 hover:border-amber-500/40 hover:bg-[#1f0d2b]'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-amber-500 to-purple-600 flex items-center justify-center text-2xl shadow-md group-hover:scale-105 transition-transform">
                👑
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif-romantic text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                    Julián
                  </h3>
                  <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-700/50">
                    El Novio / Esposo
                  </span>
                </div>
                <p className="text-xs text-stone-400 mt-0.5">
                  Para consentir a mi muñeca Yanet
                </p>
              </div>
            </div>

            {profileId === 'julian' && (
              <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center text-stone-950">
                <Check className="w-4 h-4 stroke-[3]" />
              </div>
            )}
          </button>

          {/* Yanet */}
          <button
            onClick={() => handleSelect('yanet')}
            className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between group cursor-pointer ${
              profileId === 'yanet'
                ? 'bg-gradient-to-r from-[#2b1022] to-[#250d1e] border-rose-500/70 shadow-lg shadow-rose-950/40 ring-1 ring-rose-400/40'
                : 'bg-[#180a22]/70 border-rose-950/70 hover:border-rose-500/40 hover:bg-[#250e20]'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-2xl shadow-md group-hover:scale-105 transition-transform">
                🌸
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif-romantic text-lg font-bold text-white group-hover:text-rose-300 transition-colors">
                    Yanet
                  </h3>
                  <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-rose-950/80 text-rose-300 border border-rose-700/50">
                    La Novia / Esposa
                  </span>
                </div>
                <p className="text-xs text-stone-400 mt-0.5">
                  Para disfrutar y mimar a mi rey Julián
                </p>
              </div>
            </div>

            {profileId === 'yanet' && (
              <div className="w-6 h-6 rounded-full bg-rose-500 flex items-center justify-center text-white">
                <Check className="w-4 h-4 stroke-[3]" />
              </div>
            )}
          </button>
        </div>

        {/* Footer info */}
        <div className="mt-6 pt-4 border-t border-rose-950/60 text-center">
          <p className="text-[11px] text-stone-400 flex items-center justify-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>Puedes cambiar de perfil en cualquier momento desde la barra superior.</span>
          </p>
        </div>
      </div>
    </div>
  );
}
