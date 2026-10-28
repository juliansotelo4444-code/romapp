import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Send, 
  Sparkles, 
  Heart, 
  Plus, 
  Trash2, 
  BookOpen, 
  Calendar, 
  User, 
  Check, 
  ArrowLeft,
  Feather
} from 'lucide-react';
import { SURPRISE_LETTERS } from '../data/surpriseLetters';
import { triggerLoveConfetti } from '../utils/confetti';
import { fetchSyncData, apiSaveLetter, apiDeleteLetter } from '../api/client';

export default function LoveLetters() {
  const [letters, setLetters] = useState([]);
  const [activeLetter, setActiveLetter] = useState(null);
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // 'list', 'read', 'write'

  // New letter form state
  const [newLetter, setNewLetter] = useState({
    title: '',
    author: 'Julián',
    recipient: 'Yanet',
    date: new Date().toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' }),
    content: ''
  });

  // Load letters from localStorage and sync with Neon PostgreSQL
  useEffect(() => {
    let localList = SURPRISE_LETTERS;
    const saved = localStorage.getItem('romapp_letters');
    if (saved) {
      try {
        localList = JSON.parse(saved);
      } catch {
        localList = SURPRISE_LETTERS;
      }
    }
    setLetters(localList);
    localStorage.setItem('romapp_letters', JSON.stringify(localList));

    // Cloud sync from Neon
    fetchSyncData().then((syncData) => {
      if (syncData && Array.isArray(syncData.letters)) {
        setLetters((prev) => {
          const ids = new Set(prev.map(l => l.id));
          const merged = [...prev];
          syncData.letters.forEach((rem) => {
            if (!ids.has(rem.id)) {
              merged.push(rem);
              ids.add(rem.id);
            }
          });
          localStorage.setItem('romapp_letters', JSON.stringify(merged));
          return merged;
        });
      }
    });
  }, []);

  const saveLettersToLocal = (newLetters) => {
    setLetters(newLetters);
    localStorage.setItem('romapp_letters', JSON.stringify(newLetters));
  };

  const handleOpenLetter = (letter) => {
    setActiveLetter(letter);
    setIsEnvelopeOpen(false);
    setViewMode('read');
    triggerLoveConfetti();
    setTimeout(() => {
      setIsEnvelopeOpen(true);
    }, 300);
  };

  const handleSurpriseLetter = () => {
    const randomIndex = Math.floor(Math.random() * SURPRISE_LETTERS.length);
    const chosen = SURPRISE_LETTERS[randomIndex];
    handleOpenLetter(chosen);
  };

  const handleSaveNewLetter = (e) => {
    e.preventDefault();
    if (!newLetter.title.trim() || !newLetter.content.trim()) return;

    const created = {
      id: 'custom-' + Date.now(),
      ...newLetter
    };

    const updated = [created, ...letters];
    saveLettersToLocal(updated);
    triggerLoveConfetti();
    setActiveLetter(created);
    setViewMode('read');
    setIsEnvelopeOpen(true);

    // Save to Neon cloud DB
    apiSaveLetter(created);

    // Reset form
    setNewLetter({
      title: '',
      author: 'Julián',
      recipient: 'Yanet',
      date: new Date().toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' }),
      content: ''
    });
  };

  const handleDeleteLetter = (id, e) => {
    e.stopPropagation();
    if (confirm('¿Seguro que deseas eliminar esta carta de amor?')) {
      const filtered = letters.filter((l) => l.id !== id);
      saveLettersToLocal(filtered);
      apiDeleteLetter(id);
      if (activeLetter?.id === id) {
        setViewMode('list');
        setActiveLetter(null);
      }
    }
  };

  return (
    <div className="space-y-8 py-6 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#140816]/90 backdrop-blur-xl p-6 rounded-3xl border border-rose-950/70 shadow-2xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-rose-950/60 border border-rose-800/40 text-rose-400">
              <Mail className="w-5 h-5" />
            </span>
            <h2 className="text-2xl font-bold font-serif-romantic text-stone-100">
              Cartas de Amor Eterno
            </h2>
          </div>
          <p className="text-xs text-stone-400 mt-1">
            Palabras que sellan nuestra promesa, con citas de Morat, Tan Biónica y la complicidad de cada día.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleSurpriseLetter}
            className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-amber-950/40 hover:bg-amber-950/70 text-amber-300 font-semibold text-xs border border-amber-600/40 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '8s' }} />
            <span>Carta Sorpresa</span>
          </button>
          <button
            onClick={() => setViewMode(viewMode === 'write' ? 'list' : 'write')}
            className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-pink-700 hover:from-rose-500 hover:to-pink-600 text-white font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-rose-950"
          >
            {viewMode === 'write' ? <BookOpen className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            <span>{viewMode === 'write' ? 'Ver Todas' : 'Escribir Carta'}</span>
          </button>
        </div>
      </div>

      {/* VIEW MODE: WRITE NEW LETTER */}
      {viewMode === 'write' && (
        <div className="bg-[#140816]/90 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-rose-950/70 shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-rose-950/60 pb-4">
            <h3 className="font-serif-romantic text-xl font-bold text-stone-100 flex items-center gap-2">
              <Feather className="w-5 h-5 text-rose-400" />
              Redactar una Nueva Carta de Amor
            </h3>
            <button
              onClick={() => setViewMode('list')}
              className="text-stone-400 hover:text-stone-200 text-xs flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver a la lista</span>
            </button>
          </div>

          <form onSubmit={handleSaveNewLetter} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  ¿Quién escribe?
                </label>
                <select
                  value={newLetter.author}
                  onChange={(e) => setNewLetter({ ...newLetter, author: e.target.value })}
                  className="w-full bg-[#1c0b1f] border border-rose-950/80 text-stone-100 text-xs rounded-xl p-2.5 focus:outline-none focus:border-rose-500"
                >
                  <option value="Julián">Julián (para Yanet)</option>
                  <option value="Yanet">Yanet (para Julián)</option>
                  <option value="Julián & Yanet">Julián & Yanet (Juntos)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  ¿Para quién?
                </label>
                <input
                  type="text"
                  value={newLetter.recipient}
                  onChange={(e) => setNewLetter({ ...newLetter, recipient: e.target.value })}
                  placeholder="Ej: Mi muñeca, Mi memé..."
                  className="w-full bg-[#1c0b1f] border border-rose-950/80 text-stone-100 text-xs rounded-xl p-2.5 focus:outline-none focus:border-rose-500 placeholder-stone-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Fecha o Momento
                </label>
                <input
                  type="text"
                  value={newLetter.date}
                  onChange={(e) => setNewLetter({ ...newLetter, date: e.target.value })}
                  className="w-full bg-[#1c0b1f] border border-rose-950/80 text-stone-100 text-xs rounded-xl p-2.5 focus:outline-none focus:border-rose-500 placeholder-stone-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Título de la carta
              </label>
              <input
                type="text"
                required
                value={newLetter.title}
                onChange={(e) => setNewLetter({ ...newLetter, title: e.target.value })}
                placeholder="Ej: Lo que sentí la primera vez que te vi..."
                className="w-full bg-[#1c0b1f] border border-rose-950/80 text-stone-100 text-xs rounded-xl p-2.5 focus:outline-none focus:border-rose-500 placeholder-stone-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Contenido de la carta (abrí tu corazón)
              </label>
              <textarea
                required
                rows={8}
                value={newLetter.content}
                onChange={(e) => setNewLetter({ ...newLetter, content: e.target.value })}
                placeholder="Escribe aquí con tus palabras, apodos y todo lo que sientes..."
                className="w-full bg-[#1c0b1f] border border-rose-950/80 text-stone-100 text-xs rounded-xl p-3 focus:outline-none focus:border-rose-500 leading-relaxed font-serif-romantic text-base placeholder-stone-500"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className="px-4 py-2 rounded-xl text-stone-400 hover:text-stone-200 hover:bg-rose-950/40 text-xs font-semibold transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs shadow-md shadow-rose-950 flex items-center gap-2 cursor-pointer transition-transform hover:scale-105"
              >
                <Send className="w-4 h-4" />
                <span>Guardar y Sellar Carta</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* VIEW MODE: READ LETTER WITH ENVELOPE ANIMATION */}
      {viewMode === 'read' && activeLetter && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setViewMode('list')}
              className="text-stone-300 hover:text-stone-100 text-xs font-semibold flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1a0a1e] border border-rose-950/70 shadow-xs cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver a todas las cartas</span>
            </button>
            <span className="text-xs text-stone-400 italic">
              Sellada con amor eterno
            </span>
          </div>

          {/* Interactive Envelope Graphic */}
          <div className="relative max-w-2xl mx-auto">
            
            {/* The Envelope Outer Frame */}
            <div className={`transition-all duration-700 transform ${isEnvelopeOpen ? 'opacity-100 scale-100' : 'opacity-90 scale-95'}`}>
              
              {/* Parchment Letter Paper */}
              <div className="parchment-bg rounded-3xl p-8 sm:p-12 shadow-2xl border-2 border-[#e6dbc8] text-stone-800 relative overflow-hidden">
                
                {/* Vintage stamp & seal */}
                <div className="absolute top-6 right-6 flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full bg-rose-700 text-amber-200 flex items-center justify-center shadow-lg border-2 border-rose-800/80 transform rotate-12">
                    <Heart className="w-7 h-7 fill-amber-200" />
                  </div>
                  <span className="text-[9px] uppercase tracking-widest text-stone-500 font-bold mt-1">
                    8 & 9 OCT
                  </span>
                </div>

                {/* Letter Header */}
                <div className="space-y-2 border-b border-[#ded2be] pb-6 mb-6">
                  <div className="flex items-center gap-2 text-xs text-stone-500 uppercase tracking-widest font-semibold">
                    <Calendar className="w-3.5 h-3.5 text-rose-600" />
                    <span>{activeLetter.date}</span>
                  </div>
                  <h3 className="font-serif-romantic text-2xl sm:text-3xl font-extrabold text-stone-900 leading-tight">
                    {activeLetter.title}
                  </h3>
                  <div className="text-xs text-rose-700 font-medium flex items-center gap-2">
                    <span>De: <strong>{activeLetter.author}</strong></span>
                    <span>•</span>
                    <span>Para: <strong>{activeLetter.recipient}</strong></span>
                  </div>
                </div>

                {/* Letter Body */}
                <div className="font-serif-romantic text-base sm:text-lg leading-relaxed text-stone-800 whitespace-pre-line space-y-4">
                  {activeLetter.content}
                </div>

                {/* Romantic Signature */}
                <div className="mt-10 pt-6 border-t border-[#ded2be] flex justify-between items-end">
                  <div className="text-xs italic text-stone-500">
                    "Siempre tuyo, siempre mía, siempre nuestros."
                  </div>
                  <div className="text-right">
                    <span className="font-serif-romantic text-xl font-bold text-rose-800 block">
                      {activeLetter.author}
                    </span>
                    <span className="text-[11px] text-stone-500">Con todo mi amor</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      )}

      {/* VIEW MODE: LIST OF LETTERS */}
      {viewMode === 'list' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {letters.map((letter) => (
              <div
                key={letter.id}
                onClick={() => handleOpenLetter(letter)}
                className="group relative bg-[#150a18]/90 backdrop-blur-md p-5 rounded-3xl border border-rose-950/70 hover:border-rose-700/60 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between"
              >
                {/* Decorative envelope fold top */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-rose-900/20 to-transparent rounded-bl-full pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between text-xs text-stone-400 mb-2">
                    <span className="flex items-center gap-1 font-medium text-rose-300 bg-rose-950/60 px-2.5 py-0.5 rounded-full border border-rose-800/40">
                      <Feather className="w-3 h-3" />
                      {letter.author}
                    </span>
                    <span>{letter.date}</span>
                  </div>

                  <h3 className="font-serif-romantic text-lg font-bold text-stone-100 group-hover:text-rose-300 transition-colors line-clamp-1">
                    {letter.title}
                  </h3>

                  <p className="text-xs text-stone-400 mt-2 line-clamp-3 leading-relaxed font-serif-romantic italic">
                    "{letter.content.slice(0, 160)}..."
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-rose-950/60 flex items-center justify-between text-xs">
                  <span className="font-semibold text-rose-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    <span>Abrir sobre y leer</span>
                    <span>→</span>
                  </span>

                  {letter.id.toString().startsWith('custom-') && (
                    <button
                      onClick={(e) => handleDeleteLetter(letter.id, e)}
                      className="p-1.5 text-stone-400 hover:text-rose-400 rounded-lg hover:bg-rose-950/40 transition-colors"
                      title="Eliminar carta"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
