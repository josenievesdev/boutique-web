# Design Bible v2

## Estado y autoridad

Este documento define la dirección visual objetivo de Boutique Web v2. Gobierna el rediseño público después de la auditoría registrada en `docs/design-audit-v2.md`.

Orden de autoridad para decisiones de producto y diseño:

1. `PRODUCT.md` conserva la autoridad sobre propósito, usuarios, rutas, datos, flujos y restricciones funcionales.
2. `DESIGN_BIBLE.md` gobierna la dirección visual v2.
3. `docs/design-audit-v2.md` conserva el diagnóstico y la evidencia del estado anterior.
4. `DESIGN.md` registra los tokens y la implementación técnica vigente; no reemplaza las decisiones de arquitectura de esta Biblia.
5. `docs/tailwind-migration-plan.md` gobierna la convivencia técnica entre Tailwind y CSS heredado.

Esta Biblia no autoriza por sí sola cambios de implementación. Cada modificación se ejecuta en la tanda correspondiente, con alcance visual explícito y verificación manual.

### Estado técnico después de Tanda 0B

- Tailwind CSS v4, `@tailwindcss/vite` y `src/tailwind.css` están activos sin Preflight.
- Los valores públicos definitivos viven bajo `.catalog-site` como aliases `--catalog-*`; `src/index.css` conserva los tokens globales consumidos por administración.
- Un bridge scoped mantiene los selectores públicos heredados sin trasladar la nueva personalidad al panel.
- `DESIGN.md` registra la implementación técnica vigente. Esta Biblia conserva autoridad sobre dirección y arquitectura.
- `PRODUCT.md`, `DESIGN.md` y el plan técnico reflejan el estado híbrido actual de Tailwind.

## Límites de producto

El rediseño conserva sin cambios:

- Supabase, migraciones, políticas, almacenamiento y configuración.
- Dominio, entidades, repositorios, casos de uso y errores.
- Autenticación, permisos, rutas públicas, rutas protegidas y slugs.
- Forma, clave y compatibilidad de la solicitud persistida en `localStorage`.
- Reglas de cantidad, subtotales, precios y valor de referencia.
- Constructores de mensajes y enlaces de WhatsApp.
- Contratos de producto, categoría, imágenes y configuración.
- Código de molde, su valor, persistencia e inclusión actual en detalle, solicitud, WhatsApp y administración.
- Flujo principal: catálogo → detalle → solicitud → WhatsApp.
- Consulta directa de una sola pieza desde el detalle cuando existe contacto configurado.

No se incorporan pagos, checkout, reserva, favoritos, quick add, quick view, ordenamiento, facetas nuevas, testimonios, promociones ni contenido comercial inventado.

## 1. Concepto rector

### Atelier abierto

**“Atelier abierto: una boutique digital donde la colección es la interfaz”.**

La experiencia se inspira en una mesa de trabajo despejada: las prendas están a la vista, la información necesaria vive junto a cada pieza y las herramientas para encontrarla permanecen al alcance. El sitio no presenta primero una campaña y después un catálogo. Presenta la colección como la expresión principal de la marca.

La escena física de referencia es un atelier con luz natural, una mesa de corte amplia, prendas ordenadas y etiquetas precisas. La interfaz traduce esa escena mediante fotografía contenida, alineaciones continuas, líneas finas, tipografía medida y datos comerciales legibles. No la traduce mediante texturas falsas, ilustraciones de costura, beige uniforme ni decoración temática.

### Voz de marca

Tres cualidades concretas gobiernan las decisiones:

- **Táctil:** la fotografía y la escala dejan percibir forma, caída y detalle de cada prenda.
- **Precisa:** nombre, precio, atributos, cantidades y acciones se leen sin esfuerzo.
- **Cercana:** el recorrido conduce a una conversación real, sin teatralidad de lujo ni lenguaje de checkout.

### Trabajo principal de cada superficie

| Superficie | Trabajo principal |
| --- | --- |
| Inicio | Encontrar y comparar piezas reales con rapidez. |
| Detalle | Entender una pieza y decidir si se añade a la solicitud o se consulta individualmente. |
| Solicitud | Revisar piezas y cantidades antes de iniciar la conversación por WhatsApp. |
| Administración | Gestionar información con claridad operativa; se trata por separado en la Tanda 5. |

### Firma visual

La firma de v2 es **la línea de colección**: apertura, buscador, categorías, contador y primera fila comparten una misma medida y una secuencia vertical continua. Una regla fina separa controles de resultados como la guía de una mesa de corte. Debajo, cada imagen y su etiqueta de producto se alinean con precisión.

La firma no es un componente decorativo. Hace visible la relación entre la herramienta y lo que modifica, elimina la doble introducción actual y convierte la primera fila del grid en escaparate.

### Lo que hace específica esta dirección

La pareja Newsreader y Manrope y una paleta cálida ya pertenecen a la identidad existente. Para evitar caer en el patrón genérico “serif + crema + terracota”, v2 impone tres restricciones:

- El fondo principal permanece casi neutro y no cubre toda la experiencia de beige.
- Newsreader no construye una revista: se reserva para marca, títulos y nombres de producto.
- El gesto memorable no es un hero tipográfico, sino la continuidad inmediata entre descubrimiento y producto.

## 2. Primera impresión

La primera impresión debe comunicar, en este orden:

1. Esta es una boutique identificable.
2. Esta es su colección real.
3. Puedo buscar o filtrar ahora.
4. Puedo abrir una pieza y preparar una solicitud.

### Objetivos de primer viewport

- El header ocupa una sola franja compacta siempre que el contenido lo permita.
- La apertura usa un título breve y, como máximo, un bloque corto de apoyo. No requiere un CTA para llegar a contenido que ya sigue inmediatamente.
- En el fixture de referencia definido abajo, el borde superior de la primera imagen de producto debe aparecer en el primer viewport.
- En `1440×900`, la primera fila comienza a más tardar en `340px` desde el borde superior.
- En `1280×720`, la primera fila comienza a más tardar en `310px`.
- En `390×844`, el primer producto comienza a más tardar en `350px`.
- En `320×568`, el primer producto comienza a más tardar en `285px`; se reduce primero el espacio de la apertura, nunca su contenido.

Estas medidas se validan a `100%` de zoom, con fuentes cargadas, al menos `4` productos, nombre de boutique de hasta `32` caracteres y apertura de hasta dos líneas de título más tres de apoyo. La tolerancia de captura es `16px`. Son criterios de composición, no alturas fijas. Contenido más largo, zoom o fuentes fallback quedan fuera del umbral numérico: se priorizan lectura y reflow completos aunque el producto pase al viewport siguiente.

### Orden visual objetivo

```text
Header compacto
→ apertura breve
→ búsqueda + resultado
→ categorías
→ primera fila del catálogo como escaparate
→ resto del catálogo
→ personalización o proceso real, si existe contenido aprobado
→ footer
```

No existe un showcase independiente. No se repite ningún producto antes del grid filtrado.

## 3. Arquitectura del inicio

### Estructura

```text
PublicPageShell
├── enlace de salto
├── header
├── main
│   ├── apertura compacta
│   └── colección
│       ├── barra de catálogo
│       │   ├── búsqueda
│       │   ├── resultado único
│       │   └── categorías
│       ├── estado contextual o grid
│       └── explicación posterior, si procede
└── footer
```

### Apertura

- Usa un solo `h1` y texto de apoyo de hasta `65ch`.
- No contiene imagen destacada, métrica, testimonios, CTA redundante ni tarjetas.
- Puede usar una composición asimétrica en escritorio, con copy ocupando parte de la medida y aire al lado, pero no una segunda columna promocional.
- La apertura y la colección comparten eje; no parecen dos páginas consecutivas.
- El copy existente que permanezca en la composición no se reescribe hasta que una tarea de contenido apruebe cambios. Retirar un CTA redundante no autoriza a reutilizar o alterar su texto en otro mensaje.

### Colección

- Búsqueda, filtros, contador, estados y grid pertenecen a una sola región visual y semántica.
- El resultado se anuncia una vez.
- La primera fila usa exactamente el conjunto filtrado actual.
- La colección no necesita una segunda tesis ni otro encabezado de gran escala.
- Con pocos productos, las piezas ocupan las primeras posiciones del grid; no se centran como campaña ni se duplican para llenar espacio.
- Con muchos productos, el ritmo procede del grid y de sus etiquetas, no de inserts promocionales entre filas.

### Contenido posterior

La explicación sobre personalización o trabajo sobre pedido solo aparece después de productos reales. Debe usar contenido aprobado y describir capacidades existentes. Si no existe copy verificado, el módulo se omite.

Cuando proceda, se presenta como secuencia o lista plana, no como tres cards genéricas. Los números solo se usan si los pasos tienen un orden real.

## 4. Arquitectura del detalle

### Orden

```text
Breadcrumb compacto
→ galería
→ nombre + precio
→ resumen y atributos prioritarios
→ acción para añadir a la solicitud
→ consulta individual, si existe contacto
→ descripción y datos
→ código de molde como metadata discreta
```

### Escritorio

- Galería e información forman dos columnas, con la fotografía ligeramente dominante.
- La columna informativa puede permanecer sticky mientras su contenido quepa de forma segura bajo el header.
- Nombre, precio y acción principal aparecen sin atravesar un panel promocional intermedio.
- El bloque de consulta se integra mediante espaciado y una regla, no mediante una card elevada competitiva.
- Descripción y datos forman una lectura continua. No se fragmenta cada atributo en una card.

### Tablet y móvil

- Galería, información y acciones se apilan en el orden de lectura.
- Los thumbnails forman una fila horizontal contenida cuando existan varias imágenes.
- La acción primaria aparece después de la información esencial, no antes del nombre o precio.
- No se añade una barra fija inferior ni se duplica el CTA sin evidencia de uso que lo justifique.
- El nombre largo puede ocupar varias líneas sin empujar el precio fuera de contexto.

### Contenido comercial

- “Disponible” u otra afirmación de inventario solo puede mostrarse si el contrato actual ya aporta ese dato. Si no existe fuente, se omite el texto fijo; no se crea un campo, consulta, estado o regla de inventario.
- Precio anterior solo aparece cuando existe en el producto y conserva la semántica actual.
- Tiempo de preparación, atributos y descripción proceden del catálogo real.
- El código de molde no se convierte en badge ni argumento de venta.

## 5. Arquitectura de la solicitud

### Orden

```text
Cabecera compacta
→ lista de piezas
→ cantidades, eliminación y subtotales
→ resumen
→ acción de WhatsApp o estado de contacto
```

### Composición

- El título explica la tarea y cede protagonismo a la lista.
- Cada pieza es una fila, no una card dentro de otra card.
- Imagen, nombre, código opcional, precio unitario, cantidad y subtotal conservan asociaciones claras.
- El resumen se mantiene al lado en escritorio cuando hay anchura útil y pasa al flujo en pantallas menores.
- El valor total sigue descrito como referencia; la página no adopta convenciones de pago.
- Vaciar o eliminar conserva las confirmaciones existentes. Cualquier cambio a ese comportamiento requiere tarea funcional separada.
- La acción de WhatsApp solo aparece cuando la configuración real lo permite.

### Prioridades visuales

1. Identidad de cada pieza.
2. Cantidad editable.
3. Subtotal por fila.
4. Total de referencia.
5. Envío por WhatsApp.

El código de molde permanece visible como dato secundario para que la solicitud y la conversación con la boutique sigan siendo inequívocas.

## 6. Navegación

### Header público

- Sticky, plano y compacto.
- Marca a la izquierda; colección y solicitud a la derecha en anchos suficientes.
- “Descubrir” deja de ser una entrada visual separada, porque colección y descubrimiento pasan a ser la misma superficie. Su anchor, `id` y destino existentes se conservan como alias del inicio de la barra de catálogo para no romper enlaces.
- “Colección” enlaza al contenido real del inicio; “Solicitud” conserva contador y ruta.
- En móvil, marca y solicitud tienen prioridad. No se introduce un menú hamburguesa para ocultar una única navegación secundaria.
- El nombre dinámico de la boutique usa una línea en el caso habitual y envuelve cuando necesita más espacio. No se trunca; palabras largas usan wrapping seguro y el header puede crecer en los fixtures extremos.
- El header no cambia de altura bruscamente en un único píxel de breakpoint.

### Footer público

- Conserva marca, navegación, año y acceso administrativo discreto.
- Usa una superficie oscura y compacta como cierre, no como segundo hero.
- Recompone columnas antes de comprimir el contenido.
- Los enlaces cumplen el target táctil mínimo.

### Navegación semántica

- Enlaces navegan; botones ejecutan acciones.
- Existe un enlace de salto a `main` visible al recibir foco.
- Los destinos internos usan `scroll-margin-top` según la altura real del header.
- El estado activo no depende solo de color.
- Volver desde detalle o solicitud conserva las rutas actuales. Recuperar posición o filtros sería un cambio funcional y queda fuera de las tandas visuales.

## 7. Sistema tipográfico

### Familias

| Rol | Familia | Pesos disponibles | Uso |
| --- | --- | --- | --- |
| Marca y display | Newsreader | `400`, `500` | Marca, `h1`–`h3`, nombres de producto y totales puntuales. |
| Interfaz y datos | Manrope | `400`, `500`, `600` | Navegación, cuerpo, búsqueda, filtros, precios, atributos y acciones. |

La pareja se conserva como identidad existente. No se añade una tercera familia ni se solicitan pesos no cargados sin una tarea tipográfica separada.

### Escala objetivo

| Rol | Tamaño objetivo | Peso | Interlineado | Tracking |
| --- | --- | --- | --- | --- |
| Apertura | `clamp(2.5rem, 4.2vw, 4rem)` | Newsreader `400` | `0.98–1.04` | `-0.035em` máximo |
| Nombre de detalle | `clamp(2.25rem, 4vw, 3.75rem)` | Newsreader `400` | `0.98–1.04` | `-0.035em` máximo |
| Encabezado de sección | `clamp(1.9rem, 3vw, 2.75rem)` | Newsreader `400` | `1–1.08` | `-0.03em` |
| Nombre en card | `clamp(1.1rem, 1.5vw, 1.35rem)` | Newsreader `500` | `1.1–1.2` | `-0.015em` |
| Cuerpo principal | `1rem` | Manrope `400` | `1.55–1.7` | normal |
| Cuerpo compacto | `0.875rem` | Manrope `400–500` | `1.45–1.6` | normal |
| Precio | `0.9375–1.0625rem` | Manrope `600` | `1.3–1.45` | normal |
| Label y navegación | `0.75–0.8125rem` | Manrope `600` | `1.3–1.5` | `0.02–0.06em` |

### Reglas

- No usar texto funcional por debajo de `12px`.
- Usar mayúsculas solo en labels breves y excepcionales; no como gramática de cada sección.
- Mantener títulos en sentence case según español.
- Aplicar `text-wrap: balance` a encabezados cortos y wrapping legible a prosa.
- Limitar prosa a `65–75ch`.
- Usar números tabulares donde cantidades, precios o subtotales se comparan en columna.
- Los precios comparten la jerarquía primaria del producto; nunca vuelven a microtexto.
- El tracking de display nunca baja de `-0.04em`.

## 8. Paleta

### Estrategia

La estrategia es **restrained con acción de carbón**: marfil cálido para el canvas, piedra y arena para separar planos, carbón suave para texto y acciones, y un taupe neutral configurable como único acento. La calidez surge de materiales, fotografía y temperatura de los neutros; no de rosa cliché, dorado artificial ni una página cubierta de beige.

### Tokens públicos definitivos

| Token conceptual | Valor | Uso |
| --- | --- | --- |
| Canvas marfil | `#FAF8F3` | Página pública. |
| Canvas sutil | `#F3F1EC` | Secciones de bajo énfasis. |
| Superficie piedra | `#EFEDE7` | Agrupaciones secundarias. |
| Superficie clara | `#FFFEFA` | Campos y planos de producto. |
| Superficie arena | `#EBE7DF` | Fallbacks y separación tonal. |
| Tinta y acción carbón | `#292825` | Texto, acción primaria, WhatsApp y footer. |
| Tinta secundaria | `#625F59` | Apoyo y metadata. |
| Línea | `rgba(41, 40, 37, 0.16)` | Hairlines no esenciales. |
| Línea fuerte | `#817B73` | Límites interactivos esenciales. |
| Foco | `#5C534C` | Outline y focus-within. |
| Acento taupe | `#695F57` | Acento neutral configurable. |
| Acento hover | `#514A44` | Estado fuerte del acento. |
| Acento soft | `#E8E2DB` | Campo suave del acento. |

Éxito, advertencia, error e información usan familias semánticas independientes documentadas en `DESIGN.md`. Los pares principales y de estado alcanzan al menos `4.5:1` para texto; la línea fuerte alcanza `3.95:1` sobre canvas. Transparencias y estados disabled se validan sobre la composición final.

### Distribución

- Neutros: `80–90%` de la superficie.
- Carbón de acción: `8–15%`, concentrado en acciones, selección y footer.
- Acento: máximo visual cercano a `5%` y siempre con función.
- La fotografía real no se recolorea para encajar artificialmente en la paleta.

### Reglas

- No usar gradientes decorativos ni texto con gradiente.
- No combinar varios pasteles en una misma vista para simular variedad.
- No usar gris de baja opacidad para texto normal.
- Placeholder y texto secundario deben alcanzar `4.5:1` sobre su fondo final.
- Cualquier cambio de la familia configurable de acento debe mantener sus tres valores y volver a verificar contraste.

## 9. Espaciado y medidas

### Escala base

La escala conserva una base de `4px`:

`4`, `8`, `12`, `16`, `20`, `24`, `32`, `40`, `48`, `64`, `80`, `96`.

No todos los intervalos tienen el mismo peso. Controles relacionados usan `8–16px`; grupos de producto usan `16–24px`; cambios de sección usan `48–80px` según viewport.

### Gutter exterior

- Escritorio ancho: `clamp(32px, 4vw, 64px)`.
- Tablet: `24–32px`.
- Móvil: `16–20px`.
- `320px`: mínimo `16px`, sin compensarlo con overflow oculto.

### Medidas de contenido

| Medida | Máximo objetivo | Uso |
| --- | --- | --- |
| Catálogo amplio | `1440px` | Header, apertura, toolbar y grid. |
| Contenido estándar | `1240px` | Footer, solicitud y agrupaciones generales. |
| Detalle | `1200px` | Galería e información. |
| Formulario o estado | `900px` | Estados y tareas lineales. |
| Prosa | `65–75ch` | Descripciones y ayuda. |

Las medidas son aliases públicos futuros, no sustituciones directas de variables globales compartidas.

### Ritmo vertical

- Header: objetivo de `60–68px`, sin segunda franja permanente en móvil.
- Apertura: `48–72px` de padding total en escritorio y `28–44px` en móvil.
- Toolbar a grid: `20–32px`.
- Filas del grid: `40–64px`.
- Última fila a contenido posterior: `64–96px`.
- Cabeceras de detalle y solicitud: compactas; no replican el hero del inicio.

## 10. Imágenes

### Proporción

- Catálogo: plano de media `4:5` estable.
- Detalle: imagen principal `4:5`, adaptada a la altura disponible sin convertirse abruptamente en cuadrada.
- Solicitud: miniatura `4:5`.
- Thumbnails: pueden ser cuadrados como controles, manteniendo la imagen contenida.

### Tratamiento

- `object-fit: contain` es la base para no recortar prendas.
- El fondo de media es claro o silencioso y no compite con el producto.
- Las imágenes conservan dimensiones o `aspect-ratio` explícitos para evitar layout shift.
- La primera fila visible no debe tratarse como contenido inferior lazy si ello demora la primera impresión. La política exacta de prioridad se valida en Tanda 6.
- Las imágenes bajo el pliegue mantienen lazy loading.
- El fallback es honesto y neutro; no usa ilustraciones inventadas.
- El alt describe la pieza real. Imágenes repetidas dentro de controles etiquetados pueden usar alt vacío.

### Galería

- El estado seleccionado se reconoce por borde y semántica, no solo por color.
- El contador de imágenes es metadata secundaria.
- No se añade zoom complejo, lightbox ni gesto nuevo como parte del rediseño visual.

## 11. Tarjetas de producto

La tarjeta se entiende como una etiqueta extendida de producto, no como un panel de aplicación.

### Anatomía

```text
Plano de imagen 4:5
Nombre
Precio actual [precio anterior opcional]
Atributos reales seleccionados, si aportan
Indicación discreta de apertura al detalle
```

### Jerarquía

1. Imagen.
2. Nombre.
3. Precio.
4. Atributos útiles.
5. Descripción o affordance, solo si cabe sin desplazar el núcleo.

### Reglas

- Toda la card sigue siendo un enlace al detalle.
- El exterior no necesita borde, fondo ni sombra; el plano de imagen sí puede tener una línea fina.
- El nombre busca ocupar dos líneas en grids de varias columnas, pero envuelve tantas como el contenido necesite. No se trunca ni se oculta; el precio se mantiene próximo dentro del mismo bloque.
- Mostrar como máximo los dos primeros atributos públicos no vacíos, respetando su orden de origen. No reordenarlos ni inferir cuáles son más comerciales. Los demás pertenecen al detalle.
- No mostrar código de molde en cards públicas.
- Usar badges solo para un estado real y necesario; no usar “Selección” como decoración recurrente.
- No introducir quick add, favoritos ni quick view.
- Hover no revela información indispensable.
- En puntero fino, el hover puede reforzar línea o imagen de forma mínima; en touch no deja estados pegados.
- Con `1` o `2` productos, las cards ocupan las primeras columnas y conservan ancho útil. No se estiran a todo el contenedor ni se centran como campaña.

## 12. Barra de catálogo

### Composición de escritorio

```text
[Label + búsqueda amplia]                    [resultado]
────────────────────────────────────────────────────────
[Todo] [Categoría] [Categoría] [Categoría] ...
```

### Composición móvil

```text
[Label]
[búsqueda                         limpiar]
[resultado]
[categorías con scroll horizontal contenido]
────────────────────────────────────────────
[grid]
```

### Búsqueda

- Mantiene label persistente; el placeholder no sustituye al label.
- Conserva `type="search"`, `name` significativo y acción “Limpiar” cuando existe texto.
- Mide al menos `48px` de alto.
- El control compuesto usa `:focus-within` y un foco claramente visible.
- La búsqueda responde sobre el grid inmediatamente adyacente.
- No se añade debounce o estado diferido sin evidencia de coste real.

### Categorías

- Se presentan como navegación de texto con estado activo claro, no como nube de pills.
- Cada categoría conserva un target de al menos `44px` de alto.
- En anchos amplios pueden ocupar una línea; si no caben, se usa scroll horizontal contenido antes que una barra de varias filas demasiado alta.
- Los nombres largos no se truncan hasta perder significado.
- “Todo” conserva su función actual.
- No se añaden recuentos por categoría sin fuente real.
- Una categoría real sin productos coincidentes permanece interactiva y conduce al estado “Sin coincidencias”; no se deshabilita ni oculta sin una decisión funcional separada.

### Resultado

- Aparece una sola vez y se anuncia mediante región de estado cuando cambia.
- Usa lenguaje de colección, no de base de datos.
- Distingue catálogo vacío de búsqueda sin coincidencias.
- La sincronización de búsqueda o categoría con URL sería un cambio funcional; se documenta como oportunidad separada y no se incluye en estas tandas visuales.

### Sticky

La barra no será sticky en la primera implementación. La Tanda 4 puede evaluar una versión sticky solo si una colección larga demuestra que mejora el retorno a los controles sin consumir demasiado viewport junto al header.

## 13. Precio, atributos y código de molde

### Precio

- Se formatea con la lógica y locale existentes; el rediseño no altera cálculos ni moneda.
- Usa Manrope `600`, números tabulares cuando se comparan valores y contraste de tinta principal.
- En card, se sitúa inmediatamente después o junto al nombre según anchura.
- En detalle, comparte el primer bloque con nombre y acción.
- El precio anterior usa tachado semántico y contraste suficiente; no domina al actual.
- En solicitud, precio unitario, subtotal y total se alinean para comparar.

### Atributos

- Se muestran como texto compacto o lista, no como colección de badges decorativos.
- El grid enseña los dos primeros atributos públicos no vacíos en el orden recibido. No inventa una prioridad comercial ni reordena datos.
- El detalle puede exponer el conjunto real en una lista de datos.
- No se inventan materiales, tallas, colores, disponibilidad ni tiempos.

### Código de molde

- No aparece en cards públicas.
- En detalle vive dentro de datos o metadata posterior a la información comercial principal.
- En solicitud aparece bajo el nombre o en la columna descriptiva, con wrapping seguro para `40` caracteres sin espacios.
- En administración permanece visible y buscable.
- Conserva su valor y presencia actual en solicitud y WhatsApp.
- Nunca se convierte en badge promocional, filtro público o titular.

## 14. Acciones e iconografía

### Botones

| Tipo | Tratamiento | Uso |
| --- | --- | --- |
| Primario | Fondo carbón suave, texto marfil, borde del mismo tono | Añadir a solicitud y acción principal de WhatsApp. |
| Secundario | Fondo transparente, borde fuerte o enlace subrayado según contexto | Ver solicitud, volver y acciones de apoyo. |
| Terciario | Texto con área táctil completa | Limpiar, continuar explorando y navegación contextual. |
| Destructivo | Texto o fondo de peligro solo donde la acción lo requiera | Eliminar y vaciar, conservando confirmación actual. |

Reglas comunes:

- Altura mínima visual y táctil de `44px`; objetivo principal de `48px`.
- Radio de `8px`; pills solo para contadores o tags que semánticamente lo necesiten.
- Label específico y estable entre acción y resultado.
- Estado `:active` breve de `scale(0.98)` cuando no interfiera con teclado ni reduced motion.
- Disabled mantiene texto legible y no depende solo de opacidad extrema.
- Una sola acción primaria por grupo visual.

### Iconografía

- Sistema lineal simple de `16`, `20` y `24px`, con trazo coherente cercano a `1.5px`.
- Los iconos acompañan acciones reconocibles; no reemplazan labels importantes.
- Botones solo-icono requieren nombre accesible.
- Iconos decorativos usan `aria-hidden="true"`.
- Sustituir caracteres Unicode inconsistentes por SVG controlados puede hacerse en la tanda del componente, sin instalar una librería.
- El favicon de plantilla se reemplaza solo con un asset de marca aprobado en Tanda 6.

## 15. Bordes, radios, profundidad y capas

### Bordes

- Hairline de `1px` para estructura y separación.
- Línea fuerte para inputs, thumbnails seleccionados y límites interactivos esenciales.
- No usar franjas laterales gruesas como acento.

### Radios

| Elemento | Radio objetivo |
| --- | --- |
| Botones e inputs | `8px` |
| Plano de imagen | `8–10px` |
| Estados agrupados | máximo `12px` |
| Tags y contador | pill solo cuando la forma comunica compacidad |

No se usan contenedores de sección redondeados ni radios de `24px` o más.

### Sombras

- Las cards públicas no usan drop shadow.
- El header puede usar una línea o sombra de `1–2px` de blur como separación funcional, no ambas con elevación amplia.
- El foco usa halo definido y visible.
- No combinar borde decorativo con sombra amplia.

### Capas

La implementación debe mantener una escala semántica: contenido, sticky, overlay, modal y feedback. No se introducen z-index arbitrarios de cuatro cifras.

## 16. Movimiento

### Principio

El sitio debe sentirse inmediato. El movimiento explica feedback y continuidad; no retrasa la comparación de productos.

### Sistema objetivo

| Interacción | Duración | Propiedades | Curva |
| --- | --- | --- | --- |
| Hover de color o borde | `120–180ms` | color, background-color, border-color | `ease` |
| Press de botón | `100–140ms` | transform | ease-out fuerte |
| Cambio pequeño de estado | `160–220ms` | opacity, transform | ease-out fuerte |
| Entrada inicial opcional | máximo `240ms` | opacity, translateY hasta `6px` | ease-out fuerte |

Curva de referencia: `cubic-bezier(0.23, 1, 0.32, 1)`.

### Reglas

- No usar `transition: all`.
- No animar width, height, margin, padding ni layout salvo necesidad demostrada.
- No aplicar reveal a cada sección o cada fila del catálogo.
- Una entrada coordinada de apertura y primera fila es opcional, pero los productos deben ser visibles por defecto aunque el script no ejecute.
- El stagger, si se aprueba, se limita a la primera fila, con `30–50ms` entre piezas y sin bloquear interacción.
- Hover con transform solo se aplica bajo `(hover: hover) and (pointer: fine)`.
- Teclado no espera animaciones de apertura o cierre.
- `prefers-reduced-motion: reduce` elimina desplazamiento y escala; puede conservar cambios instantáneos o crossfade breve.
- No se añaden librerías de movimiento para este sistema.

## 17. Responsive

### Principio

El layout responde a espacio útil y contenido. Los breakpoints implementados deben derivarse del ancho mínimo de una card, la medida del texto y el número real de controles, no de nombres de dispositivos.

### Grid objetivo

| Contexto | Columnas objetivo | Condición |
| --- | --- | --- |
| Móvil mínimo | `1` | Cuando dos cards no conservan al menos `152px` útiles cada una. |
| Móvil habitual | `2` | Desde el ancho que permite dos cards legibles con gap de `10–12px`. |
| Tablet | `2` | Prioriza fotografía y nombres completos. |
| Escritorio medio | `3` | Cada card conserva aproximadamente `270px` o más. |
| Escritorio amplio | `4` | Cada card conserva aproximadamente `270px` o más. |

No se fuerza el cambio de densidad en `1440px` si el contenedor ya admite cuatro columnas antes. La implementación exacta puede usar container queries, auto-fit controlado o media queries basadas en contenido; debe verificarse en los viewports obligatorios.

### Matriz obligatoria

| Viewport | Resultado esperado |
| --- | --- |
| `1440×900` | Header de una fila, apertura compacta, toolbar completa, `4` columnas, primera fila visible, detalle en dos columnas y solicitud con resumen lateral. |
| `1280×720` | Economía vertical, `3–4` columnas según ancho útil validado, producto visible en primer viewport y ninguna imagen de altura completa. |
| `1024×768` | `3` columnas útiles, toolbar recompuesta sin panel, detalle aún en dos columnas solo si ambas conservan medida legible. |
| `768px` | Header compacto, `2` columnas, toolbar en dos niveles, detalle y solicitud apilados, categorías con overflow contenido si hace falta. |
| `430×932` | `2` columnas, gutter de `16–20px`, búsqueda completa, filtros horizontales, nombres y precios legibles. |
| `390×844` | Misma jerarquía que `430px`, con wrapping largo y controles de cantidad de `44px`. |
| `360×800` | `2` columnas solo si cada card conserva el mínimo; no ocultar descripción esencial para sostenerlas. |
| `320×568` | `1` columna, apertura mínima, primer producto temprano, footer y solicitud en una columna. |

### Estados de datos para cada viewport

Validar catálogo con `0`, `1`, `2`, `3`, `4`, `12` y muchos productos. También validar:

- Nombre de producto corto y hasta `150` caracteres.
- Nombre de negocio corto y hasta `120` caracteres.
- Categorías numerosas y nombres largos.
- Precio COP largo y precio anterior opcional.
- Código de molde ausente, corto y de `40` caracteres sin espacios.
- Imagen ausente, una imagen, varias y carga fallida.
- Solicitud vacía, una fila, muchas filas y cantidad de dos dígitos.
- Contacto configurado, ausente y con error de carga.

### Reglas de reflow

- No ocultar problemas con `overflow-x: hidden` o `clip` a nivel de página.
- El único overflow horizontal previsto es el de categorías y thumbnails, contenido en su región.
- Flex y grid children con texto variable deben poder encogerse mediante `min-width: 0` y hacer wrap de identificadores.
- No usar alturas fijas para copy, nombre, precio o datos.
- Safe areas se consideran si una superficie full-bleed o fija llega a bordes del viewport.
- Debe funcionar a zoom de `200%` y reflow equivalente a `320px` CSS sin pérdida de contenido.

## 18. Accesibilidad

Objetivo mínimo: WCAG 2.2 AA.

### Semántica

- Un `main` por ruta y jerarquía de headings sin saltos arbitrarios.
- Listas para productos, atributos o pasos cuando semánticamente corresponda.
- Botones para acciones y enlaces para navegación.
- Labels persistentes para campos y grupos de filtros.
- Semántica nativa antes que ARIA.
- Estados async con `aria-live="polite"` y región ocupada con `aria-busy` cuando proceda.

### Teclado y foco

- Enlace de salto al contenido.
- Orden de foco igual al orden visual y de lectura.
- `:focus-visible` de al menos `2px`, offset perceptible y contraste mínimo `3:1` respecto a superficies adyacentes.
- Ningún outline se elimina sin reemplazo.
- Scrollers horizontales pueden recorrerse sin atrapar foco.
- El producto enlazado completo tiene un único destino comprensible; no contiene acciones anidadas incompatibles.

### Contraste y legibilidad

- Texto normal, placeholders y labels: mínimo `4.5:1`.
- Texto grande, iconos funcionales, foco y límites esenciales: mínimo `3:1`.
- No depender solo de color para selección, error o disponibilidad.
- Cuerpo base de `16px`; texto compacto no baja de `12px`.
- Targets interactivos de al menos `44×44px`.

### Imágenes y movimiento

- Alt útil para producto; alt vacío solo para duplicados decorativos o controles ya etiquetados.
- No usar nombre de archivo como alt.
- Respetar reduced motion en toda animación.
- La información y las acciones no dependen de hover.

### Formularios y estados

- Inputs con `name`, tipo y autocomplete apropiados.
- Errores junto al control o acción que los produjo y con siguiente paso claro.
- No bloquear paste, zoom ni selección de texto.
- Los cambios de cantidad, eliminación y filtros deben anunciarse cuando la actualización no sea evidente por foco.

Los cambios que alteren comportamiento, como persistir filtros en URL o recuperar posición de scroll, se registran aparte y no se introducen bajo la etiqueta de accesibilidad sin aprobación funcional.

## 19. Estados

Cada estado ocupa el lugar del contenido al que sustituye. No se monta como una card flotante ni conserva un showcase incongruente por encima.

| Estado | Tratamiento | Acción |
| --- | --- | --- |
| Carga de catálogo | Reserva estable del área, texto “Cargando…” y geometría neutra sin shimmer. | Ninguna mientras progresa. |
| Catálogo vacío real | Explica que no hay piezas publicadas sin prometer fecha o disponibilidad. | Ninguna o retorno seguro según ruta. |
| Sin coincidencias | Nombra el resultado de búsqueda o filtro de forma breve. | Limpiar búsqueda o volver a “Todo”. |
| Error recuperable | Explica que la colección no pudo cargarse. | Reintentar. |
| Imagen ausente | Plano neutro con mensaje breve. | El enlace al detalle permanece si el producto existe. |
| Detalle inexistente | Contexto de producto no encontrado. | Volver a la colección. |
| Pieza añadida | El contador existente se actualiza y una región polite confirma la misma acción, sin toast ni demora artificial. | Ver solicitud o continuar. |
| Límite de cantidad | El control que no puede avanzar se deshabilita sin perder contraste y comunica el límite mediante nombre o descripción accesible. | Ajustar en la dirección permitida. |
| Confirmación destructiva | Conserva la confirmación existente y devuelve el foco a un destino lógico al cerrarse. | Confirmar o cancelar. |
| Solicitud vacía | Explica que todavía no hay piezas. | Explorar la colección. |
| Contacto ausente | Indica que la consulta no puede prepararse en ese momento, sin inventar canal. | Conservar revisión de solicitud. |
| Error de contacto | Mensaje específico y no destructivo. | Reintentar si el comportamiento existente lo permite. |
| 404 | Marca y orientación compactas, sin cifra monumental. | Volver al inicio. |

### Reglas de copy

- Voz activa, directa y en segunda persona cuando corresponda.
- El error dice qué ocurrió y cuál es el siguiente paso.
- Estados de carga terminan en elipsis tipográfica `…`.
- No pedir disculpas de forma vaga ni usar tono promocional en fallos.
- No inventar productos, imágenes, promociones o prueba social para llenar vacíos.

## 20. Antipatrones

No implementar:

- Hero de pantalla completa, video de fondo o imagen de una pantalla de alto.
- Secuencia tesis → CTA → showcase → catálogo.
- Showcase separado que repite productos del grid.
- Revista simulada con columnas tipográficas, drop caps o composición que dificulte comparar.
- SaaS, dashboard, panel de métricas o navegación corporativa en la experiencia pública.
- Cards anidadas, panel por sección o grid de cards para explicar cada idea.
- Beige uniforme, paleta tímida sin contraste o pasteles usados como relleno.
- Gradientes genéricos, texto con gradiente, glassmorphism o blur decorativo.
- Radios mayores de `16px` en cards y secciones, salvo elementos realmente circulares.
- Borde fino más sombra amplia en la misma superficie.
- Etiqueta pequeña en mayúsculas sobre cada sección.
- Marcadores `01 / 02 / 03` salvo en un proceso realmente ordenado.
- Código de molde como badge público o elemento promocional.
- Quick add, checkout, pagos, favoritos, reserva, inventario inventado o urgencia comercial.
- Iconos grandes redondeados, emoji o caracteres Unicode como sistema visual final.
- Parallax, scroll secuestrado, cursor personalizado, marquee o reveal repetido.
- `transition: all`, animaciones superiores a `300ms` en interacción frecuente o contenido oculto hasta que JavaScript anime.
- Microtexto menor de `12px`, foco imperceptible, targets menores de `44px` o información solo en hover.
- Ocultar overflow globalmente para maquillar fallos responsive.
- Cambiar tokens globales compartidos antes de aislar administración.
- Reescribir componentes o carpetas solo para acompañar una mejora visual.

## 21. Referencias conceptuales

Las referencias describen principios, no layouts para copiar:

- **Mesa de corte de atelier:** amplitud, orden y herramientas pegadas al objeto que modifican.
- **Etiqueta de prenda:** jerarquía compacta entre nombre, precio y datos, sin card pesada.
- **Perchero abierto:** comparación inmediata y ritmo repetible sin una vitrina separada.
- **Catálogo de boutique contemporánea:** fotografía dominante, compra comprensible y servicio humano.
- **Ficha de museo comercial:** datos precisos y discretos, sin convertir la tienda en publicación cultural.
- **Interfaces de baja fricción:** acciones con labels claros, estados previsibles y respuesta inmediata.

Beauty in STEM, Brunello Cucinelli AI E-commerce y ChatGPT pueden seguir funcionando como referencias históricas de suavidad, atención material y claridad. No autorizan copiar paletas, layouts, componentes, tono o firma visual.

## 22. Decisiones firmes y provisionales

### Firmes

- La colección es la interfaz principal.
- No existe showcase independiente.
- La primera fila del grid es el escaparate.
- Apertura, controles y resultados forman un flujo continuo.
- La búsqueda y los filtros viven con el catálogo que controlan.
- Imagen, nombre y precio son la jerarquía primaria de producto.
- Newsreader y Manrope se conservan.
- Superficies planas, líneas finas, radios contenidos y sombras mínimas.
- Marfil cálido, acción carbón, piedra, arena y un único acento taupe configurable.
- Card completa enlaza al detalle; añadir permanece en el detalle.
- Código de molde ausente de cards y discreto donde sí corresponde.
- Solicitud sigue siendo solicitud y WhatsApp sigue siendo la salida comercial.
- Administración se rediseña por separado bajo registro `product`.
- WCAG 2.2 AA, targets de `44px`, foco visible y reduced motion son mínimos.

### Provisionales hasta validación de tanda

- Composición final de transparencias y estados disabled sobre cada superficie real.
- Umbral exacto entre `3` y `4` columnas.
- Composición asimétrica exacta de la apertura en escritorio.
- Presencia de descripción corta o affordance textual en cards compactas.
- Entrada inicial coordinada y posible stagger de la primera fila.
- Conversión futura de la barra de catálogo en sticky.
- Fuente final de SVG y diseño de favicon, sujetos a assets aprobados.
- Módulo posterior de personalización, sujeto a copy real aprobado.

Una decisión provisional no permite improvisación durante implementación. Debe resolverse y registrarse dentro de la tanda que la necesita.

## 23. Plan por tandas

Las tandas siguientes son macrofases de roadmap, no autorización para un diff único. Si una macrofase contiene más de una responsabilidad, se divide antes de implementarse en subtandas pequeñas, cada una con alcance, archivos y aceptación propios. En particular, Tanda 4 se separa como mínimo en responsive, accesibilidad/estados y movimiento; Tanda 6 se separa en identidad/assets, rendimiento y revisión final.

### Tanda 0A: contrato y diagnóstico

**Objetivo:** establecer fuentes de verdad y proteger funcionalidad antes del rediseño.

**Entregables:**

- `AGENTS.md`.
- `docs/design-audit-v2.md`.
- `DESIGN_BIBLE.md`.

**Aceptación:** los documentos distinguen estado real, dirección objetivo, invariantes y riesgos. No se modifica código de aplicación.

### Tanda 0B: tokens y ownership visual

**Objetivo:** preparar el sistema híbrido para rediseñar lo público sin alterar administración.

**Estado:** implementada a nivel de tokens, primitivas y documentación; validación visual manual pendiente.

**Alcance:**

- Valores definitivos `--catalog-*` bajo `.catalog-site` en `src/tailwind.css`.
- Theme utilities `boutique-*` conectadas al scope público.
- Bridge temporal para consumidores de nombres globales dentro del mismo scope de `src/tailwind.css`.
- Primitivas públicas para contenedor, títulos, texto, acciones, campos, foco, badges, estados, media, precio y separadores.
- Ownership documentado sin activar Preflight, cambiar el orden de hojas ni tocar `src/admin.css`.
- Estado real de Tailwind actualizado en `DESIGN.md`, esta Biblia y el plan de migración.

**No tocar:** componentes visuales, datos, rutas, comportamiento ni `src/admin.css` salvo lectura de consumidores.

**Aceptación manual:** comparación pública y administrativa en todos los estados actuales, contraste calculado y ausencia de regresiones por cascade.

### Tanda 1A: header, apertura y barra de catálogo

**Objetivo:** hacer visible la colección en el primer recorrido.

**Alcance:**

- Simplificar navegación pública.
- Convertir el hero en apertura compacta.
- Eliminar visualmente la fase de showcase independiente.
- Unir apertura, búsqueda, resultado y categorías sobre el eje del catálogo.
- Incorporar enlace de salto y offsets correctos.
- Conservar los anchors, `id`, `href` y destinos públicos existentes aunque una entrada deje de mostrarse en la navegación principal.

**No tocar:** algoritmo de búsqueda, carga de datos, categorías, rutas, cards o flujo de solicitud.

**Aceptación manual:** objetivos de primer viewport, teclado, nombres de boutique largos, `0–4` productos, carga, error y categorías numerosas.

### Tanda 1B: grid, cards, búsqueda y filtros

**Objetivo:** convertir el grid real en escaparate comparativo.

**Alcance:**

- Ajustar densidad por ancho útil.
- Rediseñar media y etiqueta de producto.
- Elevar nombre y precio.
- Resolver `1`, `2`, `3`, `4` y muchos resultados.
- Afinar estados de búsqueda, categorías, limpieza y contador único.
- Mantener imágenes contenidas y cards como enlaces completos.

**No tocar:** quick add, nuevos filtros, ordenamiento, persistencia en URL, dominio o datos.

**Aceptación manual:** matriz responsive completa, contenido largo, imágenes ausentes, hover/touch/teclado y primera fila sin productos duplicados.

### Tanda 2: detalle de producto

**Objetivo:** hacer inmediata la relación imagen → nombre → precio → acción.

**Alcance:**

- Reequilibrar galería e información.
- Integrar consulta individual sin panel competitivo.
- Ordenar descripción, atributos, preparación y código de molde.
- Estabilizar proporción de imagen y thumbnails.
- Revisar estados de carga, error y producto inexistente.
- Confirmar la adición mediante el contador existente y una región de estado accesible.
- Omitir la afirmación fija de disponibilidad si el contrato actual no la respalda, sin crear lógica de inventario.

**No tocar:** selección de producto, comportamiento de agregado, consulta, URLs de WhatsApp, contratos ni lógica de disponibilidad.

**Aceptación manual:** una y varias imágenes, nombres largos, precios, código de `40` caracteres, contacto presente/ausente y todos los viewports.

### Tanda 3: solicitud

**Objetivo:** priorizar revisión de piezas y cantidades sin parecer checkout.

**Alcance:**

- Compactar cabecera.
- Rediseñar filas y resumen.
- Llevar controles a targets mínimos.
- Mejorar jerarquía de precio unitario, subtotal y total de referencia.
- Tratar estados vacío, contacto ausente y error.
- Definir feedback visual y accesible para límites de cantidad y confirmaciones destructivas existentes.

**No tocar:** provider, persistencia, límites, cálculos, confirmaciones, mensajes o enlaces de WhatsApp.

**Aceptación manual:** solicitud vacía, una y muchas filas, cantidad de dos dígitos, códigos largos, teclado y recomposición responsive.

### Tanda 4: responsive, accesibilidad y movimiento

**Objetivo:** cerrar la experiencia pública contra WCAG 2.2 AA y la matriz de contenido.

**Alcance:**

- Resolver overflow real sin ocultarlo globalmente.
- Unificar breakpoints por contenido.
- Verificar contraste, foco, semántica, labels, live regions, alt y targets.
- Ajustar reduced motion e interacciones de puntero fino.
- Evaluar, sin asumir, si la barra de catálogo necesita sticky.
- Cerrar el responsive y la accesibilidad del footer, 404 y estados compartidos del shell público.
- Consultar las reglas web actualizadas antes de la revisión.

**No tocar:** cambios funcionales de navegación, URL, persistencia o dominio bajo etiqueta de accesibilidad.

**Aceptación manual:** matriz completa, zoom `200%`, teclado, lector de pantalla sobre flujos críticos, reduced motion y colecciones de todos los tamaños.

### Tanda 5: administración

**Objetivo:** rediseñar el panel como superficie `product`, sin heredar mecánicamente la estética pública.

**Alcance:**

- Auditar primero flujos y `src/admin.css`.
- Definir tokens administrativos separados.
- Mejorar densidad, formularios, tablas/listas, feedback y responsive.
- Mantener código de molde visible y buscable.

**No tocar:** autenticación, permisos, Supabase, repositorios, validaciones o contratos sin tarea funcional separada.

**Aceptación manual:** login, dashboard, productos, edición, categorías y configuración con datos largos, errores y teclado.

### Tanda 6: producción

**Objetivo:** cerrar identidad, rendimiento y evidencia de entrega.

**Alcance:**

- Favicon y metadata solo con contenido aprobado.
- Prioridad de imágenes críticas, lazy loading inferior y prevención de CLS.
- Fuentes, preconnect/preload y fallback.
- Limpieza de assets de plantilla confirmados como no consumidos.
- Revisión final de estados, rutas públicas y protegidas.
- Registro de validación visual y funcional manual.

**No tocar:** contenido comercial inventado, integraciones o comportamiento para resolver una deuda visual.

**Aceptación manual:** pruebas, build, lint, contraste, teclado, rutas y matriz responsive ejecutados por el usuario según `AGENTS.md`. Para rendimiento se registra una línea base al iniciar Tanda 6 y se repite el mismo perfil de red, CPU, viewport y datos en tres ejecuciones; se compara la mediana antes/después, con objetivo `CLS ≤ 0.1`, `LCP ≤ 2.5s` e interacción local crítica `≤ 200ms`. Si una dependencia remota impide el objetivo, se registra causa y evidencia en lugar de declarar cierre sin medición.

## 24. Criterios de aceptación global

El rediseño v2 puede considerarse implementado solo cuando:

- Los productos aparecen casi inmediatamente en inicio.
- No existe repetición entre showcase y grid.
- Búsqueda, filtros, contador y resultados se perciben como un único sistema.
- Nombre, imagen y precio dominan cada producto.
- El flujo catálogo → detalle → solicitud → WhatsApp permanece intacto.
- Código de molde conserva todos sus usos autorizados y no aparece en cards públicas.
- No se han inventado datos ni transformado la solicitud en checkout.
- Administración no cambia antes de su tanda.
- Ningún viewport obligatorio presenta overflow de página, corte de contenido o densidad ilegible.
- Todos los controles alcanzan `44×44px`, el foco es visible, el contraste cumple y reduced motion funciona.
- Carga, vacío, sin resultados, error, imagen ausente, solicitud vacía y contacto ausente tienen tratamiento coherente.
- Los cambios de tokens públicos no alteran accidentalmente la superficie administrativa.
- La documentación coincide con el estado real de Tailwind y con la implementación final.

La validación visual, pruebas, build, lint, comandos Git, commit y push permanecen a cargo del usuario salvo instrucción explícita distinta.
