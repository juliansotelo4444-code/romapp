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
  Search
} from 'lucide-react';
import { GENERAL_COUPONS } from '../data/generalCoupons';
import { triggerLoveConfetti } from '../utils/confetti';

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
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 18;

  // Load from localStorage and merge newly added coupons
  useEffect(() => {
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
        setCoupons(merged);
        localStorage.setItem('romapp_general_coupons', JSON.stringify(merged));
      } catch {
        const initial = GENERAL_COUPONS.map(c => ({ ...c, redeemed: false, redeemedAt: null }));
        setCoupons(initial);
        localStorage.setItem('romapp_general_coupons', JSON.stringify(initial));
      }
    } else {
      const initial = GENERAL_COUPONS.map(c => ({ ...c, redeemed: false, redeemedAt: null }));
      setCoupons(initial);
      localStorage.setItem('romapp_general_coupons', JSON.stringify(initial));
    }
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
  };

  const handleReactivate = (id) => {
    const updated = coupons.map((c) => {
      if (c.id === id) {
        return { ...c, redeemed: false, redeemedAt: null };
      }
      return c;
    });
    saveCoupons(updated);
  };

  const categories = [
    'Todos',
    'Tregua Doméstica & Convivencia',
    'Citas, Gastronomía & Salidas',
    'Mimos y Cuidado Diario',
    'Música, Salidas y Citas',
    'Sensuales & Pícaros (After Dark)',
    'Especiales Boda y Bariloche',
    'Canjeados'
  ];

  // Filter coupons with search and category
  const filteredCoupons = useMemo(() => {
    return coupons.filter((c) => {
      // Category filter
      if (activeCategory === 'Canjeados') {
        if (!c.redeemed) return false;
      } else {
        if (c.redeemed) return false; // In other tabs show available only
        if (activeCategory !== 'Todos' && c.category !== activeCategory) return false;
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
  }, [coupons, activeCategory, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredCoupons.length / itemsPerPage);
  const paginatedCoupons = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredCoupons.slice(start, start + itemsPerPage);
  }, [filteredCoupons, currentPage]);

  const availableCount = coupons.filter((c) => !c.redeemed).length;
  const redeemedCount = coupons.filter((c) => c.redeemed).length;

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
            Vales canjeables con sello nupcial: treguas de convivencia, citas gourmet, mimos y momentos especiales.
          </p>
        </div>

        {/* Counter Pills */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-rose-950/60 text-rose-300 border border-rose-800/50">
            {availableCount} Disponibles
          </span>
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-[#1a0a1e] text-stone-400 border border-rose-950/50">
            {redeemedCount} Canjeados
          </span>
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
                    ? 'bg-rose-700 text-rose-100 shadow-md border border-rose-600/50'
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
                    {coupon.redeemed ? `Canjeado: ${coupon.redeemedAt}` : 'Válido sin vencimiento'}
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
