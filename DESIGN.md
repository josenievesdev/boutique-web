---
name: boutique-web
description: "Línea visual aprobada provisionalmente y base para seguir mejorando."
colors:
  background: "#fcfaf7"
  background-subtle: "#f7f3ee"
  surface: "#f7f3ee"
  surface-raised: "#fffefd"
  surface-muted: "#f3e5e3"
  surface-overlay: "rgba(252, 250, 247, 0.94)"
  text: "#292525"
  text-secondary: "#746e6b"
  text-inverse: "#fcfaf7"
  primary: "#402014"
  primary-hover: "#2f160e"
  primary-soft: "#e9dfcf"
  accent: "#e5cac7"
  border: "rgba(41, 37, 37, 0.13)"
  border-strong: "rgba(41, 37, 37, 0.26)"
  focus-ring: "rgba(64, 32, 20, 0.2)"
  success: "#49634f"
  success-soft: "#d9e1d5"
  success-border: "#a9b9a7"
  warning: "#75664b"
  warning-soft: "#e8dfcf"
  danger: "#8a4e48"
  danger-hover: "#6f3934"
  danger-soft: "#e6d4cf"
  danger-border: "#c7a5a0"
  pastel-sage: "#d5ded2"
  pastel-blush: "#f3e5e3"
  pastel-rose: "#e5cac7"
  pastel-mist: "#dce5e8"
  pastel-sand: "#e9dfcf"
typography:
  brand:
    fontFamily: "Newsreader, Georgia, Times New Roman, serif"
    fontSize: "1.34rem"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "-0.035em"
  display:
    fontFamily: "Newsreader, Georgia, Times New Roman, serif"
    fontSize: "clamp(2.9rem, 4vw, 3.85rem)"
    fontWeight: 400
    lineHeight: 0.98
    letterSpacing: "-0.042em"
  headline:
    fontFamily: "Newsreader, Georgia, Times New Roman, serif"
    fontSize: "clamp(2.2rem, 3vw, 2.8rem)"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "-0.035em"
  title:
    fontFamily: "Newsreader, Georgia, Times New Roman, serif"
    fontSize: "1.34rem"
    fontWeight: 500
    lineHeight: 1.08
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Manrope, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  navigation:
    fontFamily: "Manrope, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "0.68rem"
    fontWeight: 600
    letterSpacing: "0.075em"
  button:
    fontFamily: "Manrope, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "0.74rem"
    fontWeight: 600
    letterSpacing: "0.02em"
  price:
    fontFamily: "Manrope, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "0.72rem"
    fontWeight: 600
  label:
    fontFamily: "Manrope, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "0.65rem"
    fontWeight: 600
    letterSpacing: "0.11em"
rounded:
  sm: "8px"
  md: "10px"
  lg: "12px"
  xl: "12px"
  2xl: "12px"
  pill: "999px"
  circle: "50%"
spacing:
  1: "4px"
  2: "8px"
  3: "12px"
  4: "16px"
  5: "20px"
  6: "24px"
  8: "32px"
  10: "40px"
  12: "48px"
  16: "64px"
  20: "80px"
  24: "96px"
components:
  primary-action:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.text-inverse}"
    typography: "{typography.button}"
    rounded: "{rounded.sm}"
    padding: "0 20px"
    height: "46px"
  secondary-action:
    backgroundColor: "transparent"
    textColor: "{colors.text}"
    typography: "{typography.button}"
    rounded: "{rounded.sm}"
    padding: "0 20px"
    height: "46px"
  search-field:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.text}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "0 12px 0 46px"
    height: "52px"
  filter-active:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.text-inverse}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0 12px"
    height: "32px"
  product-card:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.text}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "15px 16px 14px"
---

# Design System: boutique-web

## 1. Overview

**Creative North Star: “Atelier contemporáneo, compra cercana”**

Esta es la **“Línea visual aprobada provisionalmente y base para seguir mejorando.”** Registra fielmente la implementación pública actual, pero no afirma que cada composición o medida sea definitiva. Durante las primeras etapas de Tailwind, la apariencia actual es el objetivo de paridad; las mejoras llegarán después como trabajo de diseño explícito.

El catálogo representa una boutique femenina contemporánea: elegante, cálida, delicada, artesanal, minimalista, comercial y refinada sin parecer inaccesible. El lujo silencioso surge de una tipografía editorial controlada, texto de interfaz sans-serif limpio, líneas delgadas, geometría moderada, acentos pastel contenidos, espacio negativo deliberado e imágenes de producto protagonistas. El contenido comercial debe ser fácil de encontrar.

Beauty in STEM, Brunello Cucinelli AI E-commerce y la claridad de interfaces como ChatGPT son referencias de principios, no plantillas para copiar. Beauty in STEM orienta el equilibrio entre suavidad y precisión; Brunello Cucinelli inspira una presentación calmada del producto y atención a la calidad material; ChatGPT aporta legibilidad, acciones claras y navegación de baja fricción. Ninguna referencia autoriza copiar un layout, firma visual o sistema de componentes.

**Características clave:**

- Lujo silencioso sin teatralidad de exclusividad.
- Newsreader para marca y jerarquía editorial; Manrope para claridad de interfaz.
- Bordes finos y separación tonal antes que sombras.
- Fondos claros, campos pastel moderados y acciones primarias oscuras.
- Imágenes y datos de producto por encima de la composición decorativa.
- Responsive diseñado para cada cambio de densidad, no como un escritorio apilado mecánicamente.
- Superficies públicas en registro `brand`; futura migración administrativa en registro `product`.

### Decisiones provisionales

Todavía no son definitivos el hero, la composición exacta de escritorio, la escala exacta de las imágenes, el uso del espacio cuando hay pocos productos, algunos detalles responsive ni la página administrativa. Solo podrán mejorar en una tanda de diseño posterior a la paridad visual. Los valores actuales de tracking de display inferiores a `-0.04em` también son valores de paridad, no un precedente para nueva tipografía; el pulido posterior deberá revisarlos sin esconder el cambio dentro de la migración.

## 2. Colors

La paleta actual combina superficies claras neutras, un marrón profundo como primario y campos pequeños de blush, mist, sage y sand. El frontmatter es normativo; las tablas siguientes ofrecen trazabilidad hacia las variables CSS existentes y sus usos públicos actuales.

### Primario y acento

| Nombre semántico | Variable existente | Valor real | Uso recomendado |
| --- | --- | --- | --- |
| Marrón atelier profundo | `--color-primary` | `#402014` | Botones primarios, filtros activos, contador de solicitud activo, reglas finas activas y footer oscuro. |
| Marrón atelier profundo — hover | `--color-primary-hover` | `#2f160e` | Hover de acciones primarias y de WhatsApp. |
| Tinte marrón suave | `--color-primary-soft` | `#e9dfcf` | Selección, matiz sutil de marca y énfasis tonal no crítico. |
| Acento rosa empolvado | `--color-accent` | `#e5cac7` | Acento reservado; nunca como baño decorativo genérico. |

### Neutros y superficies

| Nombre semántico | Variable existente | Valor real | Uso recomendado |
| --- | --- | --- | --- |
| Fondo claro | `--color-background` | `#fcfaf7` | Fondo de página y contraparte del texto inverso. |
| Fondo sutil | `--color-background-subtle` | `#f7f3ee` | Etiquetas, controles discretos, estados vacíos y secciones de bajo énfasis. |
| Superficie base | `--color-surface` | `#f7f3ee` | Token de superficie compartido, actualmente más visible en administración. |
| Superficie clara elevada | `--color-surface-raised` | `#fffefd` | Tarjetas, búsqueda, pies de producto y controles de formulario. |
| Superficie blush apagada | `--color-surface-muted` | `#f3e5e3` | Zonas de media y estados atenuados. |
| Superficie overlay del sticky | `--color-surface-overlay` | `rgba(252, 250, 247, 0.94)` | Solo header público sticky, acompañado de su blur funcional. |
| Tinta principal | `--color-text` | `#292525` | Cuerpo, encabezados, precios y etiquetas prioritarias. |
| Tinta secundaria | `--color-text-secondary` | `#746e6b` | Texto de apoyo y metadata, siempre sujeto a verificación de contraste. |
| Tinta inversa | `--color-text-inverse` | `#fcfaf7` | Texto sobre el marrón profundo. |
| Divisor fino | `--color-border` | `rgba(41, 37, 37, 0.13)` | Separación hairline, tarjetas y reglas estructurales. |
| Divisor fuerte | `--color-border-strong` | `rgba(41, 37, 37, 0.26)` | Inputs, acciones secundarias y controles que necesitan mayor definición. |
| Halo de foco | `--color-focus-ring` | `rgba(64, 32, 20, 0.2)` | Halo de foco y `focus-within` de tres píxeles. |

### Pasteles y estados

| Nombre semántico | Variable existente | Valor real | Uso recomendado |
| --- | --- | --- | --- |
| Pastel sage | `--color-pastel-sage` | `#d5ded2` | Media secundaria de producto y contexto positivo calmado. |
| Pastel blush | `--color-pastel-blush` | `#f3e5e3` | Composición del hero, media de producto y contexto suave de error. |
| Pastel rose | `--color-pastel-rose` | `#e5cac7` | Numerales o marcadores decorativos muy puntuales. |
| Pastel mist | `--color-pastel-mist` | `#dce5e8` | Variación de media y estados de carga. |
| Pastel sand | `--color-pastel-sand` | `#e9dfcf` | Panel de consulta y énfasis cálido contenido. |
| Tinta de éxito | `--color-success` | `#49634f` | Texto de estado exitoso. |
| Superficie de éxito | `--color-success-soft` | `#d9e1d5` | Fondo de estado exitoso. |
| Borde de éxito | `--color-success-border` | `#a9b9a7` | Borde de estado exitoso. |
| Tinta de advertencia | `--color-warning` | `#75664b` | Texto de advertencia. |
| Superficie de advertencia | `--color-warning-soft` | `#e8dfcf` | Fondo de advertencia. |
| Tinta de peligro | `--color-danger` | `#8a4e48` | Errores inline públicos y texto destructivo. |
| Peligro — hover | `--color-danger-hover` | `#6f3934` | Hover destructivo. |
| Superficie de peligro | `--color-danger-soft` | `#e6d4cf` | Fondo de error o acción destructiva. |
| Borde de peligro | `--color-danger-border` | `#c7a5a0` | Borde de error o acción destructiva. |

`src/catalog.css` también contiene valores translúcidos contextuales sin variable CSS: blanco a `0.45` para el hover secundario; fondo claro a `0.88` y `0.86` para badges y captions; y opacidades de tinta inversa entre `0.24` y `0.88` en el footer. Son detalles de implementación, no nuevos tokens de paleta; deben migrarse con exactitud antes de decidir si algún valor repetido merece un nombre semántico.

**Regla de color Product-First.** Los pasteles enmarcan productos y estados; nunca dominan las prendas, cubren todo el sitio de manera uniforme ni aparecen como decoración sin función.

## 3. Typography

**Fuente de display y marca:** Newsreader, con Georgia y Times New Roman como fallbacks.

**Fuente de interfaz:** Manrope, con los fallbacks sans-serif y de sistema existentes.

`index.html` carga Newsreader con eje óptico `6..72` en pesos `400` y `500`, y Manrope en pesos `400`, `500` y `600`. No se solicitarán pesos no cargados salvo que la carga de fuentes cambie deliberadamente en otra tarea.

La pareja es editorial pero controlada: Newsreader da a la boutique una voz artesanal; Manrope mantiene directas la navegación, búsqueda, filtros, acciones, precios e información densa. Newsreader es una decisión de identidad existente y debe conservarse durante la migración, aunque sea un recurso editorial común en proyectos nuevos.

### Jerarquía actual

| Rol | Familia y peso | Tamaño y ritmo actuales | Uso |
| --- | --- | --- | --- |
| Marca | Newsreader `500` | `1.34rem`, line-height `1`, tracking `-0.035em` | Nombre de boutique en header y footer. |
| Display del hero público | Newsreader `400` | `clamp(2.9rem, 4vw, 3.85rem)`, line-height `0.98`, tracking `-0.042em` | Tesis del hero de inicio. Los overrides reducen la escala a `820px`, `700px`, `430px` y bajo `360px`. |
| Display de detalle y solicitud | Newsreader `400` | Hasta `4rem`, line-height `0.94–0.95`, tracking `-0.045em` | Nombre de producto y título de solicitud. Conservar por paridad y revisar después. |
| Encabezado de sección | Newsreader `400` | `clamp(2.2rem, 3vw, 2.8rem)`, line-height `1`, tracking `-0.035em` | Colección y estados principales. |
| Título de producto | Newsreader `500` | `1.34rem`, line-height `1.08`, tracking `-0.02em` | Tarjetas de producto. |
| Cuerpo de interfaz | Manrope `400–500` | Base del navegador `1rem/1.5`; apoyo público generalmente `0.73–0.96rem` a `1.5–1.65` | Descripciones, orientación, estados y datos. Prosa larga limitada a `65–75ch`. |
| Navegación | Manrope `600` | `0.68rem`, tracking `0.075em`, mayúsculas | Navegación pública; los tamaños responsive menores son comportamiento de paridad existente. |
| Botones | Manrope `600` | `0.74rem`, tracking `0.02em` | Acciones primarias, secundarias, solicitud y WhatsApp. |
| Precios | Manrope `600` | `0.66–0.83rem`; Newsreader `500` a `1.35rem` para total | Precios compactos y total enfatizado. |
| Etiqueta eyebrow | Manrope `600` | `0.65rem`, tracking `0.11em`, mayúsculas | Etiqueta compartida y limitada del catálogo. No repetirla sobre cada sección futura. |
| Tags y etiquetas compactas | Manrope `600` | `0.50–0.56rem` | Atributos, captions y metadata compacta. |

**Regla de dos voces.** Newsreader expresa marca y jerarquía; Manrope explica, etiqueta, muestra precios y acciona. No se intercambian responsabilidades arbitrariamente, no se introduce Inter y no se añade una tercera familia sin una necesidad documentada.

## 4. Elevation

El catálogo público es plano por defecto. La profundidad procede de cambios suaves de superficie, bordes finos, planos de imagen, posición sticky y espaciado. Las tarjetas usan un borde de un píxel sin drop shadow. El header sticky usa `--color-surface-overlay` y un backdrop blur de `14px` para conservar legibilidad sobre contenido en movimiento; es una excepción funcional, no un motivo de glassmorphism.

El CSS global define tres sombras discretas — `--shadow-sm: 0 1px 2px rgba(40, 40, 40, 0.04)`, `--shadow-md: 0 4px 12px rgba(40, 40, 40, 0.05)` y `--shadow-lg: 0 10px 24px rgba(40, 40, 40, 0.06)` — pero `src/catalog.css` no las usa en superficies públicas. Inputs y búsqueda solo usan `0 0 0 3px var(--color-focus-ring)` como halo de interacción.

**Regla Flat-by-Default.** Se conservan las líneas finas y las capas tonales. Nunca se combina un borde decorativo de un píxel con una sombra suave amplia ni se añaden sombras pesadas para que un componente migrado parezca “terminado”.

## 5. Components

### Header

Sticky, silencioso y estructural. Usa una fila de escritorio de `72px`, borde inferior fino, superficie overlay clara y blur funcional de `14px`. La marca queda a la izquierda; Descubrir, Colección y Solicitud, a la derecha. A `820px` o menos se convierte en una composición de dos filas y `96px`. El contador de solicitud está delineado cuando está vacío y relleno con el primario cuando está activo.

### Hero

Composición de dos partes en escritorio: tesis de marca, controles de descubrimiento y enlace a la colección a la izquierda; showcase de producto a la derecha. El techo de display es `3.85rem`, por debajo del límite general de `6rem`. El hero es provisional: se conserva su geometría durante la migración y se revisan después composición, escala de imagen y comportamiento con pocos productos. El movimiento es un reveal corto de `320ms` con desplazamiento vertical de `7px` y se elimina con reducción de movimiento.

### Buscador

Campo claro de mínimo `52px`, borde fuerte de un píxel, radio de `10px`, icono de búsqueda dibujado y acción Limpiar solo cuando existe texto. El foco combina borde primario y halo de tres píxeles. La etiqueta permanece disponible para tecnologías de asistencia.

### Filtros

Las categorías son controles pill compactos. En reposo usan borde fino y tinta secundaria; el filtro activo usa primario profundo y texto inverso. En anchos grandes hacen wrap; a `430px` o menos se convierten en un scroller horizontal contenido. Es el único patrón de scroll horizontal intencional: la página nunca debe desplazarse horizontalmente.

### Colección

Sección clara elevada, separada por una línea hairline. Usa una medida centrada cercana a `1060px`, grid de dos columnas y tratamiento centrado cuando solo hay una tarjeta. Los estados vacío, carga, error y sin coincidencias viven en el mismo contexto, no como modales ni cards anidadas.

### Tarjetas

Radio de `10px`, borde de un píxel, superficie clara y ausencia de sombra. La imagen domina; título y precio comparten una línea compacta, la descripción se limita a dos líneas y el pie contiene solo atributos reales y acción de detalle. La proporción de imagen cambia deliberadamente por rango responsive. Nunca se anida una tarjeta dentro de otra.

### Galería

El detalle usa un plano de imagen grande y contenido, con thumbnails opcionales de `64px` en escritorio. El thumbnail elegido se identifica con borde primario y `aria-pressed`; la imagen principal usa alt real y los thumbnails repetidos usan alt vacío dentro de botones etiquetados. En anchos estrechos, los thumbnails pasan debajo de la imagen.

### Detalle

La galería se empareja con una columna informativa sticky en escritorio. Nombre, precio, resumen, tags reales, opciones de consulta, descripción y datos forman la jerarquía. El panel sand de consulta es agrupación tonal, no una card flotante adicional. A `820px` galería e información se apilan y la información aprovecha dos columnas; a `700px` se convierte en flujo de bloque.

### Solicitud

Lista de productos y resumen sticky en escritorio. Cada fila expone producto, precio unitario, cantidad, eliminación y subtotal. A `1024px` las filas se recomponen; a `820px` el resumen deja de ser sticky y se distribuye horizontalmente; a `700px` vuelve a una columna. La acción de WhatsApp es oscura, explícita y solo aparece cuando existe contacto.

### Estados vacíos y de error

Usan la misma jerarquía editorial y sans del catálogo, un mensaje direccional breve y una siguiente acción concreta. Mist y blush pueden identificar carga o error. El copy explica qué ocurrió y cómo continuar; nunca llena el espacio con productos o afirmaciones comerciales inventadas.

### Footer

Superficie primaria oscura con texto inverso a opacidades controladas. Contiene marca, navegación pública, año actual y acceso administrativo. Escritorio usa tres columnas; anchos medios, dos más una fila meta; anchos mínimos, una columna. Permanece compacto y no se convierte en un segundo hero.

### Matriz de validación responsive

| Viewport | Composición y controles obligatorios |
| --- | --- |
| `1440×900` | Aplicar el límite estándar de `1240px`; mantener hero y showcase de dos productos en dos columnas, colección de dos columnas, detalle de dos columnas y solicitud con lista más resumen. Verificar el espacio con uno o dos productos. |
| `1366×768` | Conservar composición de escritorio y revisar economía vertical: header de `72px`, hero y descubrimiento utilizables sin un fold gigante, imágenes contenidas e información sticky por debajo del header. |
| `1280×720` | Mantener estructura de escritorio con menor altura. Hero, búsqueda, filtros y entrada a colección deben seguir visibles; ninguna imagen de viewport completo oculta contenido comercial. |
| `1024×768` | Aplicar reglas de `1024px`: hero y showcase más estrechos, detalle y solicitud en dos columnas, filas de solicitud recompuestas. Ningún min-width puede crear overflow. |
| `768px` | Aplicar reglas de `820px`: header en dos filas, hero reducido, showcase de una pieza, detalle apilado con información interna en dos columnas, solicitud en una columna y resumen en dos. |
| `430×932` | Aplicar reglas de `700px` y `430px`: hero en una columna, categorías con scroll contenido, grid compacto de dos columnas, detalle y solicitud apilados, y ancho exterior restando `24px`. |
| `390×844` | Conservar la composición de `430px`; probar nombres largos de categoría y producto, cards de dos columnas, controles de cantidad y wrapping del footer. |
| `360×800` | Conservar la composición de `430px`, porque las simplificaciones bajo `360px` no aplican. Confirmar que el grid de dos columnas sigue siendo viable en este límite exacto. |
| `320×568` | Aplicar reglas bajo `360px`: subtítulo de marca simplificado, un producto en showcase, grid y footer de una columna, descripción y acción de tarjeta restauradas. Validar altura corta y acciones alcanzables. |

### Accesibilidad

- Usar landmarks, encabezados, listas, botones, enlaces, figuras, descripciones y regiones de estado semánticos según su propósito real.
- Mantener el orden de teclado alineado con el visual y foco `:focus-visible` perceptible en todo elemento interactivo.
- Conservar al menos `4.5:1` en cuerpo y placeholder, y `3:1` en texto grande y límites de interfaz significativos; verificar transparencias sobre la superficie final compuesta.
- Buscar touch targets de al menos `44×44px`. Si un chip visual conserva `32px` por paridad, ampliar su área efectiva en una tanda de accesibilidad posterior sin ocultar el cambio en la migración.
- Mantener alt significativo para producto, alt vacío para thumbnails repetidos dentro de controles etiquetados y labels útiles para controles icónicos.
- Conservar `prefers-reduced-motion: reduce`; cualquier movimiento nuevo necesita una alternativa equivalente.
- No se acepta scroll horizontal de página, encabezados cortados, foco oculto ni contenido recortado por alturas fijas.

### Rendimiento React

- Mantener estado local cuando pertenece a una página o interacción; conservar la solicitud compartida en el proveedor de carrito existente.
- No introducir `useEffect` para datos derivables durante render o desde un evento.
- Conservar cargas independientes en paralelo con `Promise.all`; no crear waterfalls.
- No recalcular colecciones derivadas costosas sin necesidad ni añadir `useMemo` a expresiones primitivas triviales.
- Mantener lazy loading de rutas e imágenes.
- No introducir dependencias visuales cuando CSS o la plataforma existente resuelvan el comportamiento de forma clara y accesible.

## 6. Do's and Don'ts

### Do

- **Do** tratar este documento como base visual provisional y reproducirla primero en la migración.
- **Do** conservar Newsreader, Manrope, fondos claros, acciones marrón oscuro, pasteles moderados, líneas finas, radios contenidos, cards equilibradas, scroll contenido, responsive funcional y footer oscuro.
- **Do** mantener fáciles de encontrar imágenes, búsqueda, filtros, precios, datos, gestión de solicitud y acciones de WhatsApp.
- **Do** verificar la matriz exacta de viewports, teclado, foco, contraste, touch targets, movimiento reducido y ausencia de scroll horizontal tras cada componente migrado.
- **Do** usar espaciado y cambios tonales antes de añadir elevación.
- **Do** separar una mejora visual justificada en su propia fase y diff después de demostrar paridad.

### Don't

- **Don't** usar degradados púrpura o azul genéricos.
- **Don't** usar texto con degradado.
- **Don't** introducir glassmorphism innecesario; el blur del header sticky es una excepción funcional existente, no un tema.
- **Don't** sustituir las fuentes actuales por fuentes del sistema sobreutilizadas ni usar Inter automáticamente.
- **Don't** anidar cards ni repetir grids de cards idénticas como estructura genérica.
- **Don't** usar redondeados exagerados; cards y campos públicos permanecen en la escala de `8–12px`, con pills solo para tags y filtros compactos.
- **Don't** añadir sombras grandes ni combinar borde decorativo de un píxel con sombra suave amplia.
- **Don't** crear un hero gigantesco ni usar el patrón hero-metric.
- **Don't** hacer imágenes de una pantalla de alto ni ocultar contenido comercial esencial.
- **Don't** cubrir toda la página de beige uniforme; la calidez surge del sistema completo, las imágenes y los acentos contenidos.
- **Don't** repetir etiquetas pequeñas, en mayúsculas y con tracking sobre cada sección ni usar marcadores numéricos salvo en secuencias reales.
- **Don't** dejar que una cuadrícula editorial compita con los productos ni hacer que el catálogo parezca una revista.
- **Don't** hacer que el catálogo parezca un dashboard o una página corporativa.
- **Don't** añadir bordes laterales decorativos, ilustraciones sketchy de fallback, fondos de rayas diagonales ni cuadrículas decorativas.
- **Don't** cambiar decisiones visuales arbitrariamente solo para producir un diff grande.
- **Don't** introducir productos, redes, teléfonos, testimonios, promociones ni información comercial ausente de los datos reales o de una fuente aprobada.
