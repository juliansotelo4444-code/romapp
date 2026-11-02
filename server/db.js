import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

export async function initDb() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Cupones (estado de canje sincronizado entre Julián y Yanet)
    await client.query(`
      CREATE TABLE IF NOT EXISTS coupons_state (
        coupon_id TEXT PRIMARY KEY,
        redeemed BOOLEAN NOT NULL DEFAULT FALSE,
        redeemed_at TEXT,
        redeemed_by TEXT
      );
      ALTER TABLE coupons_state ADD COLUMN IF NOT EXISTS redeemed_by TEXT;
    `);

    // 2. Cartas de Amor compartidas
    await client.query(`
      CREATE TABLE IF NOT EXISTS love_letters (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        recipient TEXT NOT NULL,
        date TEXT NOT NULL,
        content TEXT NOT NULL,
        photo_url TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
      ALTER TABLE love_letters ADD COLUMN IF NOT EXISTS photo_url TEXT;
    `);

    // 2b. Mimos de Amor en Vivo (Love Pings entre Julián y Yanet)
    await client.query(`
      CREATE TABLE IF NOT EXISTS love_pings (
        id TEXT PRIMARY KEY,
        from_user TEXT NOT NULL,
        to_user TEXT NOT NULL,
        message TEXT NOT NULL,
        emoji TEXT DEFAULT '❤️',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        seen BOOLEAN NOT NULL DEFAULT FALSE
      );
    `);

    // 2c. Hitos y Línea del Tiempo de Nuestra Historia
    await client.query(`
      CREATE TABLE IF NOT EXISTS love_milestones (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        date TEXT NOT NULL,
        description TEXT NOT NULL,
        icon TEXT DEFAULT 'heart',
        photo_url TEXT,
        created_by TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // 3. Checklist de Luna de Miel (Bariloche)
    await client.query(`
      CREATE TABLE IF NOT EXISTS honeymoon_items (
        id TEXT PRIMARY KEY,
        text TEXT NOT NULL,
        day TEXT NOT NULL,
        category TEXT NOT NULL,
        checked BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // 4. Guion Nocturno de la Víspera (7 Oct)
    await client.query(`
      CREATE TABLE IF NOT EXISTS wedding_eve_notes (
        slot_time TEXT PRIMARY KEY,
        content TEXT NOT NULL DEFAULT '',
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // 5. Respuestas de preguntas / afinidad íntima
    await client.query(`
      CREATE TABLE IF NOT EXISTS quiz_answers (
        user_id TEXT NOT NULL,
        fantasy_id INT NOT NULL,
        answer TEXT NOT NULL,
        updated_at TIMESTAMPTZ DEFAULT NOW(),
        PRIMARY KEY (user_id, fantasy_id)
      );
    `);

    await client.query('COMMIT');
    console.log('✅ Base de datos Neon PostgreSQL conectada y tablas inicializadas con éxito.');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error al inicializar tablas en Neon:', error);
    throw error;
  } finally {
    client.release();
  }
}
