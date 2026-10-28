import React, { useState, useEffect } from 'react';
import { 
  CheckSquare, 
  Square, 
  MapPin, 
  Plus, 
  Trash2, 
  Sparkles, 
  Luggage, 
  Flame, 
  Coffee, 
  Camera, 
  Mountain, 
  Ship,
  Heart
} from 'lucide-react';
import { INITIAL_HONEYMOON_ITEMS } from '../data/honeymoonData';
import { triggerLoveConfetti } from '../utils/confetti';

export default function HoneymoonChecklist() {
  const [items, setItems] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('Todos');
  const [newText, setNewText] = useState('');
  const [newDay, setNewDay] = useState('Valija');

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('romapp_honeymoon_items');
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch {
        setItems(INITIAL_HONEYMOON_ITEMS);
      }
    } else {
      setItems(INITIAL_HONEYMOON_ITEMS);
      localStorage.setItem('romapp_honeymoon_items', JSON.stringify(INITIAL_HONEYMOON_ITEMS));
    }
  }, []);

  const saveItems = (updated) => {
    setItems(updated);
    localStorage.setItem('romapp_honeymoon_items', JSON.stringify(updated));
  };

  const handleToggle = (id) => {
    const updated = items.map((it) => {
      if (it.id === id) {
        const nextState = !it.checked;
        if (nextState) triggerLoveConfetti();
        return { ...it, checked: nextState };
      }
      return it;
    });
    saveItems(updated);
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newText.trim()) return;

    const newItem = {
      id: 'custom-hm-' + Date.now(),
      day: newDay,
      category: newDay === 'Valija' ? 'Equipaje' : 'Itinerario',
      text: newText.trim(),
      checked: false
    };

    saveItems([newItem, ...items]);
    setNewText('');
  };

  const handleDeleteItem = (id) => {
    const updated = items.filter((it) => it.id !== id);
    saveItems(updated);
  };

  // Stats calculation
  const totalCount = items.length;
  const completedCount = items.filter((it) => it.checked).length;
  const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Day categories list
  const dayOptions = [
    'Todos',
    'Valija',
    'Día 1',
    'Día 2',
    'Día 3',
    'Día 4',
    'Día 5',
    'Día 6',
    'Día 7',
    'Día 8',
    'Día 9',
    'Día 10'
  ];

  const filteredItems = selectedFilter === 'Todos'
    ? items
    : items.filter((it) => it.day === selectedFilter);

  return (
    <div className="space-y-8 py-6 max-w-4xl mx-auto">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950 via-teal-950 to-stone-900 text-white p-6 sm:p-8 shadow-xl border border-emerald-500/20">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/60 border border-emerald-500/30 text-xs font-semibold text-emerald-300">
              <Mountain className="w-3.5 h-3.5" />
              <span>10 Días Inolvidables en la Patagonia</span>
            </div>
            <h2 className="font-serif-romantic text-2xl sm:text-3xl font-extrabold text-white">
              Nuestra Luna de Miel en Bariloche
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-light">
              Cabaña con chimenea, chocolates artesanales de Mamuschka & Rapa Nui, navegación en el lago Nahuel Huapi y miradores de cuento de hadas.
            </p>
          </div>

          {/* Progress Widget */}
          <div className="w-full md:w-56 bg-stone-900/80 backdrop-blur-md p-4 rounded-2xl border border-emerald-500/30 text-center shrink-0">
            <span className="text-xs uppercase tracking-wider text-emerald-300 font-bold block">
              Progreso del Viaje
            </span>
            <div className="font-serif-romantic text-3xl font-black text-white mt-1">
              {percent}%
            </div>
            <p className="text-[11px] text-stone-400 mt-0.5">
              {completedCount} de {totalCount} ítems listos
            </p>
            {/* Progress Bar */}
            <div className="w-full bg-stone-800 rounded-full h-2 mt-2.5 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bariloche Scenic Highlights Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#140816]/85 backdrop-blur-md p-3.5 rounded-2xl border border-rose-950/70 shadow-lg flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-950/60 border border-amber-800/40 text-amber-400 flex items-center justify-center shrink-0">
            <Coffee className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-stone-200">Mamuschka & Rapa Nui</h4>
            <p className="text-[10px] text-stone-400">Chocolates & Franui</p>
          </div>
        </div>

        <div className="bg-[#140816]/85 backdrop-blur-md p-3.5 rounded-2xl border border-rose-950/70 shadow-lg flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-rose-950/60 border border-rose-800/40 text-rose-400 flex items-center justify-center shrink-0">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-stone-200">Fuego en la Cabaña</h4>
            <p className="text-[10px] text-stone-400">Chimenea & Malbec</p>
          </div>
        </div>

        <div className="bg-[#140816]/85 backdrop-blur-md p-3.5 rounded-2xl border border-rose-950/70 shadow-lg flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-sky-950/60 border border-sky-800/40 text-sky-400 flex items-center justify-center shrink-0">
            <Ship className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-stone-200">Nahuel Huapi</h4>
            <p className="text-[10px] text-stone-400">Paseo lacustre</p>
          </div>
        </div>

        <div className="bg-[#140816]/85 backdrop-blur-md p-3.5 rounded-2xl border border-rose-950/70 shadow-lg flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 flex items-center justify-center shrink-0">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-stone-200">Cerro Campanario</h4>
            <p className="text-[10px] text-stone-400">Vista 360° inolvidable</p>
          </div>
        </div>
      </div>

      {/* Add New Custom Item Box */}
      <form onSubmit={handleAddItem} className="bg-[#140816]/90 backdrop-blur-xl p-4 rounded-2xl border border-rose-950/70 shadow-xl flex flex-col sm:flex-row items-center gap-3">
        <select
          value={newDay}
          onChange={(e) => setNewDay(e.target.value)}
          className="w-full sm:w-36 bg-[#1c0b1f] border border-rose-950/80 text-stone-100 text-xs rounded-xl p-2.5 focus:outline-none focus:border-emerald-500"
        >
          {dayOptions.filter(d => d !== 'Todos').map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        <input
          type="text"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          placeholder="Agregar nuevo plan, prenda o recuerdo para Bariloche..."
          className="w-full flex-1 bg-[#1c0b1f] border border-rose-950/80 text-stone-100 text-xs rounded-xl p-2.5 focus:outline-none focus:border-emerald-500 placeholder-stone-500"
        />

        <button
          type="submit"
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-xs shadow-sm flex items-center justify-center gap-1.5 cursor-pointer shrink-0 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Agregar</span>
        </button>
      </form>

      {/* Filter Tabs by Day */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {dayOptions.map((day) => {
          const isSelected = selectedFilter === day;
          return (
            <button
              key={day}
              onClick={() => setSelectedFilter(day)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-emerald-700 text-emerald-100 shadow-xs border border-emerald-600/40'
                  : 'bg-[#1a0a1e] text-stone-300 hover:bg-rose-950/40 border border-rose-950/60'
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* Checklist Items List */}
      <div className="bg-[#140816]/90 backdrop-blur-xl rounded-3xl border border-rose-950/70 shadow-xl overflow-hidden divide-y divide-rose-950/50">
        {filteredItems.length === 0 ? (
          <div className="p-8 text-center text-stone-400 text-xs">
            No hay actividades marcadas para esta categoría aún.
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => handleToggle(item.id)}
              className={`p-4 flex items-center justify-between gap-3 hover:bg-rose-950/25 transition-colors cursor-pointer ${
                item.checked ? 'bg-emerald-950/20' : ''
              }`}
            >
              <div className="flex items-center gap-3 flex-1">
                <button
                  type="button"
                  className={`p-1 rounded-lg transition-colors ${
                    item.checked ? 'text-emerald-400' : 'text-stone-500 hover:text-stone-300'
                  }`}
                >
                  {item.checked ? (
                    <CheckSquare className="w-5 h-5 fill-emerald-950/50" />
                  ) : (
                    <Square className="w-5 h-5" />
                  )}
                </button>

                <div>
                  <span className={`text-xs sm:text-sm font-medium block leading-snug ${
                    item.checked ? 'line-through text-stone-500' : 'text-stone-200'
                  }`}>
                    {item.text}
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-800/40">
                      {item.day}
                    </span>
                    <span className="text-[10px] text-stone-400">
                      {item.category}
                    </span>
                  </div>
                </div>
              </div>

              {item.id.toString().startsWith('custom-hm-') && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteItem(item.id);
                  }}
                  className="p-1.5 text-stone-400 hover:text-rose-400 rounded-lg hover:bg-rose-950/40 transition-colors"
                  title="Eliminar ítem"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))
        )}
      </div>

    </div>
  );
}
