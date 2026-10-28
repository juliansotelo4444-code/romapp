import React from 'react';

export default function PositionSvg({ type }) {
  const baseClass = "w-full h-40 flex items-center justify-center p-2 rounded-2xl bg-purple-950/40 border border-purple-800/40";

  switch (type) {
    case 'amazona':
      return (
        <div className={baseClass}>
          <svg viewBox="0 0 200 120" className="w-full h-full text-purple-400 stroke-current fill-none stroke-2">
            {/* Base bed */}
            <line x1="20" y1="105" x2="180" y2="105" strokeWidth="3" className="text-purple-700/60" />
            {/* Man lying down */}
            <circle cx="50" cy="88" r="8" fill="currentColor" fillOpacity="0.3" />
            <path d="M50 96 C 65 98, 90 98, 110 98" strokeWidth="3" />
            <path d="M110 98 L 135 85 L 155 102" strokeWidth="3" />
            {/* Woman sitting on top facing him */}
            <circle cx="105" cy="40" r="8" fill="#fbbf24" stroke="#fbbf24" fillOpacity="0.3" />
            <path d="M105 48 C 104 60, 108 72, 110 85" strokeWidth="3" stroke="#fbbf24" />
            {/* Woman legs straddling */}
            <path d="M110 85 L 95 98 L 85 96" strokeWidth="3" stroke="#fbbf24" />
            <path d="M110 85 L 125 98 L 135 96" strokeWidth="3" stroke="#fbbf24" />
            {/* Motion / rhythm arcs */}
            <path d="M125 55 C 130 65, 128 75, 122 80" strokeDasharray="3,3" stroke="#f43f5e" />
          </svg>
        </div>
      );

    case 'loto':
      return (
        <div className={baseClass}>
          <svg viewBox="0 0 200 120" className="w-full h-full text-purple-400 stroke-current fill-none stroke-2">
            <line x1="30" y1="105" x2="170" y2="105" strokeWidth="3" className="text-purple-700/60" />
            {/* Man sitting upright */}
            <circle cx="85" cy="42" r="8" fill="currentColor" fillOpacity="0.3" />
            <path d="M85 50 L 85 85 L 60 102" strokeWidth="3" />
            <path d="M85 85 L 110 102" strokeWidth="3" />
            {/* Woman sitting on his lap facing him */}
            <circle cx="115" cy="44" r="8" stroke="#fbbf24" fill="#fbbf24" fillOpacity="0.3" />
            <path d="M115 52 L 115 82 L 85 82" strokeWidth="3" stroke="#fbbf24" />
            <path d="M115 82 L 135 100" strokeWidth="3" stroke="#fbbf24" />
            {/* Heart symbol of tantric union */}
            <path d="M100 25 C 95 18, 90 22, 100 32 C 110 22, 105 18, 100 25 Z" fill="#f43f5e" stroke="#f43f5e" />
          </svg>
        </div>
      );

    case 'cucharita':
      return (
        <div className={baseClass}>
          <svg viewBox="0 0 200 120" className="w-full h-full text-purple-400 stroke-current fill-none stroke-2">
            <line x1="20" y1="105" x2="180" y2="105" strokeWidth="3" className="text-purple-700/60" />
            {/* Man on side behind */}
            <circle cx="60" cy="70" r="8" fill="currentColor" fillOpacity="0.3" />
            <path d="M60 78 C 75 80, 85 85, 100 88 L 130 92 L 155 102" strokeWidth="3" />
            {/* Woman on side in front nested */}
            <circle cx="85" cy="70" r="8" stroke="#fbbf24" fill="#fbbf24" fillOpacity="0.3" />
            <path d="M85 78 C 100 80, 110 85, 125 88 L 145 92 L 165 102" strokeWidth="3" stroke="#fbbf24" />
            {/* Arm enveloping */}
            <path d="M68 82 C 85 80, 100 84, 115 84" strokeWidth="2" strokeDasharray="2,2" stroke="#f43f5e" />
          </svg>
        </div>
      );

    case 'jinete':
      return (
        <div className={baseClass}>
          <svg viewBox="0 0 200 120" className="w-full h-full text-purple-400 stroke-current fill-none stroke-2">
            <line x1="20" y1="105" x2="180" y2="105" strokeWidth="3" className="text-purple-700/60" />
            {/* Man lying down */}
            <circle cx="50" cy="88" r="8" fill="currentColor" fillOpacity="0.3" />
            <path d="M50 96 C 75 96, 95 96, 120 96 L 150 98" strokeWidth="3" />
            {/* Woman sitting facing away */}
            <circle cx="110" cy="40" r="8" stroke="#fbbf24" fill="#fbbf24" fillOpacity="0.3" />
            <path d="M110 48 L 105 82 L 130 96" strokeWidth="3" stroke="#fbbf24" />
            <path d="M105 82 L 85 96" strokeWidth="3" stroke="#fbbf24" />
            {/* Hands supported on his shins */}
            <path d="M110 60 L 135 78" strokeWidth="2" stroke="#fbbf24" />
          </svg>
        </div>
      );

    case 'puente':
      return (
        <div className={baseClass}>
          <svg viewBox="0 0 200 120" className="w-full h-full text-purple-400 stroke-current fill-none stroke-2">
            <line x1="20" y1="105" x2="180" y2="105" strokeWidth="3" className="text-purple-700/60" />
            {/* Pillows under pelvis */}
            <rect x="85" y="88" width="40" height="15" rx="5" fill="#a855f7" fillOpacity="0.3" stroke="#a855f7" />
            {/* Woman arched over pillows */}
            <circle cx="50" cy="85" r="8" stroke="#fbbf24" fill="#fbbf24" fillOpacity="0.3" />
            <path d="M50 93 C 70 93, 85 80, 105 80 L 125 98 L 140 102" strokeWidth="3" stroke="#fbbf24" />
            {/* Man kneeling entering */}
            <circle cx="150" cy="50" r="8" fill="currentColor" fillOpacity="0.3" />
            <path d="M150 58 L 135 80 L 120 80" strokeWidth="3" />
            <path d="M135 80 L 155 102" strokeWidth="3" />
          </svg>
        </div>
      );

    case 'pared':
      return (
        <div className={baseClass}>
          <svg viewBox="0 0 200 120" className="w-full h-full text-purple-400 stroke-current fill-none stroke-2">
            {/* Wall on the left */}
            <line x1="40" y1="10" x2="40" y2="110" strokeWidth="4" className="text-purple-600" />
            {/* Woman against wall */}
            <circle cx="55" cy="30" r="8" stroke="#fbbf24" fill="#fbbf24" fillOpacity="0.3" />
            <path d="M55 38 L 52 70 L 70 65 L 85 80" strokeWidth="3" stroke="#fbbf24" />
            {/* Man standing lifting */}
            <circle cx="85" cy="30" r="8" fill="currentColor" fillOpacity="0.3" />
            <path d="M85 38 L 82 72 L 80 105" strokeWidth="3" />
            <path d="M82 55 L 60 65" strokeWidth="2" stroke="#f43f5e" />
          </svg>
        </div>
      );

    case 'tijera':
      return (
        <div className={baseClass}>
          <svg viewBox="0 0 200 120" className="w-full h-full text-purple-400 stroke-current fill-none stroke-2">
            <line x1="20" y1="105" x2="180" y2="105" strokeWidth="3" className="text-purple-700/60" />
            {/* Oblique X crossing legs */}
            <circle cx="50" cy="50" r="8" fill="currentColor" fillOpacity="0.3" />
            <path d="M50 58 L 95 85 L 140 102" strokeWidth="3" />
            <circle cx="75" cy="50" r="8" stroke="#fbbf24" fill="#fbbf24" fillOpacity="0.3" />
            <path d="M75 58 L 95 85 L 125 70" strokeWidth="3" stroke="#fbbf24" />
            {/* Pelvic friction spark */}
            <circle cx="95" cy="85" r="4" fill="#f43f5e" />
          </svg>
        </div>
      );

    case 'cascada':
      return (
        <div className={baseClass}>
          <svg viewBox="0 0 200 120" className="w-full h-full text-purple-400 stroke-current fill-none stroke-2">
            {/* Bed edge cut */}
            <rect x="20" y="70" width="85" height="35" rx="3" fill="#3b0764" fillOpacity="0.4" stroke="#7e22ce" />
            {/* Woman on bed edge */}
            <circle cx="45" cy="50" r="8" stroke="#fbbf24" fill="#fbbf24" fillOpacity="0.3" />
            <path d="M45 58 L 75 70 L 105 70 L 115 90" strokeWidth="3" stroke="#fbbf24" />
            {/* Man standing at edge */}
            <circle cx="135" cy="40" r="8" fill="currentColor" fillOpacity="0.3" />
            <path d="M135 48 L 125 70 L 128 105" strokeWidth="3" />
          </svg>
        </div>
      );

    default:
      return null;
  }
}
