import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useProfile } from './ProfileContext';
import { fetchSyncData, apiSendPing, apiMarkPingSeen, apiGetPings } from '../api/client';
import { triggerLoveConfetti } from '../utils/confetti';
import { romanticSound } from '../utils/sound';

const LovePingsContext = createContext(null);

const DEFAULT_PINGS = [
  {
    id: 'ping-initial-1',
    fromUser: 'Julián',
    toUser: 'Yanet',
    message: 'Te amo infinito, mi muñeca hermosa. Ya quiero verte vestida de blanco. ❤️',
    emoji: '👰‍♀️',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    seen: true
  },
  {
    id: 'ping-initial-2',
    fromUser: 'Yanet',
    toUser: 'Julián',
    message: 'Sos el amor de mi vida, mi rey. Contando los días para Bariloche juntos! ✨',
    emoji: '🏔️',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    seen: true
  }
];

export function LovePingsProvider({ children }) {
  const { profile, partnerName } = useProfile();
  const [pings, setPings] = useState(() => {
    const saved = localStorage.getItem('romapp_love_pings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_PINGS;
      }
    }
    return DEFAULT_PINGS;
  });

  const [isPingModalOpen, setIsPingModalOpen] = useState(false);
  const [activeToastPing, setActiveToastPing] = useState(null);

  // Sync with API on mount
  useEffect(() => {
    fetchSyncData().then((data) => {
      if (data && Array.isArray(data.pings) && data.pings.length > 0) {
        setPings((prev) => {
          const map = new Map();
          // Keep local first
          prev.forEach(p => map.set(p.id, p));
          // Merge remote
          data.pings.forEach(p => map.set(p.id, p));
          const merged = Array.from(map.values()).sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          localStorage.setItem('romapp_love_pings', JSON.stringify(merged));
          return merged;
        });
      }
    });
  }, []);

  // Poll for new pings every 20s
  useEffect(() => {
    const pollInterval = setInterval(() => {
      apiGetPings().then((serverPings) => {
        if (serverPings && Array.isArray(serverPings)) {
          setPings((prev) => {
            const map = new Map();
            prev.forEach(p => map.set(p.id, p));
            let hasNewIncoming = false;

            serverPings.forEach(p => {
              const existing = map.get(p.id);
              if (!existing && p.toUser.toLowerCase() === profile.name.toLowerCase() && !p.seen) {
                hasNewIncoming = true;
              }
              map.set(p.id, p);
            });

            const merged = Array.from(map.values()).sort(
              (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );

            if (hasNewIncoming) {
              romanticSound.playLoveChime();
              triggerLoveConfetti();
            }

            localStorage.setItem('romapp_love_pings', JSON.stringify(merged));
            return merged;
          });
        }
      });
    }, 20000);

    return () => clearInterval(pollInterval);
  }, [profile.name]);

  // Check for unseen pings addressed to the current active user to display in toast
  useEffect(() => {
    const unread = pings.find(
      (p) => p.toUser.toLowerCase() === profile.name.toLowerCase() && !p.seen
    );
    if (unread && (!activeToastPing || activeToastPing.id !== unread.id)) {
      setActiveToastPing(unread);
      romanticSound.playLoveChime();
    }
  }, [pings, profile.name, activeToastPing]);

  const sendPing = useCallback(async ({ message, emoji }) => {
    const newPing = {
      id: `ping-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      fromUser: profile.name,
      toUser: partnerName,
      message: message.trim(),
      emoji: emoji || '❤️',
      createdAt: new Date().toISOString(),
      seen: false
    };

    setPings((prev) => {
      const updated = [newPing, ...prev];
      localStorage.setItem('romapp_love_pings', JSON.stringify(updated));
      return updated;
    });

    romanticSound.playKissChime();
    triggerLoveConfetti();

    // Async sync to server
    apiSendPing(newPing);
  }, [profile.name, partnerName]);

  const markPingSeen = useCallback(async (pingId) => {
    setPings((prev) => {
      const updated = prev.map((p) => (p.id === pingId ? { ...p, seen: true } : p));
      localStorage.setItem('romapp_love_pings', JSON.stringify(updated));
      return updated;
    });

    if (activeToastPing && activeToastPing.id === pingId) {
      setActiveToastPing(null);
    }

    apiMarkPingSeen(pingId);
  }, [activeToastPing]);

  const dismissActiveToast = useCallback(() => {
    if (activeToastPing) {
      markPingSeen(activeToastPing.id);
    }
    setActiveToastPing(null);
  }, [activeToastPing, markPingSeen]);

  // Count unread pings for the current user
  const unreadCount = pings.filter(
    (p) => p.toUser.toLowerCase() === profile.name.toLowerCase() && !p.seen
  ).length;

  return (
    <LovePingsContext.Provider
      value={{
        pings,
        unreadCount,
        activeToastPing,
        sendPing,
        markPingSeen,
        dismissActiveToast,
        isPingModalOpen,
        setIsPingModalOpen
      }}
    >
      {children}
    </LovePingsContext.Provider>
  );
}

export function useLovePings() {
  const ctx = useContext(LovePingsContext);
  if (!ctx) {
    throw new Error('useLovePings debe usarse dentro de LovePingsProvider');
  }
  return ctx;
}
