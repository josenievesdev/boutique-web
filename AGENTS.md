# AGENTS.md

## Propósito

Este repositorio contiene Boutique Web, un catálogo de moda con solicitud por WhatsApp y panel administrativo privado. No es un ecommerce con pagos.

El trabajo debe proteger primero el comportamiento existente y avanzar mediante cambios pequeños, revisables y explícitos. Una tanda visual no autoriza cambios de producto, dominio, persistencia o integraciones.

## Fuentes de verdad

Consultar en este orden antes de trabajar:

1. `PRODUCT.md`: propósito, usuarios, rutas, flujos y restricciones funcionales.
2. `DESIGN_BIBLE.md`: dirección visual objetivo para el rediseño v2.
3. `docs/design-audit-v2.md`: diagnóstico y evidencia del estado previo al rediseño.
4. `DESIGN.md`: registro provisional de la etapa visual anterior; no prevalece sobre `DESIGN_BIBLE.md` cuando ambos difieren.
5. `docs/tailwind-migration-plan.md`: contexto histórico y técnico de la migración; verificar siempre su estado contra el código actual.

Si la documentación contradice la implementación, no asumir cuál es correcta. Registrar la discrepancia y limitar el cambio al alcance aprobado.

## Stack y estado visual

- React 19, TypeScript, Vite y React Router.
- Supabase para datos, autenticación y almacenamiento.
- Tailwind CSS v4 con `@tailwindcss/vite` ya está instalado.
- `src/tailwind.css` carga theme y utilities sin Preflight.
- La interfaz pública está en una etapa híbrida: header, apertura, búsqueda y filtros usan utilities; catálogo, detalle, solicitud y footer conservan CSS convencional.
- `src/index.css` contiene variables y normalización globales compartidas.
- `src/admin.css` continúa siendo la implementación visual administrativa.

No añadir `tailwind.config.*`, activar Preflight, cambiar el orden de hojas ni sustituir el sistema híbrido sin una tarea técnica específica.

## Skills instaladas

Usar únicamente skills presentes en `.agents/skills/`.

### Consulta obligatoria según alcance

- `.agents/skills/frontend-design/`: consultar al definir o revisar una dirección visual pública.
- `.agents/skills/impeccable/`: consultar para auditoría, rediseño, jerarquía, responsive, accesibilidad, tokens y pulido. La superficie pública usa registro `brand`; administración usa registro `product`.
- `.agents/skills/vercel-react-best-practices/`: consultar antes de escribir o reorganizar componentes React, carga de datos o listas.
- `.agents/skills/web-design-guidelines/`: consultar en tandas de accesibilidad o revisión final y obtener sus reglas actualizadas según las instrucciones de la skill.

### Consulta complementaria

- `.agents/skills/redesign-existing-projects/`: útil para auditar y mejorar sin reescribir el proyecto.
- `.agents/skills/ui-ux-pro-max/`: útil para contrastar patrones, accesibilidad y decisiones de sistema; sus resultados no reemplazan `PRODUCT.md` ni `DESIGN_BIBLE.md`.
- `.agents/skills/emil-design-eng/`: consultar cuando una tanda incluya movimiento o microinteracciones.

### Skills que no gobiernan la aplicación

- `.agents/skills/web-artifacts-builder/` crea artifacts aislados y no debe inicializar, reemplazar ni empaquetar esta aplicación de producción.
- No introducir shadcn/ui, Radix, Parcel ni el stack de artifacts por existir esa skill.
- No inventar una skill, un comando o una capacidad que no esté instalada.

## Protección funcional

Durante una tanda visual está prohibido modificar:

- `supabase/`, migraciones, políticas, storage o configuración.
- Entidades, errores, puertos, repositorios o casos de uso de `src/core/`.
- Implementaciones de Supabase o repositorios en memoria de `src/infrastructure/`.
- Autenticación, rutas protegidas o permisos administrativos.
- Rutas públicas, slugs o destinos existentes.
- Estructura, clave o compatibilidad de la solicitud guardada en `localStorage`.
- Reglas de cantidades, subtotales, precios o valor de referencia.
- Constructores de mensajes y enlaces de WhatsApp.
- Contratos de `Product`, categorías, imágenes o configuración.
- Código de molde, su valor, su persistencia o su inclusión en solicitud y WhatsApp.

Si una mejora visual parece requerir cualquiera de esos cambios, detenerla y proponer una tarea funcional separada.

## Contenido real

- No inventar productos, precios, categorías, imágenes, promociones, testimonios, perfiles sociales, teléfonos, materiales, tallas, tiempos ni promesas de disponibilidad.
- No convertir el catálogo en checkout, carrito transaccional, reserva o flujo de pago.
- Mantener el término `solicitud` y el carácter informativo de los valores.
- El código de molde es metadata operativa discreta. No mostrarlo en tarjetas públicas ni convertirlo en badge promocional.
- El módulo de personalización o proceso solo puede explicar capacidades y pasos reales del producto.

## Reglas del rediseño público

- Concepto rector: **“Atelier abierto: una boutique digital donde la colección es la interfaz”.**
- Los productos deben aparecer casi inmediatamente.
- La primera fila del catálogo funciona como escaparate; no crear un showcase separado que repita productos.
- Búsqueda, filtros, contador y resultados deben formar un mismo bloque visual.
- Nombre, imagen y precio son la jerarquía primaria de producto.
- La apertura debe ser breve y nunca volver a desplazar el catálogo fuera del primer recorrido.
- Personalización y trabajo sobre pedido se explican después de mostrar productos.
- No volver a convertir el inicio en una landing con tesis, CTA, showcase y catálogo como secciones sucesivas.
- No imitar una revista, una campaña de moda inaccesible, una agencia, un SaaS o un dashboard.
- No usar la palabra “editorial” como permiso para sacrificar comparación, búsqueda, precio o acciones.
- No crear grids de tarjetas repetitivas cuando una lista, regla, toolbar o flujo continuo sea más claro.
- No anidar cards ni envolver cada bloque en paneles redondeados.
- La fotografía y los datos reales aportan identidad; la decoración queda en segundo plano.

## Superficie administrativa

- El panel se rediseña solo en la Tanda 5.
- Administración usa registro `product`: familiaridad, densidad útil, labels claros y estados previsibles.
- No trasladar automáticamente la tipografía editorial, el escaparate ni el ritmo de marca al panel.
- No cambiar variables globales públicas si eso modifica administración fuera de alcance.
- Mantener visible y buscable el código de molde en administración.

## Tailwind y CSS

- Trabajar con Tailwind v4 y el enfoque CSS-first ya instalado.
- No instalar librerías de componentes, iconos o animación sin una justificación concreta y aprobación explícita.
- No usar `@apply` para reconstruir hojas completas.
- No componer nombres de utilities dinámicamente si Tailwind no puede detectarlos.
- Evitar nuevos `!important`; resolver ownership, layers y especificidad dentro de la tanda técnica correspondiente.
- Mantener tokens semánticos y separar tokens públicos de los administrativos antes de cambiar la personalidad de marca.
- Eliminar un selector solo después de comprobar manualmente todos sus consumidores.
- No mezclar migración técnica, rediseño y limpieza amplia en una sola tanda.

## Alcance y tamaño de cambios

- Una tanda debe tener una sola responsabilidad visual principal.
- Preferir el cambio correcto más pequeño sobre una reescritura.
- No reorganizar carpetas, renombrar componentes ni extraer abstracciones genéricas solo para acompañar un rediseño.
- Extraer un componente cuando tenga una responsabilidad visual o reutilización concreta.
- No corregir problemas no relacionados dentro del mismo diff.
- Documentar riesgos descubiertos que queden fuera de alcance.

## React

- Conservar cargas independientes en paralelo.
- No introducir waterfalls.
- No almacenar en estado valores derivables durante render.
- No usar `useMemo` o `useCallback` por defecto.
- Considerar `useDeferredValue` o transiciones solo si una colección grande demuestra una interacción costosa.
- Mantener lazy loading de rutas.
- No añadir una dependencia para resolver algo que React, CSS o la plataforma ya resuelven con claridad.

## Accesibilidad

- Objetivo mínimo: WCAG 2.2 AA.
- Mantener HTML semántico, landmarks y jerarquía de headings.
- Mantener labels persistentes; un placeholder no reemplaza un label.
- Mantener foco `:focus-visible` claramente perceptible.
- Objetivo táctil mínimo: `44 × 44 px`.
- Contraste mínimo: `4.5:1` en texto normal y `3:1` en texto grande, iconos funcionales y límites esenciales.
- Mantener alt útil en imágenes de producto y alt vacío solo en duplicados decorativos correctamente etiquetados.
- Respetar `prefers-reduced-motion`.
- No depender de hover para información o acciones.
- No ocultar errores responsive con `overflow-x: hidden` o `clip`.
- Probar contenido largo, zoom y navegación por teclado en la tanda manual correspondiente.

## Responsive

- Diseñar por contenido, no por nombres de dispositivos.
- Conservar una matriz explícita que incluya al menos `1440×900`, `1280×720`, `1024×768`, `768px`, `430×932`, `390×844`, `360×800` y `320×568`.
- Validar colecciones con `0`, `1`, `2`, `3`, `4` y muchos productos.
- Validar nombres largos, precios COP, código de molde de 40 caracteres, imágenes ausentes y cantidades de dos dígitos.
- Evitar saltos arbitrarios de densidad en un solo píxel de breakpoint.
- Mantener proporciones de producto coherentes entre grid, detalle y solicitud.

## Movimiento

- Animar solo cuando explica estado, continuidad o feedback.
- Interacciones frecuentes deben ser inmediatas o inferiores a `220ms`.
- Preferir `transform` y `opacity`; no animar layout sin necesidad.
- No añadir parallax, scroll secuestrado, cursores personalizados, marquees ni reveals en cada sección.
- Los productos deben estar visibles aunque una animación no se ejecute.
- Toda animación debe tener alternativa de reducción de movimiento.

## Pruebas y Git

- Las pruebas generales, build, lint, validación visual, comandos Git, commit y push serán ejecutados manualmente por el usuario.
- El agente no debe ejecutar la suite completa, `npm run build`, `npm run lint`, commits ni push salvo instrucción explícita del usuario.
- El agente puede ejecutar una prueba específica y estrechamente relacionada solo para diagnosticar un cambio concreto.
- Antes de ejecutar una prueba específica, indicar qué hipótesis diagnostica.
- No crear, modificar ni mover tags o ramas.
- No asumir que un cambio no relacionado del worktree debe revertirse.

## Entrega de cada tanda

La entrega debe indicar:

- Archivos modificados.
- Alcance visual realizado.
- Invariantes funcionales preservadas.
- Riesgos o verificaciones manuales pendientes.
- Viewports y estados que el usuario debe revisar.

No declarar una tanda “terminada” basándose en pruebas no ejecutadas.
