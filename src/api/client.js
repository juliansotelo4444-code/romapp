/**
 * Romapp API Client with Neon PostgreSQL backend & localStorage fallback.
 * Allows smooth offline operation and cloud synchronization between Julián and Yanet.
 */

const API_BASE = '/api';

async function fetchWithTimeout(url, options = {}, timeoutMs = 4000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

// 1. Cargar toda la sincronización de una sola vez
export async function fetchSyncData() {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/sync`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Backend API no disponible, usando almacenamiento local:', err.message);
    return null;
  }
}

// 2. Cupones
export async function apiRedeemCoupon(couponId, redeemedAt) {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/coupons/redeem`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ couponId, redeemedAt })
    });
    return res.ok;
  } catch (e) {
    return false;
  }
}

export async function apiReactivateCoupon(couponId) {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/coupons/reactivate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ couponId })
    });
    return res.ok;
  } catch (e) {
    return false;
  }
}

// 3. Cartas de Amor
export async function apiSaveLetter(letter) {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/letters`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(letter)
    });
    return res.ok;
  } catch (e) {
    return false;
  }
}

export async function apiDeleteLetter(id) {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/letters/${id}`, {
      method: 'DELETE'
    });
    return res.ok;
  } catch (e) {
    return false;
  }
}

// 4. Checklist Bariloche
export async function apiToggleHoneymoon(item) {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/honeymoon/toggle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    });
    return res.ok;
  } catch (e) {
    return false;
  }
}

export async function apiAddHoneymoon(item) {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/honeymoon/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    });
    return res.ok;
  } catch (e) {
    return false;
  }
}

export async function apiDeleteHoneymoon(id) {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/honeymoon/${id}`, {
      method: 'DELETE'
    });
    return res.ok;
  } catch (e) {
    return false;
  }
}

// 5. Víspera - Guion nocturno
export async function apiSaveWeddingEveNote(slotTime, content) {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/wedding-eve/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slotTime, content })
    });
    return res.ok;
  } catch (e) {
    return false;
  }
}

// 6. Juego Íntimo
export async function apiSaveQuizAnswer(userId, fantasyId, answer) {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/quiz/answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, fantasyId, answer })
    });
    return res.ok;
  } catch (e) {
    return false;
  }
}
