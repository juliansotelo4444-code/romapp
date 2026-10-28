import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Camera, 
  Clock, 
  Upload, 
  Eye, 
  EyeOff, 
  Check, 
  Flame, 
  Send, 
  Crown, 
  Radio, 
  Volume2, 
  HelpCircle,
  Dices,
  Lock,
  Unlock,
  Heart,
  Moon
} from 'lucide-react';
import { 
  WEDDING_EVE_MISSIONS, 
  NIGHT_SCHEDULE_PROMPTS, 
  INSOMNIA_ROULETTE_PROMPTS 
} from '../data/weddingEveData';
import { triggerLoveConfetti, triggerGoldConfetti } from '../utils/confetti';

function LockedWeddingEveView({ countdown }) {
  return (
    <div className="py-12 px-4 max-w-xl mx-auto text-center space-y-8">
      <div className="p-8 sm:p-12 rounded-3xl bg-[#0d0918] text-white border border-indigo-500/30 shadow-2xl relative overflow-hidden space-y-6">
        
        {/* Night ambient glows */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Moon & Stars Icon */}
        <div className="relative z-10 w-24 h-24 rounded-3xl bg-[#101726] border-2 border-indigo-400/50 flex items-center justify-center mx-auto text-amber-300 shadow-2xl shadow-black">
          <Moon className="w-12 h-12 text-amber-300 animate-pulse" />
        </div>

        {/* Header Tag & Title */}
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-amber-300 bg-indigo-950/80 px-4 py-1.5 rounded-full border border-indigo-700/60 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Noche Previa al Gran Día • 7 de Octubre</span>
          </div>

          <h2 className="font-serif-romantic text-3xl sm:text-4xl font-extrabold text-white">
            La Víspera de Nuestra Boda
          </h2>

          <p className="text-xs sm:text-sm text-stone-300 max-w-md mx-auto leading-relaxed font-light">
            Este espacio atesora las dinámicas nocturnas, la ruleta del insomnio y las actividades especiales para Julián y Yanet durante las últimas horas de soltería. Permanecerá cerrado y se desbloqueará automáticamente la noche del 7 de Octubre a las 20:00 hs.
          </p>
        </div>

        {/* Live Active Countdown Grid */}
        <div className="relative z-10 pt-1 space-y-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-300 block">
            Tiempo restante para la apertura:
          </span>
          <div className="grid grid-cols-4 gap-2 sm:gap-3 max-w-sm mx-auto">
            <div className="p-3 rounded-2xl bg-[#140e26] border border-indigo-800/60 shadow-inner">
              <span className="block font-mono text-2xl font-black text-amber-300">
                {countdown.days}
              </span>
              <span className="text-[10px] uppercase font-bold text-stone-400">Días</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#140e26] border border-indigo-800/60 shadow-inner">
              <span className="block font-mono text-2xl font-black text-amber-300">
                {String(countdown.hours).padStart(2, '0')}
              </span>
              <span className="text-[10px] uppercase font-bold text-stone-400">Horas</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#140e26] border border-indigo-800/60 shadow-inner">
              <span className="block font-mono text-2xl font-black text-amber-300">
                {String(countdown.minutes).padStart(2, '0')}
              </span>
              <span className="text-[10px] uppercase font-bold text-stone-400">Min</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#140e26] border border-indigo-800/60 shadow-inner">
              <span className="block font-mono text-2xl font-black text-amber-300">
                {String(countdown.seconds).padStart(2, '0')}
              </span>
              <span className="text-[10px] uppercase font-bold text-stone-400">Seg</span>
            </div>
          </div>
        </div>

        {/* Locked status banner */}
        <div className="relative z-10 pt-2 text-center">
          <span className="inline-flex items-center gap-1.5 text-xs text-indigo-300/90 font-medium bg-indigo-950/60 px-3.5 py-1.5 rounded-full border border-indigo-800/40">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>Bloqueado hasta el 7 de Octubre a las 20:00 hs. Apertura automática.</span>
          </span>
        </div>

        {/* Footer date info */}
        <div className="relative z-10 pt-4 border-t border-indigo-900/50 flex flex-col items-center gap-1.5 text-xs text-stone-400">
          <div className="flex items-center gap-2 font-medium text-amber-200">
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500 inline-block animate-pulse" />
            <span>Víspera: 7 de Octubre • Civil: 8 de Octubre • Fiesta: 9 de Octubre</span>
          </div>
          <span className="text-[11px] text-indigo-300/80">
            Julián (24) & Yanet (30) • Bariloche
          </span>
        </div>

      </div>
    </div>
  );
}

export default function WeddingEve({ onOpenSpotify }) {
  // Eve lock state: locked until October 7 at 20:00 hs
  const calculateEveRemaining = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    let target = new Date(currentYear, 9, 7, 20, 0, 0); // 7 de Octubre, 20:00 hs
    if (target.getTime() <= now.getTime()) {
      target = new Date(currentYear + 1, 9, 7, 20, 0, 0);
    }
    const diff = target.getTime() - now.getTime();
    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isUnlocked: true };
    }
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / 1000 / 60) % 60),
      seconds: Math.floor((diff / 1000) % 60),
      isUnlocked: false
    };
  };

  const [eveCountdown, setEveCountdown] = useState(calculateEveRemaining);

  useEffect(() => {
    const timer = setInterval(() => {
      setEveCountdown(calculateEveRemaining());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const [activeTab, setActiveTab] = useState('missions'); // 'missions', 'schedule', 'roulette', 'midnight'
  const [targetAudience, setTargetAudience] = useState('yanet'); // 'yanet' or 'julian'
  const [missionsState, setMissionsState] = useState(WEDDING_EVE_MISSIONS);
  const [scheduleNotes, setScheduleNotes] = useState({});
  const [revealedPhotos, setRevealedPhotos] = useState({});
  const [rouletteResult, setRouletteResult] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isGoldenUnlocked, setIsGoldenUnlocked] = useState(false);

  // If locked, render the atmospheric locked screen with countdown
  if (!eveCountdown.isUnlocked) {
    return <LockedWeddingEveView countdown={eveCountdown} />;
  }

  // Load state from localStorage
  useEffect(() => {
    const savedMissions = localStorage.getItem('romapp_wedding_eve_missions');
    if (savedMissions) {
      try {
        setMissionsState(JSON.parse(savedMissions));
      } catch {
        setMissionsState(WEDDING_EVE_MISSIONS);
      }
    }

    const savedSchedule = localStorage.getItem('romapp_night_schedule');
    if (savedSchedule) {
      try {
        setScheduleNotes(JSON.parse(savedSchedule));
      } catch {
        setScheduleNotes({});
      }
    }

    const goldenSaved = localStorage.getItem('romapp_golden_coupon_unlocked');
    if (goldenSaved === 'true') {
      setIsGoldenUnlocked(true);
    }
  }, []);

  const saveMissions = (updated) => {
    setMissionsState(updated);
    localStorage.setItem('romapp_wedding_eve_missions', JSON.stringify(updated));
  };

  const saveSchedule = (updated) => {
    setScheduleNotes(updated);
    localStorage.setItem('romapp_night_schedule', JSON.stringify(updated));
  };

  // Handle Photo Upload
  const handlePhotoUpload = (missionId, e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target.result;
      const updated = {
        ...missionsState,
        [targetAudience]: missionsState[targetAudience].map((m) => {
          if (m.id === missionId) {
            return { ...m, status: 'completed', photoBase64: base64 };
          }
          return m;
        })
      };
      saveMissions(updated);
      triggerLoveConfetti();
    };
    reader.readAsDataURL(file);
  };

  // Handle Schedule Text Change
  const handleScheduleTextChange = (timeSlot, text) => {
    const updated = { ...scheduleNotes, [timeSlot]: text };
    saveSchedule(updated);
  };

  // Spin Roulette
  const spinRoulette = () => {
    setIsSpinning(true);
    let counter = 0;
    const interval = setInterval(() => {
      const randomIdx = Math.floor(Math.random() * INSOMNIA_ROULETTE_PROMPTS.length);
      setRouletteResult(INSOMNIA_ROULETTE_PROMPTS[randomIdx]);
      counter++;
      if (counter > 10) {
        clearInterval(interval);
        setIsSpinning(false);
        triggerLoveConfetti();
      }
    }, 100);
  };

  // Unlock Golden Coupon
  const handleUnlockGoldenCoupon = () => {
    setIsGoldenUnlocked(true);
    localStorage.setItem('romapp_golden_coupon_unlocked', 'true');
    triggerGoldConfetti();
    if (onOpenSpotify) onOpenSpotify();
  };

  const currentMissions = missionsState[targetAudience] || [];

  return (
    <div className="space-y-8 py-6 max-w-5xl mx-auto">
      
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-950 via-stone-900 to-[#120a1f] text-white p-6 sm:p-10 shadow-2xl border border-purple-500/30">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-900/60 border border-purple-500/40 text-xs font-semibold text-amber-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Módulo Especial • 7 de Octubre</span>
          </div>

          <h2 className="font-serif-romantic text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            La Víspera de Nuestra Boda
          </h2>

          <p className="text-xs sm:text-sm text-purple-200/90 leading-relaxed font-light">
            La noche donde reina la anticipación antes del civil del 8 de Octubre. Misiones fotográficas milimétricas, secretos susurrados en la madrugada y el camino al altar.
          </p>
        </div>

        {/* Quick Nav Tabs */}
        <div className="relative z-10 flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-purple-900/60">
          <button
            onClick={() => setActiveTab('missions')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'missions'
                ? 'bg-amber-400 text-stone-950 shadow-md'
                : 'bg-purple-900/40 text-purple-200 hover:bg-purple-900/80'
            }`}
          >
            📸 Misiones de Fotos Prohibidas
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'schedule'
                ? 'bg-amber-400 text-stone-950 shadow-md'
                : 'bg-purple-900/40 text-purple-200 hover:bg-purple-900/80'
            }`}
          >
            🌙 Guion Noche de Bodas
          </button>
          <button
            onClick={() => setActiveTab('roulette')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'roulette'
                ? 'bg-amber-400 text-stone-950 shadow-md'
                : 'bg-purple-900/40 text-purple-200 hover:bg-purple-900/80'
            }`}
          >
            🎲 Ruleta del Insomnio Nupcial
          </button>
          <button
            onClick={() => setActiveTab('midnight')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'midnight'
                ? 'bg-amber-400 text-stone-950 shadow-md'
                : 'bg-purple-900/40 text-purple-200 hover:bg-purple-900/80'
            }`}
          >
            👑 Conteo & Cupón Dorado
          </button>
        </div>
      </div>

      {/* TAB 1: MISIONES DE FOTOS PROHIBIDAS */}
      {activeTab === 'missions' && (
        <div className="space-y-6">
          
          {/* Target Audience Switch */}
          <div className="flex items-center justify-center p-1 bg-[#180a1c] rounded-2xl border border-rose-950/70 max-w-md mx-auto shadow-xs">
            <button
              onClick={() => setTargetAudience('yanet')}
              className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                targetAudience === 'yanet'
                  ? 'bg-rose-700 text-rose-100 shadow-xs'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Para Yanet (a pedido de Julián)
            </button>
            <button
              onClick={() => setTargetAudience('julian')}
              className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                targetAudience === 'julian'
                  ? 'bg-rose-700 text-rose-100 shadow-xs'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Para Julián (a pedido de Yanet)
            </button>
          </div>

          <div className="text-center max-w-xl mx-auto">
            <h3 className="font-serif-romantic text-xl font-bold text-stone-100">
              {targetAudience === 'yanet'
                ? 'Consignas para Yanet: Desata la imaginación de tu futuro esposo'
                : 'Consignas para Julián: La presencia y elegancia que derrite a Yanet'}
            </h3>
            <p className="text-xs text-stone-400 mt-1">
              Cumple cada misión con el encuadre, iluminación y pose exacta. Las fotos se guardan en tu dispositivo con vista previa protegida por desenfoque.
            </p>
          </div>

          {/* Missions Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {currentMissions.map((mission) => {
              const isRevealed = revealedPhotos[mission.id];

              return (
                <div
                  key={mission.id}
                  className="bg-[#140816]/90 backdrop-blur-xl rounded-3xl p-6 border border-rose-950/70 shadow-xl space-y-4 hover:border-rose-800/60 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-rose-300 bg-rose-950/60 px-2.5 py-0.5 rounded-full border border-rose-800/40">
                        {mission.targetAudience}
                      </span>
                      <h4 className="font-serif-romantic text-lg font-bold text-stone-100 mt-1.5">
                        {mission.title}
                      </h4>
                    </div>

                    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold flex items-center gap-1 ${
                      mission.status === 'completed'
                        ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/40'
                        : 'bg-[#1c0b1f] text-stone-400 border border-rose-950/50'
                    }`}>
                      {mission.status === 'completed' ? <Check className="w-3.5 h-3.5" /> : <Camera className="w-3.5 h-3.5" />}
                      <span>{mission.status === 'completed' ? 'Cumplida' : 'Pendiente'}</span>
                    </span>
                  </div>

                  {/* Consignas Milimétricas */}
                  <div className="space-y-2 text-xs bg-[#1c0b1f] p-3.5 rounded-2xl border border-rose-950/70">
                    <div>
                      <strong className="text-stone-300">📐 Encuadre:</strong>{' '}
                      <span className="text-stone-400">{mission.framing}</span>
                    </div>
                    <div>
                      <strong className="text-stone-300">💡 Iluminación:</strong>{' '}
                      <span className="text-stone-400">{mission.lighting}</span>
                    </div>
                    <div>
                      <strong className="text-stone-300">💃 Pose:</strong>{' '}
                      <span className="text-stone-400">{mission.pose}</span>
                    </div>
                    <div>
                      <strong className="text-stone-300">👗 Vestimenta:</strong>{' '}
                      <span className="text-stone-400">{mission.attire}</span>
                    </div>
                  </div>

                  {/* Photo Preview / Upload Area */}
                  {mission.photoBase64 ? (
                    <div className="space-y-2">
                      <div className="relative rounded-2xl overflow-hidden bg-stone-950 aspect-video flex items-center justify-center group">
                        <img
                          src={mission.photoBase64}
                          alt={mission.title}
                          className={`w-full h-full object-cover transition-all duration-300 select-none ${
                            isRevealed ? 'filter-none scale-100' : 'filter blur-xl scale-105'
                          }`}
                        />

                        {/* Hold to reveal badge */}
                        <div 
                          onMouseDown={() => setRevealedPhotos({ ...revealedPhotos, [mission.id]: true })}
                          onMouseUp={() => setRevealedPhotos({ ...revealedPhotos, [mission.id]: false })}
                          onTouchStart={() => setRevealedPhotos({ ...revealedPhotos, [mission.id]: true })}
                          onTouchEnd={() => setRevealedPhotos({ ...revealedPhotos, [mission.id]: false })}
                          className="absolute inset-0 flex items-center justify-center bg-black/40 text-white cursor-pointer select-none"
                        >
                          <div className="px-3 py-1.5 rounded-xl bg-black/70 backdrop-blur-md text-xs font-semibold flex items-center gap-1.5 border border-white/20">
                            {isRevealed ? <EyeOff className="w-4 h-4 text-rose-400" /> : <Eye className="w-4 h-4 text-amber-300" />}
                            <span>{isRevealed ? 'Soltar para ocultar' : 'Mantener presionado para revelar'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-stone-400">
                        <span>Foto protegida en tu navegador</span>
                        <label className="text-rose-400 font-semibold hover:underline cursor-pointer">
                          <span>Reemplazar foto</span>
                          <input
                            type="file"
                            accept="image/*"
                            capture="environment"
                            onChange={(e) => handlePhotoUpload(mission.id, e)}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  ) : (
                    <label className="border-2 border-dashed border-rose-950/80 hover:border-rose-700/60 bg-[#1a0a1e]/60 hover:bg-[#1a0a1e] rounded-2xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors text-center">
                      <div className="w-10 h-10 rounded-full bg-rose-950/60 text-rose-400 border border-rose-800/40 flex items-center justify-center">
                        <Camera className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-semibold text-stone-200">
                        Tomar o subir foto de la misión
                      </span>
                      <span className="text-[10px] text-stone-400">
                        Se guarda cifrada en Base64 con blur automático
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={(e) => handlePhotoUpload(mission.id, e)}
                        className="hidden"
                      />
                    </label>
                  )}

                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* TAB 2: GUION DE LA NOCHE DE BODAS */}
      {activeTab === 'schedule' && (
        <div className="bg-[#140816]/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-rose-950/70 shadow-2xl space-y-6">
          <div className="border-b border-rose-950/60 pb-4">
            <h3 className="font-serif-romantic text-2xl font-bold text-stone-100">
              El Guion de Nuestra Noche de Bodas
            </h3>
            <p className="text-xs text-stone-400 mt-1">
              Un lienzo dividido en 4 horarios clave de la madrugada para escribir compromisos, fantasías y sensaciones por turnos.
            </p>
          </div>

          <div className="space-y-6">
            {NIGHT_SCHEDULE_PROMPTS.map((slot) => (
              <div 
                key={slot.time}
                className="p-5 rounded-2xl bg-[#1b0a1d]/80 border border-rose-950/70 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-lg bg-amber-950/80 text-amber-300 font-mono text-xs font-bold border border-amber-600/40">
                      {slot.time}
                    </span>
                    <h4 className="font-serif-romantic text-base font-bold text-stone-100">
                      {slot.title}
                    </h4>
                  </div>
                </div>

                <p className="text-xs text-stone-400 italic">
                  {slot.description}
                </p>

                <textarea
                  rows={3}
                  value={scheduleNotes[slot.time] || ''}
                  onChange={(e) => handleScheduleTextChange(slot.time, e.target.value)}
                  placeholder={slot.authorPrompt}
                  className="w-full bg-[#140616] border border-rose-950/80 rounded-xl p-3 text-xs text-stone-100 focus:outline-none focus:border-rose-500 leading-relaxed font-serif-romantic text-sm placeholder-stone-500"
                />

                <div className="flex justify-between items-center text-[10px] text-stone-400">
                  <span>Se guarda automáticamente en localStorage</span>
                  {scheduleNotes[slot.time] && (
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <Check className="w-3 h-3" /> Guardado
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: RULETA DEL INSOMNIO NUPCIAL */}
      {activeTab === 'roulette' && (
        <div className="bg-[#140816]/90 backdrop-blur-xl rounded-3xl p-6 sm:p-10 border border-rose-950/70 shadow-2xl text-center space-y-6 max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-3xl bg-rose-950/60 text-amber-400 border border-rose-800/40 flex items-center justify-center mx-auto shadow-inner">
            <Dices className={`w-8 h-8 ${isSpinning ? 'animate-spin' : ''}`} />
          </div>

          <div className="space-y-2">
            <h3 className="font-serif-romantic text-2xl font-bold text-stone-100">
              Ruleta del Insomnio Nupcial
            </h3>
            <p className="text-xs text-stone-400 max-w-md mx-auto">
              Diseñada especialmente para la madrugada previa entre las 00:00 y las 03:00 AM. Si los nervios y las ganas no los dejan dormir, giren la ruleta y cumplan el desafío.
            </p>
          </div>

          {/* Result Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-[#1b0a1d] to-[#120715] border-2 border-dashed border-amber-500/40 min-h-[120px] flex items-center justify-center">
            {rouletteResult ? (
              <p className="font-serif-romantic text-lg sm:text-xl font-bold text-amber-200 leading-relaxed animate-pulse">
                "{rouletteResult}"
              </p>
            ) : (
              <p className="text-xs text-stone-400 italic">
                Presiona el botón para descubrir tu reto nocturno...
              </p>
            )}
          </div>

          <button
            onClick={spinRoulette}
            disabled={isSpinning}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-600/60 hover:border-amber-400 text-amber-200 font-bold text-sm shadow-xl shadow-black hover:scale-105 transition-all cursor-pointer disabled:opacity-50"
          >
            {isSpinning ? 'Girando el destino...' : '🎲 Girar Ruleta del Insomnio'}
          </button>
        </div>
      )}

      {/* TAB 4: CONTEO A MEDIANOCHE & CUPÓN DORADO NUPCIAL */}
      {activeTab === 'midnight' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-[#1a0e05] via-[#0c0812] to-[#150a18] text-white rounded-3xl p-6 sm:p-10 border border-amber-500/40 shadow-2xl relative overflow-hidden text-center space-y-6">
            
            <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 border border-amber-400/40 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/10">
              <Crown className="w-8 h-8 text-amber-400 animate-pulse" />
            </div>

            <div className="space-y-2 max-w-xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                El Mayor Tesoro de la Boda
              </span>
              <h3 className="font-serif-romantic text-3xl sm:text-4xl font-black text-amber-100">
                El Legendario Cupón Dorado Nupcial
              </h3>
              <p className="text-xs text-stone-300 leading-relaxed font-light">
                Se activa a las 00:00 hs del 8 de Octubre (inicio oficial del día del civil) para dar inicio formal a la vida conyugal de Julián y Yanet.
              </p>
            </div>

            {/* Unlock Button / State */}
            {!isGoldenUnlocked ? (
              <div className="space-y-3">
                <button
                  onClick={handleUnlockGoldenCoupon}
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-500 hover:to-yellow-500 text-stone-950 font-black text-sm uppercase tracking-wider shadow-xl shadow-amber-400/30 hover:scale-105 transition-all cursor-pointer"
                >
                  ✨ Desbloquear Cupón Dorado Ahora
                </button>
                <p className="text-[11px] text-stone-400">
                  (Permite previsualizar el cupón dorado con fanfarria y música nupcial)
                </p>
              </div>
            ) : (
              /* The Golden Voucher Display */
              <div className="relative max-w-2xl mx-auto rounded-3xl bg-gradient-to-r from-[#ffeaa7] via-[#fdcb6e] to-[#fab1a0] p-1 shadow-2xl animate-fade-in text-stone-900">
                <div className="bg-gradient-to-b from-[#fffbf0] to-[#fff3cd] rounded-[22px] p-6 sm:p-10 border border-amber-300 relative overflow-hidden">
                  
                  {/* Watermark Rings */}
                  <div className="absolute right-4 bottom-4 opacity-10 pointer-events-none">
                    <Crown className="w-48 h-48 text-amber-800" />
                  </div>

                  <div className="space-y-4 relative z-10 text-center">
                    <span className="inline-block text-[11px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-amber-400/50 text-amber-950 border border-amber-400">
                      CUPÓN DORADO NUPCIAL IRREVOCABLE
                    </span>

                    <h4 className="font-serif-romantic text-2xl sm:text-3xl font-black text-stone-900 leading-tight">
                      Promesa de Amor y Pasión Perpetua
                    </h4>

                    <div className="w-24 h-0.5 bg-amber-500 mx-auto" />

                    <p className="font-serif-romantic text-base sm:text-lg text-stone-800 leading-relaxed italic">
                      "Válido para consagrar este amor para siempre. Otorga al portador el derecho irrenunciable a ser amado, deseado, cuidado y elegido cada día del resto de su existencia por su cónyuge. Válido en la salud, en la risa, en las noches de cabaña en Bariloche y por toda la eternidad."
                    </p>

                    <div className="pt-4 flex items-center justify-between border-t border-amber-300 text-xs font-semibold text-stone-700">
                      <span>Julián & Yanet</span>
                      <span>Sello: 8 de Octubre</span>
                      <span>Para Siempre</span>
                    </div>
                  </div>

                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
