# Product

## Register

brand

## Platform

web

## Registro por superficie

- **Experiencia pública — `brand`:** el catálogo es una superficie de marca. Debe comunicar identidad, confección, delicadeza y calidad, además de mantener claro el recorrido comercial.
- **Futura migración administrativa — `product`:** el panel administrativo se tratará como una superficie de producto, porque la claridad operativa, los controles predecibles y la familiaridad tendrán prioridad sobre la expresión de marca.

## Nombre del producto

`boutique-web`

## Tipo de producto

Catálogo web de una boutique de moda femenina donde las personas exploran prendas y preparan una solicitud que se envía por WhatsApp. No es un checkout transaccional: la disponibilidad, personalización, entrega y conversación comercial final se confirman directamente con la boutique.

## Users

- Visitantes que exploran las prendas disponibles y la identidad de la boutique.
- Clientes que buscan, filtran, abren detalles de producto y preparan una solicitud.
- El administrador de la boutique, que gestiona catálogo y configuración mediante rutas protegidas.

## Product Purpose

La experiencia pública reúne el descubrimiento de productos y la consulta directa por WhatsApp en un recorrido coherente. Debe ayudar a entender la colección, elegir una o varias piezas, ajustar cantidades y enviar una solicitud clara sin exponer detalles internos de implementación.

El producto cumple su propósito cuando la colección es fácil de explorar en escritorio y móvil, la información de cada prenda es legible y el cliente llega a WhatsApp con los productos y cantidades elegidos intactos.

## Positioning

Un catálogo de boutique cercano que combina una identidad de moda cuidada con un recorrido breve y comprensible desde el descubrimiento hasta una consulta personal por WhatsApp.

## Conversion & proof

- La conversión pública principal es añadir piezas a la solicitud y enviar la solicitud consolidada por WhatsApp.
- La ruta secundaria permite consultar una sola pieza desde su detalle.
- La búsqueda, los filtros de categoría y el detalle de producto respaldan ambos recorridos; no son recursos decorativos.
- Imágenes, descripciones, precio, atributos y tiempo de preparación proceden de los datos reales del catálogo. No se inventan testimonios, prueba social, afirmaciones comerciales ni datos de contacto.

## Brand Personality

Contemporánea, cálida, delicada, artesanal, minimalista, comercial y refinada sin parecer inaccesible. La experiencia debe transmitir confianza serena y atención al detalle de la prenda, no estatus ni exclusividad como fines en sí mismos.

## Anti-references

La experiencia pública no debe derivar hacia degradados púrpura o azul genéricos, glassmorphism innecesario, monocultivo de fuentes del sistema, uso automático de Inter, cards anidadas, redondeados exagerados, sombras grandes, heroes sobredimensionados, imágenes de producto de una pantalla de alto, beige uniforme en toda la página, exceso de etiquetas en mayúsculas, cuadrículas editoriales que compitan con las prendas, aspecto de dashboard, páginas corporativas ni cambios visuales arbitrarios hechos solo para producir un diff grande.

Tampoco debe imitar una revista. La tipografía editorial se usa con moderación para apoyar los productos, no para convertir el catálogo en una composición editorial.

## Design Principles

1. **Las prendas lideran.** Las imágenes y la información del producto sostienen la decisión; la decoración permanece en segundo plano.
2. **Identidad y comercio trabajan juntos.** La superficie pública puede sentirse refinada, pero búsqueda, filtros, precios, detalles, solicitud y acciones de WhatsApp deben ser fáciles de encontrar.
3. **Oficio silencioso antes que espectáculo.** Tipografía, líneas finas, geometría medida y espacio negativo deliberado comunican calidad sin efectos pesados.
4. **Responsive compuesto, no simplemente apilado.** Cada ancho compatible conserva jerarquía, densidad útil y una ruta clara hacia la colección y la solicitud.
5. **Migración y rediseño permanecen separados.** La migración técnica reproduce primero la base provisional aprobada; los cambios visuales requieren una tanda propia y justificada.

## Flujos públicos

1. Explorar el catálogo.
2. Buscar productos.
3. Filtrar por categoría.
4. Abrir el detalle de un producto.
5. Añadir un producto a la solicitud.
6. Gestionar cantidades o eliminar productos.
7. Enviar la solicitud consolidada por WhatsApp.

El detalle de producto también permite una consulta directa por una sola pieza cuando el contacto de la tienda está configurado.

## Rutas actuales

### Públicas

- `/` — inicio del catálogo, hero, controles de descubrimiento y colección.
- `/productos/:slug` — detalle público y galería de producto.
- `/solicitud` — productos seleccionados, gestión de cantidades, resumen y acción de WhatsApp.
- `*` — experiencia pública de página no encontrada.

### Administración

- `/admin/login` — inicio de sesión del administrador.
- `/admin` — dashboard protegido.
- `/admin/products` — listado protegido de productos.
- `/admin/products/new` — creación protegida de producto.
- `/admin/products/:productId/edit` — edición protegida de producto.
- `/admin/settings` — configuración protegida de la boutique.
- `/admin/categories` — gestión protegida de categorías.

## Restricciones funcionales

El trabajo visual y la migración a Tailwind no deben modificar:

- El dominio.
- La configuración, el esquema ni las integraciones de Supabase.
- Las interfaces o implementaciones de repositorios.
- Los casos de uso.
- El comportamiento de autenticación.
- Los datos de la solicitud guardados en `localStorage`.
- La construcción de mensajes de WhatsApp para producto o solicitud.
- La información existente de productos, redes, teléfonos o comercio.

No se puede inventar ningún producto, perfil social, teléfono, testimonio, promoción o promesa comercial para llenar un vacío visual.

## Stack actual

- React `^19.2.7`.
- TypeScript `~6.0.2`.
- Vite `^8.1.1` con `@vitejs/plugin-react`.
- React Router mediante `react-router` `^8.2.0`.
- Supabase mediante `@supabase/supabase-js` `^2.110.7`.
- Vitest `^4.1.10`.
- Oxlint `^1.71.0`.
- CSS convencional cargado desde `src/index.css`, `src/catalog.css` y `src/admin.css`.

## Estado de Tailwind

Tailwind CSS estuvo contemplado inicialmente, pero nunca fue instalado. No existe dependencia, plugin de Vite, archivo de configuración, directiva `@tailwind` ni import de Tailwind en el repositorio actual.

Tailwind CSS se incorporará mediante una migración controlada y por etapas. Las primeras fases públicas deben ser visualmente neutras; la superficie administrativa queda fuera de alcance hasta su fase posterior y la referencia visual segura es el tag inmutable `visual-public-v1`.

## Accessibility & Inclusion

La experiencia pública debe seguir siendo comprensible con HTML semántico, navegación por teclado, foco visible, contraste suficiente, texto alternativo útil, touch targets adecuados, soporte de reducción de movimiento y layouts responsive sin scroll horizontal de página ni contenido cortado. Las mejoras de accesibilidad que cambien la apariencia deben identificarse de forma explícita y no ocultarse dentro de una migración supuestamente neutra.
