# Plan técnico de Tailwind CSS

## Estado actual

Tailwind CSS v4 está instalado y funcionando:

- `tailwindcss` y `@tailwindcss/vite` están declarados como dependencias.
- `vite.config.ts` registra el plugin oficial de Tailwind para Vite.
- `src/main.tsx` importa `src/tailwind.css` antes de las hojas heredadas.
- `src/tailwind.css` importa `tailwindcss/theme.css` y `tailwindcss/utilities.css`.
- Preflight no se importa y permanece desactivado.
- No existe ni se necesita `tailwind.config.*`; el proyecto usa configuración CSS-first.

La superficie pública es híbrida:

| Superficie | Construcción actual |
| --- | --- |
| Header, apertura, búsqueda, filtros y showcase existente | Utilities de Tailwind v4. |
| Catálogo, cards, estados, detalle, solicitud, footer y 404 | CSS convencional en `src/catalog.css`. |
| Administración | CSS convencional en `src/admin.css`. |
| Normalización y defaults compartidos | `src/index.css`. |

## Objetivo técnico vigente

La migración debe permitir el rediseño por tandas de `DESIGN_BIBLE.md` sin modificar comportamiento de producto ni trasladar la personalidad pública a administración.

Debe conservar:

- Dominio, Supabase, repositorios y casos de uso.
- Autenticación, rutas, slugs y permisos.
- Solicitud persistida en `localStorage`.
- Cantidades, precios, subtotales y valor de referencia.
- Mensajes y enlaces de WhatsApp.
- Contratos y código de molde.
- Carga diferida de rutas y cargas independientes en paralelo.

## Orden de estilos

`src/main.tsx` conserva este orden:

```text
tailwind.css
→ index.css
→ catalog.css
→ admin.css
```

Consecuencias actuales:

- Theme y utilities de Tailwind están en layers.
- `index.css`, `catalog.css` y `admin.css` no están layerizados y se cargan después.
- Algunos componentes migrados usan utilities importantes para vencer defaults globales.
- Tanda 0B no cambia este orden, no layeriza hojas heredadas y no añade nuevos `!important`.

La resolución definitiva de especificidad pertenece a la tanda del consumidor. No se debe responder a la convivencia acumulando overrides transversales.

## Tanda 0B: tokens públicos

### Estado

Implementada a nivel de CSS y documentación. La validación visual manual continúa pendiente.

### Fuente única

`src/tailwind.css` contiene los valores definitivos `--catalog-*` dentro de `.catalog-site`:

- fondos y superficies;
- texto, acción y acento;
- líneas, foco y estados;
- familias y escala tipográfica;
- espaciado y alturas de control;
- radios y sombras;
- anchos;
- motion y z-index.

El scope coincide con el wrapper de `PublicPageShell`:

```tsx
<div className="catalog-site">…</div>
```

Las rutas administrativas no viven dentro de ese wrapper y no reciben los aliases públicos.

### Theme de Tailwind

`@theme inline` conecta las utilities existentes `boutique-*` con `--catalog-*`. Las utilities no contienen valores de marca independientes.

Ejemplos:

```css
--color-boutique-canvas: var(--catalog-color-canvas);
--color-boutique-ink: var(--catalog-color-ink);
--font-boutique-display: var(--catalog-font-display);
--radius-boutique-control: var(--catalog-radius-control);
```

Esto mantiene nombres de clase detectables de forma estática y evita fragmentos dinámicos.

### Bridge de compatibilidad

Los selectores convencionales públicos todavía leen nombres globales como `--color-text`, `--radius-md` o `--transition-fast`. `.catalog-site` los redefine como aliases de los tokens públicos:

```css
.catalog-site {
  --color-text: var(--catalog-color-ink);
  --radius-md: var(--catalog-radius-media);
  --transition-fast: var(--catalog-transition-fast);
}
```

Este bridge permite una migración progresiva sin editar cards, detalle, solicitud o footer en Tanda 0B. No duplica valores: cada alias apunta a una fuente `--catalog-*`.

Se retira por familia solo cuando una búsqueda completa confirme que el último consumidor público usa el nombre nuevo.

### Compatibilidad de nombres pastel

Los nombres `boutique-sage`, `boutique-blush`, `boutique-rose`, `boutique-mist` y sus equivalentes globales permanecen temporalmente porque ya tienen consumidores.

No representan una nueva paleta pública:

- sage resuelve a superficie de éxito;
- blush resuelve a superficie de error;
- rose resuelve al acento neutral suave;
- mist resuelve a superficie informativa;
- sand resuelve a la superficie arena.

No se deben crear consumidores nuevos con esos nombres legacy.

## Ownership visual

| Archivo o capa | Responsabilidad permitida |
| --- | --- |
| `src/tailwind.css` | Valores `--catalog-*`, scope público, bridge temporal y theme utilities. |
| `src/index.css` | Normalización, defaults del documento, tokens globales de compatibilidad, formularios globales, carga de rutas y reduced motion. |
| Utilities en TSX | Construcción visual específica del componente ya migrado. |
| `src/catalog.css` | Primitivas públicas y componentes aún no migrados. |
| `src/admin.css` | Toda la presentación administrativa hasta Tanda 5. |

### Lo que permanece global

- `color-scheme`.
- `box-sizing`.
- Defaults de `html`, `body`, enlaces, imágenes y controles.
- Foco y disabled globales mientras existan consumidores compartidos.
- Variables de `:root` consumidas por administración.
- `.route-loading`, porque el fallback de Suspense se renderiza fuera de `.catalog-site`.
- Override general de `prefers-reduced-motion`.

### Lo reservado para administración

- Valores actuales de `:root`.
- Todos los selectores `.admin-*`.
- Densidad, escalas, formularios, cards, tablas/listas y estados del panel.
- Un futuro scope administrativo con registro `product`, definido solo en Tanda 5.

No se debe mover un token público a `:root` para facilitar una utility. Si una necesidad administrativa y pública coincide, ambas superficies pueden apuntar a un valor común explícito en una tanda posterior; no se asume esa coincidencia.

## Primitivas disponibles

`src/catalog.css` contiene el contrato visual inicial para:

- `.catalog-container` y modificadores de medida;
- `.catalog-title` y escalas de display/item;
- `.catalog-eyebrow`;
- `.catalog-secondary-text`;
- `.catalog-primary-action`;
- `.catalog-secondary-action`;
- `.catalog-whatsapp-action`;
- `.catalog-field`;
- `.catalog-focus-ring`;
- `.catalog-badge`;
- `.catalog-state` y sus tonos actuales de carga/información y error;
- `.catalog-product-media`;
- `.catalog-price`;
- `.catalog-separator`.

Acciones, eyebrow y estados existentes ya comparten ese contrato. Las demás primitivas quedan disponibles, pero no se aplican masivamente antes de la tanda de cada componente.

## Estado de la migración

| Área | Estado | Siguiente autoridad |
| --- | --- | --- |
| Infraestructura Tailwind v4 | Completa | Mantener sin reinstalar ni activar Preflight. |
| Tokens públicos aislados | Implementados en Tanda 0B | `DESIGN.md` y `DESIGN_BIBLE.md`. |
| Header | Migrado a utilities, diseño anterior | Tanda 1A. |
| Apertura, búsqueda, filtros y showcase | Migrados a utilities, diseño anterior | Tanda 1A y Tanda 1B. |
| Colección y cards | CSS heredado | Tanda 1B. |
| Footer y 404 | CSS heredado | Tanda 4, dividido en subtandas. |
| Detalle | CSS heredado | Tanda 2. |
| Solicitud | CSS heredado | Tanda 3. |
| Administración | CSS heredado y fuera del scope público | Tanda 5. |
| Limpieza final de CSS público | Pendiente | Solo después de migrar todos los consumidores. |

## Reglas para próximas tandas

1. Migrar una responsabilidad visual estrecha por vez.
2. Usar `--catalog-*` o utilities `boutique-*` conectadas al theme; no añadir valores de marca paralelos.
3. No usar `@apply` para reconstruir componentes.
4. No componer nombres de utilities dinámicamente.
5. No añadir `tailwind.config.*` sin una necesidad técnica demostrada.
6. No activar Preflight.
7. No cambiar el orden de imports sin una tanda de cascade específica.
8. No eliminar un selector heredado antes de buscar todos sus consumidores.
9. No migrar `src/admin.css` durante las tandas públicas.
10. No corregir microtexto, breakpoints o layouts de un componente fuera de su tanda.
11. No añadir dependencias visuales para resolver primitives disponibles en CSS o plataforma.
12. Conservar lazy loading de rutas, cargas paralelas y `content-visibility` donde siga siendo útil.

## Deuda heredada conocida

- Utilities y selectores con tamaños menores de `12px` continúan en header, cards, detalle, solicitud y footer.
- Existen utilities importantes por la precedencia de hojas no layerizadas.
- `body` usa `overflow-x: hidden` y `.catalog-site` usa `overflow-x: clip`.
- Breakpoints equivalentes están repartidos entre utilities arbitrarias y media queries.
- Muchos selectores convencionales todavía consumen nombres globales mediante el bridge.
- `.route-loading` sigue usando el sistema global y no los tokens públicos.
- Los nombres legacy de pasteles todavía tienen consumidores.
- No existe todavía un scope semántico administrativo.

Estas deudas se registran; no se corrigen dentro de Tanda 0B.

## Validación manual por tanda

El usuario ejecuta pruebas, build, lint, comandos Git y validación visual según `AGENTS.md`.

Para Tanda 0B debe revisar como mínimo:

- Inicio, detalle, solicitud, 404 y estados públicos bajo `.catalog-site`.
- Login, dashboard, productos, formulario, categorías y configuración administrativos para confirmar que no cambiaron.
- Contraste de texto secundario, línea fuerte, foco y estados sobre superficies reales.
- Foco de botones, enlaces, campos y controles compuestos.
- Reduced motion en acciones compartidas.
- Viewports `1440×900`, `1280×720`, `1024×768`, `768px`, `430×932`, `390×844`, `360×800` y `320×568`.
- Ausencia de cambios en solicitud, cantidades, precios, WhatsApp y código de molde.

No se ejecutaron suite completa, build, lint ni comandos Git durante la implementación de Tanda 0B.

## Criterio de retiro del bridge

El bridge scoped se elimina únicamente cuando:

- cada selector público usa tokens `--catalog-*` o utilities conectadas al theme;
- una búsqueda completa no encuentra consumidores públicos del nombre global retirado;
- `src/index.css` conserva lo necesario para administración y defaults reales;
- la superficie administrativa se valida sin cambios;
- la matriz pública se valida manualmente;
- no se introducen nuevos `!important` para compensar la retirada.

Hasta entonces, el bridge es parte intencional del sistema híbrido y no deuda que deba eliminarse de forma oportunista.
