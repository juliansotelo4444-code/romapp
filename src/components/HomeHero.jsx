import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Sparkles, 
  Calendar, 
  MapPin, 
  Mail, 
  Ticket, 
  Flame, 
  Clock, 
  ArrowRight,
  Music,
  Compass,
  Lock,
  Unlock,
  ShieldCheck,
  Gift
} from 'lucide-react';
import { triggerLoveConfetti } from '../utils/confetti';

const NICKNAMES_GREETINGS = [
  'Hola, mi muñeca hermosa',
  'Hola, mi amor de mi vida',
  'Hola, mi bebota linda',
  'Hola, mi vida entera',
  'Hola, mi bebé',
  'Hola, mi memé adorado'
];

const ROMANTIC_LYRICS = [
  { quote: '"Si tú me pides que te cante una canción, te canto mil... si me regalas de tus días y tus flores."', band: 'Morat' },
  { quote: '"Con vos las noches no son tan frías ni los inviernos tan largos."', band: 'Tan Biónica' },
  { quote: '"Me mata que me mires y que no me digas nada, me mata la sospecha de saber que tú me amas."', band: 'Morat' },
  { quote: '"Por mil noches que te soñé y hoy te tengo acá conmigo."', band: 'Airbag' },
  { quote: '"Sin miedo a lo que venga, porque si es con vos, ya ganamos."', band: 'Nuestra Historia' }
];

export default function HomeHero({ onNavigate, isIntimateUnlocked, onOpenSpotify }) {
  const [greetingIndex, setGreetingIndex] = useState(0);
  const [lyricIndex, setLyricIndex] = useState(0);
  const [targetEvent, setTargetEvent] = useState('civil'); // 'civil', 'party', 'bariloche'

  // Time remaining states
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPast: false
  });

  // Rotate greetings
  useEffect(() => {
    const greetingTimer = setInterval(() => {
      setGreetingIndex((prev) => (prev + 1) % NICKNAMES_GREETINGS.length);
    }, 4000);

    const lyricTimer = setInterval(() => {
      setLyricIndex((prev) => (prev + 1) % ROMANTIC_LYRICS.length);
    }, 8000);

    return () => {
      clearInterval(greetingTimer);
      clearInterval(lyricTimer);
    };
  }, []);

  // Countdown calculations
  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      const currentYear = now.getFullYear();

      // Dates targets:
      // Civil: Oct 8
      // Fiesta: Oct 9
      // Bariloche: Oct 11
      let targetDate;
      if (targetEvent === 'civil') {
        targetDate = new Date(currentYear, 9, 8, 11, 0, 0); // 8 de Octubre
      } else if (targetEvent === 'party') {
        targetDate = new Date(currentYear, 9, 9, 21, 0, 0); // 9 de Octubre
      } else {
        targetDate = new Date(currentYear, 9, 11, 10, 0, 0); // 11 de Octubre (Bariloche)
      }

      // If date has passed for current year, target the upcoming date so countdown is active
      if (targetDate.getTime() <= now.getTime()) {
        targetDate.setFullYear(currentYear + 1);
      }

      const diff = targetDate.getTime() - now.getTime();

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setTimeLeft({ days, hours, minutes, seconds, isPast: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetEvent]);

  return (
    <div className="space-y-10 py-6 md:py-10">
      
      {/* Hero Welcome Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#240a18] via-[#190712] to-[#0d050a] text-white shadow-2xl p-6 sm:p-10 md:p-14 border border-rose-900/40">
        
        {/* Background glow effects */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-rose-500/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(#f43f5e_1px,transparent_1px)] [background-size:20px_20px] opacity-10 pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
          
          {/* Couple badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-medium text-rose-200">
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Julián (24) & Yanet (30)</span>
            <span className="w-1 h-1 rounded-full bg-rose-300" />
            <span className="text-amber-200 font-serif-romantic italic">Nuestra Historia Eterna</span>
          </div>

          {/* Dynamic rotating greeting */}
          <h1 className="font-serif-romantic text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-tight">
            <span className="block text-rose-300 text-xl sm:text-2xl md:text-3xl font-sans font-light tracking-wide mb-2 transition-all duration-700">
              {NICKNAMES_GREETINGS[greetingIndex]} ❤️
            </span>
            Bienvenidos a Nuestra App de Bodas
          </h1>

          <p className="text-base sm:text-lg text-rose-100/90 font-light max-w-2xl mx-auto leading-relaxed">
            El espacio interactivo donde atesoramos cada instante: el conteo regresivo al altar, las cartas más sentidas, los 10 días soñados en las montañas de Bariloche y la complicidad de nuestra intimidad.
          </p>

          {/* Current quote banner */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 text-xs sm:text-sm text-stone-200 max-w-xl mx-auto shadow-inner">
            <p className="italic font-serif-romantic text-amber-200">
              {ROMANTIC_LYRICS[lyricIndex].quote}
            </p>
            <span className="block text-[11px] text-stone-400 mt-1 uppercase tracking-wider">
              — {ROMANTIC_LYRICS[lyricIndex].band}
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                triggerLoveConfetti();
                onNavigate('letters');
              }}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-semibold text-sm shadow-lg shadow-rose-500/30 hover:scale-105 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Mail className="w-4 h-4" />
              <span>Ver Cartas de Amor</span>
            </button>
            <button
              onClick={() => onNavigate('honeymoon')}
              className="px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-semibold text-sm border border-white/20 hover:scale-105 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Compass className="w-4 h-4 text-amber-300" />
              <span>Itinerario Bariloche</span>
            </button>
          </div>

        </div>
      </div>

      {/* Countdown Timer Section */}
      <div className="rounded-3xl p-6 sm:p-8 bg-[#130816]/90 backdrop-blur-xl border border-rose-950/70 shadow-2xl space-y-6">
        
        {/* Event selector tabs */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-rose-950/50 pb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-rose-950/60 border border-rose-800/40 flex items-center justify-center text-rose-400">
              <Clock className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-serif-romantic text-stone-100">
                Cuenta Regresiva a la Felicidad
              </h2>
              <p className="text-xs text-stone-400">Cada segundo nos acerca más a nuestro nuevo capítulo</p>
            </div>
          </div>

          <div className="flex items-center bg-[#1a0a1e] p-1 rounded-2xl text-xs font-semibold border border-rose-950/60">
            <button
              onClick={() => setTargetEvent('civil')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                targetEvent === 'civil'
                  ? 'bg-rose-700 text-rose-100 shadow-md'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Casamiento Civil (8 Oct)
            </button>
            <button
              onClick={() => setTargetEvent('party')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                targetEvent === 'party'
                  ? 'bg-rose-700 text-rose-100 shadow-md'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Gran Fiesta (9 Oct)
            </button>
            <button
              onClick={() => setTargetEvent('bariloche')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                targetEvent === 'bariloche'
                  ? 'bg-rose-700 text-rose-100 shadow-md'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Luna de Miel (10 Días)
            </button>
          </div>
        </div>

        {/* Real-time Clock display */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 text-center">
          
          <div className="p-4 sm:p-6 rounded-2xl bg-[#180a1c]/90 border border-rose-950/80 shadow-inner">
            <span className="block font-serif-romantic text-4xl sm:text-6xl font-extrabold text-rose-400">
              {String(timeLeft.days).padStart(2, '0')}
            </span>
            <span className="text-xs sm:text-sm uppercase tracking-wider text-stone-400 font-semibold mt-1 block">
              Días
            </span>
          </div>

          <div className="p-4 sm:p-6 rounded-2xl bg-[#180a1c]/90 border border-rose-950/80 shadow-inner">
            <span className="block font-serif-romantic text-4xl sm:text-6xl font-extrabold text-stone-100">
              {String(timeLeft.hours).padStart(2, '0')}
            </span>
            <span className="text-xs sm:text-sm uppercase tracking-wider text-stone-400 font-semibold mt-1 block">
              Horas
            </span>
          </div>

          <div className="p-4 sm:p-6 rounded-2xl bg-[#180a1c]/90 border border-rose-950/80 shadow-inner">
            <span className="block font-serif-romantic text-4xl sm:text-6xl font-extrabold text-stone-100">
              {String(timeLeft.minutes).padStart(2, '0')}
            </span>
            <span className="text-xs sm:text-sm uppercase tracking-wider text-stone-400 font-semibold mt-1 block">
              Minutos
            </span>
          </div>

          <div className="p-4 sm:p-6 rounded-2xl bg-[#180a1c]/90 border border-rose-950/80 shadow-inner">
            <span className="block font-serif-romantic text-4xl sm:text-6xl font-extrabold text-amber-400 animate-pulse">
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
            <span className="text-xs sm:text-sm uppercase tracking-wider text-stone-400 font-semibold mt-1 block">
              Segundos
            </span>
          </div>

        </div>

        {/* Milestone info banner */}
        <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-700/40 flex items-center justify-between text-xs sm:text-sm text-stone-300">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              {targetEvent === 'civil' && 'Registro Civil: 8 de Octubre — El momento en que nos convertimos en marido y mujer.'}
              {targetEvent === 'party' && 'La Gran Fiesta de Bodas: 9 de Octubre — A brindar, bailar y celebrar con todos.'}
              {targetEvent === 'bariloche' && 'Luna de Miel en Bariloche: 10 días de cabaña, lagos, chimenea y chocolates Mamuschka.'}
            </span>
          </div>
          <button
            onClick={triggerLoveConfetti}
            className="text-amber-300 font-semibold hover:text-amber-200 hover:underline shrink-0 ml-2"
          >
            Celebrar ✨
          </button>
        </div>

      </div>

      {/* Quick Access Interactive Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold font-serif-romantic text-stone-100">
            Nuestros Rincones Especiales
          </h2>
          <span className="text-xs text-stone-400">Toca cualquier tarjeta para ingresar</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          
          {/* Card 1: Cartas de Amor */}
          <div
            onClick={() => onNavigate('letters')}
            className="group relative overflow-hidden rounded-3xl bg-[#140816]/85 backdrop-blur-md p-6 shadow-xl hover:shadow-2xl border border-rose-950/60 hover:border-rose-700/50 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-950/60 border border-rose-800/40 flex items-center justify-center text-rose-400 mb-4 group-hover:scale-110 group-hover:bg-rose-800 group-hover:text-white transition-all">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="font-serif-romantic text-lg font-bold text-stone-100 group-hover:text-rose-300 transition-colors">
              Cartas de Amor
            </h3>
            <p className="text-xs text-stone-400 mt-1.5 leading-relaxed">
              Visor con animación interactiva de sobre sellado, editor local para redactar y botón de cartas sorpresa con Morat.
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-rose-400">
              <span>Abrir sobres</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Bariloche 10 Días */}
          <div
            onClick={() => onNavigate('honeymoon')}
            className="group relative overflow-hidden rounded-3xl bg-[#140816]/85 backdrop-blur-md p-6 shadow-xl hover:shadow-2xl border border-rose-950/60 hover:border-emerald-700/50 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-950/60 border border-emerald-800/40 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 group-hover:bg-emerald-800 group-hover:text-white transition-all">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="font-serif-romantic text-lg font-bold text-stone-100 group-hover:text-emerald-300 transition-colors">
              Checklist Luna de Miel
            </h3>
            <p className="text-xs text-stone-400 mt-1.5 leading-relaxed">
              10 días en Bariloche: valijas, abrigo térmico, paseos lacustres, chimenea en la cabaña y chocolates artesanales.
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-emerald-400">
              <span>Ver itinerario</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Cupones Románticos */}
          <div
            onClick={() => onNavigate('coupons')}
            className="group relative overflow-hidden rounded-3xl bg-[#140816]/85 backdrop-blur-md p-6 shadow-xl hover:shadow-2xl border border-rose-950/60 hover:border-amber-600/50 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-950/60 border border-amber-800/40 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 group-hover:bg-amber-800 group-hover:text-white transition-all">
              <Ticket className="w-6 h-6" />
            </div>
            <h3 className="font-serif-romantic text-lg font-bold text-stone-100 group-hover:text-amber-300 transition-colors">
              Cupones Románticos
            </h3>
            <p className="text-xs text-stone-400 mt-1.5 leading-relaxed">
              Mimos diarios, salidas musicales con Tan Biónica & Airbag, y comodines especiales para la boda y Bariloche.
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-amber-400">
              <span>Canjear cupones</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: Víspera de la Boda (7 Octubre) */}
          <div
            onClick={() => onNavigate('wedding-eve')}
            className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0b0f1a] via-[#121929] to-[#070a12] text-white p-6 shadow-xl hover:shadow-2xl border border-indigo-900/50 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
          >
            <div className="w-12 h-12 rounded-2xl bg-indigo-950/70 border border-indigo-500/30 flex items-center justify-center text-amber-300 mb-4 group-hover:scale-105 transition-all">
              <Sparkles className="w-6 h-6 text-amber-300" />
            </div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif-romantic text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                La Víspera (7 de Octubre)
              </h3>
              <span className="text-[10px] bg-indigo-950 text-indigo-200 border border-indigo-800/60 font-bold px-2 py-0.5 rounded-full">
                Abre 7 Oct • 20:00 hs
              </span>
            </div>
            <p className="text-xs text-indigo-200/80 mt-1.5 leading-relaxed">
              Dinámicas secretas, ruleta del insomnio y actividades especiales para las horas previas al gran día. Disponible la noche previa a la boda.
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-amber-300">
              <span>Ver víspera sellada</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 5: Caja de Regalo de Bodas */}
          <div
            onClick={() => onNavigate('intimate')}
            className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#160815] via-[#210c1f] to-[#0c050b] text-white p-6 shadow-xl hover:shadow-2xl border border-amber-900/40 hover:border-amber-500/40 transition-all duration-300 hover:-translate-y-1 cursor-pointer sm:col-span-2 lg:col-span-2"
          >
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-2xl bg-amber-950/40 border border-amber-600/30 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-105 transition-all">
                {isIntimateUnlocked ? (
                  <Flame className="w-6 h-6 text-amber-400 animate-pulse" />
                ) : (
                  <Gift className="w-6 h-6 text-amber-300 animate-pulse" />
                )}
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-[#1e0a1b] text-amber-300 border border-amber-700/60 font-semibold">
                {isIntimateUnlocked ? 'Regalo Abierto' : 'Caja de Regalo de Bodas • Abre el 8 de Octubre'}
              </span>
            </div>
            
            <h3 className="font-serif-romantic text-xl font-bold text-white group-hover:text-amber-400 transition-colors">
              Caja de Regalo de Bodas
            </h3>
            <p className="text-xs text-stone-400 mt-2 leading-relaxed">
              Una sorpresa exclusiva guardada con todo el amor y la complicidad para Julián y Yanet. Esta caja de regalo permanece sellada y se abrirá automáticamente el día del Casamiento Civil.
            </p>
            
            <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-amber-400">
              <span>{isIntimateUnlocked ? 'Explorar regalo' : 'Ver caja de regalo'}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
