import fs from 'fs';
import path from 'path';

const categories = [
  {
    name: 'Juegos de Poder, Control y Dominación',
    range: [1, 50],
    subthemes: [
      'Vendas y privación sensorial',
      'Ataduras suaves y control de muñecas',
      'Órdenes susurradas al oído',
      'Permiso para tocar o rogar',
      'Posición sumisa y entrega total',
      'Castigo dulce o penitencia erótica',
      'Juegos de rol y jerarquía',
      'Control de ritmo y pausas obligadas',
      'Inmovilidad y entrega pasiva',
      'Recompensa tras obediencia'
    ]
  },
  {
    name: 'Sensoriales, Masajes y Temperatura',
    range: [51, 100],
    subthemes: [
      'Hielo y contraste térmico',
      'Cera tibia de soja para masaje',
      'Plumas y caricias milimétricas',
      'Masaje tántrico de cuerpo completo con aceites esenciales',
      'Vendas y estímulos sonoros / susurros',
      'Texturas: seda, satén y piel',
      'Baño caliente con espuma y velas',
      'Masaje de pies, pantorrillas y muslos interiores',
      'Aliento tibio en cuello y columna',
      'Caricias a cámara lenta sin penetración'
    ]
  },
  {
    name: 'Oral y Enfoque Exclusivo sin Reciprocidad Obligatoria',
    range: [101, 150],
    subthemes: [
      'Enfoque 100% en el placer de ella',
      'Enfoque 100% en el placer de él',
      'Oral pausado y metódico',
      'Uso de lubricante saborizado o térmico',
      'Posición 69 lenta y conectada',
      'Borde del orgasmo repetido solo con lengua',
      'Oral matutino bajo las sábanas',
      'Mirada fija durante la estimulación oral',
      'Oral nocturno antes de dormir',
      'Sesión maratónica sin prisa ni reloj'
    ]
  },
  {
    name: 'Anticipación, Previa y Sexting',
    range: [151, 200],
    subthemes: [
      'Mensajes eróticos durante el día de trabajo',
      'Foto sugerente sin mostrar todo',
      'Audio susurrado con una confesión caliente',
      'Cena romántica donde uno no lleva ropa interior',
      'Tocar por debajo de la mesa sin que nadie lo note',
      'Prohibido tocarse durante las primeras dos horas',
      'Striptease íntimo a la luz de una vela',
      'Contar una fantasía oculta en voz baja',
      'Caricias sobre la ropa hasta no aguantar más',
      'Beso prolongado de diez minutos antes del primer desvestir'
    ]
  },
  {
    name: 'Lugares, Espontaneidad y Retos Express',
    range: [201, 250],
    subthemes: [
      'En la cabaña de Bariloche frente a la chimenea',
      'Contra la pared del pasillo de sorpresa',
      'Bajo la ducha compartida con agua hirviendo',
      'En el sillón del living con música de fondo',
      'Mirando por la ventana con poca luz',
      'En el auto en un mirador solitario de la ruta',
      'En la alfombra junto a la cama',
      'Un rapidito mañanero antes de que suene la alarma',
      'En el balcón o terraza en la oscuridad',
      'En la cocina mientras se prepara algo'
    ]
  },
  {
    name: 'Deseo, Kamasutra y Experimentación',
    range: [251, 290],
    subthemes: [
      'La Amazona Dominante con control del ritmo',
      'El Loto Tántrico con respiración sincronizada',
      'La Cucharita con penetración profunda y lenta',
      'El Jinete Invertido con vista privilegiada',
      'El Puente Sensual con apoyo de almohadones',
      'De pie con elevación y apoyo en pared',
      'Juegos con juguetes y vibradores compartidos',
      'Variaciones angulares milimétricas',
      'Cambio constante de roles durante el acto',
      'Exploración de puntos reflexológicos y zonas olvidadas'
    ]
  },
  {
    name: 'Post-Intimidad, Conexión y Cuidados',
    range: [291, 318],
    subthemes: [
      'Abrazo prolongado piel con piel en silencio',
      'Vaso de agua fresca y algo dulce llevado a la cama',
      'Acariciar el cabello hasta que se duerma',
      'Ducha templada juntos para limpiar y relajar',
      'Charla sincera sobre lo que más nos excitó',
      'Masaje suave en la espalda para aliviar tensiones',
      'Agradecer con besos suaves en todo el rostro',
      'Dormir entrelazados toda la noche',
      'Desayuno sorpresa en la cama al despertar',
      'Mirarse a los ojos y renovar la promesa de amarnos'
    ]
  }
];

// Helper to generate realistic titles and descriptions
const coupons = [];

// Specific custom title templates and descriptors per category
const titlesPool = {
  0: [
    'El Decreto de la Sumisión', 'Manos Cautivas de Satén', 'La Palabra Clave Secreta', 'Tus Órdenes Son Mis Deseos',
    'Privación de la Mirada', 'El Compás Prohibido', 'Pide Permiso para Llegar', 'La Reina Dicta el Juego',
    'El Rey Elige el Castigo', 'Penitencia de Besos Calientes', 'A Merced de Mis Manos', 'Bajo Llave y Candado',
    'Inmovilidad Absoluta', 'Susurros de Autoridad', 'Pausa Forzada en el Clímax', 'Entrega Incondicional',
    'La Silla del Deseo', 'De Rodillas Frente a Mí', 'El Toque Condicionado', 'El Juego de las Tres Faltas',
    'Voz de Mando al Oído', 'Tú Miras, Yo Decido', 'El Lazo de Seda', 'Control Total de la Noche',
    'Sin Derecho a Réplica', 'El Castigo Dulce', 'La Regla del Silencio', 'El Tributo al Placer',
    'El Contrato de la Medianoche', 'Recompensa por Paciencia', 'Solo Cuando Yo Diga', 'Rendición de Armas',
    'El Secreto de la Espalda', 'Manos en la Nuca', 'El Test de la Obediencia', 'El Antifaz de Terciopelo',
    'Dominio a Fuego Lento', 'Juego de Jerarquías en la Cabaña', 'El Desafío de No Moverse', 'El Voto de Rendición',
    'Prisión de Algodón', 'La Señal Acordada', 'El Amo de tus Gemidos', 'La Soberana de la Cama',
    'Espera de Diez Minutos', 'Tacto Prohibido', 'La Orden Inquebrantable', 'Sed de Control',
    'El Trono de la Pasión', 'Dominación Sublime'
  ],
  1: [
    'Caricia de Hielo y Fuego', 'Lluvia de Cera Tibia', 'Piel de Durazno y Plumas', 'Masaje Tántrico Bariloche',
    'Aceites de Rosa Mosqueta y Canela', 'El Despertar de la Espalda', 'Vendas y Aromaterapia', 'Toque de Seda Fría',
    'Baño de Espuma a la Luz de Velas', 'Camino de Hielo por el Vientre', 'Masaje con Manos Calientes', 'El Mapa del Cuello',
    'Respiración en el Pabellón de la Oreja', 'Pinchazos Dulces de Sensibilidad', 'El Aceite Calefactor', 'Caricias a Contrapelo',
    'El Susurro que Eriza', 'Texturas Ocultas en la Oscuridad', 'Masaje de Muslos Interiores', 'El Toque de las Cien Plumas',
    'Vino Caliente y Piel Desnuda', 'Gota a Gota de Placer', 'El Deshielo de los Sentidos', 'Vibración Suave y Continua',
    'El Espejo y la Vela', 'Sábanas Heladas, Cuerpos Hirviendo', 'El Camino de la Columna', 'Caricias con la Punta de los Dedos',
    'Masaje de Pies Cansados con Mimo', 'El Aliento Cálido', 'Contrastes en los Labios', 'La Toalla Húmeda y Caliente',
    'Piel con Piel sin Moverse', 'Perfume Íntimo Inolvidable', 'Masaje Craneal Hipnótico', 'Caricias en la Clavícula',
    'El Misterio del Velo', 'Tacto Ciego', 'Despertar de Zonas Prohibidas', 'Sinfonía Sensorial',
    'La Almohada de Plumas', 'Gotas de Miel Tibia', 'Rozar sin Apretar', 'El Calor de la Chimenea en la Piel',
    'Piel de Gallina Garantizada', 'Viaje a Través de los Poros', 'El Ecosistema del Deseo', 'Toque Eléctrico',
    'Incienso y Mirada', 'La Ceremonia de los Sentidos'
  ],
  2: [
    'Devoción Oral sin Tiempo', 'Enfoque Absoluto en Su Placer', 'Rendición Bucal Masculina', 'Sinfonía con Lengua y Labios',
    'El Secreto del Punto G con Oral', 'Bordeando la Locura con Calma', 'Oral Bajo las Sábanas', 'El Cóctel Helado y Cálido',
    'Tributo Ininterrumpido de 20 Minutos', 'La Posición 69 de Película', 'Mirada Cómplice Durante el Festín', 'Presión Milimétrica y Suave',
    'El Oasis del Clítoris', 'Entrega Total a Su Sensibilidad', 'El Despertar Matutino Más Dulce', 'Sin Prisas, Solo Placer Puro',
    'La Danza de la Lengua', 'Beso Profundo sin Retorno', 'El Ritmo Cardiaco Oral', 'Caricias Mientras la Lengua Trabaja',
    'El Toque Doble: Dedos y Labios', 'Devoción Nocturna en Bariloche', 'El Placer sin Obligación de Vuelta', 'La Fuente del Deseo',
    'El Éxtasis a Paso Lento', 'Manos en Sus Caderas mientras Bajas', 'El Murmullo Contra la Piel Húmeda', 'Suspiros Robados con la Boca',
    'El Deslizamiento Perfecto', 'El Desayuno Favorito de la Pareja', 'Olas de Placer Sucesivas', 'Boca Abierta y Calor Constante',
    'El Rey Postrado a Sus Pies', 'La Reina Tomando el Mando', 'Festín Íntimo a Medianoche', 'Caricias con la Barba Rala',
    'El Suspiro Final en la Boca', 'El Banquete de los Sentidos', 'Oral Prolongado hasta el Temblores', 'La Dulce Tortura',
    'Lengua Suave sobre Piel Firme', 'La Calidez Inagotable', 'El Don de Hacerte Gemir', 'Exploración Perimetral Exquisita',
    'El Ritual del Placer Compartido', 'El Laberinto Húmedo', 'Solo para Ti, Esta Noche', 'El Canto de la Sirena',
    'El Clímax Guiado por la Respiración', 'Consagración del Deseo'
  ],
  3: [
    'Mensaje Cifrado de las 15:00 hs', 'La Foto que No Puede Esperar', 'Audio de 10 Segundos con Gemido', 'Cena sin Bragas bajo el Vestido',
    'Mano Traviesa en el Restaurante', 'El Pacto de las Dos Horas sin Tocar', 'Striptease Privado con Luces Tenues', 'Confesión de la Fantasía Oculta',
    'Beso de Despedida que Promete Todo', 'La Notificación Ardiente en el Celular', 'Caricias Encima de la Ropa en el Auto', 'Ropa Interior Elegida por la Pareja',
    'El Deseo Guardado Todo el Día', 'Llamada Telefónica con Propuestas Indecentes', 'La Mirada Fijada al Otro Lado del Salón', 'El Escote Nupcial en Secreto',
    'Desabotonar Lento, Botón a Botón', 'Un Roce Accidental muy Planeado', 'La Promesa Escrita en una Servilleta', 'El Perfume Detrás de la Oreja',
    'Juego de Miradas con Tensión Pura', 'La Cuenta Atrás en el Espejo', 'Susurro en el Ascensor', 'La Previa Eterna',
    'Mordisco en el Lóbulo de la Oreja', 'La Caricia de la Rodilla al Conducir', 'Ropa Olvidada a Propósito', 'El Secreto Compartido con Nadie',
    'Anticipación en la Fila del Supermercado', 'El Escaneo Visual Lento', 'Un Te Quiero con Hambre de Ti', 'Cerrar la Puerta con Doble Traba',
    'La Camisa Semiabierta', 'Desvestir con la Mirada', 'El Anticipo de Bariloche', 'Noche de Bodas Anticipada',
    'La Promesa de Medianoche', 'La Foto Desenfoncada que Incendia', 'Seducción con Canción de Morat', 'A Quemarropa con una Caricia',
    'El Reto de Aguantar las Ganas', 'Cita a Ciegas en Nuestra Propia Cama', 'Mano en el Muslo Bajo la Mesa', 'El Beso Robado que Inicia la Tormenta',
    'Cita en el Pasillo con Luz Apagada', 'El Juego de las Insinuaciones', 'La Postal Erótica Mental', 'Tensión que se Corta con Cuchillo',
    'La Fiebre del Deseo Previo', 'El Disparo de Adrenalina'
  ],
  4: [
    'Frente a las Brasas de la Cabaña', 'Contra la Pared del Pasillo', 'Bajo el Agua Hirviendo de la Ducha', 'En la Alfombra del Living',
    'El Mirador del Nahuel Huapi en el Auto', 'El Rapidito de las 07:00 AM', 'En el Balcón con Frío y Pasión', 'En la Mesada de la Cocina',
    'El Sillón del Hotel de Luna de Miel', 'Al Costado del Camino con las Luces Apagadas', 'En el Baño de una Fiesta Familiar', 'La Escalera de la Cabaña',
    'El Abrazo Salvaje al Llegar a Casa', 'El Baile Desnudos en la Sala', 'En el Jacuzzi con Burbujas', 'Frente al Gran Espejo del Cuarto',
    'El Rincón Oculto del Bosque de Arrayanes', 'En el Suelo con Almohadas y Mantas', 'Despertar con Penetración Sorpresa', 'El Asalto Amoroso en el Descanso',
    'La Puerta Entreabierta con Deseo', 'El Reto del Silencio en Lugar Ruidoso', 'El Enredo de Sábanas de Tarde de Lluvia', 'El Fuego de Bariloche',
    'La Cama Deshecha a Media Tarde', 'El Beso Robado en la Terraza', 'Caricias en la Mesa de Noche', 'El Desafío Express de 5 Minutos',
    'El Refugio Secreto de la Nieve', 'El Eco de los Gemidos en el Baño', 'Sobre la Valija a Medio Armar', 'El Impulso Irresistible',
    'Desvestirse con Apuro Voraz', 'El Lugar que Nunca Imaginamos', 'El Juego de la Ventana Empeñada', 'Ataque de Besos en la Espalda',
    'La Parada de Emergencia en la Ruta', 'El Rincón más Oscuro de la Habitación', 'El Encuentro Prohibido del Pasillo', 'Furia y Ternura en el Suelo',
    'La Alquimia del Instante', 'El Arrebato Pasional', 'La Cima del Cerro Campanario (Mental)', 'El Calor Contra el Frío del Sur',
    'El Reto de la Cabaña Rústica', 'El Baño de Medianoche', 'El Rincón de las Maletas', 'En el Borde de la Cama sin Tiempo',
    'El Abrazo en el Sofá Tras el Viaje', 'La Tormenta Perfecta'
  ],
  5: [
    'La Amazona Dominante con Ritmo Hipnótico', 'El Loto Tántrico con Ojos Abiertos', 'La Cucharita Profunda y Cálida', 'El Jinete Invertido con Espejo',
    'El Puente Sensual con Tres Almohadas', 'De Pie con Apoyo en la Pared', 'La Tijera con Fricción Total', 'La Cascada con Placer Inclinado',
    'El Molino del Deseo', 'La Fusión de Caderas', 'El Abrazo del Oso en Bariloche', 'El Barco en la Tormenta',
    'La Mariposa Expandida', 'La Danza de las Piernas Entrelazadas', 'El Trono de los Enamorados', 'El Vuelo del Halcón',
    'Penetración Angular de Precisión', 'El balanceo Pélvico Milimétrico', 'La Cima del Volcán', 'El Encuentro Fusión',
    'La Serpiente Ondulante', 'El Abrazo de Nieve y Fuego', 'El Triángulo de Oro', 'La Flor Abierta al Sol',
    'El Arco del Triunfo Íntimo', 'El Vaivén Ininterrumpido', 'La Flor de Loto Inclinada', 'El Doble Estímulo Sincronizado',
    'El Contacto Clavicular Intenso', 'La Conquista de la Cumbre', 'La Montaña Rusa de Sensaciones', 'La Espiral del Placer',
    'El Eclipse de Dos Cuerpos', 'La Orquídea Salvaje', 'El Laberinto del Kamasutra', 'El Nudo de Amor Eterno',
    'La Cuna del Placer Profundo', 'La Inclinación Perfecta', 'La Sirena en la Orilla', 'La Resurrección del Fuego'
  ],
  6: [
    'El Abrazo Eterno Piel con Piel', 'El Vaso de Agua y Fruta a la Cama', 'Acariciar el Pelo hasta Dormir', 'Ducha Templada Juntos con Esponja',
    'La Charla Íntima de Confesiones', 'Masaje Descontracturante de Hombros', 'Besos Calmos en Párpados y Frente', 'Dormir Cucharita Toda la Noche',
    'Desayuno Completo a la Mañana Siguiente', 'La Mirada Llena de Gratitud y Paz', 'La Ropa Limpia Puesta con Amor', 'Mimos en la Espalda con las Uñas Suaves',
    'Té de Hierbas Caliente y Manta Compartida', 'La Respiración que Vuelve a la Calma', 'Cantar Bajito una Canción de Morat', 'Acomodar las Almohadas para el Descanso',
    'La Sensación de Hogar en Tus Brazos', 'El Beso Lento de Buenas Noches', 'Cuidar el Cuerpo del Ser Amado', 'El Suspiro de Saciedad Compartida',
    'El Abrazo Fuerte que Protege del Mundo', 'La Caricia del Pulgar en la Mejilla', 'Reírse Juntos de lo Intenso que Fue', 'La Promesa de Volver a Repetirlo',
    'Mirar el Amanecer de Bariloche Abrazados', 'El Masaje de Pies Tras la Noche Larga', 'La Conexión de Alma y Piel', 'El Amor Después del Amor'
  ]
};

let currentId = 1;
categories.forEach((cat, catIdx) => {
  const [start, end] = cat.range;
  const count = end - start + 1;
  const titles = titlesPool[catIdx];

  for (let i = 0; i < count; i++) {
    const id = start + i;
    const title = titles[i % titles.length] + (i >= titles.length ? ` (Fase ${Math.floor(i / titles.length) + 1})` : '');
    const subtheme = cat.subthemes[i % cat.subthemes.length];
    
    let description = '';
    switch(catIdx) {
      case 0: // Poder y control
        description = `Válido para una sesión donde se explora ${subtheme.toLowerCase()}. Quien canjea este cupón define las reglas, el ritmo y los límites acordados previamente. Sin distracciones, con entrega absoluta y consentimiento pleno.`;
        break;
      case 1: // Sensoriales y temperatura
        description = `Canjeable por una experiencia centrada en ${subtheme.toLowerCase()}. Preparación de ambiente con luz tenue, música ambiental envolvente y dedicación exclusiva a despertar cada terminación nerviosa.`;
        break;
      case 2: // Oral exclusivo
        description = `Cupón de entrega generosa enfocado en ${subtheme.toLowerCase()}. La persona que recibe el estímulo no tiene obligación de reciprocidad inmediata; se trata de dejarse llevar por el deleite puro y la técnica pausada.`;
        break;
      case 3: // Anticipación y sexting
        description = `Activa un juego de seducción previa con eje en ${subtheme.toLowerCase()}. Calentar los motores a lo largo del día para que el encuentro posterior sea una explosión de deseo acumulado.`;
        break;
      case 4: // Lugares y espontaneidad
        description = `Desafío para romper la rutina a través de ${subtheme.toLowerCase()}. Una chispa de adrenalina, picardía y pasión espontánea para Julián y Yanet en cualquier rincón especial.`;
        break;
      case 5: // Kamasutra y posiciones
        description = `Exploración técnica y erótica inspirada en ${subtheme.toLowerCase()}. Enfoque en la sincronía física, ángulos de contacto profundo y la intensidad del clímax compartido.`;
        break;
      case 6: // Post-intimidad y conexión
        description = `El cierre perfecto con ${subtheme.toLowerCase()}. Cuidar el vínculo emocional, mimar el cuerpo del otro y reafirmar el amor incondicional que los une en su vida juntos.`;
        break;
    }

    coupons.push({
      id,
      title,
      category: cat.name,
      description,
      redeemed: false,
      redeemedAt: null
    });
  }
});

const fileContent = `// Base completa de 318 Cupones Íntimos y Sexuales estructurados en 7 categorías exactas
export const INTIMATE_COUPONS = ${JSON.stringify(coupons, null, 2)};
`;

fs.writeFileSync(path.join(process.cwd(), 'src', 'data', 'intimateCoupons.js'), fileContent, 'utf8');
console.log(`Generated ${coupons.length} intimate coupons successfully!`);
