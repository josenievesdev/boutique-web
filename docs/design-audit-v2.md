# Auditoría de diseño v2

## Estado

Auditoría estática del frontend existente, realizada antes de iniciar el rediseño visual. No incluye cambios de componentes, CSS, datos, rutas ni comportamiento.

La evaluación se basa en:

- `PRODUCT.md`, `DESIGN.md`, `README.md` y `docs/tailwind-migration-plan.md`.
- `package.json`, `vite.config.ts`, `src/tailwind.css`, `src/index.css`, `src/catalog.css` y `src/admin.css`.
- Componentes públicos de `src/features/catalog/` y `src/features/cart/`.
- Rutas de `src/routes/router.tsx` y carga diferida de `src/routes/lazy-route-components.tsx`.
- Skills instaladas en `.agents/skills/` y reglas web actualizadas consultadas durante la auditoría.

No se ejecutó navegador, suite, build ni lint. Las conclusiones visuales deberán contrastarse con capturas y datos reales al comenzar la implementación.

## Diagnóstico principal

La web actual se percibe como **una landing elegante que conduce a un catálogo**, no como una boutique cuya colección constituye la interfaz principal.

El problema no es la ausencia de productos, sino el orden de autoridad:

1. El header presenta navegación de secciones: “Descubrir”, “Colección” y “Solicitud”.
2. El hero presenta una tesis de marca, una descripción y un CTA.
3. La búsqueda y las categorías viven dentro de ese hero.
4. Un showcase lateral vuelve a presentar uno o dos productos como contenido promocional.
5. La sección “La colección” comienza después y repite esos productos dentro del grid real.

Esta secuencia es propia de una landing: tesis, llamada a la acción, destacado y contenido principal. En una boutique contemporánea, el producto debería ser la tesis y la búsqueda debería gobernar el conjunto que aparece inmediatamente después.

### Evidencia estructural

- `catalog-home-page.tsx:38-155` define una apertura de dos columnas con copy, descubrimiento y showcase.
- `catalog-home-page.tsx:307-325` selecciona hasta dos productos globales para el showcase.
- `catalog-home-page.tsx:448-476` renderiza ese showcase aunque los filtros gobiernen otra colección.
- `catalog-home-page.tsx:479-556` inicia después la colección filtrada y vuelve a renderizar los mismos productos.
- `catalog.css:95-153` introduce una nueva superficie, cabecera y grid para el catálogo real.

En una pantalla de escritorio de altura contenida, el header de `72px`, la apertura de hasta `408px`, sus paddings y la cabecera posterior de colección empujan la primera fila completa del grid cerca o por debajo del primer pliegue. En móvil, copy, CTA, búsqueda, filtros y showcase se apilan antes del grid.

## Arquitectura visual actual

### Estructura pública

La aplicación pública usa un shell común:

```text
PublicPageShell
├── CatalogHeader
├── contenido de ruta
└── CatalogFooter
```

No existen directorios públicos `src/components/` o `src/layouts/`. El shell, header y footer viven en `src/features/catalog/`.

Las rutas públicas son:

| Ruta | Superficie |
| --- | --- |
| `/` | Apertura, búsqueda, filtros, showcase y catálogo |
| `/productos/:slug` | Detalle, galería, solicitud individual y adición múltiple |
| `/solicitud` | Selección, cantidades, subtotales, resumen y WhatsApp |
| `*` | Página pública no encontrada |

### Arquitectura de estilos

El frontend se encuentra en una etapa híbrida:

| Capa | Responsabilidad actual |
| --- | --- |
| `src/index.css` | Variables globales, normalización, formularios, foco y carga de rutas |
| `src/tailwind.css` | Theme CSS-first y utilities de Tailwind v4, sin Preflight |
| Utilities en TSX | Header, apertura, búsqueda, filtros y showcase |
| `src/catalog.css` | Grid, cards, estados, detalle, solicitud, footer, 404 y responsive asociado |
| `src/admin.css` | Toda la superficie administrativa |

`main.tsx` importa, en este orden, `tailwind.css`, `index.css`, `catalog.css` y `admin.css`. Las hojas convencionales no están dentro de layers y se cargan después de las utilities. Esto explica el uso de utilities con `!` en búsqueda, filtros y navegación para vencer defaults globales.

### Estado real de Tailwind

`PRODUCT.md` y `docs/tailwind-migration-plan.md` afirman que Tailwind no está instalado. El código actual demuestra lo contrario:

- `tailwindcss` y `@tailwindcss/vite` existen en `package.json`.
- `vite.config.ts` registra `tailwindcss()`.
- `src/main.tsx` importa `src/tailwind.css`.
- Header, hero, buscador, filtros y showcase ya usan utilities.

La migración parece haber completado infraestructura, tokens y parte de la superficie pública, pero su documentación no registra ese avance.

## Navegación

### Fortalezas

- Header sticky compacto en escritorio.
- Marca dinámica basada en configuración real.
- Contador visible de la solicitud.
- Navegación semántica y focos heredados del sistema global.
- Composición responsive específica, no un simple apilado automático.

### Problemas

- “Descubrir” y “Colección” son dos entradas hacia secciones del mismo inicio, una sintaxis típica de landing.
- “Descubrir” puede permanecer visualmente activo mientras el usuario ya recorre la colección.
- La búsqueda no acompaña un catálogo largo porque queda dentro de la apertura.
- A `820px` el header crece a `96px`, pero la colección conserva un `scroll-margin-top` de `72px` en CSS.
- El subtítulo de marca y la navegación móvil llegan a tamaños de microtexto cercanos a `9px`.
- No existe enlace de salto al contenido principal.
- La marca puede recibir nombres largos, pero no hay una política explícita de wrapping o límite visual.

### Conclusión

La marca, el sticky y la solicitud deben conservarse. La navegación debe simplificarse alrededor de la colección real y no simular un índice de landing.

## Hero y escaparate

### Fortalezas

- Tipografía de marca coherente.
- Imágenes reales y proporciones controladas.
- Reveal breve con alternativa de movimiento reducido.
- No usa gradientes, sombras pesadas ni afirmaciones promocionales inventadas.

### Problemas

- La tesis de marca tiene más jerarquía que nombres y precios de producto.
- El CTA “Explorar la colección” confirma que el contenido comercial todavía está en otra sección.
- El bloque ocupa una fase completa antes de que el usuario llegue al grid.
- En móvil, la apertura puede desplazar la colección real fuera del primer viewport.
- La pieza destacada y la pieza secundaria son una segunda representación visual del mismo inventario.
- El showcase no responde a búsqueda ni categoría, mientras el contador sí cambia.
- Durante carga, error o catálogo vacío puede mostrarse “Colección en preparación” como si fuera un estado definitivo.
- Con uno o dos productos, todo el inventario se duplica antes de empezar el catálogo.

### Por qué se siente como landing

El hero no funciona solo como encabezado: contiene tesis, CTA, herramienta de descubrimiento y una mini campaña de producto. La colección posterior necesita otra cabecera para volver a explicar dónde está el usuario. Esta doble introducción convierte el catálogo en destino secundario.

### Dirección de rediseño

La apertura debe convertirse en un masthead breve. La primera fila del catálogo será el escaparate: productos reales, no duplicados, inmediatamente conectados a la barra de búsqueda y filtros.

## Búsqueda

### Fortalezas

- Tiene label accesible, `name`, `type="search"` y acción Limpiar.
- La coincidencia usa nombre, slug y descripciones reales.
- El contador usa una región de estado.
- La actualización es inmediata y no añade dependencias.

### Problemas

- El campo está visualmente unido al hero, no al grid que controla.
- El usuario ve productos no filtrados en el showcase mientras busca otros productos.
- El resultado se anuncia tanto en el bloque “Descubrir” como en la cabecera de colección.
- El botón Limpiar vive dentro del `<label>` compuesto.
- El estado no se conserva al abandonar la ruta; este punto es funcional y queda fuera de una tanda puramente visual.

### Dirección de rediseño

La búsqueda debe ser el primer control de una barra de catálogo unificada. El resultado debe aparecer una sola vez y el grid filtrado debe comenzar inmediatamente debajo.

## Filtros

### Fortalezas

- Categorías reales cargadas desde Supabase.
- Estado `aria-pressed` explícito.
- Targets de `44px` en la implementación migrada.
- Scroller horizontal contenido a anchos pequeños.
- Estado “Todo” claro.

### Problemas

- El grupo usa `aria-label` sin una semántica de grupo explícita.
- Las categorías pueden ocupar mucho alto al hacer wrap en escritorio.
- La presentación pill se acerca a una nube de chips si hay muchas categorías.
- No existe un tratamiento definido para categorías largas, numerosas o sin productos publicados.

### Dirección de rediseño

Mantener categorías visibles y comparables. Priorizar una línea o toolbar continua sobre un panel de filtros, dado el modelo actual simple. No inventar facetas, ordenamientos ni drawers sin una necesidad funcional aprobada.

## Grid de productos

### Fortalezas

- Tres columnas por defecto y cuatro en pantallas anchas cuando hay suficientes productos.
- Dos columnas móviles que permiten comparar prendas.
- Tratamientos específicos para uno y dos resultados.
- `content-visibility: auto` para cards fuera del viewport.
- Separación mediante ritmo y superficie, no mediante contenedores pesados.

### Problemas

- El grid comienza después de una superficie promocional extensa.
- El salto de tres a cuatro columnas ocurre exactamente en `1440px`, lo que crea un cambio de densidad abrupto.
- A `360px` todavía se mantienen dos columnas muy estrechas; bajo `359px` se cambia a una columna y reaparecen elementos antes ocultos.
- Una colección con uno o dos productos queda visualmente pequeña después de haber sido repetida en un showcase mayor.
- La última fila de colecciones impares no tiene una estrategia explícita de cierre visual.

### Dirección de rediseño

El grid debe asumir desde el principio el papel de escaparate. Debe conservar densidad comercial, pero sus columnas deben responder a la anchura mínima útil de una card, no a un único píxel de breakpoint.

## Tarjetas de producto

### Fortalezas

- Imagen dominante con `aspect-ratio` y `object-fit: contain`.
- Exterior transparente y ausencia de sombra.
- Nombre, precio, descripción y atributos reales.
- Toda la card es un enlace válido al detalle.
- El código de molde no se expone en cards públicas.
- Fallback de imagen honesto y sin ilustración inventada.

### Problemas de jerarquía

- El nombre usa `1.25rem`, pero el precio solo `0.73rem`; en móvil baja a `0.66rem`.
- El precio puede sentirse como metadata cuando debería compartir la jerarquía principal.
- Nombre y precio compiten en una misma fila estrecha.
- La descripción y “Ver pieza” desaparecen entre `360px` y `700px`, debilitando el affordance.
- Badges, tags, descripción, regla y acción compiten por un cuerpo de solo `138px`.
- “Selección” aparece tanto como badge de card como lenguaje del showcase, sin cambiar el flujo real.

### Flujo comercial

La card conduce al detalle y el detalle permite agregar a la solicitud. Ese flujo debe conservarse porque cambiarlo implicaría comportamiento nuevo. El rediseño debe hacer más evidente que la card abre una ficha accionable, sin introducir quick add, favoritos o quick view.

### Dirección de rediseño

- Imagen, nombre y precio forman el núcleo.
- Atributos se reducen a un máximo visual razonable y nunca dominan.
- La card se entiende como etiqueta de producto, no como panel de aplicación.
- La proporción debe ser consistente entre catálogo, detalle y solicitud.

## Detalle de producto

### Fortalezas

- Galería y columna informativa equilibradas en escritorio.
- Imagen completa, thumbnails accesibles y contador.
- Nombre, precio actual/anterior, resumen y atributos reales.
- Agregar a la solicitud es la acción primaria.
- Ver la solicitud y consultar solo la pieza mantienen una jerarquía secundaria.
- Código de molde condicional dentro de datos descriptivos.
- Sticky se desactiva antes de móvil.

### Problemas

- El nombre puede llegar a `3.75rem`, mientras el precio principal usa `0.92rem`.
- El panel de consulta crea un segundo foco visual fuerte antes de descripción y datos.
- El estado “Disponible” está escrito de forma fija, aunque el producto confirma disponibilidad por WhatsApp. Es un riesgo funcional de contenido, no un cambio autorizado en esta tanda.
- A `430px` la galería cambia abruptamente de `5:6` a cuadrada.
- La imagen principal y las imágenes del showcase usan el mismo `loading="lazy"` que imágenes inferiores.
- Un error de categorías o configuración puede bloquear toda la ficha por el `Promise.all`; es un riesgo funcional separado.
- Volver a `/` no devuelve directamente al punto de colección.

### Dirección de rediseño

Mantener la composición general. Reordenar jerarquía para que imagen, nombre, precio y acción sean inmediatos; integrar el código de molde como metadata silenciosa; reducir el aspecto de panel del bloque de consulta.

## Solicitud múltiple

### Fortalezas

- Lenguaje correcto: solicitud, piezas y valor de referencia.
- No imita checkout ni introduce pago.
- Lista plana con imagen, nombre, código opcional, precio, cantidad y subtotal.
- Resumen sticky en escritorio y recomposición en tablet.
- Acción de WhatsApp condicionada a configuración real.
- Estado vacío con regreso a la colección.

### Problemas

- El título de hasta `3.8rem` y el bloque introductorio vuelven a introducir una apertura grande antes de la tarea.
- El resumen repite el total de piezas en cabecera y primera fila.
- “Resumen de la solicitud” usa tratamiento de eyebrow, por lo que su jerarquía semántica y visual divergen.
- Varios controles miden `40-42px`, por debajo del objetivo interno de `44px`.
- Los cambios de cantidad, eliminación y vaciado no tienen una región viva específica.
- El error de configuración de WhatsApp no ofrece reintento.
- “Seguir explorando” vuelve al inicio, no directamente a la colección.
- Las instantáneas persistidas pueden quedar desactualizadas respecto al producto; el copy de valor de referencia mitiga el riesgo y no debe cambiarse en una tanda visual.

### Dirección de rediseño

Compactar la cabecera y dar más autoridad a la lista. Mantener una estructura editorial de filas y resumen, no convertir cada artículo o subtotal en una card.

## Footer

### Fortalezas

- Compacto, oscuro y sin apariencia de segundo hero.
- Marca, navegación y acceso administrativo claramente separados.
- Año dinámico y landmarks correctos.
- La acción administrativa permanece discreta.

### Problemas

- El footer usa el primario global actual, un carbón neutro que ha perdido parte de la calidez documentada.
- El texto de marca es una afirmación fija que debe seguir sujeto a aprobación de contenido.
- Los enlaces tienen `40px` de alto.
- A `360px` todavía mantiene dos columnas y solo pasa a una bajo `359px`.
- Un nombre de negocio largo puede comprimir navegación y metadata.

### Dirección de rediseño

Conservar contenido y oscuridad, reducir altura y asegurar una composición de una columna antes de que el contenido se comprima.

## Estados de carga, vacío y error

### Fortalezas

- Existe un componente compartido para estados públicos.
- Error, carga y neutral usan superficies diferenciadas sin estética de dashboard.
- El catálogo permite reintentar.
- El estado sin resultados permite limpiar filtros.
- Detalle, solicitud y 404 conservan shell de marca.

### Problemas

- Catálogo realmente vacío y búsqueda sin coincidencias comparten el mismo mensaje inferior.
- Durante carga o error, el showcase puede parecer una colección vacía real.
- `CatalogPublicState` usa siempre `h2`, incluso en estados que ocupan una ruta completa.
- La carga de ruta usa un spinner genérico de producto digital.
- No todos los estados asíncronos declaran `aria-live` o `aria-busy` de forma coherente.
- La 404 usa una cifra de hasta `12rem`, un gesto más cercano a landing editorial que a navegación comercial.

### Dirección de rediseño

Cada estado debe ocupar el lugar del contenido que reemplaza. No duplicar explicaciones, no rellenar con productos falsos y no usar skeletons con shimmer decorativo.

## Responsive

### Lo que funciona

- Existen composiciones explícitas para `1024px`, `820px`, `700px`, `430px` y menos de `360px`.
- Detalle y solicitud se recomponen, no solo se encogen.
- Los scrollers de categorías y thumbnails están contenidos.
- El sticky se retira cuando deja de ser útil.
- Se usan `svh` y `aspect-ratio` en superficies sensibles.

### Riesgos

- Breakpoints equivalentes viven en dos sintaxis: media queries CSS y utilities arbitrarias `max-[…]`.
- La diferencia entre `430px` y `431px`, o entre `359px` y `360px`, produce cambios grandes.
- `body` usa `overflow-x: hidden` y `.catalog-site` usa `overflow-x: clip`; esto puede esconder defectos en lugar de resolverlos.
- No hay evidencia de validación con nombres de producto o boutique al máximo permitido.
- La primera fila real del catálogo llega demasiado tarde en móviles cortos.
- Header y toolbar futuros pueden ocupar demasiado espacio si ambos se vuelven sticky.

### Estados que deben probarse

| Datos | Variantes mínimas |
| --- | --- |
| Productos | `0`, `1`, `2`, `3`, `4`, `12` y muchos |
| Nombre de producto | Corto y hasta `150` caracteres |
| Negocio | Nombre corto y hasta `120` caracteres |
| Código de molde | Ausente, corto y `40` caracteres sin espacios |
| Imágenes | Ausente, una, varias y fallida |
| Solicitud | Vacía, una fila, muchas filas y cantidad `99` |
| Contacto | Configurado, ausente y error de carga |

## Consistencia visual

### Documentación frente a implementación

`DESIGN.md` ya no representa exactamente el código:

| Decisión | `DESIGN.md` | Implementación actual |
| --- | --- | --- |
| Primario | Marrón `#402014` | Carbón `#252725` |
| Fondo | `#fcfaf7` | `#fcfbf8` |
| Texto secundario | `#746e6b` | `#66645f` |
| Grid | Dos columnas | Tres y cuatro columnas |
| Card | Superficie elevada con padding | Exterior transparente y media delimitada |
| Filtros | Altura documentada de `32px` | Target actual de `44px` |
| Tailwind | No instalado | Instalado y usado parcialmente |

Los cambios no son necesariamente negativos. El problema es que no existe una fuente visual única y actualizada.

### Tokens compartidos

Los tokens de `:root` alimentan tanto catálogo como administración. Un cambio público de color, radio o superficie puede rediseñar el panel antes de la Tanda 5. La nueva personalidad de marca debe usar aliases o scope público antes de modificar tokens globales.

### Iconografía y assets

- La interfaz usa caracteres Unicode para flechas, suma y resta.
- `public/icons.svg` contiene símbolos sociales y de documentación que no forman un sistema de iconos de boutique.
- `public/favicon.svg` conserva un asset púrpura genérico de plantilla.
- No hay fotografías locales; las imágenes reales llegan desde Supabase.

Estos assets deben inventariarse en producción, pero no justifican instalar una librería de iconos.

### README

`README.md` conserva el texto del template de Vite. No describe el producto, la arquitectura ni el flujo de solicitud. Es deuda documental, fuera de los tres entregables de esta tanda.

## Problemas de jerarquía

1. H1 promocional mayor que cualquier nombre o precio de card.
2. Showcase mayor que la primera fila del catálogo real.
3. Precio tratado como microtexto en cards y detalle.
4. Resultado repetido en hero y colección.
5. Tags y badges consumen atención que debería pertenecer a nombre y precio.
6. Solicitud abre con otra composición de hero antes de la lista.
7. Footer y 404 mantienen gestos de marca mayores que algunas acciones comerciales.
8. Microtexto por debajo de `12px` debilita legibilidad y sensación comercial.

## Problemas de flujo comercial

### Flujo actual

```text
Header
→ tesis de marca
→ CTA de colección
→ búsqueda y filtros
→ productos destacados no filtrados
→ segunda cabecera de colección
→ grid filtrado
→ detalle
→ agregar a solicitud
→ solicitud
→ WhatsApp
```

### Fricciones

- Se necesita atravesar dos presentaciones antes del grid.
- Buscar no cambia los productos visualmente más próximos al campo.
- Una colección pequeña parece repetida para llenar espacio.
- El CTA “Explorar” existe porque el catálogo todavía no es el contenido inmediato.
- La personalización se menciona antes de mostrar suficiente producto.
- En un catálogo largo, los controles quedan lejos de los resultados posteriores.

### Flujo objetivo sin cambiar funcionalidad

```text
Header compacto
→ apertura breve
→ búsqueda + categorías + contador
→ primera fila como escaparate
→ resto del grid
→ explicación breve de personalización/proceso
→ detalle
→ agregar a solicitud
→ solicitud
→ WhatsApp
```

El detalle sigue siendo el lugar donde se agrega una pieza. El rediseño visual no introduce quick add ni cambia el flujo de dominio.

## Qué debe conservarse

- Rutas públicas y protegidas.
- Cargas independientes en paralelo.
- Filtro actual y sus datos reales.
- Imágenes de producto con presentación contenida.
- Newsreader para voz de marca y Manrope para interfaz.
- Nombre, imagen, precio, descripción y atributos reales.
- Card completa como enlace al detalle.
- Flujo detalle → solicitud → WhatsApp.
- Contador, cantidades, subtotales y valor de referencia.
- Código de molde en detalle, solicitud, WhatsApp y administración.
- Ausencia del código de molde en cards públicas.
- Foco visible, reduced motion, alt y semántica ya presentes.
- Superficies planas, hairlines, radios moderados y sombras mínimas.
- Footer compacto y acceso administrativo discreto.

## Qué debe rediseñarse

- Jerarquía y altura del inicio.
- Relación entre apertura, búsqueda y catálogo.
- Eliminación del showcase duplicado.
- Navegación enfocada en colección y solicitud.
- Barra unificada de catálogo.
- Escala y posición de nombre y precio.
- Densidad y responsive de cards.
- Ritmo con pocos productos.
- Presentación de detalle sin paneles competitivos.
- Cabecera de solicitud y jerarquía del resumen.
- Estados públicos y microtipografía.
- Scope de tokens públicos.
- Coherencia entre Tailwind, CSS y documentación.

## Qué no debe tocarse

- Supabase, migraciones, políticas, storage y configuración.
- Entidades, repositorios, casos de uso y errores de dominio.
- Autenticación, permisos y rutas.
- Formato de productos, categorías o configuración.
- Persistencia y compatibilidad de `localStorage`.
- Cálculos de cantidad, subtotal y valor de referencia.
- Constructores de mensajes o URLs de WhatsApp.
- Reglas y valor del código de molde.
- Datos, copy comercial o imágenes no aprobados.
- Panel administrativo antes de la Tanda 5.

## Riesgos priorizados

| Prioridad | Riesgo | Consecuencia |
| --- | --- | --- |
| Alta | Documentación y código discrepan sobre Tailwind y tokens | No existe baseline fiable para implementar o revisar |
| Alta | Tokens globales compartidos con administración | El rediseño público puede alterar el panel fuera de alcance |
| Alta | Home concentra estado, carga y gran cantidad de construcción visual | Un cambio visual amplio puede tocar lógica accidentalmente |
| Alta | Showcase y grid representan el mismo inventario | La colección pequeña parece relleno de landing |
| Alta | Controles y resultados viven en bloques distintos | La respuesta a búsqueda se percibe desconectada |
| Media | CSS y Tailwind compiten por cascade | Más `!important` y ownership visual ambiguo |
| Media | Breakpoints con saltos de un píxel | Cambios abruptos y resultados difíciles de validar |
| Media | Pocos productos no tienen composición v2 definida | Exceso de vacío o repetición |
| Media | No hay muestra local representativa de imágenes | Proporción final y crops deben validarse con datos reales |
| Media | Microtexto demasiado pequeño | Menor legibilidad y jerarquía comercial débil |
| Media | Overflow oculto globalmente | Defectos responsive pueden permanecer invisibles |
| Baja | Favicon e iconos conservan assets de plantilla | La identidad puede seguir pareciendo genérica en producción |

## Conclusión

La base visual contiene buenos ingredientes: fotografía protagonista, tipografía con carácter, filtros reales, grid denso, detalle claro y solicitud honesta. El rediseño no necesita añadir más secciones ni más decoración.

Necesita cambiar el protagonista: **la colección debe dejar de ser la segunda mitad de la página y convertirse en el primer plano visual, operativo y comercial**.
