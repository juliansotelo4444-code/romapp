import confetti from 'canvas-confetti';

export const triggerLoveConfetti = () => {
  const count = 120;
  const defaults = {
    origin: { y: 0.7 },
    zIndex: 9999
  };

  function fire(particleRatio, opts) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio)
    });
  }

  fire(0.25, {
    spread: 30,
    startVelocity: 55,
    colors: ['#f43f5e', '#fb7185', '#fda4af', '#f59e0b']
  });
  fire(0.2, {
    spread: 60,
    colors: ['#e11d48', '#be185d', '#d946ef', '#fcd34d']
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
    colors: ['#ec4899', '#f43f5e', '#a855f7']
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
    colors: ['#fbbf24', '#f59e0b', '#d97706']
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
    colors: ['#e11d48', '#be185d', '#ffffff']
  });
};

export const triggerGoldConfetti = () => {
  confetti({
    particleCount: 150,
    spread: 80,
    origin: { y: 0.6 },
    colors: ['#fbbf24', '#f59e0b', '#d97706', '#fef08a'],
    zIndex: 9999
  });
};
