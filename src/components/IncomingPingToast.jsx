import React from 'react';
import { X, MessageCircle, Sparkles } from 'lucide-react';
import { useLovePings } from '../context/LovePingsContext';

export default function IncomingPingToast() {
  const { activeToastPing, dismissActiveToast, setIsPingModalOpen } = useLovePings();

  if (!activeToastPing) return null;

  const handleReply = () => {
    dismissActiveToast();
    setIsPingModalOpen(true);
  };

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-50 max-w-sm w-full animate-slide-up">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#2c0d24]/95 via-[#1b0818]/95 to-[#10040e]/95 backdrop-blur-xl border border-rose-500/50 p-4 sm:p-5 shadow-[0_10px_35px_rgba(244,63,94,0.25)] text-stone-100">
        
        {/* Glow corner */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/20 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-start gap-3">
          {/* Avatar Photo */}
          <div className="relative w-12 h-12 rounded-2xl overflow-hidden border border-white/20 shadow-md shrink-0">
            <img 
              src={activeToastPing.fromUser.toLowerCase().includes('jul') ? '/photos/cena-romantica.jpg' : '/photos/parque-rosas.jpg'} 
              alt={activeToastPing.fromUser}
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-0 right-0 w-4 h-4 bg-amber-400 rounded-full border border-black flex items-center justify-center text-[9px]">
              {activeToastPing.emoji || '❤️'}
            </span>
          </div>

          <div className="flex-1 min-w-0 pr-6">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="font-serif-romantic font-bold text-sm text-white">
                Mimo de {activeToastPing.fromUser}
              </span>
              <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
            </div>

            <p className="text-xs sm:text-sm text-rose-100 font-light leading-snug line-clamp-3 mb-3">
              "{activeToastPing.message}"
            </p>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleReply}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md transition-all active:scale-95"
              >
                <MessageCircle className="w-3 h-3" />
                <span>Responder mimo</span>
              </button>
              <button
                onClick={dismissActiveToast}
                className="px-2.5 py-1.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-stone-300 text-xs font-medium transition-colors"
              >
                Guardar en mi corazón 💕
              </button>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={dismissActiveToast}
            className="absolute top-3 right-3 p-1 rounded-lg text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
