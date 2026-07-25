# Design System: boutique-web

## Estado

Registro técnico del sistema visual público después de la **Tanda 0B: tokens y sistema visual público**.

- Concepto: **“Atelier abierto: una boutique digital donde la colección es la interfaz”.**
- Scope público: `.catalog-site`.
- Fuente de tokens públicos: `src/tailwind.css`.
- Primitivas públicas: `src/catalog.css`.
- Dirección normativa: `DESIGN_BIBLE.md`.
- Tailwind CSS v4 y `@tailwindcss/vite` están instalados y activos.
- `src/tailwind.css` importa theme y utilities; Preflight continúa desactivado.
- La interfaz sigue siendo híbrida. Esta tanda no migra páginas ni elimina selectores heredados.

## Principio de aislamiento

Los valores `--catalog-*` existen únicamente bajo `.catalog-site`. No se cambiaron los tokens globales de `:root`, porque `src/admin.css` todavía los consume de forma directa.

```css
.catalog-site {
  --catalog-color-canvas: #faf8f3;
  --catalog-color-ink: #292825;
  /* ... */
}
```

El mismo scope expone temporalmente nombres heredados como `--color-background`, `--radius-md` y `--transition-fast`. Los selectores públicos que aún usan esos nombres reciben los valores de v2 por herencia; administración, al estar fuera de `.catalog-site`, continúa resolviendo los valores globales de `src/index.css`.

Este puente es de compatibilidad, no una segunda fuente de valores. Se retira nombre por nombre cuando migre el último consumidor público.

## Paleta pública definitiva

La paleta usa marfil cálido, carbón suave, piedra y arena. El acento es un taupe neutral configurable y no un rosa de marca, dorado artificial ni color promocional.

### Base y superficies

| Token | Valor | Rol |
| --- | --- | --- |
| `--catalog-color-canvas` | `#faf8f3` | Fondo marfil de la experiencia pública. |
| `--catalog-color-canvas-subtle` | `#f3f1ec` | Secciones y estados de bajo énfasis. |
| `--catalog-color-surface` | `#efede7` | Superficie piedra. |
| `--catalog-color-surface-raised` | `#fffefa` | Campos y planos claros de producto. |
| `--catalog-color-surface-muted` | `#ebe7df` | Superficie arena atenuada. |
| `--catalog-color-overlay` | `rgba(250, 248, 243, 0.96)` | Superficie sticky pública. |
| `--catalog-color-stone` | `#d9d5ce` | Piedra explícita para separaciones tonales. |
| `--catalog-color-sand` | `#e9e2d7` | Arena explícita para agrupaciones cálidas. |

### Texto, acción y acento

| Token | Valor | Rol |
| --- | --- | --- |
| `--catalog-color-ink` | `#292825` | Texto principal y carbón de acción. |
| `--catalog-color-text-muted` | `#625f59` | Texto secundario y metadata. |
| `--catalog-color-text-inverse` | `#faf8f3` | Texto sobre carbón. |
| `--catalog-color-action` | `#292825` | Acción primaria y WhatsApp. |
| `--catalog-color-action-hover` | `#191815` | Hover de acción primaria. |
| `--catalog-color-action-soft` | `#e2ded6` | Selección o apoyo de acción. |
| `--catalog-accent` | `#695f57` | Fuente configurable del acento neutral. |
| `--catalog-accent-hover` | `#514a44` | Estado fuerte del acento. |
| `--catalog-accent-soft` | `#e8e2db` | Campo suave del acento. |
| `--catalog-color-accent` | `var(--catalog-accent)` | Alias semántico de uso. |
| `--catalog-color-accent-hover` | `var(--catalog-accent-hover)` | Alias semántico de hover. |
| `--catalog-color-accent-soft` | `var(--catalog-accent-soft)` | Alias semántico suave. |

La familia de acento se cambia como unidad. Cualquier configuración futura debe proporcionar base, hover y soft, y volver a verificar contraste; esta tanda no conecta el acento a datos ni configuración de Supabase.

### Líneas y foco

| Token | Valor | Rol |
| --- | --- | --- |
| `--catalog-color-line` | `rgba(41, 40, 37, 0.16)` | Hairline estructural no esencial. |
| `--catalog-color-line-strong` | `#817b73` | Límite interactivo esencial. |
| `--catalog-color-focus` | `#5c534c` | Outline y focus-within público. |

### Estados

| Estado | Texto | Superficie | Línea |
| --- | --- | --- | --- |
| Éxito | `#3f654e` | `#e1ebe3` | `#708878` |
| Advertencia | `#6d5832` | `#f1e9d9` | `#987b49` |
| Error | `#85483f` | `#f2e2df` | `#a0645d` |
| Información/carga | `#4f6269` | `#e4ebed` | `#71878e` |

Contrastes calculados sobre sus superficies:

- Tinta principal sobre canvas: `13.89:1`.
- Texto secundario sobre canvas: `5.99:1`.
- Línea fuerte sobre canvas: `3.95:1`.
- Texto inverso sobre acción: `13.89:1`.
- Acento sobre canvas: `5.86:1`.
- Textos de estado sobre sus superficies: entre `5.30:1` y `5.63:1`.
- Líneas de estado sobre sus superficies: entre `3.13:1` y `3.74:1`.

Las transparencias, estados disabled y composiciones reales todavía requieren comprobación visual manual.

## Tipografía pública

### Familias

| Token | Familia | Uso |
| --- | --- | --- |
| `--catalog-font-display` | Newsreader, Georgia, Times New Roman, serif | Marca, títulos y nombres de producto. |
| `--catalog-font-sans` | Manrope, ui-sans-serif, system-ui, Segoe UI, sans-serif | Navegación, precios, controles y texto funcional. |

### Escala

| Token | Valor |
| --- | --- |
| `--catalog-text-display` | `clamp(2.5rem, 4.2vw, 4rem)` |
| `--catalog-text-headline` | `clamp(1.9rem, 3vw, 2.75rem)` |
| `--catalog-text-title` | `clamp(1.1rem, 1.5vw, 1.35rem)` |
| `--catalog-text-body` | `1rem` |
| `--catalog-text-supporting` | `0.875rem` |
| `--catalog-text-navigation` | `0.75rem` |
| `--catalog-text-button` | `0.8125rem` |
| `--catalog-text-price` | `0.9375rem` |
| `--catalog-text-label` | `0.75rem` |

Ningún token funcional nuevo baja de `12px`. Los tamaños menores escritos directamente en selectores o utilities existentes son deuda heredada y se corrigen en la tanda del consumidor, no mediante overrides globales.

### Ritmo tipográfico

| Token | Valor |
| --- | --- |
| `--catalog-leading-display` | `1.02` |
| `--catalog-leading-headline` | `1.06` |
| `--catalog-leading-title` | `1.16` |
| `--catalog-leading-body` | `1.6` |
| `--catalog-tracking-display` | `-0.035em` |
| `--catalog-tracking-headline` | `-0.03em` |
| `--catalog-tracking-title` | `-0.015em` |

## Espaciado y controles

La escala `--catalog-space-*` conserva incrementos de `4px`:

`4`, `8`, `12`, `16`, `20`, `24`, `32`, `40`, `48`, `64`, `80`, `96`.

| Token | Valor | Uso |
| --- | --- | --- |
| `--catalog-gutter-inline` | `clamp(16px, 4vw, 64px)` | Margen exterior público. |
| `--catalog-control-height-compact` | `44px` | Mínimo táctil. |
| `--catalog-control-height` | `48px` | Botones y campos estándar. |
| `--catalog-control-height-large` | `52px` | Búsqueda o control principal. |

## Forma y elevación

| Token | Valor | Uso |
| --- | --- | --- |
| `--catalog-radius-control` | `8px` | Botones y campos. |
| `--catalog-radius-media` | `10px` | Planos de imagen. |
| `--catalog-radius-panel` | `12px` | Estados agrupados. |
| `--catalog-radius-pill` | `999px` | Badges y contadores únicamente. |
| `--catalog-radius-circle` | `50%` | Elementos circulares reales. |
| `--catalog-shadow-hairline` | `0 1px 0 rgba(41, 40, 37, 0.12)` | Separación sticky. |
| `--catalog-shadow-sm` | `0 1px 2px rgba(41, 40, 37, 0.04)` | Excepción funcional mínima. |
| `--catalog-shadow-md` | `0 4px 10px rgba(41, 40, 37, 0.05)` | Overlay pequeño. |
| `--catalog-shadow-lg` | `0 8px 16px rgba(41, 40, 37, 0.06)` | Techo de elevación pública. |

Las cards públicas permanecen sin sombra. Ningún componente combina hairline decorativo con sombra amplia.

## Anchos

| Token | Valor |
| --- | --- |
| `--catalog-width-wide` | `1440px` |
| `--catalog-width-standard` | `1240px` |
| `--catalog-width-detail` | `1200px` |
| `--catalog-width-form` | `900px` |
| `--catalog-width-prose` | `70ch` |
| `--catalog-width-narrow` | `460px` |

## Motion y capas

| Token | Valor |
| --- | --- |
| `--catalog-duration-fast` | `140ms` |
| `--catalog-duration-base` | `180ms` |
| `--catalog-duration-slow` | `220ms` |
| `--catalog-ease-standard` | `ease` |
| `--catalog-ease-out` | `cubic-bezier(0.23, 1, 0.32, 1)` |
| `--catalog-z-base` | `0` |
| `--catalog-z-raised` | `10` |
| `--catalog-z-sticky` | `20` |
| `--catalog-z-overlay` | `40` |
| `--catalog-z-modal` | `50` |

Las transiciones compuestas `--catalog-transition-fast`, `--catalog-transition-base` y `--catalog-transition-slow` combinan esas duraciones y curvas. No se usa `transition: all`. Las primitivas con transform de presión eliminan el movimiento bajo `prefers-reduced-motion`.

## Primitivas públicas

`src/catalog.css` define estas APIs sin migrar todavía todos sus consumidores:

| Primitiva | Responsabilidad |
| --- | --- |
| `.catalog-container` | Medida amplia y gutter público. |
| `.catalog-container--standard` | Medida estándar. |
| `.catalog-container--prose` | Medida de lectura. |
| `.catalog-title` | Título Newsreader principal. |
| `.catalog-title--display` | Escala de apertura. |
| `.catalog-title--item` | Nombre o título de producto. |
| `.catalog-eyebrow` | Label breve de `12px`, uso excepcional. |
| `.catalog-secondary-text` | Texto funcional secundario. |
| `.catalog-primary-action` | Acción primaria carbón. |
| `.catalog-secondary-action` | Acción secundaria delineada. |
| `.catalog-whatsapp-action` | Acción WhatsApp con la misma jerarquía primaria, sin verde inventado. |
| `.catalog-field` | Input público de `48px`. |
| `.catalog-focus-ring` | Focus-within único para controles compuestos y sus hijos directos. |
| `.catalog-badge` | Metadata discreta; no promociones. |
| `.catalog-state`, `--mist` y `--error` | Vacío, carga/información y error compatibles con el componente actual. |
| `.catalog-product-media` | Plano `4:5`, imagen contenida. |
| `.catalog-price` | Precio Manrope con números tabulares. |
| `.catalog-separator` | Hairline horizontal. |

Las clases existentes de acciones, eyebrow y estados ya consumen el sistema. Las nuevas primitivas de contenedor, títulos, texto, campo, badge, media, precio y separador quedan disponibles para las siguientes tandas.

## Tailwind CSS v4

`@theme inline` expone utilities `boutique-*` que resuelven los aliases `--catalog-*` dentro del shell público:

- Colores: `bg-boutique-canvas`, `text-boutique-ink`, `border-boutique-line`, estados, piedra y arena.
- Familias: `font-boutique-display`, `font-boutique-sans`.
- Escala: `text-boutique-display`, `text-boutique-headline`, `text-boutique-title`, `text-boutique-body`, `text-boutique-navigation`, `text-boutique-button`, `text-boutique-price`, `text-boutique-label`.
- Radios: `rounded-boutique-control`, `rounded-boutique-card`, `rounded-boutique-panel` y pills reservados.
- Sombras, contenedores, alturas de control y easings equivalentes.

Los nombres heredados `boutique-sage`, `boutique-blush`, `boutique-rose` y `boutique-mist` permanecen como aliases de compatibilidad. Ya no definen una paleta pastel de marca: resuelven estados semánticos o acento neutral y se retiran con sus consumidores.

## Propiedad visual

| Capa | Propiedad actual |
| --- | --- |
| `src/tailwind.css` | Valores definitivos `--catalog-*`, scope `.catalog-site`, bridge heredado y theme utilities. |
| `src/index.css` | Tokens globales de compatibilidad, normalización, defaults de documento, formularios globales, carga de rutas y reduced motion. |
| Utilities en TSX | Construcción visual ya migrada de header, apertura, búsqueda, filtros y showcase. No se reorganizó en Tanda 0B. |
| `src/catalog.css` | Primitivas públicas y layout heredado de catálogo, detalle, solicitud, footer y 404. |
| `src/admin.css` | Propiedad exclusiva de la superficie administrativa actual. |

El orden de imports permanece `tailwind.css` → `index.css` → `catalog.css` → `admin.css`. Preflight sigue desactivado. No se añadieron layers a hojas heredadas ni nuevos `!important`.

## Qué permanece global

- `color-scheme` y defaults del documento.
- `box-sizing`, body, herencia de controles, enlaces e imágenes.
- Variables `--color-*`, `--space-*`, `--radius-*`, `--shadow-*`, `--content-width-*`, `--transition-*`, `--z-*` y `--font-family-*` mientras administración las consuma.
- Foco y formularios globales durante la convivencia.
- Fallback de rutas `.route-loading`.
- Override global de `prefers-reduced-motion`.

## Qué queda reservado para administración

- Todos los valores globales actuales de `src/index.css`.
- Todos los selectores de `src/admin.css`.
- Densidad, tipografía, radios, sombras, formularios, tablas/listas y estados administrativos.
- Una futura familia de aliases administrativos bajo registro `product`, que solo se define en Tanda 5.

Administración no hereda `--catalog-*` porque sus rutas no se renderizan dentro de `.catalog-site`. No se modificó `src/admin.css`.

## Reglas pendientes de convivencia

- No eliminar el bridge de variables hasta migrar y buscar todos los consumidores públicos.
- No sustituir valores hard-coded de componentes fuera de su tanda.
- No corregir microtexto heredado en header, cards, detalle, solicitud o footer desde un override transversal.
- No activar Preflight ni cambiar el orden de hojas.
- No añadir `@apply`, configuración JavaScript de Tailwind o nombres dinámicos de utilities.
- No convertir los aliases legacy de pasteles en una segunda paleta.
- No asumir que `.route-loading`, al vivir fuera de `.catalog-site`, ya usa el sistema público.
- No declarar paridad o finalización sin validación manual de la superficie pública y administrativa.
