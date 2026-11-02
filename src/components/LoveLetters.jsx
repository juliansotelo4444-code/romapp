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
  Feather,
  Edit3,
  Filter,
  Camera,
  Image as ImageIcon,
  X,
  Maximize2
} from 'lucide-react';
import { SURPRISE_LETTERS } from '../data/surpriseLetters';
import { triggerLoveConfetti } from '../utils/confetti';
import { fetchSyncData, apiSaveLetter, apiDeleteLetter } from '../api/client';
import { useProfile } from '../context/ProfileContext';

export default function LoveLetters() {
  const { profile, isJulian, isYanet, partnerName } = useProfile();
  const [letters, setLetters] = useState([]);
  const [activeLetter, setActiveLetter] = useState(null);
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // 'list', 'read', 'write'
  const [editingLetterId, setEditingLetterId] = useState(null);
  const [authorFilter, setAuthorFilter] = useState('all'); // 'all', 'mine', 'partner', 'julian', 'yanet'
  const [zoomedPhoto, setZoomedPhoto] = useState(null);

  // New letter form state
  const [newLetter, setNewLetter] = useState({
    title: '',
    author: profile.name,
    recipient: partnerName,
    date: new Date().toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' }),
    content: '',
    photoUrl: ''
  });

  // Keep author/recipient in sync when profile changes if not editing
  useEffect(() => {
    if (!editingLetterId) {
      setNewLetter((prev) => ({
        ...prev,
        author: profile.name,
        recipient: partnerName
      }));
    }
  }, [profile.name, partnerName, editingLetterId]);

  // Load letters from localStorage and sync with Neon PostgreSQL
  useEffect(() => {
    let localList = SURPRISE_LETTERS;
    const saved = localStorage.getItem('romapp_letters');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Keep custom letters, preserve original author or fallback to Julian
        const customOnly = parsed.filter(l => l.id.toString().startsWith('custom-')).map(l => ({
          ...l,
          author: l.author || 'Julián',
          recipient: l.recipient || (l.author === 'Yanet' ? 'Julián' : 'Yanet')
        }));
        localList = [...SURPRISE_LETTERS, ...customOnly];
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
              merged.push({ 
                ...rem, 
                author: rem.author || 'Julián', 
                recipient: rem.recipient || (rem.author === 'Yanet' ? 'Julián' : 'Yanet') 
              });
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
    const randomIndex = Math.floor(Math.random() * letters.length);
    const chosen = letters[randomIndex] || SURPRISE_LETTERS[0];
    handleOpenLetter(chosen);
  };

  const handleStartNewLetter = () => {
    setEditingLetterId(null);
    setNewLetter({
      title: '',
      author: profile.name,
      recipient: partnerName,
      date: new Date().toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' }),
      content: '',
      photoUrl: ''
    });
    setViewMode('write');
  };

  const handleStartEditLetter = (letter, e) => {
    if (e) e.stopPropagation();
    setEditingLetterId(letter.id);
    setNewLetter({
      title: letter.title,
      author: letter.author || profile.name,
      recipient: letter.recipient || partnerName,
      date: letter.date || new Date().toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' }),
      content: letter.content,
      photoUrl: letter.photoUrl || ''
    });
    setViewMode('write');
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Convert file to base64 Data URL for instant preview and persistence
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      setNewLetter((prev) => ({
        ...prev,
        photoUrl: uploadEvent.target.result
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSaveLetterForm = (e) => {
    e.preventDefault();
    if (!newLetter.title.trim() || !newLetter.content.trim()) return;

    if (editingLetterId) {
      // Editing existing letter
      const updatedItem = {
        ...newLetter,
        id: editingLetterId
      };
      const updatedList = letters.map((l) => (l.id === editingLetterId ? updatedItem : l));
      saveLettersToLocal(updatedList);
      triggerLoveConfetti();
      setActiveLetter(updatedItem);
      setViewMode('read');
      setIsEnvelopeOpen(true);
      apiSaveLetter(updatedItem);
    } else {
      // Creating new letter
      const created = {
        id: 'custom-' + Date.now(),
        ...newLetter,
        author: newLetter.author.trim() || profile.name,
        recipient: newLetter.recipient.trim() || partnerName
      };

      const updated = [created, ...letters];
      saveLettersToLocal(updated);
      triggerLoveConfetti();
      setActiveLetter(created);
      setViewMode('read');
      setIsEnvelopeOpen(true);
      apiSaveLetter(created);
    }

    // Reset editing state
    setEditingLetterId(null);
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

  const filteredLetters = letters.filter((l) => {
    if (authorFilter === 'mine') {
      return l.author?.toLowerCase().includes(profile.name.toLowerCase());
    }
    if (authorFilter === 'partner') {
      return l.author?.toLowerCase().includes(partnerName.toLowerCase());
    }
    if (authorFilter === 'julian') {
      return l.author?.toLowerCase().includes('julián') || l.author?.toLowerCase().includes('julian');
    }
    if (authorFilter === 'yanet') {
      return l.author?.toLowerCase().includes('yanet');
    }
    return true;
  });

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
            Palabras, promesas y complicidad mutua entre Julián y Yanet, con acordes de Morat, Tan Biónica y Airbag.
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
            onClick={viewMode === 'write' ? () => setViewMode('list') : handleStartNewLetter}
            className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-pink-700 hover:from-rose-500 hover:to-pink-600 text-white font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-rose-950"
          >
            {viewMode === 'write' ? <BookOpen className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            <span>{viewMode === 'write' ? 'Ver Todas' : 'Escribir Carta'}</span>
          </button>
        </div>
      </div>

      {/* VIEW MODE: WRITE / EDIT LETTER */}
      {viewMode === 'write' && (
        <div className="bg-[#140816]/90 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-rose-950/70 shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-rose-950/60 pb-4">
            <h3 className="font-serif-romantic text-xl font-bold text-stone-100 flex items-center gap-2">
              <Feather className="w-5 h-5 text-rose-400" />
              <span>
                {editingLetterId 
                  ? 'Editar Carta de Amor' 
                  : (isJulian ? 'Redactar Carta de Julián para Yanet' : 'Redactar Carta de Yanet para Julián')}
              </span>
            </h3>
            <button
              onClick={() => {
                setEditingLetterId(null);
                setViewMode('list');
              }}
              className="text-stone-400 hover:text-stone-200 text-xs flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver a la lista</span>
            </button>
          </div>

          <form onSubmit={handleSaveLetterForm} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Autor de la carta
                </label>
                <select
                  value={newLetter.author}
                  onChange={(e) => setNewLetter({ ...newLetter, author: e.target.value })}
                  className="w-full bg-[#1c0b1f] border border-rose-950/80 text-rose-300 text-xs rounded-xl p-2.5 focus:outline-none focus:border-rose-500 font-semibold"
                >
                  <option value="Julián">Julián 👑</option>
                  <option value="Yanet">Yanet 🌸</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Para (Destinatario/a)
                </label>
                <input
                  type="text"
                  value={newLetter.recipient}
                  onChange={(e) => setNewLetter({ ...newLetter, recipient: e.target.value })}
                  placeholder={isJulian ? 'Yanet (Mi muñeca, Mi memé...)' : 'Julián (Mi rey, Mi amor...)'}
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

            {/* Photo Attachment (Polaroid Memory) */}
            <div className="p-4 rounded-2xl bg-[#160818]/90 border border-rose-950/80 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-rose-300 flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-rose-400" />
                  <span>Adjuntar Foto / Recuerdo 📸 (Polaroid en la carta)</span>
                </label>
                {newLetter.photoUrl && (
                  <button
                    type="button"
                    onClick={() => setNewLetter({ ...newLetter, photoUrl: '' })}
                    className="text-[11px] text-rose-400 hover:text-rose-200 flex items-center gap-1"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Quitar foto</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                {/* Upload File button */}
                <label className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-rose-950/50 hover:bg-rose-900/60 border border-rose-800/60 text-xs font-medium text-rose-200 cursor-pointer transition-colors">
                  <ImageIcon className="w-4 h-4 text-rose-400" />
                  <span>Subir foto desde este dispositivo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>

                {/* Or paste URL */}
                <input
                  type="url"
                  value={newLetter.photoUrl}
                  onChange={(e) => setNewLetter({ ...newLetter, photoUrl: e.target.value })}
                  placeholder="O pegar URL de imagen..."
                  className="bg-[#1c0b1f] border border-rose-950/80 text-stone-100 text-xs rounded-xl p-2.5 focus:outline-none focus:border-rose-500 placeholder-stone-500"
                />
              </div>

              {/* Photo preview preview in Polaroid frame */}
              {newLetter.photoUrl && (
                <div className="pt-2 flex items-center gap-3">
                  <div className="w-16 h-16 rounded-lg overflow-hidden border border-rose-500/50 shrink-0">
                    <img src={newLetter.photoUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="text-xs text-stone-300">
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Foto lista para adjuntar
                    </span>
                    <span className="text-stone-400 text-[11px] block">
                      Aparecerá fijada con cinta en el pergamino como una Polaroid clásica.
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setEditingLetterId(null);
                  setViewMode('list');
                }}
                className="px-4 py-2 rounded-xl text-stone-400 hover:text-stone-200 hover:bg-rose-950/40 text-xs font-semibold transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs shadow-md shadow-rose-950 flex items-center gap-2 cursor-pointer transition-transform hover:scale-105"
              >
                <Send className="w-4 h-4" />
                <span>{editingLetterId ? 'Guardar Cambios' : 'Guardar y Sellar Carta'}</span>
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
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleStartEditLetter(activeLetter)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 hover:text-rose-100 text-xs font-semibold border border-rose-800/40 transition-colors cursor-pointer"
                title="Editar esta carta"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Editar Carta</span>
              </button>
              <span className="text-xs text-stone-400 italic hidden sm:inline">
                Sellada con amor eterno
              </span>
            </div>
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

                {/* Attached Polaroid Memory Photo */}
                {activeLetter.photoUrl && (
                  <div className="my-8 flex justify-center">
                    <div 
                      onClick={() => setZoomedPhoto(activeLetter.photoUrl)}
                      className="group relative cursor-pointer transform -rotate-1 hover:rotate-0 hover:scale-105 transition-all duration-300 max-w-xs sm:max-w-sm w-full"
                      title="Click para ver la foto en grande"
                    >
                      {/* Vintage masking tape effect on top */}
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-amber-100/70 backdrop-blur-xs border border-amber-300/40 transform -rotate-2 z-10 shadow-xs rounded-xs" />

                      {/* Polaroid Paper Frame */}
                      <div className="bg-[#fffdf9] p-3.5 pb-8 rounded-sm shadow-[0_15px_35px_rgba(0,0,0,0.18)] border border-stone-300 text-center">
                        <div className="relative aspect-4/3 overflow-hidden bg-stone-100 rounded-xs mb-3">
                          <img 
                            src={activeLetter.photoUrl} 
                            alt="Foto de nuestro amor" 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 flex items-center justify-center transition-colors">
                            <div className="bg-black/60 text-white text-xs px-2.5 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                              <Maximize2 className="w-3.5 h-3.5" />
                              <span>Ampliar</span>
                            </div>
                          </div>
                        </div>
                        <p className="font-serif-romantic italic text-stone-700 text-sm">
                          ❤️ Nuestro recuerdo • {activeLetter.date}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

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
          
          {/* Author filter tabs */}
          <div className="flex flex-wrap items-center gap-2 bg-[#120716]/80 p-2 rounded-2xl border border-rose-950/60">
            <span className="text-xs text-stone-400 flex items-center gap-1.5 px-2">
              <Filter className="w-3.5 h-3.5 text-rose-400" />
              <span>Filtrar:</span>
            </span>
            <button
              onClick={() => setAuthorFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                authorFilter === 'all'
                  ? 'bg-rose-950/80 text-rose-200 border border-rose-700/60'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-white/5'
              }`}
            >
              Todas ({letters.length})
            </button>
            <button
              onClick={() => setAuthorFilter('mine')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                authorFilter === 'mine'
                  ? 'bg-rose-950/80 text-rose-200 border border-rose-700/60'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-white/5'
              }`}
            >
              Escritas por mí ({profile.name})
            </button>
            <button
              onClick={() => setAuthorFilter('partner')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                authorFilter === 'partner'
                  ? 'bg-rose-950/80 text-rose-200 border border-rose-700/60'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-white/5'
              }`}
            >
              Para mí (de {partnerName})
            </button>
            <button
              onClick={() => setAuthorFilter('julian')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                authorFilter === 'julian'
                  ? 'bg-amber-950/80 text-amber-200 border border-amber-700/60'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-white/5'
              }`}
            >
              👑 Julián
            </button>
            <button
              onClick={() => setAuthorFilter('yanet')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                authorFilter === 'yanet'
                  ? 'bg-pink-950/80 text-pink-200 border border-pink-700/60'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-white/5'
              }`}
            >
              🌸 Yanet
            </button>
          </div>

          {filteredLetters.length === 0 ? (
            <div className="text-center py-12 p-8 rounded-3xl bg-[#140816]/70 border border-rose-950/60 space-y-3">
              <Mail className="w-10 h-10 text-stone-500 mx-auto" />
              <p className="text-stone-300 font-serif-romantic text-lg">
                No hay cartas en esta categoría todavía.
              </p>
              <button
                onClick={handleStartNewLetter}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition-all"
              >
                Escribir una carta ahora
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredLetters.map((letter) => (
                <div
                  key={letter.id}
                  onClick={() => handleOpenLetter(letter)}
                  className="group relative bg-[#150a18]/90 backdrop-blur-md p-5 rounded-3xl border border-rose-950/70 hover:border-rose-700/60 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between"
                >
                  {/* Decorative envelope fold top */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-rose-900/20 to-transparent rounded-bl-full pointer-events-none" />

                  <div>
                    <div className="flex items-center justify-between text-xs text-stone-400 mb-2">
                      <span className="flex items-center gap-1 font-medium text-rose-300 bg-rose-950/60 px-2.5 py-0.5 rounded-full border border-rose-800/40 text-[11px]">
                        <Feather className="w-3 h-3 text-rose-400" />
                        De {letter.author} para {letter.recipient}
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

                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => handleStartEditLetter(letter, e)}
                        className="p-1.5 text-stone-400 hover:text-amber-300 rounded-lg hover:bg-rose-950/50 transition-colors"
                        title="Editar carta"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      {letter.id.toString().startsWith('custom-') && (
                        <button
                          onClick={(e) => handleDeleteLetter(letter.id, e)}
                          className="p-1.5 text-stone-400 hover:text-rose-400 rounded-lg hover:bg-rose-950/50 transition-colors"
                          title="Eliminar carta"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Fullscreen Photo Lightbox Modal */}
      {zoomedPhoto && (
        <div 
          onClick={() => setZoomedPhoto(null)} 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in"
        >
          <div 
            className="relative max-w-3xl max-h-[90vh] overflow-hidden rounded-2xl bg-black border border-stone-800 shadow-2xl p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={zoomedPhoto} 
              alt="Recuerdo en grande" 
              className="max-w-full max-h-[82vh] object-contain rounded-xl mx-auto" 
            />
            <button 
              onClick={() => setZoomedPhoto(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/70 hover:bg-black/90 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
