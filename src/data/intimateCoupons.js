// Catálogo Oficial y Completo de 318 Cupones Íntimos y Sexuales para Julián y Yanet
// Cargado directamente desde cupones_sexo_318_explicitos_v2.json
import rawData from './cupones_sexo_318_explicitos_v2.json';

function getCategory(id) {
  if (id >= 1 && id <= 50) return 'Juegos de Poder, Control y Dominación';
  if (id >= 51 && id <= 100) return 'Sensoriales, Masajes y Temperatura';
  if (id >= 101 && id <= 150) return 'Oral y Enfoque Exclusivo sin Reciprocidad Obligatoria';
  if (id >= 151 && id <= 190) return 'Iniciación y Placer Anal';
  if (id >= 191 && id <= 230) return 'Deseo, Kamasutra y Experimentación';
  if (id >= 231 && id <= 275) return 'Anticipación, Previa y Sexting';
  if (id >= 276 && id <= 308) return 'Lugares, Espontaneidad y Retos Express';
  return 'Post-Intimidad, Conexión y Cuidados'; // 309 - 318
}

export const INTIMATE_COUPONS = rawData.map((item) => ({
  id: item.id,
  title: item.titulo,
  category: getCategory(item.id),
  description: item.descripcion,
  redeemed: false,
  redeemedAt: null
}));
