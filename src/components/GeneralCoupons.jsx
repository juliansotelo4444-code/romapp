import React, { useState, useEffect, useMemo } from 'react';
import { 
  Ticket, 
  Sparkles, 
  Check, 
  RotateCcw, 
  Flame, 
  Coffee, 
  Music, 
  Gift, 
  Heart, 
  Wine, 
  Car, 
  Camera, 
  CheckCircle2, 
  ShieldCheck, 
  Tv, 
  Moon, 
  Sun, 
  IceCream, 
  HeartHandshake, 
  MapPin, 
  GlassWater,
  Search,
  Lock,
  Unlock,
  Clock,
  Home
} from 'lucide-react';
import { GENERAL_COUPONS } from '../data/generalCoupons';
import { triggerLoveConfetti } from '../utils/confetti';
import { fetchSyncData, apiRedeemCoupon, apiReactivateCoupon } from '../api/client';

export function isConvivenciaCoupon(coupon) {
  if (coupon.category === 'Tregua Doméstica & Convivencia') return true;
  const text = (coupon.title + ' ' + coupon.description).toLowerCase();
  return (
    text.includes('tareas domésticas') ||
    text.includes('lavar los platos') ||
    text.includes('limpiar los pisos') ||
    text.includes('sacar la basura') ||
    text.includes('desinfectar picaportes') ||
    text.includes('planchar ropa') ||
    text.includes('tender la cama')
  );
}

const ICON_MAP = {
  Coffee,
  Sparkles,
  CheckCircle2,
  Tv,
  IceCream,
  HeartHandshake,
  Music,
  MapPin,
  Car,
  Moon,
  Wine,
  Sun,
  Flame,
  Camera,
  Gift,
  ShieldCheck,
  Heart,
  GlassWater
};

export default function GeneralCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [activeCategory, setActiveCategory] = useState('Todos (Noviazgo)');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Progressive daily unlock state (starts with 8 noviazgo coupons unlocked)
  const [unlockedNoviazgoCount, setUnlockedNoviazgoCount] = useState(() => {
    const saved = localStorage.getItem('romapp_unlocked_noviazgo_count');
    return saved ? Math.max(parseInt(saved, 10), 8) : 8;
  });

  const [lastUnlockDate, setLastUnlockDate] = useState(() => {
    return localStorage.getItem('romapp_last_coupon_unlock_date') || '';
  });

  const [timeUntilMidnight, setTimeUntilMidnight] = useState('');

  // Countdown timer to midnight for next daily coupon
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
      const diff = midnight - now;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setTimeUntilMidnight(
        `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`
      );
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const todayStr = new Date().toISOString().slice(0, 10);
  const canUnlockToday = lastUnlockDate !== todayStr;

  // Load from localStorage and sync with Neon cloud DB
  useEffect(() => {
    let localList = [];
    const saved = localStorage.getItem('romapp_general_coupons');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const existingIds = new Set(parsed.map((c) => c.id));
        const merged = [...parsed];

        // Merge any new coupons from codebase that aren't yet in localStorage
        for (const c of GENERAL_COUPONS) {
          if (!existingIds.has(c.id)) {
            merged.push({ ...c, redeemed: false, redeemedAt: null });
          }
        }
        localList = merged;
      } catch {
        localList = GENERAL_COUPONS.map(c => ({ ...c, redeemed: false, redeemedAt: null }));
      }
    } else {
      localList = GENERAL_COUPONS.map(c => ({ ...c, redeemed: false, redeemedAt: null }));
    }

    setCoupons(localList);
    localStorage.setItem('romapp_general_coupons', JSON.stringify(localList));

    // Cloud sync from Neon PostgreSQL
    fetchSyncData().then((syncData) => {
      if (syncData && Array.isArray(syncData.coupons)) {
        const remoteMap = new Map();
        syncData.coupons.forEach((row) => {
          remoteMap.set(row.coupon_id, {
            redeemed: row.redeemed,
            redeemedAt: row.redeemed_at
          });
        });

        setCoupons((prev) => {
          const synced = prev.map((c) => {
            const remote = remoteMap.get(c.id);
            if (remote) {
              return { ...c, redeemed: remote.redeemed, redeemedAt: remote.redeemedAt };
            }
            return c;
          });
          localStorage.setItem('romapp_general_coupons', JSON.stringify(synced));
          return synced;
        });
      }
    });
  }, []);

  const saveCoupons = (updated) => {
    setCoupons(updated);
    localStorage.setItem('romapp_general_coupons', JSON.stringify(updated));
  };

  const handleRedeem = (id) => {
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
    apiRedeemCoupon(id, today);
  };

  const handleReactivate = (id) => {
    const updated = coupons.map((c) => {
      if (c.id === id) {
        return { ...c, redeemed: false, redeemedAt: null };
      }
      return c;
    });
    saveCoupons(updated);
    apiReactivateCoupon(id);
  };

  // Compute noviazgo coupons and index mapping
  const noviazgoCouponsList = useMemo(() => {
    return coupons.filter(c => !isConvivenciaCoupon(c));
  }, [coupons]);

  const totalNoviazgo = noviazgoCouponsList.length;

  // Handle daily unlock of a new coupon
  const handleRevealDailyCoupon = () => {
    const nextCount = Math.min(unlockedNoviazgoCount + 1, totalNoviazgo);
    setUnlockedNoviazgoCount(nextCount);
    setLastUnlockDate(todayStr);
    localStorage.setItem('romapp_unlocked_noviazgo_count', String(nextCount));
    localStorage.setItem('romapp_last_coupon_unlock_date', todayStr);
    triggerLoveConfetti();
  };

  const categories = [
    'Todos (Noviazgo)',
    'Citas, Gastronomía & Salidas',
    'Mimos y Cuidado Diario',
    'Música, Salidas y Citas',
    'Sensuales & Pícaros (After Dark)',
    'Especiales Boda y Bariloche',
    'Canjeados',
    '🔒 Convivencia (Bloqueados)'
  ];

  // Map each coupon with its locked/unlocked state
  const enrichedCoupons = useMemo(() => {
    let noviazgoCounter = 0;

    return coupons.map((c) => {
      const isConvivencia = isConvivenciaCoupon(c);
      let isUnlocked = false;

      if (isConvivencia) {
        isUnlocked = false; // Strictly locked for post-wedding living together
      } else {
        isUnlocked = noviazgoCounter < unlockedNoviazgoCount;
        noviazgoCounter++;
      }

      return {
        ...c,
        isConvivencia,
        isUnlocked
      };
    });
  }, [coupons, unlockedNoviazgoCount]);

  // Filter coupons with search and category
  const filteredCoupons = useMemo(() => {
    return enrichedCoupons.filter((c) => {
      // Category filter
      if (activeCategory === 'Canjeados') {
        if (!c.redeemed) return false;
      } else if (activeCategory === '🔒 Convivencia (Bloqueados)') {
        if (!c.isConvivencia) return false;
      } else if (activeCategory === 'Todos (Noviazgo)') {
        if (c.isConvivencia) return false;
        if (c.redeemed) return false;
      } else {
        if (c.isConvivencia) return false;
        if (c.redeemed) return false;
        if (c.category !== activeCategory) return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q)
        );
      }

      return true;
    });
  }, [enrichedCoupons, activeCategory, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredCoupons.length / itemsPerPage);
  const paginatedCoupons = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredCoupons.slice(start, start + itemsPerPage);
  }, [filteredCoupons, currentPage]);

  const availableNoviazgoCount = enrichedCoupons.filter((c) => !c.isConvivencia && c.isUnlocked && !c.redeemed).length;
  const redeemedCount = coupons.filter((c) => c.redeemed).length;
  const totalConvivenciaCount = enrichedCoupons.filter((c) => c.isConvivencia).length;

  return (
    <div className="space-y-8 py-6 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#140816]/90 backdrop-blur-xl p-6 rounded-3xl border border-rose-950/70 shadow-2xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-950/60 border border-amber-800/40 text-amber-400">
              <Ticket className="w-5 h-5" />
            </span>
            <h2 className="text-2xl font-bold font-serif-romantic text-stone-100">
              Cuponera Oficial de la Pareja
            </h2>
          </div>
          <p className="text-xs text-stone-400 mt-1">
            Etapa de Noviazgo activa con desbloqueo progresivo diario. Los vales de convivencia permanecen sellados hasta el matrimonio.
          </p>
        </div>

        {/* Counter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-rose-950/60 text-rose-300 border border-rose-800/50">
            {availableNoviazgoCount} Desbloqueados para Canjear
          </span>
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-[#1a0a1e] text-stone-400 border border-rose-950/50">
            {redeemedCount} Canjeados
          </span>
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-amber-950/40 text-amber-300/80 border border-amber-800/40 flex items-center gap-1">
            <Lock className="w-3 h-3 text-amber-400" />
            {totalConvivenciaCount} Convivencia (Bloqueados)
          </span>
        </div>
      </div>

      {/* Daily Reveal Banner (Cofre Diario de Noviazgo) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#200a1d] via-[#2a0e26] to-[#150718] p-6 border border-amber-500/30 shadow-2xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-5 relative z-10">
          
          <div className="flex items-center gap-4 text-left">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0 shadow-lg">
              <Gift className="w-7 h-7 text-amber-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-700/60">
                  Cofre Diario de Noviazgo
                </span>
                <span className="text-xs text-stone-400 font-mono">
                  {unlockedNoviazgoCount} de {totalNoviazgo} revelados
                </span>
              </div>
              <h3 className="font-serif-romantic text-lg sm:text-xl font-bold text-white mt-1">
                {canUnlockToday
                  ? '¡Tienes 1 nuevo cupón de noviazgo listo para revelar hoy!'
                  : '¡Ya revelaste tu cupón de hoy! El próximo se prepara a medianoche.'}
              </h3>
              <p className="text-xs text-stone-300 font-light mt-0.5">
                Desbloqueo gradual de a poco para disfrutar cada sorpresa a su debido tiempo.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
            {canUnlockToday ? (
              <button
                onClick={handleRevealDailyCoupon}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-stone-950 font-bold text-xs uppercase tracking-wider shadow-xl shadow-amber-400/20 hover:scale-105 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-stone-950" />
                <span>Revelar Cupón de Hoy</span>
              </button>
            ) : (
              <div className="px-5 py-2.5 rounded-2xl bg-[#140816] border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-2 shadow-inner">
                <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>Próximo cofre en: {timeUntilMidnight}</span>
              </div>
            )}
          </div>

        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[#120514] rounded-full h-2 mt-5 overflow-hidden border border-rose-950/50">
          <div 
            className="bg-gradient-to-r from-amber-500 via-rose-500 to-pink-500 h-2 rounded-full transition-all duration-700"
            style={{ width: `${Math.min(Math.round((unlockedNoviazgoCount / totalNoviazgo) * 100), 100)}%` }}
          />
        </div>
      </div>

      {/* Search & Categories Bar */}
      <div className="bg-[#140816]/90 backdrop-blur-xl p-4 sm:p-5 rounded-3xl border border-rose-950/70 shadow-2xl space-y-4">
        
        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Buscar cupón (platos, café, masaje, sushi, siesta, cine...)..."
            className="w-full bg-[#1c0b1f] text-xs text-stone-100 pl-10 pr-4 py-2.5 rounded-xl border border-rose-950/80 focus:outline-none focus:border-rose-500 placeholder-stone-500"
          />
        </div>

        {/* Categories Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setCurrentPage(1);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? cat.includes('Convivencia')
                      ? 'bg-amber-950/80 text-amber-200 shadow-md border border-amber-600/60'
                      : 'bg-rose-700 text-rose-100 shadow-md border border-rose-600/50'
                    : 'bg-[#1a0a1e] text-stone-300 hover:bg-rose-950/40 border border-rose-950/60'
                }`}
              >
                {cat === 'Canjeados' && '✨ '}
                {cat}
              </button>
            );
          })}
        </div>

      </div>

      {/* Coupons Count & Summary */}
      <div className="flex items-center justify-between text-xs text-stone-400 px-2">
        <span>
          Mostrando {filteredCoupons.length} cupones en esta sección
        </span>
        {totalPages > 1 && (
          <span>
            Página {currentPage} de {totalPages}
          </span>
        )}
      </div>

      {/* Coupons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {paginatedCoupons.length === 0 ? (
          <div className="col-span-full bg-[#140816]/80 p-12 rounded-3xl text-center border border-dashed border-rose-950 text-stone-400 text-xs">
            {activeCategory === 'Canjeados'
              ? 'Aún no has canjeado ningún cupón. ¡Aprovecha los vales disponibles hoy mismo!'
              : 'No se encontraron cupones que coincidan con la búsqueda o categoría seleccionada.'}
          </div>
        ) : (
          paginatedCoupons.map((coupon) => {
            const IconComponent = ICON_MAP[coupon.icon] || Heart;

            // CASE 1: CONVIVENCIA COUPONS (Strictly locked for post-wedding living together)
            if (coupon.isConvivencia) {
              return (
                <div
                  key={coupon.id}
                  className="relative rounded-3xl overflow-hidden bg-[#100814]/80 backdrop-blur-md border border-amber-900/40 p-6 flex flex-col justify-between shadow-xl opacity-80"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-amber-950/60 text-amber-400 border border-amber-800/40 flex items-center gap-1">
                        <Lock className="w-3 h-3 text-amber-400" />
                        <span>Convivencia • Post-Boda</span>
                      </span>
                      <div className="w-8 h-8 rounded-xl bg-amber-950/40 text-amber-400 border border-amber-800/30 flex items-center justify-center">
                        <Home className="w-4 h-4" />
                      </div>
                    </div>

                    <h3 className="font-serif-romantic text-base font-bold text-stone-300 leading-snug">
                      {coupon.title}
                    </h3>

                    <p className="text-xs text-stone-400 mt-2 leading-relaxed">
                      {coupon.description}
                    </p>

                    <div className="mt-3 p-2.5 rounded-xl bg-amber-950/30 border border-amber-700/30 text-[11px] text-amber-300/80 italic">
                      Reservado para la vida conyugal bajo el mismo techo después de la boda.
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-rose-950/50">
                    <button
                      disabled
                      className="w-full py-2 rounded-xl bg-stone-900/60 border border-stone-800 text-stone-500 font-semibold text-xs flex items-center justify-center gap-1.5 cursor-not-allowed"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Bloqueado hasta la Convivencia</span>
                    </button>
                  </div>
                </div>
              );
            }

            // CASE 2: NOVIAZGO COUPON NOT YET UNLOCKED (Sealed mystery card for upcoming days)
            if (!coupon.isUnlocked && !coupon.redeemed) {
              return (
                <div
                  key={coupon.id}
                  className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#120715] to-[#0c040d] border border-rose-950/60 p-6 flex flex-col justify-between shadow-xl"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-rose-950/40 text-rose-300/70 border border-rose-900/30 flex items-center gap-1">
                        <Lock className="w-3 h-3 text-rose-400" />
                        <span>Noviazgo • En Camino</span>
                      </span>
                      <div className="w-8 h-8 rounded-xl bg-rose-950/30 text-stone-500 border border-rose-900/30 flex items-center justify-center">
                        <Gift className="w-4 h-4" />
                      </div>
                    </div>

                    <h3 className="font-serif-romantic text-base font-bold text-stone-400 leading-snug">
                      Cupón Sorpresa de Noviazgo
                    </h3>

                    <p className="text-xs text-stone-500 mt-2 leading-relaxed italic">
                      Este vale se revelará en los próximos días de nuestro camino al altar. Abre el cofre diario mañana para descubrirlo.
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-rose-950/40">
                    <button
                      disabled
                      className="w-full py-2 rounded-xl bg-[#160a18]/60 border border-rose-950/50 text-stone-500 font-semibold text-xs flex items-center justify-center gap-1.5 cursor-not-allowed"
                    >
                      <Clock className="w-3.5 h-3.5 text-stone-500" />
                      <span>Se desbloqueará pronto</span>
                    </button>
                  </div>
                </div>
              );
            }

            // CASE 3: UNLOCKED NOVIAZGO COUPON (Ready to be redeemed)
            return (
              <div
                key={coupon.id}
                className={`relative rounded-3xl overflow-hidden transition-all duration-300 flex flex-col justify-between ${
                  coupon.redeemed
                    ? 'bg-[#120715]/60 border border-rose-950/40 opacity-70'
                    : 'bg-[#17091a]/90 backdrop-blur-md border border-rose-900/40 hover:border-amber-400/50 shadow-xl hover:shadow-2xl hover:-translate-y-1'
                }`}
              >
                {/* Visual perforated notch cuts on sides */}
                <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#0b0710] border-r border-rose-900/50" />
                <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#0b0710] border-l border-rose-900/50" />

                {/* Stamped visual seal for redeemed */}
                {coupon.redeemed && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                    <div className="transform -rotate-12 border-2 border-rose-500/80 text-rose-400 px-4 py-2 rounded-2xl font-black text-center tracking-widest uppercase bg-[#0f0512]/90 backdrop-blur-md shadow-2xl">
                      <span className="block text-sm font-extrabold">CANJEADO</span>
                      <span className="text-[10px] block mt-0.5">{coupon.redeemedAt}</span>
                    </div>
                  </div>
                )}

                <div className="p-6">
                  {/* Category Pill & Icon */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-rose-950/60 text-rose-300 border border-rose-800/40 max-w-[200px] truncate" title={coupon.category}>
                      {coupon.category}
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-amber-950/60 text-amber-400 border border-amber-800/40 flex items-center justify-center">
                      <IconComponent className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="font-serif-romantic text-base font-bold text-stone-100 leading-snug">
                    {coupon.title}
                  </h3>

                  <p className="text-xs text-stone-400 mt-2 leading-relaxed">
                    {coupon.description}
                  </p>
                </div>

                {/* Footer Action */}
                <div className="p-4 bg-[#100612]/90 border-t border-rose-950/60 flex items-center justify-between">
                  <span className="text-[10px] text-stone-400 font-medium">
                    {coupon.redeemed ? `Canjeado: ${coupon.redeemedAt}` : 'Válido durante el noviazgo'}
                  </span>

                  {coupon.redeemed ? (
                    <button
                      onClick={() => handleReactivate(coupon.id)}
                      className="text-xs font-semibold text-stone-400 hover:text-stone-200 flex items-center gap-1 cursor-pointer"
                      title="Reactivar cupón"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reutilizar</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleRedeem(coupon.id)}
                      className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-700 hover:from-rose-500 hover:to-pink-600 text-white font-semibold text-xs shadow-md shadow-rose-950 hover:scale-105 transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Canjear Ahora</span>
                    </button>
                  )}
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            onClick={() => {
              setCurrentPage((p) => Math.max(p - 1, 1));
              window.scrollTo({ top: 300, behavior: 'smooth' });
            }}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-xl bg-[#1a0a1e] border border-rose-950/70 text-xs text-stone-300 hover:bg-rose-950/40 disabled:opacity-30 shadow-xs cursor-pointer"
          >
            Anterior
          </button>
          <span className="text-xs text-stone-400 px-3 font-medium">
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={() => {
              setCurrentPage((p) => Math.min(p + 1, totalPages));
              window.scrollTo({ top: 300, behavior: 'smooth' });
            }}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-xl bg-[#1a0a1e] border border-rose-950/70 text-xs text-stone-300 hover:bg-rose-950/40 disabled:opacity-30 shadow-xs cursor-pointer"
          >
            Siguiente
          </button>
        </div>
      )}

    </div>
  );
}
