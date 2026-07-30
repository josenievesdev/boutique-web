# Plan técnico de Tailwind CSS

## Estado actual

Tailwind CSS v4 está instalado y funcionando:

- `tailwindcss` y `@tailwindcss/vite` están declarados como dependencias.
- `vite.config.ts` registra el plugin oficial de Tailwind para Vite.
- `src/main.tsx` importa `src/tailwind.css` antes de las hojas heredadas.
- `src/tailwind.css` importa `tailwindcss/theme.css` y `tailwindcss/utilities.css`.
- Preflight no se importa y permanece desactivado.
- No existe ni se necesita `tailwind.config.*`; el proyecto usa configuración CSS-first.

La superficie pública completó la consolidación visual posterior al rediseño integral:

| Superficie | Construcción actual |
| --- | --- |
| Tokens y aliases públicos | CSS-first en `src/tailwind.css`. |
| Header, categorías, apertura, catálogo, cards, estados, detalle, solicitud, footer y 404 | Clases semánticas convencionales en `src/catalog.css`. |
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
- Los componentes públicos ya no usan utilities importantes; `catalog.css` resuelve su especificidad dentro del scope público.
- El orden no cambia, las hojas convencionales no se layerizan y no se añaden nuevos `!important`.

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
| Componentes TSX públicos | Estructura semántica y comportamiento visual local; sin construcción de layout mediante utilities. |
| `src/catalog.css` | Toda la presentación pública, estados, movimiento y responsive. |
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

## Contrato visual público

`src/catalog.css` contiene el contrato visual activo para:

- `.catalog-container`;
- `.catalog-eyebrow`;
- `.catalog-primary-action`;
- `.catalog-secondary-action`;
- `.catalog-whatsapp-action`;
- `.catalog-state` y sus tonos actuales de carga/información y error;
- familias semánticas de header, categorías, colección, card, detalle, solicitud, footer y 404.

Las primitivas dormidas de la etapa anterior se retiraron después de verificar sus consumidores. El listado completo está registrado en `DESIGN.md`.

## Estado de la migración

| Área | Estado | Siguiente autoridad |
| --- | --- | --- |
| Infraestructura Tailwind v4 | Completa | Mantener sin reinstalar ni activar Preflight. |
| Tokens públicos aislados | Implementados en Tanda 0B | `DESIGN.md` y `DESIGN_BIBLE.md`. |
| Header y búsqueda | Rediseñados con clases semánticas | Mantener compacto y contextual por ruta. |
| Categorías y apertura | Rediseñadas con clases semánticas | Validación visual manual pendiente. |
| Colección y cards | Rediseñadas con container queries | Validación con inventarios reales pendiente. |
| Footer, 404 y estados | Rediseñados | Revisión manual de contenido y accesibilidad pendiente. |
| Detalle | Rediseñado | Validación de fotografía real pendiente. |
| Solicitud | Rediseñada | Validación de contenido largo y teclado pendiente. |
| Administración | CSS heredado y fuera del scope público | Tanda 5. |
| Limpieza final de CSS público | Completada para selectores reemplazados | Mantener bridge hasta separar defaults globales. |

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

- `body` conserva `overflow-x: hidden` como default global para administración; `catalog.css` lo neutraliza solo cuando existe `.catalog-site`.
- Los defaults globales compartidos todavía justifican el bridge scoped aunque `catalog.css` ya consuma únicamente `--catalog-*`.
- `.route-loading` sigue usando el sistema global y no los tokens públicos.
- Los nombres legacy de pasteles todavía tienen consumidores.
- No existe todavía un scope semántico administrativo.

Estas deudas permanecen registradas porque resolverlas afectaría administración o el fallback global fuera del alcance público.

## Validación del rediseño público

El usuario ejecuta pruebas, build, lint, comandos Git y validación visual según `AGENTS.md`.

La revisión manual debe cubrir como mínimo:

- Inicio, detalle, solicitud, 404 y estados públicos bajo `.catalog-site`.
- Login, dashboard, productos, formulario, categorías y configuración administrativos para confirmar que no cambiaron.
- Contraste de texto secundario, línea fuerte, foco y estados sobre superficies reales.
- Foco de botones, enlaces, campos y controles compuestos.
- Reduced motion en acciones compartidas.
- Viewports `1440×900`, `1366×768`, `1280×720`, `1024×768`, `768px`, `430×932`, `390×844`, `360×800` y `320×568`.
- Ausencia de cambios en solicitud, cantidades, precios, WhatsApp y código de molde.

Durante el rediseño pasaron el typecheck, la transformación específica de Vite y las unidades acotadas de filtro, estado de solicitud y builders de WhatsApp. No se ejecutaron suite completa, build, lint ni comandos Git.

## Criterio de retiro del bridge

El bridge scoped se elimina únicamente cuando:

- cada selector público usa tokens `--catalog-*` o utilities conectadas al theme;
- una búsqueda completa no encuentra consumidores públicos del nombre global retirado;
- `src/index.css` conserva lo necesario para administración y defaults reales;
- la superficie administrativa se valida sin cambios;
- la matriz pública se valida manualmente;
- no se introducen nuevos `!important` para compensar la retirada.

Hasta entonces, el bridge es parte intencional del sistema híbrido y no deuda que deba eliminarse de forma oportunista.
