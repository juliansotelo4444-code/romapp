# Sotelo Digital — Sistema de diseño

## Dirección visual

Una presencia digital minimalista, editorial y de alto contraste para una agencia creativa. El negro profundo aporta solidez, el blanco mantiene la lectura limpia y el rojo identifica llamadas a la acción y detalles de marca. La interfaz prioriza el contacto directo, una presentación clara de servicios y la continuidad mediante soporte mensual.

## Tokens

Los valores se definen en `:root` dentro de `index.html`.

| Token | Valor | Uso |
| --- | --- | --- |
| `--red` | `#E50914` | Acento de marca, selección, recursos gráficos y llamadas a la acción con texto oscuro. |
| `--red-dark` | `#B50912` | Texto rojo sobre blanco y estados con texto blanco que requieren más contraste. |
| `--ink` | `#101010` | Texto principal, fondos oscuros y contenido del logotipo. |
| `--paper` | `#FFFFFF` | Fondo claro y texto sobre fondos oscuros. |
| `--mist` | `#F5F5F4` | Fondo alternativo para separar secciones. |
| `--muted` | `#737373` | Texto secundario sobre superficies claras. |
| `--line` | `#E7E7E7` | Bordes y separadores sobre superficies claras. |
| `--max` | `1200px` | Ancho máximo del contenido. |

Los colores de interfaz derivados (fondos oscuros secundarios, bordes oscuros y superficies de tarjetas) complementan estos tokens sin reemplazar la paleta de marca. Para texto pequeño sobre rojo se usa `--red-dark`; los botones en `--red` usan texto oscuro para conservar el contraste.

## Tipografía

- **Manrope**: encabezados, títulos de tarjetas y marca. Pesos 400–800; titulares en 800 y tracking negativo.
- **DM Sans**: texto corrido, navegación, formularios y controles. Pesos 400–700.
- Ambas familias se cargan desde Google Fonts. Se declaran familias sans-serif genéricas como respaldo.

## Componentes

### Marca y navegación

- Marca formada por isotipo geométrico tricolor en SVG y el descriptor `SOTELO DIGITAL / CREATIVE AGENCY`.
- Barra superior oscura, fija durante el desplazamiento; navegación anclada a secciones y CTA principal.
- En móvil, la navegación se pliega en un botón con estado `aria-expanded` y enlaces que cierran el menú al activarse.
- El isotipo actual es una interpretación SVG de la descripción recibida; debe sustituirse por el archivo oficial de marca antes de publicar.

### Hero

- Fondo `--ink`, titular de alto impacto, propuesta de valor, CTA principal y enlace a proyectos.
- Mockup CSS de navegador como recurso editorial; etiqueta de apoyo, halo y puntos de confianza debajo.
- Entrada escalonada del texto, entrada del mockup y movimiento ambiental lento del mockup/halo.
- Las animaciones se desactivan/reducen con `prefers-reduced-motion`.

### Servicios

- Tres tarjetas: diseño web a medida, branding e identidad, y marketing digital.
- Icono lineal en baldosa roja clara, categoría numerada, título, descripción y enlace a contacto.
- Elevación sutil al pasar el cursor.

### Portafolio

- Grilla adaptable de cuatro conceptos visuales: e-commerce, inmobiliaria, salud y plataforma de datos.
- Mockups hechos con CSS, interacción de elevación y enlaces que preparan la consulta asociada.
- La nota bajo la grilla aclara que son conceptos de muestra, no trabajos publicados.

### Planes de soporte

- Tres tarjetas: Básico, Profesional y Empresarial; el plan Profesional se destaca visualmente.
- Lista de prestaciones y CTA que preselecciona el asunto en el formulario.
- Alcance, tiempos de respuesta y disponibilidad se presentan sujetos a acuerdo.

### Contacto y footer

- Formulario con etiquetas asociadas, validación HTML y preparación de un enlace `wa.me` con el mensaje completado por la persona.
- El envío se completa fuera del sitio: no hay backend ni persistencia de datos.
- Pie con marca, navegación, enlaces sociales provisionales y aviso de derechos reservados.

## Responsive y accesibilidad

- Breakpoints: `960px` (ajustes de grilla), `720px` (navegación móvil y columnas apiladas) y `430px` (ajustes para pantallas estrechas).
- Ancho de contenido fluido con tope de `1200px`; desplazamiento anclado contempla la barra fija.
- Estados `:focus-visible`, etiquetas de formulario, botones nativos, nombres accesibles para controles y alternativas para recursos visuales.
- Contraste de texto sobre superficies y controles rojos: usar los valores de token documentados; no sustituirlos por rojo claro para texto pequeño.
- Movimiento reducido mediante la preferencia del sistema operativo.

## Auditoría y pendientes antes de publicar

1. **Contacto verificable**: el formulario genera un enlace genérico de WhatsApp sin destinatario; la persona debe elegir a quién enviarlo. Definir y configurar el número comercial para convertir el CTA en una vía de contacto directa. El email ingresado no se entrega por un backend.
2. **Identidad oficial**: reemplazar el isotipo ilustrativo por los archivos aprobados de Sotelo Digital.
3. **Redes sociales**: los enlaces del footer son marcadores que llevan al contacto; sustituirlos por perfiles reales o retirarlos.
4. **Prueba social**: el portafolio contiene conceptos de muestra y no casos de éxito verificables. La aclaración está visible; agregar proyectos y resultados reales cuando se autoricen.

