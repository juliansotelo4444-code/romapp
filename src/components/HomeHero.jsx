import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Calendar, 
  MapPin, 
  Mail, 
  Ticket, 
  Flame, 
  Clock, 
  ArrowRight,
  Compass,
  Gift,
  Plus,
  Trash2,
  Camera,
  X
} from 'lucide-react';
import { triggerLoveConfetti } from '../utils/confetti';
import { useProfile } from '../context/ProfileContext';
import { fetchSyncData, apiSaveMilestone, apiDeleteMilestone } from '../api/client';

const DEFAULT_MILESTONES = [
  {
    id: 'm1',
    title: 'El Primer Flechazo',
    date: 'El inicio de todo',
    description: 'El día en que nuestras vidas se cruzaron y supimos que no había vuelta atrás. Comenzaba la aventura más hermosa.',
    icon: '✨',
    photoUrl: ''
  },
  {
    id: 'm2',
    title: 'Viajes, Rutas & Canciones',
    date: 'Nuestros Conciertos',
    description: 'Horas en la ruta cantando Morat, Tan Biónica y Airbag a todo pulmón. Compañeros de música y de vida.',
    icon: '🎶',
    photoUrl: ''
  },
  {
    id: 'm3',
    title: 'La Propuesta Inolvidable',
    date: 'El Gran "Sí"',
    description: 'Ese momento mágico en el que dijimos "para siempre" con lágrimas en los ojos y el corazón desbordado de amor.',
    icon: '💍',
    photoUrl: ''
  },
  {
    id: 'm4',
    title: 'Casamiento Civil',
    date: '8 de Octubre',
    description: 'La firma ante la ley y la vida que sella nuestro compromiso como esposos. ¡Oficialmente marido y mujer!',
    icon: '🏛️',
    photoUrl: ''
  },
  {
    id: 'm5',
    title: 'La Gran Fiesta de Boda',
    date: '9 de Octubre',
    description: 'Bailar hasta el amanecer, brindar con la gente que amamos y celebrar la unión más linda de todas.',
    icon: '🥂',
    photoUrl: ''
  },
  {
    id: 'm6',
    title: 'Luna de Miel en Bariloche',
    date: '11 de Octubre',
    description: '10 días en el sur argentino: lago Nahuel Huapi, montañas, paseos en catamarán, chocolates y amor sin límites.',
    icon: '🏔️',
    photoUrl: ''
  }
];

const ROMANTIC_LYRICS = [
  { quote: '"Si tú me pides que te cante una canción, te canto mil... si me regalas de tus días y tus flores."', band: 'Morat' },
  { quote: '"Con vos las noches no son tan frías ni los inviernos tan largos."', band: 'Tan Biónica' },
  { quote: '"Me mata que me mires y que no me digas nada, me mata la sospecha de saber que tú me amas."', band: 'Morat' },
  { quote: '"Por mil noches que te soñé y hoy te tengo acá conmigo."', band: 'Airbag' },
  { quote: '"Sin miedo a lo que venga, porque si es con vos, ya ganamos."', band: 'Nuestra Historia' }
];

export default function HomeHero({ onNavigate, isIntimateUnlocked, onOpenSpotify }) {
  const { profile, isJulian, isYanet, partnerName } = useProfile();
  const [greetingIndex, setGreetingIndex] = useState(0);
  const [lyricIndex, setLyricIndex] = useState(0);
  const [targetEvent, setTargetEvent] = useState('civil'); // 'civil', 'party', 'bariloche'

  // Milestones State
  const [milestones, setMilestones] = useState(() => {
    const saved = localStorage.getItem('romapp_milestones');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_MILESTONES;
      }
    }
    return DEFAULT_MILESTONES;
  });

  const [showAddMilestoneModal, setShowAddMilestoneModal] = useState(false);
  const [newMilestone, setNewMilestone] = useState({
    title: '',
    date: '',
    description: '',
    icon: '💖',
    photoUrl: ''
  });

  // Sync milestones with backend
  useEffect(() => {
    fetchSyncData().then((sync) => {
      if (sync && Array.isArray(sync.milestones) && sync.milestones.length > 0) {
        setMilestones((prev) => {
          const map = new Map();
          DEFAULT_MILESTONES.forEach(m => map.set(m.id, m));
          prev.forEach(m => map.set(m.id, m));
          sync.milestones.forEach(m => map.set(m.id, m));
          const list = Array.from(map.values());
          localStorage.setItem('romapp_milestones', JSON.stringify(list));
          return list;
        });
      }
    });
  }, []);

  const handleAddMilestone = (e) => {
    e.preventDefault();
    if (!newMilestone.title.trim() || !newMilestone.description.trim()) return;

    const item = {
      id: `milestone-${Date.now()}`,
      title: newMilestone.title.trim(),
      date: newMilestone.date.trim() || 'Momento Inolvidable',
      description: newMilestone.description.trim(),
      icon: newMilestone.icon || '💖',
      photoUrl: newMilestone.photoUrl || '',
      createdBy: profile.name
    };

    setMilestones((prev) => {
      const updated = [...prev, item];
      localStorage.setItem('romapp_milestones', JSON.stringify(updated));
      return updated;
    });

    triggerLoveConfetti();
    apiSaveMilestone(item);
    setShowAddMilestoneModal(false);
    setNewMilestone({ title: '', date: '', description: '', icon: '💖', photoUrl: '' });
  };

  const handleDeleteMilestone = (id, e) => {
    if (e) e.stopPropagation();
    setMilestones((prev) => {
      const updated = prev.filter(m => m.id !== id);
      localStorage.setItem('romapp_milestones', JSON.stringify(updated));
      return updated;
    });
    apiDeleteMilestone(id);
  };

  const handleMilestonePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (uploadEvt) => {
      setNewMilestone((prev) => ({
        ...prev,
        photoUrl: uploadEvt.target.result
      }));
    };
    reader.readAsDataURL(file);
  };

  const currentGreetings = profile.greetings || [
    'Hola, mi amor de mi vida',
    'Hola, mi vida entera',
    'Hola, mi corazón'
  ];

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
      setGreetingIndex((prev) => (prev + 1) % currentGreetings.length);
    }, 4000);

    const lyricTimer = setInterval(() => {
      setLyricIndex((prev) => (prev + 1) % ROMANTIC_LYRICS.length);
    }, 8000);

    return () => {
      clearInterval(greetingTimer);
      clearInterval(lyricTimer);
    };
  }, [currentGreetings.length]);

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
          
          {/* Couple & Active Profile badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-medium text-rose-200">
            <span className="text-base">{profile.emoji}</span>
            <span className="font-bold text-white">{profile.name}</span>
            <span className="w-1 h-1 rounded-full bg-rose-300" />
            <span className="text-amber-200 font-serif-romantic italic">
              Con mi amor {partnerName}
            </span>
          </div>

          {/* Dynamic rotating greeting */}
          <h1 className="font-serif-romantic text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-tight">
            <span className="block text-rose-300 text-xl sm:text-2xl md:text-3xl font-sans font-light tracking-wide mb-2 transition-all duration-700">
              {currentGreetings[greetingIndex]} ❤️
            </span>
            {isJulian ? 'Bienvenido a nuestra app de amor' : 'Bienvenida a nuestra app de amor'}
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

      {/* --- NUESTRA HISTORIA & HITOS DE AMOR --- */}
      <div className="space-y-6 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">💫</span>
              <h2 className="font-serif-romantic text-2xl sm:text-3xl font-bold text-white">
                Nuestra Historia & Hitos Inolvidables
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-stone-400 mt-1">
              Los momentos que marcaron nuestro camino hasta el altar y la luna de miel en Bariloche
            </p>
          </div>

          <button
            onClick={() => setShowAddMilestoneModal(true)}
            className="self-start sm:self-auto flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-rose-500/80 to-pink-600/80 hover:from-rose-500 hover:to-pink-600 border border-rose-400/50 text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Agregar Hito o Recuerdo</span>
          </button>
        </div>

        {/* Timeline Grid / Carousel */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {milestones.map((m, index) => (
            <div
              key={m.id}
              className="relative rounded-3xl bg-[#140816]/80 backdrop-blur-md border border-rose-950/60 hover:border-rose-500/40 p-5 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between overflow-hidden group"
            >
              {/* Top ambient glow */}
              <div className="absolute top-0 right-0 w-28 h-28 bg-rose-500/10 rounded-full blur-xl pointer-events-none group-hover:bg-rose-500/20 transition-all" />

              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-10 h-10 rounded-2xl bg-black/40 border border-rose-500/30 flex items-center justify-center text-xl shadow-inner">
                      {m.icon || '❤️'}
                    </span>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-600/30">
                        {m.date}
                      </span>
                      <h4 className="font-serif-romantic text-lg font-bold text-white mt-0.5">
                        {m.title}
                      </h4>
                    </div>
                  </div>

                  {m.id.startsWith('milestone-') && (
                    <button
                      onClick={(e) => handleDeleteMilestone(m.id, e)}
                      className="p-1 rounded-lg text-stone-500 hover:text-rose-400 hover:bg-rose-950/40 opacity-0 group-hover:opacity-100 transition-all"
                      title="Eliminar hito"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <p className="text-xs text-stone-300/90 leading-relaxed font-light">
                  {m.description}
                </p>

                {/* Optional Photo Attachment */}
                {m.photoUrl && (
                  <div className="mt-3 rounded-2xl overflow-hidden border border-rose-900/40 aspect-video bg-black/40">
                    <img src={m.photoUrl} alt={m.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-rose-950/50 flex items-center justify-between text-[11px] text-stone-500">
                <span>Hito #{index + 1} de nuestra vida</span>
                <span className="text-rose-400/80 font-serif-romantic italic">Julián & Yanet</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: Agregar Hito */}
      {showAddMilestoneModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div 
            className="relative w-full max-w-lg rounded-3xl bg-gradient-to-b from-[#180a1c] via-[#120715] to-[#0c040d] border border-rose-900/50 shadow-2xl overflow-hidden text-stone-100 p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-rose-950/60 pb-3">
              <h3 className="font-serif-romantic text-xl font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-rose-400" />
                <span>Agregar Hito de Nuestra Historia</span>
              </h3>
              <button
                onClick={() => setShowAddMilestoneModal(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMilestone} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Título del Hito
                  </label>
                  <input
                    type="text"
                    required
                    value={newMilestone.title}
                    onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
                    placeholder="Ej: La primera escapada juntos..."
                    className="w-full bg-[#1c0b1f] border border-rose-950/80 text-stone-100 text-xs rounded-xl p-2.5 focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Fecha o Momento
                  </label>
                  <input
                    type="text"
                    value={newMilestone.date}
                    onChange={(e) => setNewMilestone({ ...newMilestone, date: e.target.value })}
                    placeholder="Ej: Verano 2023, o Fecha..."
                    className="w-full bg-[#1c0b1f] border border-rose-950/80 text-stone-100 text-xs rounded-xl p-2.5 focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Emoji representativo
                </label>
                <div className="flex gap-2">
                  {['💖', '✨', '🎶', '💍', '🚗', '🏔️', '🥂', '☕', '🌟'].map((em) => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => setNewMilestone({ ...newMilestone, icon: em })}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-base transition-all ${
                        newMilestone.icon === em ? 'bg-rose-500/30 border border-rose-400 scale-110' : 'bg-black/30'
                      }`}
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Descripción del recuerdo
                </label>
                <textarea
                  required
                  rows={3}
                  value={newMilestone.description}
                  onChange={(e) => setNewMilestone({ ...newMilestone, description: e.target.value })}
                  placeholder="Contá qué pasó y por qué es tan especial para nosotros..."
                  className="w-full bg-[#1c0b1f] border border-rose-950/80 text-stone-100 text-xs rounded-xl p-2.5 focus:outline-none focus:border-rose-500 resize-none font-light"
                />
              </div>

              {/* Foto opcional */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-stone-300">
                  Foto del momento (opcional)
                </label>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 px-3 py-2 rounded-xl bg-rose-950/50 hover:bg-rose-900/60 border border-rose-800/60 text-xs font-medium text-rose-200 cursor-pointer">
                    <Camera className="w-4 h-4 text-rose-400" />
                    <span>Subir imagen</span>
                    <input type="file" accept="image/*" onChange={handleMilestonePhotoUpload} className="hidden" />
                  </label>
                  <input
                    type="url"
                    value={newMilestone.photoUrl}
                    onChange={(e) => setNewMilestone({ ...newMilestone, photoUrl: e.target.value })}
                    placeholder="O pegar URL de imagen..."
                    className="flex-1 bg-[#1c0b1f] border border-rose-950/80 text-stone-100 text-xs rounded-xl p-2 focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddMilestoneModal(false)}
                  className="px-4 py-2 rounded-xl text-stone-400 hover:text-stone-200 text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs shadow-md transition-all"
                >
                  Guardar Hito
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
