import React, { useState, useEffect, useMemo } from 'react';
import { 
  Lock, 
  Unlock, 
  Flame, 
  Sparkles, 
  Search, 
  Check, 
  RotateCcw, 
  Eye, 
  EyeOff, 
  Plus, 
  Trash2, 
  Key, 
  ShieldCheck, 
  BookOpen, 
  Heart, 
  ChevronDown, 
  ChevronUp, 
  Camera, 
  Star,
  Users,
  AlertTriangle,
  Gift
} from 'lucide-react';
import { INTIMATE_COUPONS } from '../data/intimateCoupons';
import { POSITIONS_DATA } from '../data/positionsData';
import { STIMULATION_GUIDE } from '../data/stimulationGuide';
import { FANTASIES_DATA } from '../data/fantasiesData';
import PositionSvg from './PositionSvg';
import { triggerLoveConfetti } from '../utils/confetti';

function SealedGiftBoxView({ onUnlock }) {
  // Target upcoming October 8 so countdown is always live and positive
  const calculateTimeLeft = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    let target = new Date(currentYear, 9, 8, 0, 0, 0); // 8 de Octubre
    if (target.getTime() <= now.getTime()) {
      target = new Date(currentYear + 1, 9, 8, 0, 0, 0);
    }
    const difference = target.getTime() - now.getTime();

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, passed: true };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      passed: false
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);
  const [isOpening, setIsOpening] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);
      if (remaining.passed && !isOpening && !isOpen) {
        handleTriggerOpen();
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpening, isOpen]);

  const handleTriggerOpen = () => {
    if (isOpening || isOpen) return;
    setIsOpening(true);
    triggerLoveConfetti();

    // Sequence of animations:
    // Lid lifts, golden rays burst out, celebratory confetti fires
    setTimeout(() => {
      setIsOpen(true);
      triggerLoveConfetti();
    }, 900);
  };

  const handleEnterUnlocked = () => {
    triggerLoveConfetti();
    if (onUnlock) onUnlock();
  };

  return (
    <div className="py-12 px-4 max-w-xl mx-auto text-center space-y-8">
      <div className="p-8 sm:p-12 rounded-3xl bg-[#0f0d15] text-white border border-purple-500/30 shadow-2xl relative overflow-hidden space-y-6">
        
        {/* Ambient atmospheric glows */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header Tag */}
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-amber-300 bg-purple-950/80 px-4 py-1.5 rounded-full border border-purple-700/60 shadow-sm">
            <Gift className="w-3.5 h-3.5 text-amber-400" />
            <span>Caja de Regalo de Bodas • Julián & Yanet</span>
          </div>

          <h2 className="font-serif-romantic text-3xl sm:text-4xl font-extrabold text-white">
            Caja de Regalo de Bodas
          </h2>

          <p className="text-xs sm:text-sm text-stone-300 max-w-md mx-auto leading-relaxed font-light">
            Una sorpresa exclusiva guardada con todo el amor y la complicidad para Julián y Yanet. Esta caja de regalo permanece sellada y se abrirá automáticamente cuando el contador llegue a cero el 8 de Octubre, día de nuestro Casamiento Civil.
          </p>
        </div>

        {/* 3D Animated Gift Box */}
        <div 
          className="relative z-10 w-64 h-60 mx-auto flex items-center justify-center select-none my-2"
        >
          {/* Radial light burst behind open box */}
          {isOpen && (
            <div className="absolute inset-0 bg-radial from-amber-400/40 via-purple-600/20 to-transparent rounded-full blur-2xl animate-pulse pointer-events-none scale-150 transition-all duration-1000" />
          )}

          {/* Celebratory floating icons when opened */}
          {isOpen && (
            <>
              <Heart className="w-8 h-8 text-rose-500 fill-rose-500 absolute -top-6 left-6 float-smooth" />
              <Sparkles className="w-8 h-8 text-amber-300 absolute -top-8 right-6 animate-spin" style={{ animationDuration: '2s' }} />
              <Flame className="w-7 h-7 text-amber-400 absolute -top-10 left-1/2 -translate-x-1/2 animate-pulse" />
            </>
          )}

          {/* Gift Box Container */}
          <div className={`relative transition-transform duration-500 ${isOpening && !isOpen ? 'scale-105' : ''}`}>
            
            {/* GIFT BOX LID (TAPA QUE SE ABRE) */}
            <div 
              className={`relative z-20 transition-all duration-1000 ease-out origin-bottom-right ${
                isOpen 
                  ? '-translate-y-24 -rotate-25 scale-105 opacity-90' 
                  : isOpening 
                  ? '-translate-y-12 -rotate-12' 
                  : ''
              }`}
            >
              {/* Satin Bow on Top of Lid */}
              <div className="flex justify-center -mb-2.5 relative z-30">
                <div className="relative">
                  <div className="w-12 h-6 bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500 rounded-full shadow-lg border border-amber-200 -rotate-15 transform -mr-2 inline-block" />
                  <div className="w-12 h-6 bg-gradient-to-r from-amber-500 via-yellow-200 to-amber-400 rounded-full shadow-lg border border-amber-200 rotate-15 transform -ml-2 inline-block" />
                  <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-amber-600 to-amber-300 border border-amber-100 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 shadow-md" />
                </div>
              </div>

              {/* Lid Box Rim */}
              <div className="w-48 h-10 bg-gradient-to-r from-[#2a0e20] via-[#3b122e] to-[#240c1c] rounded-t-xl border-2 border-amber-400/90 shadow-2xl relative overflow-hidden flex items-center justify-center">
                {/* Golden vertical ribbon on lid */}
                <div className="absolute inset-y-0 w-8 bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500 shadow-md border-x border-amber-300/70" />
                <div className="absolute inset-x-0 bottom-0 h-1 bg-amber-400/60" />
              </div>
            </div>

            {/* Glowing Light Beam Out of Open Box */}
            {isOpen && (
              <div className="absolute -top-14 left-1/2 -translate-x-1/2 w-40 h-32 bg-gradient-to-t from-amber-300/80 via-yellow-200/40 to-transparent blur-md pointer-events-none rounded-t-full animate-pulse" />
            )}

            {/* GIFT BOX BASE (CUERPO DE LA CAJA) */}
            <div className="w-44 h-36 bg-gradient-to-b from-[#2b0e22] via-[#1f0a18] to-[#11050d] mx-auto rounded-b-2xl border-2 border-t-0 border-amber-400/80 shadow-2xl relative overflow-hidden flex items-center justify-center -mt-1">
              {/* Vertical center ribbon */}
              <div className="absolute inset-y-0 w-8 bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500 shadow-lg border-x border-amber-300/70 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-amber-950/80" />
              </div>
              {/* Horizontal center ribbon */}
              <div className="absolute inset-x-0 h-8 bg-gradient-to-b from-amber-400 via-yellow-200 to-amber-500 shadow-md border-y border-amber-300/70" />
              {/* Subtle box sheen */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-xl pointer-events-none" />
            </div>

          </div>
        </div>

        {/* Live Active Countdown Grid */}
        <div className="relative z-10 pt-1 space-y-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-purple-300 block">
            Tiempo restante para la apertura:
          </span>
          <div className="grid grid-cols-4 gap-2 sm:gap-3 max-w-sm mx-auto">
            <div className="p-3 rounded-2xl bg-[#171024] border border-purple-800/60 shadow-inner">
              <span className="block font-mono text-2xl font-black text-amber-300">
                {timeLeft.days}
              </span>
              <span className="text-[10px] uppercase font-bold text-stone-400">Días</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#171024] border border-purple-800/60 shadow-inner">
              <span className="block font-mono text-2xl font-black text-amber-300">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="text-[10px] uppercase font-bold text-stone-400">Horas</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#171024] border border-purple-800/60 shadow-inner">
              <span className="block font-mono text-2xl font-black text-amber-300">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="text-[10px] uppercase font-bold text-stone-400">Min</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#171024] border border-purple-800/60 shadow-inner">
              <span className="block font-mono text-2xl font-black text-amber-300">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
              <span className="text-[10px] uppercase font-bold text-stone-400">Seg</span>
            </div>
          </div>
        </div>

        {/* Status / Celebration Area */}
        {isOpen ? (
          <div className="relative z-10 space-y-3 pt-2">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-purple-900/50 to-amber-500/20 border border-amber-400/60 text-center space-y-1 animate-pulse">
              <span className="text-amber-300 font-bold text-sm sm:text-base flex items-center justify-center gap-2 font-serif-romantic">
                <Sparkles className="w-5 h-5 text-amber-400 animate-spin" />
                ¡El Regalo de Bodas se ha Abierto!
                <Sparkles className="w-5 h-5 text-amber-400 animate-spin" />
              </span>
              <p className="text-xs text-stone-300 font-light">
                Complicidad y regalos de boda listos para Julián y Yanet.
              </p>
            </div>

            <button
              onClick={handleEnterUnlocked}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-600 via-purple-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-bold text-sm shadow-xl shadow-rose-950 hover:scale-105 transition-all cursor-pointer flex items-center justify-center gap-2 mx-auto"
            >
              <Gift className="w-4 h-4 text-amber-300" />
              <span>Ver Regalo de Bodas</span>
            </button>
          </div>
        ) : (
          <div className="relative z-10 pt-2 text-center">
            <span className="inline-flex items-center gap-1.5 text-xs text-purple-300/90 font-medium bg-purple-950/60 px-3.5 py-1.5 rounded-full border border-purple-800/40">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Regalo sellado con amor. Se abrirá automáticamente al llegar a cero.</span>
            </span>
          </div>
        )}

        {/* Footer date info */}
        <div className="relative z-10 pt-4 border-t border-purple-900/50 flex flex-col items-center gap-1.5 text-xs text-stone-400">
          <div className="flex items-center gap-2 font-medium text-amber-200">
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500 inline-block animate-pulse" />
            <span>Apertura Automática: 8 de Octubre a las 00:00 hs</span>
          </div>
          <span className="text-[11px] text-purple-300/80">
            Civil • Fiesta 9 de Octubre • Luna de Miel en Bariloche
          </span>
        </div>

      </div>
    </div>
  );
}

export default function IntimateSection({ isUnlocked, setIsUnlocked }) {
  // Navigation tabs inside intimate area
  const [activeTab, setActiveTab] = useState('coupons'); // 'coupons', 'positions', 'guide', 'match', 'vault'

  // 1. Coupons State
  const [coupons, setCoupons] = useState(INTIMATE_COUPONS);
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'available', 'redeemed'
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // 2. Positions State
  const [selectedPosition, setSelectedPosition] = useState(POSITIONS_DATA[0]);

  // 3. Stimulation Guide State
  const [expandedSections, setExpandedSections] = useState({ 'femenino': true, 'masculino': true, 'fundamentos': true });

  // 4. Fantasy Match Quiz State
  const [activeUser, setActiveUser] = useState('julian'); // 'julian' or 'yanet'
  const [quizAnswers, setQuizAnswers] = useState({ julian: {}, yanet: {} });
  const [showMatchesOnly, setShowMatchesOnly] = useState(false);

  // 5. Vault Photos State
  const [vaultPin, setVaultPin] = useState('1234');
  const [isVaultUnlocked, setIsVaultUnlocked] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [vaultPhotos, setVaultPhotos] = useState([]);
  const [holdingPhotoId, setHoldingPhotoId] = useState(null);

  // Load persisted intimate state
  useEffect(() => {
    // Intimate coupons: merge canonical explicit text from cupones_sexo_318_explicitos_v2.json
    const savedCoupons = localStorage.getItem('romapp_intimate_coupons');
    if (savedCoupons) {
      try {
        const parsed = JSON.parse(savedCoupons);
        const merged = INTIMATE_COUPONS.map((canon) => {
          const found = parsed.find((p) => p.id === canon.id);
          return found
            ? { ...canon, redeemed: !!found.redeemed, redeemedAt: found.redeemedAt || null }
            : canon;
        });
        setCoupons(merged);
        localStorage.setItem('romapp_intimate_coupons', JSON.stringify(merged));
      } catch {
        setCoupons(INTIMATE_COUPONS);
      }
    } else {
      setCoupons(INTIMATE_COUPONS);
    }

    // Fantasy Quiz answers
    const savedQuiz = localStorage.getItem('romapp_fantasy_quiz');
    if (savedQuiz) {
      try {
        setQuizAnswers(JSON.parse(savedQuiz));
      } catch {
        setQuizAnswers({ julian: {}, yanet: {} });
      }
    }

    // Vault photos
    const savedPhotos = localStorage.getItem('romapp_vault_photos');
    if (savedPhotos) {
      try {
        setVaultPhotos(JSON.parse(savedPhotos));
      } catch {
        setVaultPhotos([]);
      }
    }
  }, []);

  const saveCoupons = (updated) => {
    setCoupons(updated);
    localStorage.setItem('romapp_intimate_coupons', JSON.stringify(updated));
  };

  const handleRedeemCoupon = (id) => {
    const today = new Date().toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    const updated = coupons.map((c) => {
      if (c.id === id) {
        return { ...c, redeemed: true, redeemedAt: today };
      }
      return c;
    });

    saveCoupons(updated);
    triggerLoveConfetti();
  };

  const handleReactivateCoupon = (id) => {
    const updated = coupons.map((c) => {
      if (c.id === id) {
        return { ...c, redeemed: false, redeemedAt: null };
      }
      return c;
    });
    saveCoupons(updated);
  };

  // Categories list
  const categoriesList = [
    'Todas',
    'Juegos de Poder, Control y Dominación',
    'Sensoriales, Masajes y Temperatura',
    'Oral y Enfoque Exclusivo sin Reciprocidad Obligatoria',
    'Iniciación y Placer Anal',
    'Deseo, Kamasutra y Experimentación',
    'Anticipación, Previa y Sexting',
    'Lugares, Espontaneidad y Retos Express',
    'Post-Intimidad, Conexión y Cuidados'
  ];

  // Filtered coupons
  const filteredCoupons = useMemo(() => {
    return coupons.filter((c) => {
      // Category filter
      if (selectedCategory !== 'Todas' && c.category !== selectedCategory) return false;
      // Status filter
      if (statusFilter === 'available' && c.redeemed) return false;
      if (statusFilter === 'redeemed' && !c.redeemed) return false;
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return (
          c.title.toLowerCase().includes(query) ||
          c.description.toLowerCase().includes(query) ||
          c.id.toString() === query
        );
      }
      return true;
    });
  }, [coupons, selectedCategory, statusFilter, searchQuery]);

  // Paginated coupons
  const paginatedCoupons = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredCoupons.slice(start, start + itemsPerPage);
  }, [filteredCoupons, currentPage]);

  const totalPages = Math.ceil(filteredCoupons.length / itemsPerPage);

  // Quiz vote handler
  const handleAnswerFantasy = (fantasyId, vote) => {
    const updated = {
      ...quizAnswers,
      [activeUser]: {
        ...quizAnswers[activeUser],
        [fantasyId]: vote
      }
    };
    setQuizAnswers(updated);
    localStorage.setItem('romapp_fantasy_quiz', JSON.stringify(updated));
  };

  // Match calculation logic: ONLY show if both marked 'SI' or 'TAL VEZ'
  const matchedFantasies = useMemo(() => {
    return FANTASIES_DATA.filter((f) => {
      const jAns = quizAnswers.julian?.[f.id];
      const yAns = quizAnswers.yanet?.[f.id];
      const isPositive = (ans) => ans === 'SI' || ans === 'TAL_VEZ';
      return isPositive(jAns) && isPositive(yAns);
    });
  }, [quizAnswers]);

  // Vault photo upload
  const handleVaultPhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target.result;
      const newPhoto = {
        id: 'photo-' + Date.now(),
        data: base64,
        date: new Date().toLocaleDateString('es-AR')
      };
      const updated = [newPhoto, ...vaultPhotos];
      setVaultPhotos(updated);
      localStorage.setItem('romapp_vault_photos', JSON.stringify(updated));
      triggerLoveConfetti();
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteVaultPhoto = (id) => {
    if (confirm('¿Eliminar esta foto de la bóveda privada?')) {
      const updated = vaultPhotos.filter((p) => p.id !== id);
      setVaultPhotos(updated);
      localStorage.setItem('romapp_vault_photos', JSON.stringify(updated));
    }
  };

  const handleUnlockVault = (e) => {
    e.preventDefault();
    if (pinInput === vaultPin || pinInput === 'bariloche2026') {
      setIsVaultUnlocked(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  // If locked, render the atmospheric sealed wedding gift box screen with live countdown
  if (!isUnlocked) {
    return <SealedGiftBoxView onUnlock={() => setIsUnlocked(true)} />;
  }

  // UNLOCKED VIEW: DEEP DARK IMMERSIVE ATMOSPHERE (#0f0d15)
  return (
    <div className="min-h-screen bg-[#0f0d15] text-stone-200 -mx-4 -mb-12 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Intimate Section Header */}
      <div className="max-w-6xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a1226] via-[#120b1c] to-[#0a0610] p-6 sm:p-10 border border-purple-500/30 shadow-2xl space-y-6">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/40 text-xs font-semibold text-amber-300">
                <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>Espacio Privado • Desbloqueado</span>
              </div>
              <h2 className="font-serif-romantic text-3xl sm:text-4xl font-extrabold text-white">
                Modo Íntimo & Pasión
              </h2>
              <p className="text-xs sm:text-sm text-stone-400 leading-relaxed font-light">
                Complicidad absoluta para Julián y Yanet: 318 cupones eróticos completos, catálogo de posiciones con fichas técnicas, guía táctica de estimulación, match de fantasías y bóveda privada de fotos.
              </p>
            </div>

            <button
              onClick={() => setIsUnlocked(false)}
              className="px-3.5 py-1.5 rounded-xl bg-purple-950/60 hover:bg-purple-900 border border-purple-800 text-stone-400 hover:text-white text-xs font-medium flex items-center gap-1.5 cursor-pointer shrink-0"
              title="Volver a bloquear modo íntimo"
            >
              <Lock className="w-3.5 h-3.5 text-purple-400" />
              <span>Bloquear Acceso</span>
            </button>
          </div>

          {/* Module Navigation Sub-Tabs */}
          <div className="relative z-10 flex items-center gap-2 overflow-x-auto pb-1 border-t border-purple-900/60 pt-4 scrollbar-none">
            <button
              onClick={() => setActiveTab('coupons')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'coupons'
                  ? 'bg-amber-400 text-stone-950 shadow-md font-bold'
                  : 'bg-purple-950/60 text-purple-300 hover:bg-purple-900/80 hover:text-white'
              }`}
            >
              🔥 318 Cupones Íntimos
            </button>
            <button
              onClick={() => setActiveTab('positions')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'positions'
                  ? 'bg-amber-400 text-stone-950 shadow-md font-bold'
                  : 'bg-purple-950/60 text-purple-300 hover:bg-purple-900/80 hover:text-white'
              }`}
            >
              📖 Guía Ilustrada de Posiciones
            </button>
            <button
              onClick={() => setActiveTab('guide')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'guide'
                  ? 'bg-amber-400 text-stone-950 shadow-md font-bold'
                  : 'bg-purple-950/60 text-purple-300 hover:bg-purple-900/80 hover:text-white'
              }`}
            >
              🎯 Estimulación Oral & Anal
            </button>
            <button
              onClick={() => setActiveTab('match')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'match'
                  ? 'bg-amber-400 text-stone-950 shadow-md font-bold'
                  : 'bg-purple-950/60 text-purple-300 hover:bg-purple-900/80 hover:text-white'
              }`}
            >
              💘 Match Íntimo (25 Fantasías)
            </button>
            <button
              onClick={() => setActiveTab('vault')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'vault'
                  ? 'bg-amber-400 text-stone-950 shadow-md font-bold'
                  : 'bg-purple-950/60 text-purple-300 hover:bg-purple-900/80 hover:text-white'
              }`}
            >
              🔐 Bóveda de Fotos Prohibidas
            </button>
          </div>
        </div>
      </div>

      {/* SUB-TAB 1: 318 CUPONES ÍNTIMOS Y SEXUALES */}
      {activeTab === 'coupons' && (
        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* Filters Bar */}
          <div className="bg-[#150f21] p-4 sm:p-6 rounded-3xl border border-purple-900/60 space-y-4">
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Search box */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Buscar cupón íntimo por título, número o palabra clave..."
                  className="w-full bg-[#0d0915] text-xs text-white pl-10 pr-4 py-2.5 rounded-xl border border-purple-800/60 focus:outline-none focus:border-amber-400 placeholder-stone-500"
                />
              </div>

              {/* Status pills */}
              <div className="flex items-center gap-1.5 bg-[#0d0915] p-1 rounded-xl border border-purple-900/60 text-xs">
                <button
                  onClick={() => { setStatusFilter('all'); setCurrentPage(1); }}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    statusFilter === 'all' ? 'bg-purple-800 text-white font-bold' : 'text-stone-400 hover:text-white'
                  }`}
                >
                  Todos ({coupons.length})
                </button>
                <button
                  onClick={() => { setStatusFilter('available'); setCurrentPage(1); }}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    statusFilter === 'available' ? 'bg-purple-800 text-white font-bold' : 'text-stone-400 hover:text-white'
                  }`}
                >
                  Disponibles
                </button>
                <button
                  onClick={() => { setStatusFilter('redeemed'); setCurrentPage(1); }}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    statusFilter === 'redeemed' ? 'bg-purple-800 text-white font-bold' : 'text-stone-400 hover:text-white'
                  }`}
                >
                  Canjeados
                </button>
              </div>
            </div>

            {/* Category selection chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {categoriesList.map((cat, idx) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setCurrentPage(1);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-r from-purple-700 to-amber-500 text-white shadow-sm'
                        : 'bg-[#0e0a17] text-stone-400 hover:text-white hover:bg-purple-950 border border-purple-900/40'
                    }`}
                  >
                    {idx === 0 ? '✨ Todas las Categorías' : `Cat ${idx}: ${cat}`}
                  </button>
                );
              })}
            </div>

          </div>

          {/* Coupons Count & Summary */}
          <div className="flex items-center justify-between text-xs text-stone-400 px-2">
            <span>
              Mostrando {filteredCoupons.length} de 318 cupones íntimos
            </span>
            <span>
              Página {currentPage} de {totalPages || 1}
            </span>
          </div>

          {/* Coupons Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedCoupons.length === 0 ? (
              <div className="col-span-full bg-[#150f21] p-12 rounded-3xl text-center border border-dashed border-purple-900/60 text-stone-400 text-xs">
                No se encontraron cupones que coincidan con la búsqueda.
              </div>
            ) : (
              paginatedCoupons.map((coupon) => (
                <div
                  key={coupon.id}
                  className={`relative rounded-3xl p-5 border flex flex-col justify-between transition-all duration-300 ${
                    coupon.redeemed
                      ? 'bg-[#100a18]/70 border-purple-950 opacity-75'
                      : 'bg-gradient-to-b from-[#181126] to-[#120c1d] border-purple-700/40 hover:border-amber-400/60 shadow-lg hover:shadow-purple-900/30 hover:-translate-y-0.5'
                  }`}
                >
                  {/* Coupon number badge */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-purple-950 text-amber-300 border border-purple-800">
                      #{String(coupon.id).padStart(3, '0')}
                    </span>
                    <span className="text-[10px] font-medium text-stone-400 truncate max-w-[200px]" title={coupon.category}>
                      {coupon.category}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-2 mb-4">
                    <h4 className="font-serif-romantic text-base font-bold text-white leading-snug">
                      {coupon.title}
                    </h4>
                    <p className="text-xs text-stone-300 leading-relaxed font-light">
                      {coupon.description}
                    </p>
                  </div>

                  {/* Action Footer */}
                  <div className="pt-3 border-t border-purple-900/40 flex items-center justify-between">
                    {coupon.redeemed ? (
                      <>
                        <span className="text-[10px] text-amber-400 font-semibold">
                          Canjeado ({coupon.redeemedAt})
                        </span>
                        <button
                          onClick={() => handleReactivateCoupon(coupon.id)}
                          className="text-[11px] text-stone-400 hover:text-white flex items-center gap-1 cursor-pointer"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Reactivar</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <span className="text-[10px] text-stone-500">
                          Listo para usar
                        </span>
                        <button
                          onClick={() => handleRedeemCoupon(coupon.id)}
                          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold text-xs shadow-md shadow-rose-950 hover:scale-105 transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          <Flame className="w-3.5 h-3.5" />
                          <span>Canjear y Cumplir</span>
                        </button>
                      </>
                    )}
                  </div>

                </div>
              ))
            )}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-xl bg-[#150f21] border border-purple-900 text-xs text-stone-300 hover:text-white disabled:opacity-40"
              >
                Anterior
              </button>
              <span className="text-xs text-stone-400 px-3">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-xl bg-[#150f21] border border-purple-900 text-xs text-stone-300 hover:text-white disabled:opacity-40"
              >
                Siguiente
              </button>
            </div>
          )}

        </div>
      )}

      {/* SUB-TAB 2: CATÁLOGO DE POSICIONES (GUÍA ILUSTRADA Y TÉCNICA) */}
      {activeTab === 'positions' && (
        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* Position Selector Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {POSITIONS_DATA.map((pos) => {
              const isSelected = selectedPosition.id === pos.id;
              return (
                <button
                  key={pos.id}
                  onClick={() => setSelectedPosition(pos)}
                  className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#2c0e22] to-[#1c0816] border-amber-400/80 shadow-lg text-amber-100 ring-1 ring-amber-400/40'
                      : 'bg-[#150a14] border-stone-800/80 text-stone-400 hover:text-white hover:bg-[#200e1e]'
                  }`}
                >
                  <h5 className="font-serif-romantic text-xs sm:text-sm font-bold truncate">
                    {pos.name}
                  </h5>
                  <div className="flex items-center gap-1 mt-1 text-[10px] text-amber-300">
                    <span>Exigencia:</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-2.5 h-2.5 ${i < pos.difficulty ? 'fill-amber-400 text-amber-400' : 'text-stone-600'}`}
                        />
                      ))}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Detailed Technical Sheet of Selected Position */}
          <div className="bg-[#150f21] rounded-3xl p-6 sm:p-10 border border-purple-500/40 shadow-2xl space-y-6">
            
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-purple-900/60 pb-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-950/80 px-2.5 py-0.5 rounded-full border border-amber-800">
                  Ficha Técnica Kama Sutra
                </span>
                <h3 className="font-serif-romantic text-2xl sm:text-3xl font-bold text-white mt-2">
                  {selectedPosition.name}
                </h3>
                <p className="text-xs text-purple-300 mt-1 italic">
                  "{selectedPosition.subtitle}"
                </p>
              </div>

              {/* Difficulty & Intensity */}
              <div className="bg-[#0e0917] p-3 rounded-2xl border border-purple-800/60 text-right">
                <span className="text-[10px] uppercase tracking-wider text-stone-400 block">
                  Nivel de Exigencia Física
                </span>
                <div className="flex items-center gap-1 justify-end mt-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < selectedPosition.difficulty ? 'fill-amber-400 text-amber-400' : 'text-stone-700'}`}
                    />
                  ))}
                  <span className="text-xs font-bold text-white ml-1">
                    {selectedPosition.difficulty}/5
                  </span>
                </div>
              </div>
            </div>

            {/* Illustrated Vector Schematic & Description */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div>
                <PositionSvg type={selectedPosition.svgType} />
                <span className="block text-center text-[10px] text-stone-500 mt-2">
                  * Esquema anatómico vectorial: morado (él), dorado (ella), acento rojo (foco pélvico).
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-purple-300 mb-1">
                    Descripción y Ejecución:
                  </h4>
                  <p className="text-xs sm:text-sm text-stone-200 leading-relaxed font-light">
                    {selectedPosition.description}
                  </p>
                </div>

                {/* Stimulated Zones Pills */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-purple-300 mb-2">
                    Zonas Estimuladas:
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedPosition.zones.map((zone) => (
                      <span
                        key={zone}
                        className="text-xs px-2.5 py-1 rounded-xl bg-purple-950 text-amber-300 border border-purple-800 font-medium"
                      >
                        {zone}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Hands Placement Guide */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-purple-300 mb-1">
                    Guía de Colocación de Manos:
                  </h4>
                  <p className="text-xs text-stone-300 bg-[#0e0917] p-3 rounded-xl border border-purple-900/60 leading-relaxed">
                    {selectedPosition.hands}
                  </p>
                </div>
              </div>
            </div>

            {/* Technical Tips list */}
            <div className="border-t border-purple-900/60 pt-6 space-y-3">
              <h4 className="font-serif-romantic text-base font-bold text-amber-300">
                Secretos Técnicos & Cadencia Recomendada:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {selectedPosition.technicalTips.map((tip, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-[#0e0917] border border-purple-900/60 text-xs text-stone-300 leading-relaxed"
                  >
                    <span className="w-5 h-5 rounded-full bg-purple-900 text-amber-300 font-bold inline-flex items-center justify-center mr-2 text-[10px]">
                      {idx + 1}
                    </span>
                    {tip}
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* SUB-TAB 3: GUÍA TÁCTICA DE ESTIMULACIÓN AVANZADA (ORAL Y ANAL) */}
      {activeTab === 'guide' && (
        <div className="max-w-5xl mx-auto space-y-8">
          
          {/* ORAL SECTION */}
          <div className="bg-[#150f21] rounded-3xl p-6 sm:p-8 border border-purple-500/40 shadow-xl space-y-6">
            <div className="border-b border-purple-900/60 pb-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-purple-950 px-2.5 py-0.5 rounded-full border border-purple-800">
                Protocolo Táctico
              </span>
              <h3 className="font-serif-romantic text-2xl font-bold text-white mt-1">
                {STIMULATION_GUIDE.oral.title}
              </h3>
              <p className="text-xs text-stone-400 mt-1">
                {STIMULATION_GUIDE.oral.subtitle}
              </p>
            </div>

            <div className="space-y-6">
              {STIMULATION_GUIDE.oral.sections.map((sec) => (
                <div key={sec.id} className="space-y-3">
                  <h4 className="font-serif-romantic text-lg font-bold text-amber-300 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-rose-400" />
                    {sec.target}
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {sec.keyPoints.map((pt, i) => (
                      <div
                        key={i}
                        className="p-4 rounded-2xl bg-[#0e0917] border border-purple-900/60 space-y-1.5"
                      >
                        <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                          {pt.title}
                        </h5>
                        <p className="text-xs text-stone-300 leading-relaxed font-light">
                          {pt.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ANAL SECTION */}
          <div className="bg-[#150f21] rounded-3xl p-6 sm:p-8 border border-purple-500/40 shadow-xl space-y-6">
            <div className="border-b border-purple-900/60 pb-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 bg-rose-950/80 px-2.5 py-0.5 rounded-full border border-rose-800">
                Confort & Seguridad Milimétrica
              </span>
              <h3 className="font-serif-romantic text-2xl font-bold text-white mt-1">
                {STIMULATION_GUIDE.anal.title}
              </h3>
              <p className="text-xs text-stone-400 mt-1">
                {STIMULATION_GUIDE.anal.subtitle}
              </p>
            </div>

            <div className="space-y-6">
              {STIMULATION_GUIDE.anal.sections.map((sec) => (
                <div key={sec.id} className="space-y-3">
                  <h4 className="font-serif-romantic text-lg font-bold text-amber-300 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    {sec.target}
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {sec.keyPoints.map((pt, i) => (
                      <div
                        key={i}
                        className="p-4 rounded-2xl bg-[#0e0917] border border-purple-900/60 space-y-1.5"
                      >
                        <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                          {pt.title}
                        </h5>
                        <p className="text-xs text-stone-300 leading-relaxed font-light">
                          {pt.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* SUB-TAB 4: CUESTIONARIO 'MATCH ÍNTIMO' (25 FANTASÍAS CON FILTRO DE PRIVACIDAD) */}
      {activeTab === 'match' && (
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Header & Match Explanations */}
          <div className="bg-[#150f21] p-6 sm:p-8 rounded-3xl border border-purple-500/40 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 bg-rose-950 px-2.5 py-0.5 rounded-full border border-rose-800">
                  Filtro de Confidencialidad Absoluta
                </span>
                <h3 className="font-serif-romantic text-2xl font-bold text-white mt-1">
                  Test Match Íntimo: 25 Fantasías
                </h3>
                <p className="text-xs text-stone-400 mt-1">
                  Respondan cada uno desde su perspectiva. Las respuestas con "NO" quedan completamente invisibles. Solo verán las coincidencias donde ambos hayan puesto "SÍ" o "TAL VEZ".
                </p>
              </div>

              {/* Match Counter Badge */}
              <div className="bg-[#0e0917] px-4 py-2.5 rounded-2xl border border-purple-800/60 text-center shrink-0">
                <span className="text-[10px] uppercase tracking-wider text-stone-400 block font-semibold">
                  Coincidencias Mutuas
                </span>
                <span className="font-serif-romantic text-2xl font-black text-amber-300">
                  {matchedFantasies.length} / {FANTASIES_DATA.length}
                </span>
              </div>
            </div>

            {/* Profile Selector */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-purple-900/60">
              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-400">Respondiendo como:</span>
                <div className="flex bg-[#0e0917] p-1 rounded-xl border border-purple-900">
                  <button
                    onClick={() => setActiveUser('julian')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      activeUser === 'julian' ? 'bg-purple-700 text-white' : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    Julián
                  </button>
                  <button
                    onClick={() => setActiveUser('yanet')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      activeUser === 'yanet' ? 'bg-rose-700 text-white' : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    Yanet
                  </button>
                </div>
              </div>

              <button
                onClick={() => setShowMatchesOnly(!showMatchesOnly)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  showMatchesOnly
                    ? 'bg-amber-400 text-stone-950 shadow-md'
                    : 'bg-purple-950 text-amber-300 hover:bg-purple-900 border border-purple-800'
                }`}
              >
                <Heart className="w-3.5 h-3.5" />
                <span>{showMatchesOnly ? 'Ver Todas las Preguntas' : 'Ver Solo Coincidencias (Matches)'}</span>
              </button>
            </div>
          </div>

          {/* Fantasies List */}
          <div className="space-y-4">
            {(showMatchesOnly ? matchedFantasies : FANTASIES_DATA).map((item) => {
              const myAnswer = quizAnswers[activeUser]?.[item.id];
              const isMatch = matchedFantasies.some((m) => m.id === item.id);

              return (
                <div
                  key={item.id}
                  className={`p-5 rounded-3xl border transition-all ${
                    isMatch
                      ? 'bg-gradient-to-r from-[#20102b] to-[#160c20] border-amber-400/60 shadow-md'
                      : 'bg-[#150f21] border-purple-900/60'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-purple-950 text-purple-300 border border-purple-800">
                        #{item.id}
                      </span>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400">
                        {item.category}
                      </span>
                    </div>

                    {isMatch && (
                      <span className="px-3 py-1 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 text-white font-bold text-xs flex items-center gap-1 animate-pulse shadow-xs">
                        <Flame className="w-3.5 h-3.5" />
                        <span>¡MATCH CONFIRMADO!</span>
                      </span>
                    )}
                  </div>

                  <h4 className="font-serif-romantic text-base font-bold text-white mb-1">
                    {item.title}
                  </h4>
                  <p className="text-xs text-stone-300 font-light leading-relaxed mb-4">
                    {item.description}
                  </p>

                  {/* Voting buttons for active user */}
                  <div className="flex items-center justify-between pt-3 border-t border-purple-900/40">
                    <span className="text-[11px] text-stone-400">
                      Voto de {activeUser === 'julian' ? 'Julián' : 'Yanet'}:
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleAnswerFantasy(item.id, 'SI')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          myAnswer === 'SI'
                            ? 'bg-emerald-600 text-white shadow-md'
                            : 'bg-[#0e0917] text-stone-400 hover:text-white border border-purple-900'
                        }`}
                      >
                        🔥 SÍ
                      </button>
                      <button
                        onClick={() => handleAnswerFantasy(item.id, 'TAL_VEZ')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          myAnswer === 'TAL_VEZ'
                            ? 'bg-amber-500 text-stone-950 shadow-md'
                            : 'bg-[#0e0917] text-stone-400 hover:text-white border border-purple-900'
                        }`}
                      >
                        🤔 Tal vez
                      </button>
                      <button
                        onClick={() => handleAnswerFantasy(item.id, 'NO')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          myAnswer === 'NO'
                            ? 'bg-rose-900 text-rose-200'
                            : 'bg-[#0e0917] text-stone-400 hover:text-white border border-purple-900'
                        }`}
                      >
                        ⛔ No
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* SUB-TAB 5: BÓVEDA PRIVADA DE FOTOS PROHIBIDAS */}
      {activeTab === 'vault' && (
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* PIN Lock Screen if vault not unlocked */}
          {!isVaultUnlocked ? (
            <div className="bg-[#150f21] rounded-3xl p-8 sm:p-12 border border-purple-500/40 text-center max-w-md mx-auto space-y-6 shadow-2xl">
              <div className="w-16 h-16 rounded-3xl bg-purple-950 text-amber-400 border border-purple-700/60 flex items-center justify-center mx-auto shadow-inner">
                <Lock className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h3 className="font-serif-romantic text-2xl font-bold text-white">
                  Bóveda Privada
                </h3>
                <p className="text-xs text-stone-400">
                  Protegida por PIN numérico para máxima privacidad de la pareja.
                </p>
              </div>

              <form onSubmit={handleUnlockVault} className="space-y-4">
                <input
                  type="password"
                  maxLength={6}
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="Ingresa PIN (por defecto: 1234)..."
                  className="w-full text-center bg-[#0d0915] border border-purple-700 rounded-2xl py-3 text-lg text-amber-300 font-mono tracking-widest focus:outline-none focus:border-amber-400"
                />

                {pinError && (
                  <p className="text-xs text-rose-400">
                    PIN incorrecto. Puedes usar 1234 o "bariloche2026".
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-700 to-amber-500 hover:from-purple-600 hover:to-amber-400 text-stone-950 font-bold text-xs uppercase tracking-wider shadow-lg cursor-pointer transition-transform hover:scale-102"
                >
                  Abrir Bóveda
                </button>
              </form>
            </div>
          ) : (
            /* Unlocked Vault View */
            <div className="space-y-6">
              
              <div className="bg-[#150f21] p-6 rounded-3xl border border-purple-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-purple-950 text-amber-300">
                      <Unlock className="w-4 h-4" />
                    </span>
                    <h3 className="font-serif-romantic text-xl font-bold text-white">
                      Bóveda Privada Abierta
                    </h3>
                  </div>
                  <p className="text-xs text-stone-400 mt-1">
                    Fotos guardadas en Base64 en tu dispositivo. Mantén presionado para quitar el desenfoque.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <label className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-rose-600 hover:from-purple-500 hover:to-rose-500 text-white font-bold text-xs shadow-md flex items-center gap-1.5 cursor-pointer transition-transform hover:scale-105">
                    <Plus className="w-4 h-4" />
                    <span>Agregar Foto Secreta</span>
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleVaultPhotoUpload}
                      className="hidden"
                    />
                  </label>

                  <button
                    onClick={() => setIsVaultUnlocked(false)}
                    className="p-2 rounded-xl bg-[#0e0917] hover:bg-purple-950 border border-purple-800 text-stone-400 hover:text-white"
                    title="Cerrar bóveda"
                  >
                    <Lock className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Photos Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {vaultPhotos.length === 0 ? (
                  <div className="col-span-full bg-[#150f21] p-12 rounded-3xl text-center border border-dashed border-purple-900/60 text-stone-400 text-xs">
                    No hay fotos guardadas en la bóveda aún. ¡Suban su primera foto prohibida con total privacidad!
                  </div>
                ) : (
                  vaultPhotos.map((photo) => {
                    const isHolding = holdingPhotoId === photo.id;

                    return (
                      <div
                        key={photo.id}
                        className="bg-[#150f21] rounded-3xl p-3 border border-purple-900/60 space-y-2 relative overflow-hidden"
                      >
                        <div className="relative rounded-2xl overflow-hidden aspect-square bg-stone-950 flex items-center justify-center select-none">
                          <img
                            src={photo.data}
                            alt="Foto Privada"
                            className={`w-full h-full object-cover transition-all duration-300 select-none ${
                              isHolding ? 'filter-none scale-100' : 'filter blur-2xl scale-110'
                            }`}
                          />

                          {/* Hold to reveal overlay */}
                          <div
                            onMouseDown={() => setHoldingPhotoId(photo.id)}
                            onMouseUp={() => setHoldingPhotoId(null)}
                            onTouchStart={() => setHoldingPhotoId(photo.id)}
                            onTouchEnd={() => setHoldingPhotoId(null)}
                            className="absolute inset-0 flex items-center justify-center bg-black/30 text-white cursor-pointer select-none"
                          >
                            <div className="px-3 py-1.5 rounded-xl bg-black/70 backdrop-blur-md text-[11px] font-semibold flex items-center gap-1.5 border border-white/20">
                              {isHolding ? <EyeOff className="w-3.5 h-3.5 text-rose-400" /> : <Eye className="w-3.5 h-3.5 text-amber-300" />}
                              <span>{isHolding ? 'Soltar para ocultar' : 'Mantener pulsado'}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-stone-500 px-1">
                          <span>{photo.date}</span>
                          <button
                            onClick={() => handleDeleteVaultPhoto(photo.id)}
                            className="text-stone-400 hover:text-rose-400 p-1"
                            title="Eliminar foto"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
}
