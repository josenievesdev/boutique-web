# Sistema visual: boutique-web

## Estado

Registro técnico posterior a la pasada integral de rediseño público del 29 de julio de 2026.

- Concepto: **“Una colección abierta: las prendas, los precios y la personalización son el centro de la experiencia”.**
- Registro público: `brand`.
- Scope público: `.catalog-site`.
- Fuente de tokens públicos: `src/tailwind.css`.
- Construcción visual pública: clases semánticas en `src/catalog.css`.
- Dirección normativa: `DESIGN_BIBLE.md`.
- Tailwind CSS v4 sigue activo sin Preflight ni `tailwind.config.*`.
- Administración continúa fuera del scope público y conserva `src/admin.css` sin cambios.

El rediseño sustituyó la capa híbrida de utilities y CSS heredado. Los componentes públicos ya no construyen su layout con utilities Tailwind: consumen clases semánticas respaldadas por los aliases `--catalog-*`. Tailwind permanece como infraestructura CSS-first y fuente de theme, no como una segunda implementación visual.

## Principio de aislamiento

Los valores públicos viven únicamente bajo `.catalog-site`:

```css
.catalog-site {
  --catalog-color-canvas: #faf8f3;
  --catalog-color-ink: #292825;
  /* ... */
}
```

Los tokens globales de `src/index.css` no se modificaron porque administración los consume directamente. El bridge scoped hacia nombres globales se conserva para los defaults compartidos de documento, campos y foco; no existen consumos directos de `--color-*`, `--space-*`, `--radius-*` o `--font-family-*` dentro del nuevo `src/catalog.css`.

## Arquitectura pública

```text
PublicPageShell
├── enlace de salto
├── CatalogHeader sticky
├── contenido de ruta
└── CatalogFooter
```

### Inicio

```text
Header con búsqueda
→ categorías
→ cabecera breve de colección + contador
→ estado o grid filtrado
→ proceso de solicitud
→ footer
```

`CatalogCategoryNavigation` separa filtros del header. En escritorio muestra `Todo`, cuatro categorías y `Más` cuando corresponde. En tablet y móvil muestra todas las categorías en un scroller horizontal contenido. El menú `Más` cierra con `Escape`, selección, pérdida de foco y clic exterior.

### Detalle y solicitud

El header usa una variante contextual con marca, `Buscar prendas`, `Colección` y `Mi selección`. No renderiza un campo de búsqueda fuera del inicio.

El detalle conserva galería, thumbnails, agregado, consulta individual, descripción, personalización, preparación y código de molde. La afirmación fija `Disponible` se retiró porque el contrato de producto no contiene inventario.

La solicitud conserva snapshots, cantidades, eliminación, vaciado, subtotales, total de referencia y WhatsApp. Las piezas se presentan como filas de una lista y el resumen permanece sticky solo cuando hay anchura útil.

## Paleta pública

| Token | Valor | Rol |
| --- | --- | --- |
| `--catalog-color-canvas` | `#faf8f3` | Canvas público. |
| `--catalog-color-canvas-subtle` | `#f3f1ec` | Franja de proceso y estados neutros. |
| `--catalog-color-surface` | `#efede7` | Planos de imagen. |
| `--catalog-color-surface-raised` | `#fffefa` | Campos y menú. |
| `--catalog-color-surface-muted` | `#ebe7df` | Imagen ausente. |
| `--catalog-color-ink` | `#292825` | Texto y acciones principales. |
| `--catalog-color-text-muted` | `#625f59` | Apoyo y metadata. |
| `--catalog-color-line` | `rgba(41, 40, 37, 0.16)` | Separación estructural. |
| `--catalog-color-line-strong` | `#817b73` | Límites interactivos. |
| `--catalog-color-focus` | `#5c534c` | Foco visible. |
| `--catalog-color-accent` | `#695f57` | Acento neutral funcional. |

La acción principal y WhatsApp comparten carbón. No se inventó un verde de canal, una paleta promocional ni color de disponibilidad.

## Tipografía

| Rol | Familia | Uso |
| --- | --- | --- |
| Marca y display | Newsreader `400–500` | Marca, títulos y nombres de producto. |
| Interfaz y datos | Manrope `400–600` | Navegación, controles, precios, metadata y cuerpo. |

Reglas vigentes:

- El display no baja de `-0.035em` de tracking.
- El cuerpo funcional no baja de `12px`.
- Nombres, códigos y copy dinámico usan wrapping seguro.
- Precios, cantidades, subtotales y contadores usan números tabulares.
- Headings breves usan `text-wrap: balance`; prosa usa `text-wrap: pretty`.

## Escala y medidas

| Token o superficie | Medida |
| --- | --- |
| Contenedor público | `1240px` |
| Detalle y solicitud | `1200px` |
| Estado lineal | `900px` |
| Header habitual | `66px` |
| Categorías | `44px` mínimo |
| Control táctil mínimo | `44px` |
| Acción principal | `48px` |
| Plano de catálogo | `4:5` |
| Radio de media | `10px` |
| Radio de control | `8px` |

Los gutters siguen `clamp(16px, 4vw, 64px)`. El ancho `--catalog-width-wide` cambió de `1440px` a `1240px` para sostener una escala comercial y tarjetas controladas.

## Grid y cards

El grid usa container queries sobre `.catalog-collection`:

| Ancho útil | Columnas máximas |
| --- | --- |
| Menos de `328px` | 1 |
| Desde `328px` | 2 |
| Desde `900px` | 3 |
| Desde `1200px` y al menos 4 resultados | 4 |

Cada track tiene máximo `290px`. Con uno o dos resultados, el bloque se centra sin estirar las piezas. Los casos de referencia resultan en:

- `1366px`: 4 columnas.
- `1280px`: 3 columnas.
- `1024px`: 3 columnas.
- `768px`: 2 columnas.
- `430–360px`: 2 columnas.
- `320px`: 1 columna.

La card mantiene un único enlace al detalle. Su jerarquía es imagen, nombre, precio, descripción de dos líneas y hasta dos atributos reales. `Ver pieza` es un affordance secundario, no una acción nueva. El código de molde permanece ausente.

La primera imagen del resultado actual usa carga eager y prioridad alta; el resto conserva lazy loading para no competir con el LCP móvil. Todas las instancias públicas reciben dimensiones explícitas.

## Detalle

- Layout amplio: galería dominante y columna informativa sticky.
- Imagen principal: `4:5`, entre `480px` y `640px` de alto según viewport amplio.
- Móvil: imagen `4:5`, thumbnails horizontales y contenido en flujo.
- Orden: categoría, nombre, precio, resumen, atributos, acciones, descripción y metadata.
- Código de molde: metadata posterior, con wrapping seguro.
- La consulta individual conserva el builder y destino existentes.

## Solicitud

- Cabecera compacta, lista principal y resumen lateral.
- Miniaturas `4:5`, controles de cantidad de `44px` y subtotales asociados por fila.
- Reflow a una columna bajo `900px` y filas de dos columnas en móvil.
- El total conserva el label `Valor de referencia` y el copy no transaccional.
- Una región polite anuncia cantidad, eliminación y vaciado sin alterar las operaciones del provider.
- No existe barra fija inferior ni CTA duplicado.

## Estados y navegación

- `CatalogPublicState` admite `h1` para estados de ruta y `h2` dentro del catálogo.
- Carga, error, vacío y sin coincidencias sustituyen el área de resultados sin productos falsos ni shimmer.
- Imagen ausente usa un plano neutral honesto.
- La 404 es compacta y no usa una cifra monumental.
- Todas las rutas públicas tienen enlace de salto y `main#contenido-principal`.
- `main` y `#coleccion` reservan `scroll-margin-top` para el header sticky.
- El footer contiene solo marca, frase breve, colección, selección y copyright.
- `/admin/login` y todas las rutas administrativas permanecen intactas, aunque el acceso administrativo no se promociona en el footer público.

## Movimiento

- Color, borde y feedback de presión: `140–180ms`.
- Imagen de card: escala máxima `1.012` solo con puntero fino.
- Menú `Más`: entrada de `140ms` desde su trigger.
- No hay reveals de scroll, parallax, marquee ni animación de layout.
- `prefers-reduced-motion` elimina traslación, escala y entrada del menú.

## Selectores retirados

La reescritura de `src/catalog.css` eliminó las familias heredadas sin consumidores finales:

- primitivas dormidas `catalog-title*`, `catalog-field`, `catalog-focus-ring`, `catalog-badge`, `catalog-product-media`, `catalog-price` y `catalog-separator`;
- header híbrido `catalog-category-nav` y sus dependencias de utilities importantes;
- detalle `catalog-detail-tags`, `catalog-detail-contact*` y `catalog-whatsapp-secondary`;
- solicitud `cart-item__index`;
- 404 `catalog-not-found__code`;
- hoja de plantilla sin consumidores `src/App.css`;
- todos los breakpoints y overrides heredados asociados a esas familias.

No se retiró el bridge scoped de variables porque los defaults globales compartidos siguen siendo parte de la convivencia con administración.

## Ownership actual

| Capa | Responsabilidad |
| --- | --- |
| `src/tailwind.css` | Tokens `--catalog-*`, aliases de theme y bridge scoped. |
| `src/index.css` | Normalización y defaults globales compartidos. |
| `src/catalog.css` | Toda la presentación pública y sus breakpoints. |
| `src/admin.css` | Presentación administrativa, sin cambios. |

El orden de imports continúa `tailwind.css → index.css → catalog.css → admin.css`. No se activó Preflight, no se añadieron dependencias, `@apply`, `!important` ni configuración JavaScript de Tailwind.

## Invariantes preservadas

- Supabase, repositorios, entidades y casos de uso.
- Autenticación, rutas, slugs y lazy loading.
- Búsqueda, filtro y orden de resultados.
- Clave, forma y compatibilidad de la solicitud en `localStorage`.
- Cantidades `1–99`, subtotales, total y confirmación de vaciado.
- Constructores y URLs de WhatsApp.
- Código de molde en detalle, solicitud, WhatsApp y administración.
- Ausencia de código de molde en cards públicas.

## Verificación

El typecheck `npm exec tsc -- --noEmit` pasó después de la implementación. La validación visual con datos reales, teclado, lector de pantalla, zoom y matriz completa de viewports permanece manual según `AGENTS.md`.
