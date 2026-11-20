import React, { useState } from 'react';
import { 
  Heart, 
  Send, 
  X, 
  Sparkles, 
  Clock, 
  MessageCircle, 
  CheckCheck, 
  User, 
  Smile,
  Gift
} from 'lucide-react';
import { useProfile } from '../context/ProfileContext';
import { useLovePings } from '../context/LovePingsContext';

const JULIAN_PRESET_MIMOS = [
  { text: 'Pensando en vos, mi muñeca hermosa ❤️', emoji: '🌸' },
  { text: 'Sos la mujer de mi vida, te amo infinito ✨', emoji: '💍' },
  { text: '¿Hacemos una pausa para unos mates o café juntos? ☕', emoji: '☕' },
  { text: 'Contando los segundos para verte... ⏳', emoji: '⏳' },
  { text: 'Te mando un abrazo de esos bien fuertes que curan todo 🫂', emoji: '🫂' },
  { text: '¡Hoy estás más linda que de costumbre! 💖', emoji: '✨' },
  { text: 'Te amo con locura, mi reina adorada 👑', emoji: '👑' }
];

const YANET_PRESET_MIMOS = [
  { text: 'Pensando en vos, mi rey hermoso 👑', emoji: '👑' },
  { text: 'Sos mi vida entera, te amo tanto ❤️', emoji: '❤️' },
  { text: '¿Hacemos una pausa para unos besos? 💋', emoji: '💋' },
  { text: 'Gracias por hacerme tan feliz cada día ✨', emoji: '✨' },
  { text: 'Te amo mi bombón, siempre juntos 💖', emoji: '💖' },
  { text: '¡Sos el mejor compañero que pude haber soñado! 🌟', emoji: '🌟' },
  { text: 'Un abrazo apretadito para mi amor 🫂', emoji: '🫂' }
];

const ROMANTIC_EMOJIS = ['❤️', '💖', '🌸', '👑', '💋', '☕', '🫂', '💍', '🏔️', '✨', '🔥', '🥂'];

export default function LovePingsModal({ isOpen, onClose }) {
  const { profile, isJulian, partnerName } = useProfile();
  const { pings, sendPing, markPingSeen } = useLovePings();
  const [activeTab, setActiveTab] = useState('send'); // 'send' or 'history'
  const [customMessage, setCustomMessage] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('❤️');
  const [sentSuccess, setSentSuccess] = useState(false);

  if (!isOpen) return null;

  const presets = isJulian ? JULIAN_PRESET_MIMOS : YANET_PRESET_MIMOS;

  const handleSend = (textToSend, emojiToSend) => {
    const msg = textToSend || customMessage;
    const emo = emojiToSend || selectedEmoji;
    if (!msg.trim()) return;

    sendPing({ message: msg, emoji: emo });
    setCustomMessage('');
    setSentSuccess(true);
    setTimeout(() => {
      setSentSuccess(false);
      onClose();
    }, 1200);
  };

  const handlePresetClick = (preset) => {
    handleSend(preset.text, preset.emoji);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-lg rounded-3xl bg-[#110a16] border border-white/10 shadow-2xl overflow-hidden text-stone-100 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle ambient glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="relative z-10 px-6 py-5 border-b border-white/10 flex items-center justify-between bg-black/20">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl overflow-hidden border border-white/20 shadow-md shrink-0">
              <img 
                src={isJulian ? '/photos/parque-rosas.jpg' : '/photos/cena-romantica.jpg'} 
                alt={partnerName} 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-serif-romantic text-xl font-bold text-stone-100 flex items-center gap-2">
                Mimos de Amor en Vivo
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/[0.05] text-amber-200/90 font-sans font-medium border border-white/10">
                  Para {partnerName}
                </span>
              </h3>
              <p className="text-xs text-stone-400">
                Enviá un mimo al instante a la pantalla de tu amor
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-rose-950/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="relative z-10 flex border-b border-rose-950/60 bg-black/10">
          <button
            onClick={() => setActiveTab('send')}
            className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-2 border-b-2 transition-colors ${
              activeTab === 'send'
                ? 'border-rose-500 text-rose-300 bg-rose-950/20'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>Enviar Mimo</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-2 border-b-2 transition-colors ${
              activeTab === 'history'
                ? 'border-rose-500 text-rose-300 bg-rose-950/20'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Historial ({pings.length})</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="relative z-10 p-6 overflow-y-auto flex-1 space-y-6">
          {sentSuccess ? (
            <div className="py-12 text-center space-y-4 animate-scale-up">
              <div className="w-16 h-16 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/40 animate-bounce">
                <Heart className="w-8 h-8 fill-rose-500" />
              </div>
              <h4 className="font-serif-romantic text-2xl font-bold text-white">
                ¡Mimo enviado con todo el amor! 💕
              </h4>
              <p className="text-sm text-rose-200">
                Aparecerá iluminando la pantalla de {partnerName}.
              </p>
            </div>
          ) : activeTab === 'send' ? (
            <>
              {/* Quick Presets */}
              <div className="space-y-2.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Mimos Rápidos Recomendados
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {presets.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => handlePresetClick(preset)}
                      className="group flex items-center justify-between p-3 rounded-2xl bg-white/[0.04] hover:bg-rose-950/40 border border-white/[0.06] hover:border-rose-500/40 text-left transition-all hover:scale-[1.01]"
                    >
                      <div className="flex items-center gap-2.5 pr-2">
                        <span className="text-lg group-hover:scale-125 transition-transform">
                          {preset.emoji}
                        </span>
                        <span className="text-xs sm:text-sm font-medium text-stone-200 group-hover:text-rose-200">
                          {preset.text}
                        </span>
                      </div>
                      <Send className="w-3.5 h-3.5 text-stone-500 group-hover:text-rose-400 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom message input */}
              <div className="space-y-3 pt-2 border-t border-rose-950/60">
                <label className="text-xs font-semibold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
                  <MessageCircle className="w-3.5 h-3.5 text-rose-400" />
                  O escribí tu mensaje personalizado
                </label>
                
                {/* Emoji Selector */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  {ROMANTIC_EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setSelectedEmoji(emoji)}
                      className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm transition-all shrink-0 ${
                        selectedEmoji === emoji
                          ? 'bg-rose-500/30 border border-rose-500 scale-110 shadow-sm'
                          : 'bg-white/[0.05] border border-transparent hover:bg-white/10'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <textarea
                    rows={3}
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    placeholder={`Escribile algo dulce a ${partnerName}...`}
                    className="w-full px-4 py-3 rounded-2xl bg-black/40 border border-rose-900/40 text-stone-100 placeholder:text-stone-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50 resize-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleSend()}
                    disabled={!customMessage.trim()}
                    className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold flex items-center gap-1.5 shadow-md transition-all"
                  >
                    <span>Enviar</span>
                    <Send className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* History Tab */
            <div className="space-y-3">
              {pings.length === 0 ? (
                <div className="py-12 text-center text-stone-500 text-xs">
                  Todavía no se enviaron mimos. ¡Sé el primero en mandar uno!
                </div>
              ) : (
                pings.map((ping) => {
                  const isFromMe = ping.fromUser.toLowerCase() === profile.name.toLowerCase();
                  return (
                    <div
                      key={ping.id}
                      onClick={() => {
                        if (!isFromMe && !ping.seen) {
                          markPingSeen(ping.id);
                        }
                      }}
                      className={`p-3.5 rounded-2xl border transition-all ${
                        isFromMe
                          ? 'bg-white/[0.03] border-white/[0.06] ml-4'
                          : 'bg-rose-950/30 border-rose-800/40 mr-4'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs text-stone-400 mb-1.5">
                        <span className="font-semibold text-rose-300 flex items-center gap-1.5">
                          <span>{ping.emoji}</span>
                          <span>{isFromMe ? 'Vos' : ping.fromUser}</span>
                          <span className="text-[10px] text-stone-500">
                            → {isFromMe ? ping.toUser : 'Vos'}
                          </span>
                        </span>
                        <span className="text-[10px] text-stone-500">
                          {new Date(ping.createdAt).toLocaleTimeString('es-AR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-stone-200 leading-relaxed font-light">
                        {ping.message}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="relative z-10 px-6 py-3.5 bg-black/30 border-t border-rose-950/60 text-center text-[11px] text-stone-500">
          Un detalle romántico para recordarse cuánto se aman en cualquier momento del día.
        </div>
      </div>
    </div>
  );
}
