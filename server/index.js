import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { pool, initDb } from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Endpoint de Salud
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Romapp API (Neon PostgreSQL)', timestamp: new Date().toISOString() });
});

// Sincronización completa inicial
app.get('/api/sync', async (req, res) => {
  try {
    const [couponsRes, lettersRes, honeymoonRes, eveNotesRes, quizRes, pingsRes, milestonesRes] = await Promise.all([
      pool.query('SELECT coupon_id, redeemed, redeemed_at, redeemed_by FROM coupons_state'),
      pool.query('SELECT id, title, author, recipient, date, content, photo_url, created_at FROM love_letters ORDER BY created_at DESC'),
      pool.query('SELECT id, text, day, category, checked FROM honeymoon_items ORDER BY created_at ASC'),
      pool.query('SELECT slot_time, content FROM wedding_eve_notes'),
      pool.query('SELECT user_id, fantasy_id, answer FROM quiz_answers'),
      pool.query('SELECT id, from_user, to_user, message, emoji, created_at, seen FROM love_pings ORDER BY created_at DESC LIMIT 50'),
      pool.query('SELECT id, title, date, description, icon, photo_url, created_by, created_at FROM love_milestones ORDER BY created_at ASC')
    ]);

    const eveNotesMap = {};
    eveNotesRes.rows.forEach((row) => {
      eveNotesMap[row.slot_time] = row.content;
    });

    res.json({
      coupons: couponsRes.rows,
      letters: lettersRes.rows.map(r => ({
        ...r,
        photoUrl: r.photo_url
      })),
      honeymoon: honeymoonRes.rows,
      weddingEveNotes: eveNotesMap,
      quizAnswers: quizRes.rows,
      pings: pingsRes.rows.map(p => ({
        id: p.id,
        fromUser: p.from_user,
        toUser: p.to_user,
        message: p.message,
        emoji: p.emoji,
        createdAt: p.created_at,
        seen: p.seen
      })),
      milestones: milestonesRes.rows.map(m => ({
        id: m.id,
        title: m.title,
        date: m.date,
        description: m.description,
        icon: m.icon,
        photoUrl: m.photo_url,
        createdBy: m.created_by,
        createdAt: m.created_at
      }))
    });
  } catch (err) {
    console.error('Error en /api/sync:', err);
    res.status(500).json({ error: 'Error al sincronizar datos desde Neon' });
  }
});

// --- CUPONES ---
app.post('/api/coupons/redeem', async (req, res) => {
  const { couponId, redeemedAt, redeemedBy } = req.body;
  if (!couponId) return res.status(400).json({ error: 'couponId requerido' });

  try {
    await pool.query(
      `INSERT INTO coupons_state (coupon_id, redeemed, redeemed_at, redeemed_by)
       VALUES ($1, true, $2, $3)
       ON CONFLICT (coupon_id) DO UPDATE SET redeemed = true, redeemed_at = $2, redeemed_by = $3`,
      [couponId, redeemedAt || new Date().toLocaleDateString('es-AR'), redeemedBy || 'Nosotros']
    );
    res.json({ success: true, couponId, redeemed: true, redeemedAt, redeemedBy });
  } catch (err) {
    console.error('Error canjeando cupón:', err);
    res.status(500).json({ error: 'Error al canjear cupón en la base de datos' });
  }
});

app.post('/api/coupons/reactivate', async (req, res) => {
  const { couponId } = req.body;
  if (!couponId) return res.status(400).json({ error: 'couponId requerido' });

  try {
    await pool.query(
      `INSERT INTO coupons_state (coupon_id, redeemed, redeemed_at, redeemed_by)
       VALUES ($1, false, NULL, NULL)
       ON CONFLICT (coupon_id) DO UPDATE SET redeemed = false, redeemed_at = NULL, redeemed_by = NULL`,
      [couponId]
    );
    res.json({ success: true, couponId, redeemed: false });
  } catch (err) {
    console.error('Error reactivando cupón:', err);
    res.status(500).json({ error: 'Error al reactivar cupón' });
  }
});

// --- CARTAS DE AMOR ---
app.get('/api/letters', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, title, author, recipient, date, content, photo_url, created_at FROM love_letters ORDER BY created_at DESC');
    res.json(result.rows.map(r => ({
      ...r,
      photoUrl: r.photo_url
    })));
  } catch (err) {
    console.error('Error obteniendo cartas:', err);
    res.status(500).json({ error: 'Error al obtener cartas' });
  }
});

app.post('/api/letters', async (req, res) => {
  const { id, title, author, recipient, date, content, photoUrl } = req.body;
  if (!id || !title || !content) {
    return res.status(400).json({ error: 'Faltan campos requeridos para la carta' });
  }

  try {
    await pool.query(
      `INSERT INTO love_letters (id, title, author, recipient, date, content, photo_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (id) DO UPDATE SET title = $2, author = $3, recipient = $4, date = $5, content = $6, photo_url = $7`,
      [id, title, author, recipient, date, content, photoUrl || null]
    );
    res.json({ success: true, letter: req.body });
  } catch (err) {
    console.error('Error guardando carta:', err);
    res.status(500).json({ error: 'Error al guardar carta en Neon' });
  }
});

app.delete('/api/letters/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM love_letters WHERE id = $1', [id]);
    res.json({ success: true, id });
  } catch (err) {
    console.error('Error eliminando carta:', err);
    res.status(500).json({ error: 'Error al eliminar carta' });
  }
});

// --- CHECKLIST BARILOCHE ---
app.post('/api/honeymoon/toggle', async (req, res) => {
  const { id, text, day, category, checked } = req.body;
  if (!id) return res.status(400).json({ error: 'id requerido' });

  try {
    await pool.query(
      `INSERT INTO honeymoon_items (id, text, day, category, checked)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (id) DO UPDATE SET checked = $5`,
      [id, text || '', day || 'General', category || 'Plan', checked]
    );
    res.json({ success: true, id, checked });
  } catch (err) {
    console.error('Error alternando checklist:', err);
    res.status(500).json({ error: 'Error al actualizar checklist en Neon' });
  }
});

app.post('/api/honeymoon/add', async (req, res) => {
  const { id, text, day, category } = req.body;
  if (!id || !text) return res.status(400).json({ error: 'Datos incompletos para nuevo ítem' });

  try {
    await pool.query(
      `INSERT INTO honeymoon_items (id, text, day, category, checked)
       VALUES ($1, $2, $3, $4, false)
       ON CONFLICT (id) DO NOTHING`,
      [id, text, day || 'Todos', category || 'General']
    );
    res.json({ success: true, item: { id, text, day, category, checked: false } });
  } catch (err) {
    console.error('Error agregando ítem Bariloche:', err);
    res.status(500).json({ error: 'Error al guardar ítem en Neon' });
  }
});

app.delete('/api/honeymoon/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM honeymoon_items WHERE id = $1', [id]);
    res.json({ success: true, id });
  } catch (err) {
    console.error('Error eliminando ítem de Bariloche:', err);
    res.status(500).json({ error: 'Error al eliminar ítem' });
  }
});

// --- VÍSPERA (NOTAS NOCTURNAS) ---
app.post('/api/wedding-eve/notes', async (req, res) => {
  const { slotTime, content } = req.body;
  if (!slotTime) return res.status(400).json({ error: 'slotTime requerido' });

  try {
    await pool.query(
      `INSERT INTO wedding_eve_notes (slot_time, content, updated_at)
       VALUES ($1, $2, NOW())
       ON CONFLICT (slot_time) DO UPDATE SET content = $2, updated_at = NOW()`,
      [slotTime, content || '']
    );
    res.json({ success: true, slotTime, content });
  } catch (err) {
    console.error('Error guardando nota de víspera:', err);
    res.status(500).json({ error: 'Error al guardar nota en Neon' });
  }
});

// --- JUEGO DE AFINIDAD ÍNTIMA ---
app.post('/api/quiz/answer', async (req, res) => {
  const { userId, fantasyId, answer } = req.body;
  if (!userId || !fantasyId || !answer) {
    return res.status(400).json({ error: 'Datos incompletos' });
  }

  try {
    await pool.query(
      `INSERT INTO quiz_answers (user_id, fantasy_id, answer, updated_at)
       VALUES ($1, $2, $3, NOW())
       ON CONFLICT (user_id, fantasy_id) DO UPDATE SET answer = $3, updated_at = NOW()`,
      [userId, fantasyId, answer]
    );
    res.json({ success: true, userId, fantasyId, answer });
  } catch (err) {
    console.error('Error guardando respuesta íntima:', err);
    res.status(500).json({ error: 'Error al registrar respuesta' });
  }
});

// --- MIMOS DE AMOR EN VIVO (LOVE PINGS) ---
app.get('/api/pings', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, from_user, to_user, message, emoji, created_at, seen FROM love_pings ORDER BY created_at DESC LIMIT 50');
    res.json(result.rows.map(p => ({
      id: p.id,
      fromUser: p.from_user,
      toUser: p.to_user,
      message: p.message,
      emoji: p.emoji,
      createdAt: p.created_at,
      seen: p.seen
    })));
  } catch (err) {
    console.error('Error obteniendo mimos:', err);
    res.status(500).json({ error: 'Error al obtener mimos' });
  }
});

app.post('/api/pings', async (req, res) => {
  const { id, fromUser, toUser, message, emoji } = req.body;
  if (!id || !fromUser || !toUser || !message) {
    return res.status(400).json({ error: 'Datos incompletos para enviar mimo' });
  }

  try {
    await pool.query(
      `INSERT INTO love_pings (id, from_user, to_user, message, emoji, created_at, seen)
       VALUES ($1, $2, $3, $4, $5, NOW(), FALSE)`,
      [id, fromUser, toUser, message, emoji || '❤️']
    );
    res.json({ success: true, ping: { id, fromUser, toUser, message, emoji, seen: false } });
  } catch (err) {
    console.error('Error enviando mimo:', err);
    res.status(500).json({ error: 'Error al registrar mimo' });
  }
});

app.post('/api/pings/:id/seen', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('UPDATE love_pings SET seen = TRUE WHERE id = $1', [id]);
    res.json({ success: true, id, seen: true });
  } catch (err) {
    console.error('Error marcando mimo como visto:', err);
    res.status(500).json({ error: 'Error al actualizar mimo' });
  }
});

// --- HITOS Y MOMENTOS DE NUESTRA HISTORIA ---
app.get('/api/milestones', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, title, date, description, icon, photo_url, created_by, created_at FROM love_milestones ORDER BY created_at ASC');
    res.json(result.rows.map(m => ({
      id: m.id,
      title: m.title,
      date: m.date,
      description: m.description,
      icon: m.icon,
      photoUrl: m.photo_url,
      createdBy: m.created_by,
      createdAt: m.created_at
    })));
  } catch (err) {
    console.error('Error obteniendo hitos:', err);
    res.status(500).json({ error: 'Error al obtener hitos' });
  }
});

app.post('/api/milestones', async (req, res) => {
  const { id, title, date, description, icon, photoUrl, createdBy } = req.body;
  if (!id || !title || !description) {
    return res.status(400).json({ error: 'Datos incompletos para el hito' });
  }

  try {
    await pool.query(
      `INSERT INTO love_milestones (id, title, date, description, icon, photo_url, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (id) DO UPDATE SET title = $2, date = $3, description = $4, icon = $5, photo_url = $6`,
      [id, title, date || '', description, icon || 'heart', photoUrl || null, createdBy || 'Julián & Yanet']
    );
    res.json({ success: true, milestone: req.body });
  } catch (err) {
    console.error('Error guardando hito:', err);
    res.status(500).json({ error: 'Error al registrar hito' });
  }
});

app.delete('/api/milestones/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM love_milestones WHERE id = $1', [id]);
    res.json({ success: true, id });
  } catch (err) {
    console.error('Error eliminando hito:', err);
    res.status(500).json({ error: 'Error al eliminar hito' });
  }
});

// Iniciar servidor tras verificar DB
initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Romapp Backend API corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Fallo al inicializar base de datos:', err);
  });
