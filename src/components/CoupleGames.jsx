import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  HelpCircle, 
  RotateCw, 
  Flame, 
  MessageCircleHeart, 
  CheckCircle2, 
  Award, 
  Heart, 
  Trophy, 
  ChevronRight, 
  Volume2, 
  VolumeX, 
  Layers, 
  RefreshCw, 
  Play, 
  Eye, 
  EyeOff 
} from 'lucide-react';
import { useProfile } from '../context/ProfileContext';
import { romanticSound } from '../utils/sound';

// --- DATA: QUIÉN ES MÁS PROBABLE QUE ---
const MOST_LIKELY_QUESTIONS = [
  {
    id: 1,
    category: 'Cotidiano & Risas',
    question: '¿Quién es más probable que se duerma en los primeros 15 minutos de una película?',
    detail: 'Apenas bajan la luz y empieza la intro de Netflix o HBO...'
  },
  {
    id: 2,
    category: 'Música & Pasión',
    question: '¿Quién es más probable que cante a los gritos una canción de Morat o Tan Biónica en el auto?',
    detail: 'A todo volumen, con el vidrio bajo y haciendo los coros con la mano en el pecho.'
  },
  {
    id: 3,
    category: 'Leyes Prohibidas',
    question: '¿Quién es más probable que intente colar en secreto un tema de Tame Impala?',
    detail: 'A pesar del veto presidencial y del tratado de paz musical del auto.'
  },
  {
    id: 4,
    category: 'Antojos & Tentaciones',
    question: '¿Quién es más probable que se coma toda la caja de chocolates de Rapa Nui o Mamuschka en una sola noche?',
    detail: '"Dejo una para mañana" y 10 minutos después no queda ni el envoltorio.'
  },
  {
    id: 5,
    category: 'Emoción de Boda',
    question: '¿Quién es más probable que empiece a llorar de pura emoción al mirarse en el altar el 8 y 9 de Octubre?',
    detail: 'Esas lágrimas que no se pueden frenar cuando el amor desborda el corazón.'
  },
  {
    id: 6,
    category: 'Aventura Bariloche',
    question: '¿Quién es más probable que se pierda buscando un sendero o mirador en el sur?',
    detail: 'El GPS dice "gire a la izquierda" pero la intuición dice "sigamos recto a ver qué hay".'
  },
  {
    id: 7,
    category: 'Complicidad',
    question: '¿Quién es más probable que diga "estoy re lleno/a" y termine pidiendo el postre más grande?',
    detail: 'Porque para el volcán de chocolate o el helado siempre hay un estómago aparte.'
  },
  {
    id: 8,
    category: 'Viajes',
    question: '¿Quién es más probable que arme la valija a las corridas 2 horas antes de salir al aeropuerto?',
    detail: 'Revisando a último momento los cargadores, el abrigo y los documentos.'
  },
  {
    id: 9,
    category: 'Amor & Piel',
    question: '¿Quién es más probable que interrumpa lo que esté haciendo solo para pedir un abrazo y 10 besos?',
    detail: 'Un asalto repentino de mimos sin previo aviso.'
  },
  {
    id: 10,
    category: 'Mañanas Juntos',
    question: '¿Quién es más probable que se levante primero un domingo para preparar el café o los mates?',
    detail: 'El aroma a tostadas y café recién hecho entrando a la habitación.'
  },
  {
    id: 11,
    category: 'Sueño & Cama',
    question: '¿Quién es más probable que ponga 5 alarmas seguidas y diga "5 minutitos más"?',
    detail: 'La frazada tiene un magnetismo inexplicable a la mañana.'
  },
  {
    id: 12,
    category: 'Sorpresas',
    question: '¿Quién es más probable que planee una salida o regalito sorpresa totalmente inesperado?',
    detail: 'Esconder una carta, un chocolate o una reserva en secreto durante semanas.'
  },
  {
    id: 13,
    category: 'Ternura',
    question: '¿Quién es más probable que gane cualquier discusión simplemente poniendo cara de perrito tierno?',
    detail: 'Es imposible seguir enojado cuando aparece esa sonrisa inocente.'
  },
  {
    id: 14,
    category: 'Eternidad',
    question: '¿Quién de los dos ama más fuerte e intensamente al otro?',
    detail: '¡Cuidado con esta respuesta! La respuesta correcta siempre es un empate celestial.'
  }
];

// --- DATA: RULETA DEL AMOR Y RETOS ---
const WHEEL_CHALLENGES = [
  {
    id: 1,
    title: 'Masaje de Cuello & Hombros',
    desc: 'Regálale a tu pareja 3 minutos de masaje suave con caricias para aflojar cualquier tensión.',
    badge: 'Relax & Mimos',
    color: '#9333ea',
    icon: '💆'
  },
  {
    id: 2,
    title: 'Beso de Película (10 seg)',
    desc: 'Un beso profundo, mirándose a los ojos primero, sin apuro, como si estuviera sonando Morat de fondo.',
    badge: 'Pasión',
    color: '#e11d48',
    icon: '💋'
  },
  {
    id: 3,
    title: 'Cantar Estribillo a Dúo',
    desc: 'Pongan su tema preferido (Morat, Tan Biónica o Airbag) y canten abrazados el estribillo con sentimiento.',
    badge: 'Música',
    color: '#d97706',
    icon: '🎤'
  },
  {
    id: 4,
    title: '3 Cosas que me Vuelven Loco/a',
    desc: 'Dile mirándolo/a fijamente a los ojos tres detalles específicos que adoras de su forma de ser o de su cuerpo.',
    badge: 'Conexión',
    color: '#059669',
    icon: '✨'
  },
  {
    id: 5,
    title: 'Mimos en el Pelo & Abrazos',
    desc: 'Acurrúquense en el sillón o cama y hazle caricias suaves en el cabello durante 5 minutos en silencio.',
    badge: 'Ternura',
    color: '#0284c7',
    icon: '🧸'
  },
  {
    id: 6,
    title: 'Susurro Prohibido al Oído',
    desc: 'Acércate despacio al oído de tu pareja y susúrrale algo travieso o íntimo que tengas ganas de hacer hoy.',
    badge: 'Fuego',
    color: '#dc2626',
    icon: '🔥'
  },
  {
    id: 7,
    title: 'Servirle algo Rico & Dulce',
    desc: 'El perdedor de la ruleta debe preparar un cafecito, mate o traerle un chocolate con una sonrisa.',
    badge: 'Atención',
    color: '#ca8a04',
    icon: '🍫'
  },
  {
    id: 8,
    title: 'Vale Libre: Deseo Concedido',
    desc: '¡Comodín dorado! Quien giró la ruleta tiene derecho a pedir un favor o capricho romántico ahora mismo.',
    badge: 'Oro Puro',
    color: '#b45309',
    icon: '👑'
  }
];

// --- DATA: TRIVIA DE NUESTRA HISTORIA ---
const TRIVIA_QUESTIONS = [
  {
    id: 1,
    question: '¿En qué lugar inolvidable Julián se arrodilló con el anillo para pedirle casamiento a Yanet?',
    options: [
      'En la costanera de Puerto Madero al atardecer',
      'En el Rosedal de Palermo, rodeados de rosas y flores',
      'En un café de especialidad tomando algo rico',
      'En la cima del cerro Campanario en Bariloche'
    ],
    correctIndex: 1,
    explanation: '¡Exacto! El Rosedal de Palermo fue el escenario de película donde Julián se puso de rodillas con el estuche del anillo para sellar la promesa para siempre.'
  },
  {
    id: 2,
    question: '¿Qué artista o banda tiene un decreto de prohibición absoluta en la música del auto?',
    options: [
      'Tan Biónica',
      'Morat',
      'Tame Impala',
      'Airbag'
    ],
    correctIndex: 2,
    explanation: '¡Prohibidísimo! Tame Impala fue vetado por consenso y ley marital innegociable. ¡Cero tolerancia psicodélica al volante!'
  },
  {
    id: 3,
    question: '¿Cuáles son las dos fechas sagradas de Octubre donde celebramos nuestra boda?',
    options: [
      '5 de Octubre (Civil) y 6 de Octubre (Fiesta)',
      '8 de Octubre (Civil) y 9 de Octubre (Fiesta)',
      '11 de Octubre (Civil) y 12 de Octubre (Fiesta)',
      '20 de Octubre (Civil) y 21 de Octubre (Fiesta)'
    ],
    correctIndex: 1,
    explanation: '¡Exacto! El 8 de Octubre estampamos la firma ante la ley y el 9 de Octubre bailamos hasta que salga el sol con todos nuestros seres queridos.'
  },
  {
    id: 4,
    question: '¿Cuál es el destino patagónico soñado donde disfrutaremos la Luna de Miel a partir del 11 de Octubre?',
    options: [
      'San Carlos de Bariloche',
      'San Martín de los Andes',
      'Villa La Angostura',
      'Ushuaia'
    ],
    correctIndex: 0,
    explanation: '¡Bariloche! 10 días de ensueño con vista al lago Nahuel Huapi, cabaña con chimenea, navegación y mucho amor.'
  },
  {
    id: 5,
    question: '¿Cuáles son las tres bandas de cabecera que no pueden faltar en nuestros viajes de ruta?',
    options: [
      'Morat, Tan Biónica y Airbag',
      'Los Palmeras, Damas Gratis y Ke Personajes',
      'Soda Stereo, Los Redondos y La Renga',
      'Coldplay, Imagine Dragons y Maroon 5'
    ],
    correctIndex: 0,
    explanation: '¡El tridente de oro! Morat para cantar con el alma, Tan Biónica para emocionarse y Airbag para romper garganta.'
  },
  {
    id: 6,
    question: 'En Bariloche, ¿cuál es la parada gastronómica más peligrosa y dulce de todas?',
    options: [
      'Comer solo ensalada en la cabaña',
      'Mamuschka y Rapa Nui para atiborrarse de Franui y chocolates',
      'Tomar té sin azúcar',
      'Comer una manzana de postre'
    ],
    correctIndex: 1,
    explanation: '¡Mamuschka y los Franui de Rapa Nui! La perdición absoluta donde el presupuesto de chocolates no tiene límites.'
  },
  {
    id: 7,
    question: '¿Cómo le dice Julián a Yanet desde el fondo de su corazón todos los días?',
    options: [
      'Señora de la casa',
      'Mi muñeca, mi amor, mi bebota',
      'Compañera de cuarto',
      'La patrona'
    ],
    correctIndex: 1,
    explanation: '¡"Mi muñeca"! El apodo más dulce y tierno que llena de luz el hogar cada mañana y cada noche.'
  },
  {
    id: 8,
    question: '¿Cuál es el secreto inquebrantable de este amor que culmina en matrimonio?',
    options: [
      'La complicidad, las risas de a dos, los abrazos sinceros y elegirnos cada día',
      'Tener siempre la razón en las discusiones',
      'No verse nunca',
      'Comer pizza congelada todos los días'
    ],
    correctIndex: 0,
    explanation: '¡Eso es todo! Complicidad única, miradas que lo dicen todo, cantar juntos y saber que en el otro encontramos nuestro hogar.'
  }
];

// --- DATA: TARJETAS DE CONEXIÓN Y PREGUNTAS PROFUNDAS ---
const CONNECTION_CARDS = [
  {
    id: 1,
    category: 'Intimidad Emocional',
    icon: '💫',
    color: 'from-purple-900/40 to-pink-900/30',
    borderColor: 'border-purple-500/30',
    question: '¿Qué es lo que hago en nuestro día a día que más te hace sentir valorado/a y amado/a?',
    hint: 'Piensa en los pequeños gestos silenciosos, no solo en los grandes momentos.'
  },
  {
    id: 2,
    category: 'Recuerdos Sagrados',
    icon: '💭',
    color: 'from-amber-900/40 to-orange-900/30',
    borderColor: 'border-amber-500/30',
    question: '¿Cuál fue el momento o la mirada exacta en que supiste que querías pasar el resto de tu vida conmigo?',
    hint: 'Revive esa sensación en el pecho y cuéntasela al detalle.'
  },
  {
    id: 3,
    category: 'Futuro Juntos',
    icon: '🏡',
    color: 'from-emerald-900/40 to-teal-900/30',
    borderColor: 'border-emerald-500/30',
    question: '¿Cómo te imaginas nuestro hogar dentro de 5 años cuando recordemos estos días de novios?',
    hint: 'Imagina la casa, las mañanas de domingo, los viajes y la paz que construiremos.'
  },
  {
    id: 4,
    category: 'Pasión & Piel',
    icon: '🔥',
    color: 'from-rose-900/40 to-red-900/30',
    borderColor: 'border-rose-500/30',
    question: '¿Qué caricia o forma de mirarte te provoca cosquillas irresistibles en todo el cuerpo?',
    hint: 'Sé 100% sincero/a... y tal vez puedas pedir una demostración ahora.'
  },
  {
    id: 5,
    category: 'Gratitud',
    icon: '🙏',
    color: 'from-blue-900/40 to-indigo-900/30',
    borderColor: 'border-blue-500/30',
    question: '¿En qué momento difícil sentiste que mi abrazo fue tu verdadero refugio seguro?',
    hint: 'Reconocer cómo nos sostenemos el uno al otro fortalece el lazo para siempre.'
  },
  {
    id: 6,
    category: 'Risas & Locuras',
    icon: '✨',
    color: 'from-yellow-900/40 to-amber-900/30',
    borderColor: 'border-yellow-500/30',
    question: '¿Cuál es la anécdota más graciosa o vergonzosa que vivimos juntos y que hoy nos hace llorar de risa?',
    hint: 'Ese momento que solo ustedes dos entienden con una sola mirada.'
  },
  {
    id: 7,
    category: 'Pacto de Amor',
    icon: '💍',
    color: 'from-rose-900/40 to-purple-900/30',
    borderColor: 'border-rose-500/30',
    question: 'Si pudieras prometerte a ti mismo/a una sola cosa para hacerme feliz toda la vida, ¿cuál sería?',
    hint: 'Una promesa de corazón para los próximos 50 años juntos.'
  },
  {
    id: 8,
    category: 'Citas & Aventura',
    icon: '🏔️',
    color: 'from-cyan-900/40 to-blue-900/30',
    borderColor: 'border-cyan-500/30',
    question: '¿Cuál es la primera cosa loca que quieres hacer juntos apenas pisemos Bariloche el 11 de Octubre?',
    hint: 'Desde saltar a la cama de la cabaña hasta devorar una fondue de chocolate al lado del fuego.'
  }
];

export default function CoupleGames() {
  const { profile, isJulian, partnerName } = useProfile();
  const [activeGameTab, setActiveGameTab] = useState('likely'); // 'likely', 'wheel', 'trivia', 'cards'
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Helper sound wrapper
  const playSound = (action) => {
    if (!soundEnabled) return;
    try {
      if (action === 'tick') romanticSound.playWheelTick();
      if (action === 'card') romanticSound.playCardFlip();
      if (action === 'fanfare') romanticSound.playFanfare();
      if (action === 'match') romanticSound.playMatchSound();
      if (action === 'wrong') romanticSound.playWrongSound();
    } catch {
      // Audio fallback silent
    }
  };

  // ==========================================
  // GAME 1: ¿QUIÉN ES MÁS PROBABLE QUE...?
  // ==========================================
  const [likelyIndex, setLikelyIndex] = useState(0);
  const [playerVote, setPlayerVote] = useState(null); // 'julian' or 'yanet'
  const [partnerVote, setPartnerVote] = useState(null); // 'julian' or 'yanet'
  const [isRevealed, setIsRevealed] = useState(false);
  const [passAndPlayMode, setPassAndPlayMode] = useState(true);
  const [matchesCount, setMatchesCount] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);

  const currentLikely = MOST_LIKELY_QUESTIONS[likelyIndex];

  const handleVotePlayer = (choice) => {
    setPlayerVote(choice);
    playSound('card');
    if (!passAndPlayMode) {
      // Instant automated partner vote with realistic 70% affinity
      const partnerChoice = Math.random() < 0.7 ? choice : (choice === 'julian' ? 'yanet' : 'julian');
      setPartnerVote(partnerChoice);
      setIsRevealed(true);
      evaluateLikelyMatch(choice, partnerChoice);
    }
  };

  const handleVotePartner = (choice) => {
    setPartnerVote(choice);
    playSound('card');
    setIsRevealed(true);
    evaluateLikelyMatch(playerVote, choice);
  };

  const evaluateLikelyMatch = (v1, v2) => {
    setAnsweredCount(prev => prev + 1);
    if (v1 === v2) {
      setMatchesCount(prev => prev + 1);
      playSound('match');
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#ec4899', '#8b5cf6', '#ffffff']
      });
    } else {
      playSound('wrong');
    }
  };

  const handleNextLikely = () => {
    setPlayerVote(null);
    setPartnerVote(null);
    setIsRevealed(false);
    playSound('card');
    setLikelyIndex((prev) => (prev + 1) % MOST_LIKELY_QUESTIONS.length);
  };

  // ==========================================
  // GAME 2: RULETA DEL AMOR
  // ==========================================
  const [isSpinning, setIsSpinning] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [completedChallenges, setCompletedChallenges] = useState(() => {
    const saved = localStorage.getItem('romapp_completed_challenges');
    return saved ? JSON.parse(saved) : [];
  });
  const spinTimeoutRef = useRef(null);

  const spinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setSelectedChallenge(null);

    // Pick random index from challenges
    const challengeCount = WHEEL_CHALLENGES.length;
    const pickedIndex = Math.floor(Math.random() * challengeCount);
    const sliceDeg = 360 / challengeCount;

    // Extra spins (5 to 8 full turns)
    const extraTurns = (5 + Math.floor(Math.random() * 4)) * 360;
    // Calculate final rotation so pointer at 0 deg (top) lands on picked slice
    // Pointer is at 270 deg or top (90 deg counter). Let's align center of slice.
    const sliceCenter = pickedIndex * sliceDeg + (sliceDeg / 2);
    // When wheel rotates by R, the top pointer (at 270 deg) points to slice at (360 - (R % 360) + 270) % 360
    const targetDeg = extraTurns + (360 - sliceCenter);

    setWheelRotation((prev) => prev + targetDeg);

    // Audio ticking intervals
    let tickCount = 0;
    const totalTicks = 24;
    const interval = setInterval(() => {
      tickCount++;
      playSound('tick');
      if (tickCount >= totalTicks) {
        clearInterval(interval);
      }
    }, 150);

    spinTimeoutRef.current = setTimeout(() => {
      setIsSpinning(false);
      const chosen = WHEEL_CHALLENGES[pickedIndex];
      setSelectedChallenge(chosen);
      playSound('fanfare');
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.55 },
        colors: ['#e5c387', '#ec4899', '#f43f5e', '#a855f7']
      });
    }, 4200);
  };

  const handleMarkChallengeCompleted = (challenge) => {
    const item = {
      id: `${challenge.id}-${Date.now()}`,
      title: challenge.title,
      badge: challenge.badge,
      completedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      by: profile.name
    };
    const updated = [item, ...completedChallenges];
    setCompletedChallenges(updated);
    localStorage.setItem('romapp_completed_challenges', JSON.stringify(updated));
    setSelectedChallenge(null);
    playSound('match');
  };

  useEffect(() => {
    return () => {
      if (spinTimeoutRef.current) clearTimeout(spinTimeoutRef.current);
    };
  }, []);

  // ==========================================
  // GAME 3: TRIVIA DE NUESTRA HISTORIA
  // ==========================================
  const [triviaIndex, setTriviaIndex] = useState(0);
  const [selectedTriviaOption, setSelectedTriviaOption] = useState(null);
  const [isTriviaAnswered, setIsTriviaAnswered] = useState(false);
  const [triviaScore, setTriviaScore] = useState(0);
  const [triviaFinished, setTriviaFinished] = useState(false);

  const currentTrivia = TRIVIA_QUESTIONS[triviaIndex];

  const handleSelectTrivia = (optIndex) => {
    if (isTriviaAnswered) return;
    setSelectedTriviaOption(optIndex);
    setIsTriviaAnswered(true);

    if (optIndex === currentTrivia.correctIndex) {
      setTriviaScore((prev) => prev + 1);
      playSound('match');
      confetti({
        particleCount: 50,
        spread: 50,
        origin: { y: 0.6 }
      });
    } else {
      playSound('wrong');
    }
  };

  const handleNextTrivia = () => {
    if (triviaIndex + 1 < TRIVIA_QUESTIONS.length) {
      setTriviaIndex((prev) => prev + 1);
      setSelectedTriviaOption(null);
      setIsTriviaAnswered(false);
      playSound('card');
    } else {
      setTriviaFinished(true);
      playSound('fanfare');
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.5 }
      });
    }
  };

  const handleRestartTrivia = () => {
    setTriviaIndex(0);
    setSelectedTriviaOption(null);
    setIsTriviaAnswered(false);
    setTriviaScore(0);
    setTriviaFinished(false);
    playSound('card');
  };

  // ==========================================
  // GAME 4: TARJETAS DE CONEXIÓN
  // ==========================================
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedCardCategory, setSelectedCardCategory] = useState('all');

  const filteredCards = selectedCardCategory === 'all' 
    ? CONNECTION_CARDS 
    : CONNECTION_CARDS.filter(c => c.category === selectedCardCategory);

  const currentCard = filteredCards[cardIndex % filteredCards.length] || CONNECTION_CARDS[0];

  const handleFlipCard = () => {
    setIsFlipped(!isFlipped);
    playSound('card');
  };

  const handleNextCard = () => {
    setIsFlipped(false);
    playSound('card');
    setCardIndex((prev) => (prev + 1) % filteredCards.length);
  };

  const handleShuffleCard = () => {
    setIsFlipped(false);
    playSound('card');
    const randomIdx = Math.floor(Math.random() * filteredCards.length);
    setCardIndex(randomIdx);
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto py-2">
      
      {/* Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#1b0d23] via-[#120a16] to-[#08060a] border border-amber-300/20 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sala de Juegos & Complicidad en Pareja</span>
            </div>
            <h1 className="font-serif-romantic text-3xl sm:text-4xl md:text-5xl font-bold text-stone-100 tracking-tight">
              Jugar, Reír & Conectar
            </h1>
            <p className="text-stone-300 text-xs sm:text-sm mt-2 max-w-xl font-light leading-relaxed">
              Diseñado exclusivamente para <strong className="text-amber-200 font-medium">Julián & Yanet</strong>: 
              preguntas secretas, ruleta de retos románticos, trivia de su historia de amor y cartas de intimidad para jugar hoy mismo.
            </p>
          </div>

          {/* Sound Toggle & Player Indicator */}
          <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 shrink-0">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs text-stone-300 transition-colors cursor-pointer"
              title="Activar/desactivar efectos de sonido"
            >
              {soundEnabled ? (
                <>
                  <Volume2 className="w-4 h-4 text-amber-300" />
                  <span>Sonido Activado</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4 text-stone-500" />
                  <span>Sonido Silenciado</span>
                </>
              )}
            </button>

            <div className="flex items-center gap-2 text-xs text-stone-400">
              <span>Jugando como:</span>
              <span className="font-semibold text-amber-200 bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-500/30">
                {profile.name}
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mt-8 pt-6 border-t border-white/[0.08]">
          <button
            onClick={() => { setActiveGameTab('likely'); playSound('card'); }}
            className={`flex items-center justify-center gap-2 p-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeGameTab === 'likely'
                ? 'bg-amber-400 text-stone-950 shadow-lg shadow-amber-400/20 scale-[1.02]'
                : 'bg-white/[0.03] text-stone-300 hover:bg-white/[0.08] hover:text-white border border-white/[0.06]'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>¿Quién es Más...?</span>
          </button>

          <button
            onClick={() => { setActiveGameTab('wheel'); playSound('card'); }}
            className={`flex items-center justify-center gap-2 p-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeGameTab === 'wheel'
                ? 'bg-amber-400 text-stone-950 shadow-lg shadow-amber-400/20 scale-[1.02]'
                : 'bg-white/[0.03] text-stone-300 hover:bg-white/[0.08] hover:text-white border border-white/[0.06]'
            }`}
          >
            <RotateCw className="w-4 h-4" />
            <span>Ruleta del Amor</span>
          </button>

          <button
            onClick={() => { setActiveGameTab('trivia'); playSound('card'); }}
            className={`flex items-center justify-center gap-2 p-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeGameTab === 'trivia'
                ? 'bg-amber-400 text-stone-950 shadow-lg shadow-amber-400/20 scale-[1.02]'
                : 'bg-white/[0.03] text-stone-300 hover:bg-white/[0.08] hover:text-white border border-white/[0.06]'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Trivia Histórica</span>
          </button>

          <button
            onClick={() => { setActiveGameTab('cards'); playSound('card'); }}
            className={`flex items-center justify-center gap-2 p-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeGameTab === 'cards'
                ? 'bg-amber-400 text-stone-950 shadow-lg shadow-amber-400/20 scale-[1.02]'
                : 'bg-white/[0.03] text-stone-300 hover:bg-white/[0.08] hover:text-white border border-white/[0.06]'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Cartas de Conexión</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 1. ¿QUIÉN ES MÁS PROBABLE QUE...?                        */}
      {/* ======================================================== */}
      {activeGameTab === 'likely' && (
        <section className="space-y-6">
          <div className="luxury-card rounded-3xl p-6 sm:p-8 relative overflow-hidden border border-white/[0.08]">
            
            {/* Top Bar Status */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300 bg-amber-950/70 border border-amber-600/30 px-3 py-1 rounded-full">
                  {currentLikely.category}
                </span>
                <span className="text-xs text-stone-400">
                  Pregunta {likelyIndex + 1} de {MOST_LIKELY_QUESTIONS.length}
                </span>
              </div>

              {/* Pass and Play Toggle & Match Counter */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setPassAndPlayMode(!passAndPlayMode)}
                  className="text-xs px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10 text-stone-300 hover:bg-white/[0.08] transition-colors cursor-pointer"
                  title="Modo pasar el celular para votar ambos en secreto"
                >
                  {passAndPlayMode ? '📱 Modo Pasar Celular' : '⚡ Modo Voto Rápido'}
                </button>
                <div className="flex items-center gap-1.5 text-xs text-amber-200 bg-amber-500/10 border border-amber-400/20 px-3 py-1 rounded-full font-medium">
                  <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                  <span>Coincidencias: {matchesCount} / {answeredCount}</span>
                </div>
              </div>
            </div>

            {/* Question Text */}
            <div className="text-center py-6 sm:py-8 max-w-2xl mx-auto space-y-2">
              <h3 className="font-serif-romantic text-2xl sm:text-3xl md:text-4xl font-bold text-stone-100 leading-snug">
                {currentLikely.question}
              </h3>
              <p className="text-stone-400 text-xs sm:text-sm font-light italic">
                "{currentLikely.detail}"
              </p>
            </div>

            {/* Voting Area */}
            {!isRevealed ? (
              <div>
                {/* STEP 1: Current Player Votes */}
                {!playerVote ? (
                  <div className="space-y-4">
                    <p className="text-center text-xs text-stone-300 font-medium">
                      👉 <strong>{profile.name}</strong>, ¿a quién eliges? Vota primero en secreto:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                      
                      {/* Vote Julián */}
                      <div
                        onClick={() => handleVotePlayer('julian')}
                        className="luxury-card hover:border-amber-400/50 p-4 rounded-2xl cursor-pointer group transition-all duration-300 hover:scale-[1.02] flex items-center gap-4 bg-stone-900/60"
                      >
                        <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-amber-300/30 group-hover:border-amber-400 shrink-0 shadow-md">
                          <img 
                            src="/photos/cena-romantica.jpg" 
                            alt="Julián" 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                          />
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">Opción A</span>
                          <h4 className="font-serif-romantic text-xl font-bold text-stone-100 group-hover:text-amber-200">
                            Julián
                          </h4>
                          <p className="text-xs text-stone-400 font-light mt-0.5">
                            "Mi rey, el romántico empedernido"
                          </p>
                        </div>
                      </div>

                      {/* Vote Yanet */}
                      <div
                        onClick={() => handleVotePlayer('yanet')}
                        className="luxury-card hover:border-rose-400/50 p-4 rounded-2xl cursor-pointer group transition-all duration-300 hover:scale-[1.02] flex items-center gap-4 bg-stone-900/60"
                      >
                        <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-rose-300/30 group-hover:border-rose-400 shrink-0 shadow-md">
                          <img 
                            src="/photos/parque-rosas.jpg" 
                            alt="Yanet" 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                          />
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-rose-400 tracking-wider">Opción B</span>
                          <h4 className="font-serif-romantic text-xl font-bold text-stone-100 group-hover:text-rose-200">
                            Yanet
                          </h4>
                          <p className="text-xs text-stone-400 font-light mt-0.5">
                            "Mi muñeca, la reina de mi vida"
                          </p>
                        </div>
                      </div>

                    </div>
                  </div>
                ) : (
                  /* STEP 2: Pass and play: Partner Votes */
                  <div className="space-y-4 animate-fadeIn max-w-xl mx-auto text-center py-4">
                    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                      <span className="text-2xl">🤫</span>
                      <h4 className="font-serif-romantic text-lg font-bold text-amber-200">
                        ¡Voto de {profile.name} guardado en secreto!
                      </h4>
                      <p className="text-xs text-stone-300 font-light">
                        Pásale el teléfono a <strong>{partnerName}</strong> para que emita su voto sin mirar.
                      </p>
                    </div>

                    <p className="text-xs text-stone-400 font-medium">
                      👉 <strong>{partnerName}</strong>, ¿a quién eliges tú?
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => handleVotePartner('julian')}
                        className="p-4 rounded-2xl bg-stone-900/80 hover:bg-stone-800 border border-white/10 hover:border-amber-400 text-center transition-all cursor-pointer"
                      >
                        <span className="font-serif-romantic text-base font-bold text-stone-100 block">Julián</span>
                        <span className="text-[11px] text-stone-400 block mt-1">Elegir a Julián</span>
                      </button>

                      <button
                        onClick={() => handleVotePartner('yanet')}
                        className="p-4 rounded-2xl bg-stone-900/80 hover:bg-stone-800 border border-white/10 hover:border-rose-400 text-center transition-all cursor-pointer"
                      >
                        <span className="font-serif-romantic text-base font-bold text-stone-100 block">Yanet</span>
                        <span className="text-[11px] text-stone-400 block mt-1">Elegir a Yanet</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* RESULT REVEAL */
              <div className="space-y-6 animate-scaleIn max-w-2xl mx-auto py-2">
                <div className={`p-6 rounded-3xl border text-center space-y-3 ${
                  playerVote === partnerVote
                    ? 'bg-gradient-to-b from-amber-950/60 to-emerald-950/40 border-amber-400/40'
                    : 'bg-stone-900/70 border-white/10'
                }`}>
                  {playerVote === partnerVote ? (
                    <>
                      <div className="w-14 h-14 rounded-full bg-amber-400/20 border border-amber-400 flex items-center justify-center text-amber-300 mx-auto text-2xl animate-bounce">
                        💖
                      </div>
                      <h4 className="font-serif-romantic text-2xl font-bold text-amber-200">
                        ¡COINCIDENCIA TOTAL!
                      </h4>
                      <p className="text-xs sm:text-sm text-stone-200 font-light">
                        Los dos pensaron exactamente en <strong className="text-amber-300 capitalize font-semibold">{playerVote}</strong>. ¡Se conocen de memoria!
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="w-14 h-14 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-300 mx-auto text-2xl">
                        😜
                      </div>
                      <h4 className="font-serif-romantic text-2xl font-bold text-stone-100">
                        ¡Voto Dividido! Debate de Pareja
                      </h4>
                      <p className="text-xs sm:text-sm text-stone-300 font-light">
                        {profile.name} votó por <strong className="text-amber-200 capitalize">{playerVote}</strong>, 
                        mientras que {partnerName} votó por <strong className="text-rose-200 capitalize">{partnerVote}</strong>.
                        ¡Tienen que defender sus votos con un beso!
                      </p>
                    </>
                  )}

                  {/* Summary Comparison Tiles */}
                  <div className="grid grid-cols-2 gap-3 pt-3 max-w-sm mx-auto text-xs">
                    <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                      <span className="text-stone-400 block text-[11px]">{profile.name} eligió:</span>
                      <span className="font-bold text-stone-100 capitalize text-sm">{playerVote}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                      <span className="text-stone-400 block text-[11px]">{partnerName} eligió:</span>
                      <span className="font-bold text-stone-100 capitalize text-sm">{partnerVote}</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={handleNextLikely}
                    className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-sm shadow-lg shadow-amber-400/20 transition-all cursor-pointer hover:scale-105"
                  >
                    <span>Siguiente Pregunta</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

          </div>
        </section>
      )}

      {/* ======================================================== */}
      {/* 2. LA RULETA DEL AMOR Y CITAS SORPRESA                   */}
      {/* ======================================================== */}
      {activeGameTab === 'wheel' && (
        <section className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Wheel Canvas / SVG */}
            <div className="lg:col-span-7 luxury-card rounded-3xl p-6 sm:p-8 flex flex-col items-center border border-white/[0.08]">
              <div className="text-center mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300 bg-amber-950/60 border border-amber-600/30 px-3 py-1 rounded-full">
                  Destino & Pasión
                </span>
                <h3 className="font-serif-romantic text-2xl sm:text-3xl font-bold text-stone-100 mt-2">
                  La Ruleta de Citas & Retos
                </h3>
                <p className="text-xs text-stone-400 font-light mt-1">
                  Giren la ruleta y cumplan el reto romántico que el destino elija para ustedes hoy.
                </p>
              </div>

              {/* Wheel Container */}
              <div className="relative w-72 h-72 sm:w-80 sm:h-80 my-4 flex items-center justify-center">
                
                {/* Pointer at the top */}
                <div className="absolute -top-3 z-30 drop-shadow-lg flex flex-col items-center">
                  <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[22px] border-t-amber-400" />
                </div>

                {/* Spinning Wheel */}
                <div 
                  className="w-full h-full rounded-full border-4 border-amber-300/40 shadow-2xl relative overflow-hidden"
                  style={{
                    transform: `rotate(${wheelRotation}deg)`,
                    transition: isSpinning ? 'transform 4.2s cubic-bezier(0.15, 0.85, 0.25, 1)' : 'none'
                  }}
                >
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    {WHEEL_CHALLENGES.map((challenge, idx) => {
                      const total = WHEEL_CHALLENGES.length;
                      const sliceAngle = 360 / total;
                      const startAngle = idx * sliceAngle;
                      const endAngle = startAngle + sliceAngle;

                      // Convert polar to cartesian
                      const radStart = (startAngle * Math.PI) / 180;
                      const radEnd = (endAngle * Math.PI) / 180;

                      const x1 = 50 + 50 * Math.cos(radStart);
                      const y1 = 50 + 50 * Math.sin(radStart);
                      const x2 = 50 + 50 * Math.cos(radEnd);
                      const y2 = 50 + 50 * Math.sin(radEnd);

                      const d = `M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`;

                      // Mid text angle
                      const midRad = ((startAngle + sliceAngle / 2) * Math.PI) / 180;
                      const tx = 50 + 32 * Math.cos(midRad);
                      const ty = 50 + 32 * Math.sin(midRad);

                      return (
                        <g key={challenge.id}>
                          <path
                            d={d}
                            fill={challenge.color}
                            stroke="#1c1917"
                            strokeWidth="0.8"
                            opacity={0.9}
                          />
                          <text
                            x={tx}
                            y={ty}
                            fill="#ffffff"
                            fontSize="5"
                            fontWeight="bold"
                            textAnchor="middle"
                            dominantBaseline="central"
                            transform={`rotate(${startAngle + sliceAngle / 2 + 90}, ${tx}, ${ty})`}
                          >
                            {challenge.icon}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>

                {/* Center Hub */}
                <div 
                  onClick={spinWheel}
                  className="absolute w-20 h-20 rounded-full bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 border-4 border-stone-900 shadow-xl flex flex-col items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-transform z-20"
                >
                  <Play className={`w-6 h-6 text-stone-950 fill-stone-950 ${isSpinning ? 'opacity-30' : 'animate-pulse'}`} />
                  <span className="text-[9px] font-extrabold uppercase tracking-wider text-stone-950 mt-0.5">
                    GIRAR
                  </span>
                </div>

              </div>

              {/* Action Button */}
              <button
                onClick={spinWheel}
                disabled={isSpinning}
                className="mt-4 px-8 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-stone-950 font-bold text-sm shadow-lg shadow-amber-400/20 transition-all cursor-pointer hover:scale-105"
              >
                {isSpinning ? 'Girando la suerte del amor...' : '¡Girar la Ruleta Ahora!'}
              </button>

            </div>

            {/* Selected Challenge or History */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* Selected Result Card */}
              {selectedChallenge ? (
                <div className="luxury-card rounded-3xl p-6 border-2 border-amber-400/50 bg-gradient-to-b from-amber-950/40 to-stone-950 animate-scaleIn space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-400 text-stone-950">
                      {selectedChallenge.badge}
                    </span>
                    <span className="text-3xl">{selectedChallenge.icon}</span>
                  </div>

                  <div>
                    <h4 className="font-serif-romantic text-2xl font-bold text-amber-200">
                      {selectedChallenge.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-stone-200 font-light mt-2 leading-relaxed">
                      {selectedChallenge.desc}
                    </p>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => handleMarkChallengeCompleted(selectedChallenge)}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>¡Reto Cumplido! Guardar</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="luxury-card rounded-3xl p-6 border border-white/[0.08] text-center space-y-2 text-stone-400">
                  <RotateCw className="w-8 h-8 text-amber-300/40 mx-auto" />
                  <h4 className="font-serif-romantic text-lg font-bold text-stone-200">
                    ¿Qué reto les tocará?
                  </h4>
                  <p className="text-xs font-light">
                    Presionen "Girar" en el centro para descubrir el desafío romántico que deben cumplir de inmediato.
                  </p>
                </div>
              )}

              {/* Completed Challenges Log */}
              <div className="luxury-card rounded-3xl p-5 border border-white/[0.08] space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                  <h5 className="font-serif-romantic text-sm font-bold text-stone-200 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-300" />
                    <span>Retos Cumplidos Hoy ({completedChallenges.length})</span>
                  </h5>
                  {completedChallenges.length > 0 && (
                    <button
                      onClick={() => {
                        setCompletedChallenges([]);
                        localStorage.removeItem('romapp_completed_challenges');
                      }}
                      className="text-[10px] text-stone-500 hover:text-stone-300 cursor-pointer"
                    >
                      Reiniciar
                    </button>
                  )}
                </div>

                {completedChallenges.length === 0 ? (
                  <p className="text-xs text-stone-500 font-light italic text-center py-4">
                    Todavía no han cumplido retos hoy. ¡Hagan girar la ruleta!
                  </p>
                ) : (
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {completedChallenges.map((item) => (
                      <div 
                        key={item.id}
                        className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-between text-xs"
                      >
                        <div>
                          <span className="font-semibold text-stone-200 block">{item.title}</span>
                          <span className="text-[10px] text-stone-400 font-light">
                            Cumplido por {item.by} • {item.completedAt}
                          </span>
                        </div>
                        <span className="text-[10px] text-amber-300 font-medium px-2 py-0.5 rounded-full bg-amber-400/10">
                          {item.badge}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

          </div>
        </section>
      )}

      {/* ======================================================== */}
      {/* 3. TRIVIA DE NUESTRA HISTORIA                            */}
      {/* ======================================================== */}
      {activeGameTab === 'trivia' && (
        <section className="space-y-6">
          <div className="luxury-card rounded-3xl p-6 sm:p-8 relative overflow-hidden border border-white/[0.08] max-w-3xl mx-auto">
            
            {!triviaFinished ? (
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-300 bg-amber-950/60 border border-amber-600/30 px-3 py-1 rounded-full">
                      Pregunta {triviaIndex + 1} de {TRIVIA_QUESTIONS.length}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-amber-200 bg-amber-500/10 border border-amber-400/20 px-3 py-1 rounded-full font-medium">
                    <Trophy className="w-3.5 h-3.5 text-amber-400" />
                    <span>Puntaje: {triviaScore} pts</span>
                  </div>
                </div>

                {/* Question */}
                <div className="py-2 space-y-2">
                  <h3 className="font-serif-romantic text-xl sm:text-2xl md:text-3xl font-bold text-stone-100 leading-snug">
                    {currentTrivia.question}
                  </h3>
                </div>

                {/* Options List */}
                <div className="space-y-3">
                  {currentTrivia.options.map((opt, idx) => {
                    let optionStyle = 'bg-stone-900/60 border-white/[0.08] hover:border-amber-400/40 text-stone-200';

                    if (isTriviaAnswered) {
                      if (idx === currentTrivia.correctIndex) {
                        optionStyle = 'bg-emerald-950/60 border-emerald-400 text-emerald-200 font-semibold shadow-md';
                      } else if (idx === selectedTriviaOption) {
                        optionStyle = 'bg-rose-950/60 border-rose-500 text-rose-200 font-semibold';
                      } else {
                        optionStyle = 'bg-stone-900/30 border-white/[0.04] text-stone-500 opacity-60';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectTrivia(idx)}
                        disabled={isTriviaAnswered}
                        className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${optionStyle}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 rounded-full bg-white/[0.08] flex items-center justify-center text-xs font-bold shrink-0">
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span className="text-xs sm:text-sm font-medium leading-relaxed">
                            {opt}
                          </span>
                        </div>
                        {isTriviaAnswered && idx === currentTrivia.correctIndex && (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation Feedback */}
                {isTriviaAnswered && (
                  <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/30 text-xs text-stone-200 space-y-1 animate-fadeIn">
                    <span className="font-bold text-amber-300 block">💡 El detalle de nuestra historia:</span>
                    <p className="font-light leading-relaxed">
                      {currentTrivia.explanation}
                    </p>
                  </div>
                )}

                {/* Next button */}
                {isTriviaAnswered && (
                  <div className="flex justify-end pt-2">
                    <button
                      onClick={handleNextTrivia}
                      className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-400/20 transition-all cursor-pointer hover:scale-105"
                    >
                      <span>{triviaIndex + 1 === TRIVIA_QUESTIONS.length ? 'Ver Resultados Finales' : 'Siguiente Pregunta'}</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Trivia Final Score Result */
              <div className="py-8 text-center space-y-6 animate-scaleIn">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-300 to-amber-600 flex items-center justify-center text-stone-950 mx-auto text-3xl shadow-xl">
                  🏆
                </div>

                <div className="space-y-2">
                  <span className="text-xs uppercase tracking-widest text-amber-300 font-bold">
                    Resultado de la Trivia
                  </span>
                  <h3 className="font-serif-romantic text-3xl sm:text-4xl font-bold text-stone-100">
                    {triviaScore === TRIVIA_QUESTIONS.length
                      ? '¡Almas Gemelas Indiscutibles! 👑💍'
                      : triviaScore >= 6
                      ? '¡Amor a Prueba de Balas! 💕'
                      : '¡A repasar la historia con besos! 🍫'}
                  </h3>
                  <p className="text-stone-300 text-sm max-w-md mx-auto font-light">
                    Acertaron <strong>{triviaScore}</strong> de {TRIVIA_QUESTIONS.length} preguntas de su historia de amor.
                  </p>
                </div>

                <div className="flex justify-center gap-3 pt-2">
                  <button
                    onClick={handleRestartTrivia}
                    className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer hover:scale-105 shadow-md"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Jugar de Nuevo</span>
                  </button>
                </div>
              </div>
            )}

          </div>
        </section>
      )}

      {/* ======================================================== */}
      {/* 4. TARJETAS DE CONEXIÓN Y PREGUNTAS PROFUNDAS            */}
      {/* ======================================================== */}
      {activeGameTab === 'cards' && (
        <section className="space-y-6">
          <div className="luxury-card rounded-3xl p-6 sm:p-8 relative overflow-hidden border border-white/[0.08] max-w-2xl mx-auto">
            
            {/* Filter Categories Chips */}
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] flex-wrap gap-2">
              <span className="text-xs font-serif-romantic text-stone-300 font-semibold">
                Baraja de Intimidad & Reflexión
              </span>
              <span className="text-xs text-amber-300/80 font-medium">
                Tarjeta {cardIndex + 1} de {filteredCards.length}
              </span>
            </div>

            {/* 3D Flip Card Container */}
            <div className="py-6 flex justify-center perspective-1000">
              <div
                onClick={handleFlipCard}
                className={`relative w-full max-w-md aspect-[4/3] sm:aspect-[16/10] rounded-3xl p-6 sm:p-8 cursor-pointer select-none transition-transform duration-700 preserve-3d shadow-2xl flex flex-col justify-between ${
                  isFlipped ? 'rotate-y-180 bg-gradient-to-br from-stone-900 via-stone-950 to-black border-2 border-amber-400/50' : 'bg-gradient-to-br from-[#1c0f24] via-[#120a16] to-[#0a070e] border border-amber-300/30 hover:border-amber-400/60'
                }`}
              >
                {!isFlipped ? (
                  /* FRONT OF CARD */
                  <div className="h-full flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-300 bg-amber-950/70 border border-amber-600/30 px-3 py-1 rounded-full">
                        {currentCard.category}
                      </span>
                      <span className="text-2xl">{currentCard.icon}</span>
                    </div>

                    <div className="py-4">
                      <h4 className="font-serif-romantic text-xl sm:text-2xl font-bold text-stone-100 leading-snug">
                        {currentCard.question}
                      </h4>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-white/[0.06] text-xs text-stone-400">
                      <span className="font-serif-romantic italic text-amber-200/70">Julián & Yanet</span>
                      <span className="flex items-center gap-1 text-[11px] text-amber-300">
                        <Eye className="w-3.5 h-3.5" />
                        <span>Toca para ver consejo</span>
                      </span>
                    </div>
                  </div>
                ) : (
                  /* BACK OF CARD (REVEALED HINT/PROMPT) */
                  <div className="h-full flex flex-col justify-between rotate-y-180">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-rose-300 bg-rose-950/70 border border-rose-600/30 px-3 py-1 rounded-full">
                        Inspiración para Compartir
                      </span>
                      <Heart className="w-5 h-5 text-rose-400 fill-rose-400" />
                    </div>

                    <div className="py-4 space-y-2">
                      <span className="text-xs uppercase tracking-wider text-amber-300 font-semibold block">
                        Para conversar ahora:
                      </span>
                      <p className="font-serif-romantic text-base sm:text-lg text-stone-200 font-light leading-relaxed italic">
                        "{currentCard.hint}"
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-white/[0.06] text-xs text-stone-400">
                      <span>Hablen con el corazón en la mano</span>
                      <span className="flex items-center gap-1 text-[11px] text-stone-300">
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>Toca para voltear</span>
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Deck Controls */}
            <div className="flex items-center justify-center gap-4 pt-2">
              <button
                onClick={handleShuffleCard}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs text-stone-300 font-medium transition-all cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Aleatorio</span>
              </button>

              <button
                onClick={handleNextCard}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-400/20 transition-all cursor-pointer hover:scale-105"
              >
                <span>Siguiente Carta</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </section>
      )}

    </div>
  );
}
