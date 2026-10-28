import React, { useState, useEffect } from 'react';
import { 
  Music, 
  X, 
  ExternalLink, 
  Check, 
  AlertCircle, 
  Minimize2, 
  Maximize2,
  Heart,
  Sparkles,
  Flame,
  Radio
} from 'lucide-react';
import { DEFAULT_PLAYLISTS, BANNED_ARTISTS } from '../data/musicPlaylists';

export default function SpotifyPlayer({ isOpen, onClose }) {
  const [selectedPlaylist, setSelectedPlaylist] = useState(DEFAULT_PLAYLISTS[0].id);
  const [customEmbedUrl, setCustomEmbedUrl] = useState('');
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);

  // Load custom Spotify URL from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('romapp_spotify_custom');
    if (saved) {
      setCustomEmbedUrl(saved);
      setCustomUrlInput(saved);
    }
  }, []);

  const activePlaylist = DEFAULT_PLAYLISTS.find((p) => p.id === selectedPlaylist);
  
  // Decide which URL to embed
  const currentEmbedSrc = customEmbedUrl || activePlaylist?.embedUrl;

  const handleSaveCustomUrl = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!customUrlInput.trim()) {
      setCustomEmbedUrl('');
      localStorage.removeItem('romapp_spotify_custom');
      setSuccessMessage('Restauradas las listas predeterminadas.');
      return;
    }

    // Check banned artist
    const inputLower = customUrlInput.toLowerCase();
    const isBanned = BANNED_ARTISTS.some((banned) => inputLower.includes(banned.toLowerCase()));

    if (isBanned) {
      setErrorMessage('⛔ ¡ALERTA MUSICAL! Tame Impala está estrictamente excluido del repertorio por decreto nupcial de Julián y Yanet. Elige canciones de Morat, Tan Biónica o Airbag ❤️');
      return;
    }

    // Convert standard Spotify URL to embed if needed
    let finalUrl = customUrlInput.trim();
    if (finalUrl.includes('open.spotify.com/') && !finalUrl.includes('/embed/')) {
      finalUrl = finalUrl.replace('open.spotify.com/', 'open.spotify.com/embed/');
    }

    setCustomEmbedUrl(finalUrl);
    localStorage.setItem('romapp_spotify_custom', finalUrl);
    setSuccessMessage('¡Playlist personalizada guardada con éxito!');
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed z-50 transition-all duration-300 ${
      isMinimized 
        ? 'bottom-4 right-4 w-72' 
        : 'bottom-4 right-4 w-96 max-w-[calc(100vw-2rem)]'
    }`}>
      <div className="bg-[#121212] text-white rounded-2xl shadow-2xl border border-emerald-500/30 overflow-hidden backdrop-blur-xl">
        
        {/* Top Header */}
        <div className="bg-gradient-to-r from-emerald-950/80 via-stone-900 to-stone-950 px-4 py-3 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center text-black shadow-md">
              <Radio className="w-4 h-4 animate-spin text-black" style={{ animationDuration: '6s' }} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
                Nuestra BSO Nupcial
                <span className="text-[10px] bg-emerald-950 text-emerald-300 px-1.5 py-0.5 rounded-full border border-emerald-800">
                  Spotify
                </span>
              </h3>
              <p className="text-[11px] text-stone-400">Morat • Tan Biónica • Airbag</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
              title={isMinimized ? 'Expandir' : 'Minimizar'}
            >
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-rose-400 rounded-lg hover:bg-stone-800 transition-colors"
              title="Cerrar reproductor"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        {!isMinimized && (
          <div className="p-4 space-y-4 max-h-[75vh] overflow-y-auto">
            
            {/* Playlist Selector Tabs */}
            <div className="grid grid-cols-3 gap-1.5 bg-stone-900/90 p-1 rounded-xl border border-stone-800">
              {DEFAULT_PLAYLISTS.map((pl) => {
                const isSelected = selectedPlaylist === pl.id && !customEmbedUrl;
                return (
                  <button
                    key={pl.id}
                    onClick={() => {
                      setSelectedPlaylist(pl.id);
                      setCustomEmbedUrl('');
                      localStorage.removeItem('romapp_spotify_custom');
                    }}
                    className={`px-2 py-2 rounded-lg text-xs font-semibold text-center transition-all ${
                      isSelected
                        ? 'bg-emerald-500 text-black shadow-md'
                        : 'text-stone-300 hover:text-white hover:bg-stone-800'
                    }`}
                  >
                    {pl.id === 'romantic' && <Heart className="w-3.5 h-3.5 mx-auto mb-1 text-rose-400" />}
                    {pl.id === 'roadtrip' && <Sparkles className="w-3.5 h-3.5 mx-auto mb-1 text-amber-400" />}
                    {pl.id === 'intimate' && <Flame className="w-3.5 h-3.5 mx-auto mb-1 text-purple-400" />}
                    <span className="block truncate">{pl.id === 'romantic' ? 'Romance' : pl.id === 'roadtrip' ? 'Ruta' : 'Íntimo'}</span>
                  </button>
                );
              })}
            </div>

            {/* Currently Active Playlist Info */}
            <div className="text-xs bg-stone-900/50 p-2.5 rounded-xl border border-stone-800/80">
              <span className="text-emerald-400 font-semibold block">
                {customEmbedUrl ? '🎧 Playlist Personalizada de la Pareja' : activePlaylist.name}
              </span>
              <span className="text-stone-400 text-[11px] block mt-0.5">
                {customEmbedUrl ? 'Enlace configurado a mano' : `${activePlaylist.mood} — ${activePlaylist.artists}`}
              </span>
            </div>

            {/* Spotify Embed Player */}
            <div className="rounded-xl overflow-hidden bg-black/60 shadow-inner border border-stone-800">
              <iframe
                title="Reproductor Spotify Julián y Yanet"
                src={currentEmbedSrc}
                width="100%"
                height="152"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                className="w-full"
              />
            </div>

            {/* Custom Link Accordion / Config */}
            <div className="border-t border-stone-800 pt-3">
              <form onSubmit={handleSaveCustomUrl} className="space-y-2">
                <label className="block text-[11px] font-medium text-stone-300">
                  ¿Tienen una playlist o canción propia en Spotify?
                </label>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={customUrlInput}
                    onChange={(e) => setCustomUrlInput(e.target.value)}
                    placeholder="Pega el enlace o embed de Spotify..."
                    className="flex-1 bg-stone-900 text-xs text-white px-3 py-1.5 rounded-lg border border-stone-700 focus:outline-none focus:border-emerald-500 placeholder-stone-500"
                  />
                  <button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-500 text-black px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                  >
                    Guardar
                  </button>
                </div>
              </form>

              {errorMessage && (
                <div className="mt-2 p-2 rounded-lg bg-rose-950/80 border border-rose-700 text-rose-200 text-xs flex items-start gap-1.5">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {successMessage && (
                <div className="mt-2 p-2 rounded-lg bg-emerald-950/80 border border-emerald-700 text-emerald-200 text-xs flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              <p className="text-[10px] text-stone-500 mt-2 text-center">
                * Recordatorio: Tame Impala está estrictamente excluido por decreto de amor.
              </p>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
