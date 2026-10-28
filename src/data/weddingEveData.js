export const WEDDING_EVE_MISSIONS = {
  yanet: [
    {
      id: 'yanet-m1',
      title: 'La Promesa de Encaje',
      targetAudience: 'Para Yanet (a pedido de Julián)',
      framing: 'Plano americano frente al espejo',
      lighting: 'Luz cálida de velador o lámpara baja lateral',
      pose: 'De espaldas mirando sobre el hombro derecho con la mirada fija en el lente.',
      attire: 'Bata de satén abierta o entreabierta, dejando ver la silueta y la lencería que prepara para él.',
      status: 'pending',
      photoBase64: null
    },
    {
      id: 'yanet-m2',
      title: 'El Escote Nupcial Prohibido',
      targetAudience: 'Para Yanet (a pedido de Julián)',
      framing: 'Plano cenital (tomado desde arriba)',
      lighting: 'Luz ambiental suave, sin flash directo',
      pose: 'Recostada sobre sábanas blancas, una mano apoyada en la base del cuello acariciando la clavícula.',
      attire: 'Dejando entrever sutilmente el corpiño o encaje elegido para el gran día.',
      status: 'pending',
      photoBase64: null
    },
    {
      id: 'yanet-m3',
      title: 'El Secreto Bajo la Bata',
      targetAudience: 'Para Yanet (a pedido de Julián)',
      framing: 'Plano medio sentado',
      lighting: 'Luz lateral tenue que marque el contorno de las piernas',
      pose: 'En el borde de la cama, piernas cruzadas con elegancia, levantando sutilmente la tela inferior.',
      attire: 'Bata o vestido fluido en insinuación milimétrica.',
      status: 'pending',
      photoBase64: null
    },
    {
      id: 'yanet-m4',
      title: 'Labios y Ansiedad',
      targetAudience: 'Para Yanet (a pedido de Julián)',
      framing: 'Primer plano macro de boca, labios y cuello',
      lighting: 'Luz frontal suave y enfocada',
      pose: 'Mordiendo delicadamente el labio inferior o rozando un fruto / frutilla, transmitiendo las ganas de besarlo.',
      attire: 'Labios hidratados, cuello al descubierto.',
      status: 'pending',
      photoBase64: null
    }
  ],
  julian: [
    {
      id: 'julian-m1',
      title: 'El Traje Desarmado',
      targetAudience: 'Para Julián (a pedido de Yanet)',
      framing: 'Plano medio frente al espejo',
      lighting: 'Luz cálida de baño o habitación',
      pose: 'Camisa blanca formal completamente desabotonada, una mano apoyada en la nuca mostrando pecho y abdomen.',
      attire: 'Pantalón de vestir del traje, camisa blanca abierta.',
      status: 'pending',
      photoBase64: null
    },
    {
      id: 'julian-m2',
      title: 'Post-Ducha de Medianoche',
      targetAudience: 'Para Julián (a pedido de Yanet)',
      framing: 'Plano medio con reflejo',
      lighting: 'Luz indirecta con espejo con vapor',
      pose: 'Gotas de agua deslizándose por los hombros y pecho, mirada intensa a la cámara.',
      attire: 'Toalla oscura sostenida a la altura de la cadera.',
      status: 'pending',
      photoBase64: null
    },
    {
      id: 'julian-m3',
      title: 'La Espera en la Cama',
      targetAudience: 'Para Julián (a pedido de Yanet)',
      framing: 'Vista subjetiva de perfil',
      lighting: 'Luz de media noche suave',
      pose: 'Acostado de lado con torso descubierto, una mano reposando sobre la almohada vacía de al lado.',
      attire: 'Frase adjunta obligatoria en el mensaje: "Mañana este lado es tuyo para siempre".',
      status: 'pending',
      photoBase64: null
    },
    {
      id: 'julian-m4',
      title: 'Detalle de Manos y Tensión',
      targetAudience: 'Para Julián (a pedido de Yanet)',
      framing: 'Primer plano macro de manos y antebrazos',
      lighting: 'Luz rasante que resalte la textura de la piel',
      pose: 'Manos masculinas firmes con venas marcadas sosteniendo con fuerza la corbata o una prenda íntima de ella.',
      attire: 'Mangas arremangadas hasta el codo.',
      status: 'pending',
      photoBase64: null
    }
  ]
};

export const NIGHT_SCHEDULE_PROMPTS = [
  {
    time: '01:00 AM',
    title: 'El Primer Respiro a Solas',
    description: 'Cuando la fiesta o el día termine y se cierre la puerta de la habitación. ¿Qué es lo primero que se van a decir al mirarse a los ojos?',
    authorPrompt: 'Escribe tu compromiso o primera sensación para este horario...'
  },
  {
    time: '02:30 AM',
    title: 'Desarmando los Trajes y la Piel',
    description: 'Quitarse botón por botón, el vestido, la corbata, el reloj... sin prisa, reconociendo cada rincón del cuerpo de tu nuevo cónyuge.',
    authorPrompt: '¿Cómo imaginas ese momento de quedar piel con piel?'
  },
  {
    time: '04:00 AM',
    title: 'La Cima de la Pasión en Silencio',
    description: 'La noche avanza y el mundo duerme, pero la cama de bodas es un volcán de besos, jadeos suaves y promesas eternas.',
    authorPrompt: 'Tu fantasía o promesa íntima para la madrugada nupcial...'
  },
  {
    time: '08:30 AM',
    title: 'El Primer Despertar como Marido y Mujer',
    description: 'La luz entrando por la ventana, los anillos brillando en la mesita o en los dedos, y el primer beso con el nuevo título.',
    authorPrompt: '¿Qué le vas a susurrar al oído al verle abrir los ojos?'
  }
];

export const INSOMNIA_ROULETTE_PROMPTS = [
  'Graba un audio susurrado de 15 segundos confesando qué es lo que más te calienta de su cuerpo en este instante.',
  'Envía una foto de la prenda de ropa que te vas a poner o quitar primero mañana.',
  'Escribe el recuerdo exacto de la primera vez que supiste que te querías casar con ella/él.',
  'Describe con pelos y señales el beso que le vas a dar apenas digan "los declaro marido y mujer".',
  'Tómate una foto sonriendo con el anillo o algo del casamiento y dile por qué es el amor de tu vida.',
  'Susurra en un mensaje de voz la estrofa de Morat o Tan Biónica que define lo que sentís en esta víspera.',
  'Confiesa una fantasía que quieras cumplir sí o sí en la cabaña de Bariloche durante la luna de miel.'
];
