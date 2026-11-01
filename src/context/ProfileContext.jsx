import React, { createContext, useContext, useState, useEffect } from 'react';

const ProfileContext = createContext(null);

export const PROFILES = {
  julian: {
    id: 'julian',
    name: 'Julián',
    role: 'El Novio / Esposo',
    gender: 'he',
    emoji: '👑',
    avatarBg: 'from-amber-500 to-purple-600',
    accentColor: 'amber',
    partnerName: 'Yanet',
    partnerNickname: 'mi muñeca',
    greetings: [
      '¡Hola, mi amor! Todo listo para consentir a tu reina.',
      'Bienvenido, mi rey. Hoy es un gran día para amar.',
      'Hola Julián, la historia más linda la estás viviendo vos.',
      'Bienvenido, campeón. Tu compañera de vida te ama infinito.'
    ],
    signature: 'Siempre tuyo, Julián',
    badgeText: 'Perfil: Julián 👑'
  },
  yanet: {
    id: 'yanet',
    name: 'Yanet',
    role: 'La Novia / Esposa',
    gender: 'she',
    emoji: '🌸',
    avatarBg: 'from-pink-500 to-rose-600',
    accentColor: 'rose',
    partnerName: 'Julián',
    partnerNickname: 'mi rey',
    greetings: [
      '¡Hola, mi muñeca hermosa! Tu mundo de amor te espera.',
      'Hola, mi reina adorada. Julián muere de amor por vos.',
      'Bienvenida, mi bebota linda. Cada detalle acá es para vos.',
      'Hola mi vida, sos la luz de cada uno de sus días.'
    ],
    signature: 'Siempre tuya, Yanet',
    badgeText: 'Perfil: Yanet 🌸'
  }
};

export function ProfileProvider({ children }) {
  const [activeProfileId, setActiveProfileId] = useState(() => {
    const saved = localStorage.getItem('romapp_active_profile');
    return saved === 'yanet' ? 'yanet' : 'julian';
  });

  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    localStorage.setItem('romapp_active_profile', activeProfileId);
  }, [activeProfileId]);

  const activeProfile = PROFILES[activeProfileId] || PROFILES.julian;

  const switchProfile = (profileId) => {
    if (PROFILES[profileId]) {
      setActiveProfileId(profileId);
    }
  };

  const toggleProfile = () => {
    setActiveProfileId((prev) => (prev === 'julian' ? 'yanet' : 'julian'));
  };

  const isJulian = activeProfileId === 'julian';
  const isYanet = activeProfileId === 'yanet';

  return (
    <ProfileContext.Provider
      value={{
        profileId: activeProfileId,
        profile: activeProfile,
        isJulian,
        isYanet,
        partnerName: activeProfile.partnerName,
        switchProfile,
        toggleProfile,
        showProfileModal,
        setShowProfileModal
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile debe usarse dentro de un ProfileProvider');
  }
  return context;
}
