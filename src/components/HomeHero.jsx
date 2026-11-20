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
  Gift,
  Plus,
  Trash2,
  Camera,
  X,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Heart
} from 'lucide-react';
import { triggerLoveConfetti } from '../utils/confetti';
import { useProfile } from '../context/ProfileContext';
import { fetchSyncData, apiSaveMilestone, apiDeleteMilestone } from '../api/client';

const REAL_PHOTO_GALLERY = [
  {
    id: 'gal-1',
    src: '/photos/propuesta-rodilla.jpg',
    title: 'La Gran Propuesta',
    subtitle: 'El día en que Julián se arrodilló en el rosedal',
    tag: 'El Gran "Sí"'
  },
  {
    id: 'gal-2',
    src: '/photos/propuesta-felicidad.jpg',
    title: '¡Dijo que Sí!',
    subtitle: 'La sonrisa y el abrazo más feliz del mundo',
    tag: 'Felicidad Pura'
  },
  {
    id: 'gal-3',
    src: '/photos/propuesta-anillo-detalle.jpg',
    title: 'El Anillo de Compromiso',
    subtitle: 'Sellando nuestra promesa de amor eterno',
    tag: 'Para Siempre'
  },
  {
    id: 'gal-4',
    src: '/photos/beso-cafeteria.jpg',
    title: 'Beso de Invierno',
    subtitle: 'Café, risas y complicidad que abriga el alma',
    tag: 'Complicidad'
  },
  {
    id: 'gal-5',
    src: '/photos/viaje-auto.jpg',
    title: 'Cantando en la Ruta',
    subtitle: 'Morat, Tan Biónica y Airbag a los gritos en el auto',
    tag: 'Nuestras Canciones'
  },
  {
    id: 'gal-6',
    src: '/photos/desayuno-juntos.jpg',
    title: 'Desayunos Juntos',
    subtitle: 'Nuestra rutina favorita: tostadas, jugo y charlas',
    tag: 'Cada Mañana'
  },
  {
    id: 'gal-7',
    src: '/photos/construyendo-juntos.jpg',
    title: 'Construyendo Juntos',
    subtitle: 'Con cascos, chalecos y el corazón puesto en cada obra',
    tag: 'Equipo Invencible'
  },
  {
    id: 'gal-8',
    src: '/photos/parque-rosas.jpg',
    title: 'Tarde en el Rosedal',
    subtitle: 'Entre flores rosas y árboles que son testigos de nuestro amor',
    tag: 'Buenos Aires'
  },
  {
    id: 'gal-9',
    src: '/photos/cena-romantica.jpg',
    title: 'Cena a la Luz Cálida',
    subtitle: 'Mirarnos a los ojos y saber que elegimos bien',
    tag: 'Noche de Amor'
  },
  {
    id: 'gal-10',
    src: '/photos/juego-manos.jpg',
    title: 'Enmarcando el Momento',
    subtitle: 'Nuestras payasadas y la alegría de ser nosotros',
    tag: 'Risas'
  },
  {
    id: 'gal-11',
    src: '/photos/costanera-rio.jpg',
    title: 'Paseo por el Río',
    subtitle: 'Caminatas tranquilas con la brisa de la tarde',
    tag: 'Paz'
  },
  {
    id: 'gal-12',
    src: '/photos/beso-otono.jpg',
    title: 'Beso en el Pelo',
    subtitle: 'El abrazo que cura cualquier cansancio',
    tag: 'Refugio'
  }
];

const DEFAULT_MILESTONES = [
  {
    id: 'm1',
    title: 'El Primer Flechazo',
    date: 'El inicio de todo',
    description: 'El día en que nuestras miradas se cruzaron y supimos que no había vuelta atrás. Comenzaba la aventura más hermosa de nuestras vidas.',
    icon: '✨',
    photoUrl: '/photos/selfie-amor.jpg'
  },
  {
    id: 'm2',
    title: 'Viajes, Rutas & Canciones',
    date: 'En la Ruta Juntos',
    description: 'Horas en el auto cantando Morat, Tan Biónica y Airbag a todo pulmón. Compañeros de música, kilómetros y vida.',
    icon: '🎶',
    photoUrl: '/photos/viaje-auto.jpg'
  },
  {
    id: 'm3',
    title: 'Desayunos & Charlas Interminables',
    date: 'Nuestra Rutina Favorita',
    description: 'Tostadas, jugo de naranja y horas hablando del futuro. Encontrando la felicidad plena en los momentos más sencillos.',
    icon: '☕',
    photoUrl: '/photos/desayuno-juntos.jpg'
  },
  {
    id: 'm4',
    title: 'Construyendo con Amor',
    date: 'Compañeros de Proyecto',
    description: 'Con cascos, chalecos y la ilusión compartida de levantar algo propio. Un equipo que no se rinde ante nada.',
    icon: '🏗️',
    photoUrl: '/photos/construyendo-juntos.jpg'
  },
  {
    id: 'm5',
    title: 'La Gran Propuesta (El "¡Sí, acepto!")',
    date: 'Momento Mágico',
    description: 'Julián sobre una rodilla con el anillo en la mano, Yanet emocionada hasta las lágrimas y un "para siempre" sellado en el corazón.',
    icon: '💍',
    photoUrl: '/photos/propuesta-rodilla.jpg'
  },
  {
    id: 'm6',
    title: 'Casamiento Civil',
    date: '8 de Octubre',
    description: 'La firma ante la ley y la vida que sella nuestro compromiso como esposos. ¡Oficialmente marido y mujer!',
    icon: '🏛️',
    photoUrl: '/photos/propuesta-anillo-puerto.jpg'
  },
  {
    id: 'm7',
    title: 'La Gran Fiesta de Boda',
    date: '9 de Octubre',
    description: 'Bailar hasta el amanecer, brindar con la gente que amamos y celebrar la unión más linda de todas.',
    icon: '🥂',
    photoUrl: '/photos/cena-romantica.jpg'
  },
  {
    id: 'm8',
    title: 'Luna de Miel en Bariloche',
    date: '11 de Octubre',
    description: '10 días en el sur argentino: lago Nahuel Huapi, montañas, paseos en catamarán, cabaña con chimenea, chocolates y amor sin límites.',
    icon: '🏔️',
    photoUrl: '/photos/beso-otono.jpg'
  }
];

const ROMANTIC_LYRICS = [
  { quote: '"Si tú me pides que te cante una canción, te canto mil... si me regalas de tus días y tus flores."', band: 'Morat' },
  { quote: '"Con vos las noches no son tan frías ni los inviernos tan largos."', band: 'Tan Biónica' },
  { quote: '"Me mata que me mires y que no me digas nada, me mata la sospecha de saber que tú me amas."', band: 'Morat' },
  { quote: '"Por mil noches que te soñé y hoy te tengo acá conmigo."', band: 'Airbag' },
  { quote: '"Sin miedo a lo que venga, porque si es con vos, ya ganamos."', band: 'Nuestra Historia' }
];

export default function HomeHero({ onNavigate, isIntimateUnlocked }) {
  const { profile, isJulian, partnerName } = useProfile();
  const [greetingIndex, setGreetingIndex] = useState(0);
  const [lyricIndex, setLyricIndex] = useState(0);
  const [targetEvent, setTargetEvent] = useState('civil'); // 'civil', 'party', 'bariloche'
  const [lightboxPhoto, setLightboxPhoto] = useState(null);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);

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
    seconds: 0
  });

  // Rotate greetings
  useEffect(() => {
    const greetingTimer = setInterval(() => {
      setGreetingIndex((prev) => (prev + 1) % currentGreetings.length);
    }, 4500);

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

      let targetDate;
      if (targetEvent === 'civil') {
        targetDate = new Date(currentYear, 9, 8, 11, 0, 0); // 8 de Octubre
      } else if (targetEvent === 'party') {
        targetDate = new Date(currentYear, 9, 9, 21, 0, 0); // 9 de Octubre
      } else {
        targetDate = new Date(currentYear, 9, 11, 10, 0, 0); // 11 de Octubre (Bariloche)
      }

      if (targetDate.getTime() <= now.getTime()) {
        targetDate.setFullYear(currentYear + 1);
      }

      const diff = targetDate.getTime() - now.getTime();

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetEvent]);

  return (
    <div className="space-y-12 py-6 md:py-10">
      
      {/* --- EDITORIAL HERO SHOWCASE WITH REAL PHOTOS --- */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#180e1d] via-[#120a17] to-[#0a060d] border border-white/[0.08] shadow-2xl p-6 sm:p-10 lg:p-12">
        {/* Subtle warm ambient lighting */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Typography, Partner greeting & actions */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Active session badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs text-amber-200/90 tracking-wide backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="font-semibold text-white">{profile.name}</span>
              <span className="text-stone-400">•</span>
              <span className="italic font-serif-romantic text-amber-300">Con mi gran amor {partnerName}</span>
            </div>

            {/* Dynamic greeting */}
            <div className="space-y-2">
              <p className="text-amber-200/90 text-sm sm:text-base font-serif-romantic italic tracking-wide transition-all duration-700">
                {currentGreetings[greetingIndex]}
              </p>
              <h1 className="font-serif-romantic text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-stone-100 leading-[1.08]">
                Julián <span className="font-garamond italic font-normal text-amber-300/90">&</span> Yanet
              </h1>
              <p className="text-xs sm:text-sm uppercase tracking-widest text-stone-400 font-medium">
                Civil 8 Oct • Fiesta 9 Oct • Luna de Miel en Bariloche 11 Oct
              </p>
            </div>

            <p className="text-stone-300 text-sm sm:text-base font-light leading-relaxed max-w-xl mx-auto lg:mx-0">
              Nuestra aplicación de complicidad y vida: las cartas que nos prometen eternidad, el conteo exacto al altar, los cupones que canjeamos día a día y los diez días mágicos en el sur.
            </p>

            {/* Current Song Quote Card */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.08] backdrop-blur-md max-w-xl mx-auto lg:mx-0 text-left">
              <p className="font-serif-romantic italic text-amber-200 text-sm sm:text-base leading-snug">
                {ROMANTIC_LYRICS[lyricIndex].quote}
              </p>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/[0.06] text-xs text-stone-400">
                <span className="tracking-wider uppercase font-medium text-[11px] text-amber-300/80">
                  {ROMANTIC_LYRICS[lyricIndex].band}
                </span>
                <span className="italic font-serif-romantic text-[11px] text-stone-400">
                  Banda sonora de nuestro amor
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <button
                onClick={() => {
                  triggerLoveConfetti();
                  onNavigate('letters');
                }}
                className="px-6 py-3 rounded-2xl bg-amber-400 text-stone-950 font-semibold text-xs tracking-wide uppercase hover:bg-amber-300 transition-all shadow-md shadow-amber-950 flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Mail className="w-4 h-4" />
                <span>Nuestras Cartas</span>
              </button>
              <button
                onClick={() => onNavigate('honeymoon')}
                className="px-6 py-3 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] text-stone-200 font-semibold text-xs tracking-wide uppercase border border-white/10 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <MapPin className="w-4 h-4 text-amber-300" />
                <span>Itinerario Bariloche</span>
              </button>
            </div>

          </div>

          {/* Right Column: Editorial Photo Mosaic */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            
            {/* The main featured polaroid: Proposal on knee */}
            <div 
              onClick={() => setLightboxPhoto('/photos/propuesta-rodilla.jpg')}
              className="relative w-64 sm:w-72 bg-[#faf8f5] p-3 pb-8 rounded-sm shadow-2xl border border-stone-300 cursor-pointer transform -rotate-2 hover:rotate-0 hover:scale-105 transition-all duration-300 group z-20"
            >
              <div className="polaroid-tape" />
              <div className="aspect-[4/5] overflow-hidden bg-stone-200 rounded-xs mb-2.5">
                <img 
                  src="/photos/propuesta-rodilla.jpg" 
                  alt="La gran propuesta" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
              </div>
              <p className="font-serif-romantic italic text-center text-stone-700 text-xs sm:text-sm">
                "¿Te casás conmigo?" • El rosedal
              </p>
            </div>

            {/* Back layered polaroid: Beso cafetería */}
            <div 
              onClick={() => setLightboxPhoto('/photos/beso-cafeteria.jpg')}
              className="hidden sm:block absolute -top-4 -right-2 w-52 bg-[#faf8f5] p-2.5 pb-6 rounded-sm shadow-xl border border-stone-300 cursor-pointer transform rotate-6 hover:rotate-3 hover:scale-105 transition-all duration-300 group z-10 opacity-90"
            >
              <div className="aspect-[4/5] overflow-hidden bg-stone-200 rounded-xs mb-2">
                <img 
                  src="/photos/beso-cafeteria.jpg" 
                  alt="Beso en la cafetería" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
              </div>
              <p className="font-serif-romantic italic text-center text-stone-700 text-[11px]">
                Nuestro invierno juntos ❤️
              </p>
            </div>

            {/* Back layered polaroid: La felicidad tras el sí */}
            <div 
              onClick={() => setLightboxPhoto('/photos/propuesta-felicidad.jpg')}
              className="hidden sm:block absolute -bottom-6 -left-4 w-48 bg-[#faf8f5] p-2.5 pb-6 rounded-sm shadow-xl border border-stone-300 cursor-pointer transform -rotate-8 hover:rotate-0 hover:scale-105 transition-all duration-300 group z-10 opacity-90"
            >
              <div className="aspect-[4/5] overflow-hidden bg-stone-200 rounded-xs mb-2">
                <img 
                  src="/photos/propuesta-felicidad.jpg" 
                  alt="Felicidad tras la propuesta" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
              </div>
              <p className="font-serif-romantic italic text-center text-stone-700 text-[11px]">
                El día del "¡Sí, acepto!" ✨
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* --- REFINED COUNTDOWN SECTION --- */}
      <section className="rounded-3xl p-6 sm:p-8 bg-[#120a16] border border-white/[0.08] shadow-xl space-y-6">
        
        {/* Selector Tabs */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-amber-300">
              <Clock className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-serif-romantic text-stone-100">
                Cuenta Regresiva a Nuestro Nuevo Capítulo
              </h2>
              <p className="text-xs text-stone-400">Cada segundo que pasa nos encuentra más enamorados</p>
            </div>
          </div>

          <div className="flex items-center bg-black/40 p-1 rounded-2xl border border-white/10 text-xs">
            <button
              onClick={() => setTargetEvent('civil')}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer ${
                targetEvent === 'civil'
                  ? 'bg-amber-400 text-stone-950 font-bold shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Civil (8 Oct)
            </button>
            <button
              onClick={() => setTargetEvent('party')}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer ${
                targetEvent === 'party'
                  ? 'bg-amber-400 text-stone-950 font-bold shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Fiesta (9 Oct)
            </button>
            <button
              onClick={() => setTargetEvent('bariloche')}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer ${
                targetEvent === 'bariloche'
                  ? 'bg-amber-400 text-stone-950 font-bold shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Bariloche (11 Oct)
            </button>
          </div>
        </div>

        {/* Numeric Counter Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 sm:p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-center">
            <span className="font-serif-romantic text-3xl sm:text-5xl font-bold text-stone-100 block">
              {timeLeft.days}
            </span>
            <span className="text-[10px] sm:text-xs uppercase tracking-wider text-amber-300/80 font-medium mt-1 block">
              Días
            </span>
          </div>
          <div className="p-4 sm:p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-center">
            <span className="font-serif-romantic text-3xl sm:text-5xl font-bold text-stone-100 block">
              {String(timeLeft.hours).padStart(2, '0')}
            </span>
            <span className="text-[10px] sm:text-xs uppercase tracking-wider text-amber-300/80 font-medium mt-1 block">
              Horas
            </span>
          </div>
          <div className="p-4 sm:p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-center">
            <span className="font-serif-romantic text-3xl sm:text-5xl font-bold text-stone-100 block">
              {String(timeLeft.minutes).padStart(2, '0')}
            </span>
            <span className="text-[10px] sm:text-xs uppercase tracking-wider text-amber-300/80 font-medium mt-1 block">
              Minutos
            </span>
          </div>
          <div className="p-4 sm:p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-center">
            <span className="font-serif-romantic text-3xl sm:text-5xl font-bold text-amber-300 block">
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
            <span className="text-[10px] sm:text-xs uppercase tracking-wider text-amber-300/80 font-medium mt-1 block">
              Segundos
            </span>
          </div>
        </div>

        <div className="text-center text-xs text-stone-400 italic font-serif-romantic">
          {targetEvent === 'civil' && '"El momento de estampar la firma y ser legalmente marido y mujer."'}
          {targetEvent === 'party' && '"Celebrar con toda la gente que amamos, bailar hasta el amanecer."'}
          {targetEvent === 'bariloche' && '"10 días en la Patagonia: montañas, chimenea, lago Nahuel Huapi y nosotros."'}
        </div>

      </section>

      {/* --- ÁLBUM DE FOTOS: NUESTROS RECUERDOS REALES --- */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.08] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">📸</span>
              <h2 className="font-serif-romantic text-2xl sm:text-3xl font-bold text-stone-100">
                Álbum de Nuestro Amor
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-stone-400">
              Fotos reales de los momentos más lindos que vivimos juntos
            </p>
          </div>
          <span className="text-xs text-amber-300/80 font-serif-romantic italic">
            Toca cualquier foto para ampliarla
          </span>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {REAL_PHOTO_GALLERY.map((item) => (
            <div
              key={item.id}
              onClick={() => setLightboxPhoto(item.src)}
              className="group relative rounded-2xl overflow-hidden bg-stone-900 border border-white/10 aspect-[4/5] cursor-pointer shadow-md hover:shadow-2xl hover:border-amber-400/40 transition-all duration-300"
            >
              <img 
                src={item.src} 
                alt={item.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end">
                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-300">
                  {item.tag}
                </span>
                <h4 className="font-serif-romantic text-sm font-bold text-white leading-tight mt-0.5">
                  {item.title}
                </h4>
                <p className="text-[11px] text-stone-300 leading-snug font-light mt-1 line-clamp-2">
                  {item.subtitle}
                </p>
                <div className="mt-2 flex items-center gap-1 text-[10px] text-amber-200">
                  <Maximize2 className="w-3 h-3" />
                  <span>Ver en grande</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- NUESTRA HISTORIA & HITOS DE AMOR (TIMELINE) --- */}
      <section className="space-y-6 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">💫</span>
              <h2 className="font-serif-romantic text-2xl sm:text-3xl font-bold text-stone-100">
                Nuestra Historia & Hitos Inolvidables
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-stone-400">
              El camino que recorrimos juntos hacia el altar y nuestra luna de miel
            </p>
          </div>

          <button
            onClick={() => setShowAddMilestoneModal(true)}
            className="self-start sm:self-auto flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-stone-200 text-xs font-semibold shadow-sm transition-all cursor-pointer active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 text-amber-300" />
            <span>Sumar Recuerdo</span>
          </button>
        </div>

        {/* Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {milestones.map((m, index) => (
            <div
              key={m.id}
              className="relative rounded-2xl bg-[#120a16] border border-white/[0.08] hover:border-amber-400/30 p-4 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between overflow-hidden group"
            >
              <div>
                {/* Photo if present */}
                {m.photoUrl && (
                  <div 
                    onClick={() => setLightboxPhoto(m.photoUrl)}
                    className="relative aspect-video rounded-xl overflow-hidden bg-black/40 border border-white/10 mb-3 cursor-pointer"
                  >
                    <img 
                      src={m.photoUrl} 
                      alt={m.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                      <Maximize2 className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                )}

                <div className="flex items-start justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-600/30">
                    {m.date}
                  </span>

                  {m.id.startsWith('milestone-') && (
                    <button
                      onClick={(e) => handleDeleteMilestone(m.id, e)}
                      className="p-1 rounded-lg text-stone-500 hover:text-rose-400 hover:bg-white/5 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                      title="Eliminar hito"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <h4 className="font-serif-romantic text-base font-bold text-stone-100 mb-1 leading-snug">
                  {m.title}
                </h4>

                <p className="text-xs text-stone-300 font-light leading-relaxed">
                  {m.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-stone-500">
                <span>Hito #{index + 1}</span>
                <span className="text-amber-200/80 font-serif-romantic italic">Julián & Yanet</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- SECTIONS PORTAL CARDS --- */}
      <section className="space-y-4">
        <h2 className="font-serif-romantic text-xl font-bold text-stone-100">
          Explorar Romapp
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* Cartas de Amor */}
          <div
            onClick={() => onNavigate('letters')}
            className="luxury-card luxury-card-hover rounded-2xl p-5 cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-rose-950/50 border border-rose-500/30 flex items-center justify-center text-rose-300 mb-3 group-hover:scale-105 transition-transform">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="font-serif-romantic text-lg font-bold text-stone-100 group-hover:text-amber-200 transition-colors">
                Cartas de Amor & Polaroids
              </h3>
              <p className="text-xs text-stone-400 mt-1.5 leading-relaxed font-light">
                Pergaminos con sello de lacre, música de Morat, Tan Biónica y fotos de recuerdos para abrir y atesorar.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-amber-300">
              <span>Abrir sobre</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Checklist Bariloche */}
          <div
            onClick={() => onNavigate('honeymoon')}
            className="luxury-card luxury-card-hover rounded-2xl p-5 cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-950/50 border border-emerald-500/30 flex items-center justify-center text-emerald-300 mb-3 group-hover:scale-105 transition-transform">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="font-serif-romantic text-lg font-bold text-stone-100 group-hover:text-amber-200 transition-colors">
                Itinerario Bariloche (10 Días)
              </h3>
              <p className="text-xs text-stone-400 mt-1.5 leading-relaxed font-light">
                Cabaña frente al lago Nahuel Huapi, abrigo de montaña, chimenea, paseos lacustres y chocolates.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-emerald-400">
              <span>Ver itinerario</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Cupones Románticos */}
          <div
            onClick={() => onNavigate('coupons')}
            className="luxury-card luxury-card-hover rounded-2xl p-5 cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-950/50 border border-amber-500/30 flex items-center justify-center text-amber-300 mb-3 group-hover:scale-105 transition-transform">
                <Ticket className="w-5 h-5" />
              </div>
              <h3 className="font-serif-romantic text-lg font-bold text-stone-100 group-hover:text-amber-200 transition-colors">
                Cupones de Amor
              </h3>
              <p className="text-xs text-stone-400 mt-1.5 leading-relaxed font-light">
                Mimos diarios, salidas musicales, desayunos en la cama y comodines especiales para canjear con sello.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-amber-300">
              <span>Ver cupones</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* La Víspera (7 Octubre) */}
          <div
            onClick={() => onNavigate('wedding-eve')}
            className="luxury-card luxury-card-hover rounded-2xl p-5 cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-indigo-950/50 border border-indigo-500/30 flex items-center justify-center text-indigo-300 mb-3 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif-romantic text-lg font-bold text-stone-100 group-hover:text-indigo-200 transition-colors">
                  La Víspera (7 Octubre)
                </h3>
              </div>
              <p className="text-xs text-stone-400 mt-1.5 leading-relaxed font-light">
                Guion nocturno para calmar los nervios, ruleta del insomnio y preguntas especiales para las horas previas al altar.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-indigo-300">
              <span>Explorar víspera</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Caja de Regalo de Bodas */}
          <div
            onClick={() => onNavigate('intimate')}
            className="luxury-card luxury-card-hover rounded-2xl p-5 cursor-pointer flex flex-col justify-between group sm:col-span-2 lg:col-span-2"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-950/50 border border-amber-500/30 flex items-center justify-center text-amber-300 mb-3 group-hover:scale-105 transition-transform">
                <Gift className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif-romantic text-lg font-bold text-stone-100 group-hover:text-amber-200 transition-colors">
                  Caja de Regalo de Bodas
                </h3>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  {isIntimateUnlocked ? 'Desbloqueado' : 'Abre el 8 de Octubre'}
                </span>
              </div>
              <p className="text-xs text-stone-400 mt-1.5 leading-relaxed font-light">
                Un cofre íntimo con juegos de afinidad, ruletas de complicidad y sorpresas exclusivas reservadas para Julián y Yanet.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-amber-300">
              <span>{isIntimateUnlocked ? 'Entrar al cofre' : 'Ver cofre sellado'}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

        </div>
      </section>

      {/* --- LIGHTBOX MODAL PARA VER FOTO EN GRANDE --- */}
      {lightboxPhoto && (
        <div 
          onClick={() => setLightboxPhoto(null)} 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn cursor-pointer"
        >
          <div 
            className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl bg-black border border-white/10 shadow-2xl p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={lightboxPhoto} 
              alt="Foto en grande" 
              className="max-w-full max-h-[82vh] object-contain rounded-xl mx-auto" 
            />
            <button 
              onClick={() => setLightboxPhoto(null)}
              className="absolute top-4 right-4 p-2.5 rounded-full bg-black/70 hover:bg-black/90 text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* --- MODAL PARA SUMAR HITO --- */}
      {showAddMilestoneModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div 
            className="relative w-full max-w-lg rounded-3xl bg-[#110a16] border border-white/10 shadow-2xl overflow-hidden text-stone-100 p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-serif-romantic text-xl font-bold text-stone-100 flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-300" />
                <span>Agregar Hito de Nuestra Historia</span>
              </h3>
              <button
                onClick={() => setShowAddMilestoneModal(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-white/10 cursor-pointer"
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
                    placeholder="Ej: Primera escapada juntos..."
                    className="w-full bg-white/[0.04] border border-white/10 text-stone-100 text-xs rounded-xl p-2.5 focus:outline-none focus:border-amber-400"
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
                    placeholder="Ej: Verano 2024, o Fecha..."
                    className="w-full bg-white/[0.04] border border-white/10 text-stone-100 text-xs rounded-xl p-2.5 focus:outline-none focus:border-amber-400"
                  />
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
                  className="w-full bg-white/[0.04] border border-white/10 text-stone-100 text-xs rounded-xl p-2.5 focus:outline-none focus:border-amber-400 resize-none font-light"
                />
              </div>

              {/* Foto opcional */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-stone-300">
                  Foto del momento (opcional)
                </label>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-medium text-stone-200 cursor-pointer">
                    <Camera className="w-4 h-4 text-amber-300" />
                    <span>Subir imagen</span>
                    <input type="file" accept="image/*" onChange={handleMilestonePhotoUpload} className="hidden" />
                  </label>
                  <input
                    type="url"
                    value={newMilestone.photoUrl}
                    onChange={(e) => setNewMilestone({ ...newMilestone, photoUrl: e.target.value })}
                    placeholder="O pegar URL de imagen..."
                    className="flex-1 bg-white/[0.04] border border-white/10 text-stone-100 text-xs rounded-xl p-2 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddMilestoneModal(false)}
                  className="px-4 py-2 rounded-xl text-stone-400 hover:text-stone-200 text-xs font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-400 text-stone-950 font-semibold text-xs shadow-md transition-all cursor-pointer hover:bg-amber-300"
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
