# Plan de migración a Tailwind CSS

## Estado y alcance

Este plan gobierna una migración progresiva y visualmente neutra del frontend público de `boutique-web`, desde CSS convencional hacia Tailwind CSS.

- Tailwind CSS no está instalado. `package.json`, `package-lock.json`, `vite.config.ts`, `src/` y `skills-lock.json` no contienen dependencia, plugin, directiva ni import de Tailwind.
- La aplicación carga actualmente `src/index.css`, `src/catalog.css` y `src/admin.css` desde `src/main.tsx`.
- El frontend público está implementado y constituye la base provisional aprobada documentada en `DESIGN.md`.
- La referencia visual segura es el tag inmutable `visual-public-v1`. Actualmente resuelve al commit `155787bbaf16df7fc2e8d93b76d1563c59e4135e`.
- Todo el trabajo de migración se desarrolla únicamente en `refactor/tailwind-public-migration`.
- La superficie pública entra primero en alcance. `src/admin.css` y la interfaz administrativa permanecen fuera hasta la fase administrativa posterior.

## Objetivo

Migrar progresivamente la construcción visual a Tailwind CSS sin alterar inicialmente el diseño provisional aprobado, el comportamiento del producto, el flujo de datos ni el copy público. La paridad técnica y visual precede al rediseño.

La migración debe conservar el dominio, la integración de Supabase, los repositorios, los casos de uso, la autenticación, el comportamiento de solicitud en `localStorage` y la generación de mensajes de WhatsApp.

## Estrategia técnica

1. Usar Tailwind CSS v4 y su integración oficial para Vite; instalar `tailwindcss` y `@tailwindcss/vite` únicamente cuando se autorice explícitamente la Fase 1.
2. Añadir el plugin de Tailwind para Vite junto al plugin actual de React, sin reemplazar la integración de React.
3. Mantener Preflight desactivado durante la primera etapa. Importar las capas de theme y utilities sin importar `tailwindcss/preflight.css` hasta evaluar el impacto en toda la aplicación.
4. Conservar inicialmente `src/index.css`, `src/catalog.css` y `src/admin.css`. La cascada y el reset existentes siguen siendo la fuente de paridad visual.
5. Definir tokens semánticos a partir de los valores exactos de `src/index.css`; no inventar una paleta ni una escala tipográfica nuevas durante la migración.
6. Migrar un componente o grupo estrechamente acoplado por vez. Cada paso debe ser revisable y reversible.
7. Eliminar un selector heredado solo después de que una búsqueda completa confirme que ningún JSX, TSX ni stylesheet restante lo consume.
8. No mezclar un rediseño fuerte con la migración. Las mejoras pertenecen a la Fase 10, después de la paridad y limpieza pública.
9. No migrar el panel administrativo durante las fases públicas. `src/admin.css` permanece intacto.

La documentación oficial de Tailwind confirma el paquete y plugin de Vite para v4 y explica cómo desactivar Preflight importando únicamente las partes necesarias:

- [Instalar Tailwind CSS con Vite](https://tailwindcss.com/docs/installation/using-vite)
- [Preflight](https://tailwindcss.com/docs/preflight)

## Fases de migración

### Fase 1 — Infraestructura Tailwind sin cambios visuales

- Instalar Tailwind CSS v4 y `@tailwindcss/vite`.
- Registrar el plugin oficial de Vite.
- Añadir una entrada CSS de Tailwind que importe theme y utilities, pero no Preflight.
- Mantener funcionando todos los imports y selectores actuales.
- Demostrar que pruebas, build, lint y capturas representativas no cambian antes de migrar un componente.

### Fase 2 — Tokens y tema

- Mapear colores semánticos, familias, espaciado, radios, anchos, transiciones y capas z-index de `src/index.css` al tema de Tailwind v4 cuando corresponda.
- Mantener disponibles las variables CSS existentes durante la convivencia.
- Conservar los valores exactos de `DESIGN.md`; no rediseñar paleta ni tipografía.
- Documentar cualquier token que no pueda representarse directamente antes de añadir una excepción.

### Fase 3 — Header público como piloto

- Migrar `CatalogHeader` y los estados del contador de solicitud como primer componente.
- Incluir el comportamiento de escritorio, `820px`, `700px`, `430px` y bajo `360px`.
- Conservar tipografía de marca, posición sticky, hairline, overlay funcional, regla de navegación activa y contador.
- No migrar `CatalogFooter` en el mismo commit.

### Fase 4 — Hero, búsqueda y filtros

- Migrar columna de copy del hero, enlace a colección, cabecera de descubrimiento, buscador, acción Limpiar, filtros de categoría y showcase.
- Conservar imágenes reales, estados actuales y scroller horizontal deliberado de categorías a `430px` o menos.
- Confirmar reducción de movimiento y ausencia de overflow horizontal de página.

### Fase 5 — Colección y tarjetas

- Migrar wrapper y header de colección, resumen de resultados, grid, `CatalogProductCard`, fallback de imagen, etiqueta destacada, tags y estados públicos.
- Conservar centrado de un producto, proporciones responsive, line clamping, bordes finos, radios moderados y ausencia de drop shadows.
- Eliminar los selectores correspondientes solo después de migrar todos sus consumidores.

### Fase 6 — Footer

- Migrar `CatalogFooter` por separado.
- Conservar superficie marrón profunda, jerarquía de opacidad del texto inverso, navegación, enlace administrativo y composiciones desktop, media y estrecha.

### Fase 7 — Detalle de producto

- Migrar breadcrumb, galería, thumbnails, información, precio, tags, panel de consulta, descripción, datos y estados de carga, error y producto ausente.
- Conservar columna sticky en escritorio, recomposición de `820px`, stack de `700px`, semántica del thumbnail elegido y comportamiento alt.

### Fase 8 — Solicitud

- Migrar `CartPage`, filas, cantidad, eliminación, totales, estado vacío, estados de contacto y acción de WhatsApp.
- Conservar provider, clave y forma de datos de `localStorage`, límites de cantidad, cálculo de total, confirmación y construcción de URL de WhatsApp.
- Validar resumen sticky de escritorio y todas las recomposiciones responsive.

### Fase 9 — Limpieza de CSS público heredado

- Buscar cada selector público en todo el repositorio antes de eliminarlo.
- Retirar reglas públicas obsoletas de `src/catalog.css` y declaraciones exclusivamente públicas de `src/index.css` que hayan quedado redundantes.
- Conservar carga de fuentes, variables aún consumidas, normalización, foco, carga de rutas y excepciones globales justificadas.
- Dejar `src/admin.css` intacto.
- Reducir o eliminar `src/catalog.css` solo hasta donde sus consumidores y la validación demuestren que es seguro.

### Fase 10 — Pulido visual mediante skills

- Comenzar solo después de paridad visual, pruebas, build, lint y responsive correctos.
- Tratar hero, composición exacta de escritorio, escala de imagen, espacio con pocos productos, detalles responsive seleccionados y tracking de display como backlog independiente.
- Usar un flujo documentado de Impeccable para cada mejora; no ocultar rediseño dentro de limpieza técnica.

### Fase 11 — Migración administrativa posterior

- Tratar administración como superficie `product`, centrada en claridad operativa y controles familiares.
- Auditar componentes administrativos y `src/admin.css` de forma independiente antes de definir tokens y orden.
- No asumir que cada tratamiento de marca público corresponde al panel.

## Inventario actual de CSS y componentes

### `src/index.css`

Provee la base global consumida por superficies públicas y administrativas:

- Variables semánticas de color para fondos, superficies, contenido, marca, bordes, foco, estados y pasteles reutilizables.
- Escalas de espaciado, radio, sombra, ancho de contenido, transición y z-index.
- Variables de familia Newsreader y Manrope.
- Box sizing, defaults de body, herencia de controles, inputs/selects/textarea, enlaces, imágenes, selección, disabled y foco global.
- Tamaño raíz y estado de carga de rutas lazy, spinner y override de movimiento reducido.

Estas responsabilidades se separarán con cuidado durante la convivencia. Las variables y normalización globales no se eliminan porque un componente público haya migrado.

### `src/catalog.css`

Los grupos funcionales públicos principales son:

- **Shell y primitivas compartidas:** `.catalog-site`, contenido visualmente oculto, `.catalog-eyebrow` y acciones primaria, secundaria y WhatsApp.
- **Header y navegación:** `.catalog-header`, wrapper, marca, enlaces y regla activa, enlace de solicitud y badge contador.
- **Hero y descubrimiento:** `.catalog-hero`, contenido y copy, enlace a colección, cabecera de descubrimiento, búsqueda, categorías y botones.
- **Showcase del hero:** `.catalog-showcase`, media, captions, variantes de producto y composición vacía.
- **Colección y tarjetas:** `.catalog-collection`, header, grid, media/cuerpo/pie de tarjeta, etiqueta destacada, tags y fallback.
- **Estados públicos:** carga, vacío, sin coincidencias y error mediante variantes de `.catalog-state`.
- **Detalle:** breadcrumb, layout, galería, thumbnails, información, precio, tags, consulta, acción de solicitud, descripción, datos y estados.
- **Solicitud:** `.cart-page`, header, lista, filas, cantidad, eliminación, subtotal, resumen sticky, WhatsApp, estado/error y vacío.
- **Footer:** marca, navegación, metadata y cambios responsive de columnas.
- **404 pública:** código, contenido, copy y acción de retorno.
- **Responsive:** grupos en `1024px`, `820px`, `700px`, `430px` y bajo `360px`.
- **Movimiento:** `catalog-reveal` y excepción pública de reduced motion.

### Consumidores React públicos

| Superficie o componente | Dependencia actual de estilos |
| --- | --- |
| `PublicPageShell`, `CatalogHeader`, `CatalogFooter` | Shell, header/navegación, acciones, footer y responsive de `src/catalog.css`; tokens y reset de `src/index.css`. |
| `CatalogHomePage` | Hero, descubrimiento, búsqueda, filtros, showcase, colección, estados, grid y responsive/motion. |
| `CatalogProductCard`, `CatalogProductImage` | Tarjeta, media, fallback, etiquetas, tags y reglas responsive. |
| `CatalogProductDetailPage` | Estados, breadcrumb, galería, thumbnails, información, contacto, datos, acciones y responsive. |
| `CartPage` y presentación del carrito | Header de solicitud, filas, cantidad, resumen, vacío, acciones, shell/footer y responsive. |
| `CatalogNotFoundPage` | Shell, composición 404, tipografía, acción primaria y responsive. |
| Fallback de rutas de `src/main.tsx` | Base de carga y reduced motion de `src/index.css`. |

`src/admin.css` se carga globalmente hoy, pero no es objetivo de la migración pública. Permanece intacto hasta la Fase 11.

## Reglas de convivencia

- Un componente migrado usa Tailwind para la mayor parte de su construcción visual específica.
- No añadir overrides indefinidos para enfrentar CSS viejo y Tailwind por especificidad. Cada componente debe tener propiedad clara.
- Mantener CSS global solo para fuentes, variables globales, normalización, defaults de documento y excepciones justificadas.
- No usar `@apply` como sustituto general de componentes React ni para reconstruir el stylesheet anterior con otra sintaxis.
- No construir fragmentos dinámicos de clases que Tailwind no pueda detectar. Usar clases estáticas completas o mapas explícitos de variantes completas.
- No añadir `tailwind.config.js` salvo necesidad real y documentada. El tema CSS-first de Tailwind v4 es la ruta predeterminada.
- No activar Preflight hasta revisar su impacto en toda la aplicación pública y administrativa.
- `src/admin.css` permanece intacto durante la migración pública.
- Conservar deliberadamente el orden de imports CSS hasta que una fase demuestre otro orden seguro.
- Si selector heredado y Tailwind conviven temporalmente, registrar cuál gobierna cada propiedad y retirar la regla vieja al migrar su último consumidor.
- No introducir dependencias visuales, librerías de componentes ni paquetes de iconos como parte de la migración.

## Validación por fase

Cada fase de componente incluye:

1. `npm run test:run`
2. `npm run build`
3. `npm run lint`
4. `git diff --check`
5. Búsqueda en el repositorio de selectores eliminados y consumidores.
6. Comparación visual con `visual-public-v1` en `1440×900`, `1366×768`, `1280×720`, `1024×768`, `768px`, `430×932`, `390×844`, `360×800` y `320×568`.
7. Verificación de teclado, foco, reduced motion, touch targets, alt, contraste, ausencia de scroll horizontal y contenido cortado.
8. Confirmación de que solicitud, cantidades, precios, enlaces de producto y salida de WhatsApp permanecen intactos.

## Criterios de finalización

La migración pública termina únicamente cuando:

- El frontend público está migrado a Tailwind según el alcance por fases.
- No existen diferencias visuales accidentales frente a la base provisional aprobada antes de las mejoras de Fase 10.
- No quedan selectores públicos obsoletos.
- Ningún viewport compatible presenta scroll horizontal de página ni contenido cortado.
- Las pruebas pasan.
- El build de producción pasa.
- El lint está limpio.
- La matriz responsive completa está validada.
- El CSS público heredado está eliminado o reducido a excepciones globales justificadas.
- CSS y comportamiento administrativos permanecen intactos hasta su propia fase.

## Reglas de Git

- Una responsabilidad por commit.
- Codex nunca crea commits para esta migración.
- Cada tanda debe mostrar `git diff` y sus resultados de validación antes de entregar.
- La migración se desarrolla únicamente en `refactor/tailwind-public-migration`.
- El tag `visual-public-v1` nunca se mueve, reemplaza ni sobrescribe.
- Infraestructura, tokens, cada grupo de componentes, limpieza y pulido posterior permanecen como cambios revisables y separados.
