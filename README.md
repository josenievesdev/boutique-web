# Boutique Web

**Catálogo digital y gestión comercial para una boutique de confección.**

Boutique Web es una aplicación desarrollada para centralizar el catálogo de prendas de un negocio real. Permite explorar productos, agregarlos a un carrito y preparar un pedido para continuar la atención y confirmación directamente por WhatsApp.

El proyecto no busca reemplazar el proceso comercial de la boutique con un checkout tradicional. La compra se cierra por WhatsApp porque ese es el flujo que mejor se adapta a la forma en que actualmente trabaja el negocio.

> **Estado actual:** lógica principal implementada. Pendiente definición visual final, validación con la clienta y despliegue productivo.

---

## Objetivo del proyecto

La boutique utilizaba principalmente WhatsApp para mostrar sus productos y atender pedidos. La idea de Boutique Web es darle un punto de entrada propio donde los clientes puedan:

1. consultar el catálogo;
2. revisar los detalles de cada prenda;
3. seleccionar productos;
4. construir un pedido;
5. enviarlo a WhatsApp para continuar allí la conversación y confirmación.

Además del catálogo público, el proyecto incluye herramientas internas para administrar productos, imágenes, categorías y configuración del negocio.

---

## Funcionalidades principales

### Catálogo

- Listado público de productos.
- Organización por categorías.
- Productos destacados.
- Estados de publicación.
- Descripciones y precios.
- Precio anterior cuando corresponde.
- Productos personalizables.
- Productos bajo pedido.
- Tiempo estimado de preparación.
- Múltiples imágenes por producto.
- Imagen principal o portada.

### Carrito

- Agregar productos.
- Modificar cantidades.
- Eliminar productos.
- Mantener el estado del pedido mientras el usuario navega.
- Preparar la información para continuar el proceso comercial por WhatsApp.

### Administración

- Acceso administrativo.
- Creación y edición de productos.
- Gestión de categorías.
- Gestión de imágenes.
- Publicación, ocultamiento y archivo de productos.
- Configuración básica de la tienda.

### Imágenes

- Almacenamiento de imágenes mediante Supabase Storage.
- Asociación de múltiples imágenes a un producto.
- Orden de imágenes.
- Selección de imagen de portada.

---

## Decisiones de producto

Boutique Web fue diseñada alrededor del proceso real del negocio.

Por eso, en esta etapa:

- **no incorpora pagos en línea**;
- **no obliga al cliente a crear una cuenta**;
- **no intenta sustituir WhatsApp**;
- el catálogo funciona como punto de entrada y organización del pedido;
- la conversación comercial y la confirmación final continúan por WhatsApp.

La prioridad es resolver el flujo real de la boutique antes de agregar funciones que el negocio todavía no necesita.

---

## Stack técnico

| Área | Tecnologías |
| --- | --- |
| Frontend | React, TypeScript |
| Build | Vite |
| Navegación | React Router |
| Backend as a Service | Supabase |
| Base de datos | PostgreSQL |
| Autenticación | Supabase Auth |
| Almacenamiento | Supabase Storage |
| Validación | Zod |
| Testing | Vitest |
| Calidad | Oxlint |
| Control de versiones | Git, GitHub |

---

## Arquitectura

El proyecto separa las responsabilidades principales entre dominio, funcionalidades e infraestructura.

```text
src/
├── core/
├── features/
│   ├── admin/
│   ├── auth/
│   ├── cart/
│   └── catalog/
├── infrastructure/
├── lib/
├── routes/
├── App.tsx
└── main.tsx
```

### `core`

Contiene modelos, reglas y conceptos centrales del dominio.

### `features`

Agrupa funcionalidades por área del producto:

- administración;
- autenticación;
- carrito;
- catálogo.

### `infrastructure`

Contiene la integración con servicios externos, principalmente Supabase.

### `routes`

Define la navegación de la aplicación.

---

## Base de datos

La capa de datos utiliza PostgreSQL mediante Supabase.

El proyecto incluye migraciones para:

- esquema principal del catálogo;
- acceso administrativo;
- almacenamiento de imágenes;
- comprobación de permisos administrativos;
- configuración de la tienda.

### Modelo de catálogo

Actualmente se contemplan entidades como:

- categorías;
- productos;
- imágenes de productos;
- configuración de tienda.

Los productos pueden manejar estados como:

```text
draft
published
hidden
out_of_stock
archived
```

También se contemplan reglas relacionadas con:

- categoría;
- precio;
- precio anterior;
- producto destacado;
- personalización;
- fabricación bajo pedido;
- días de preparación;
- orden de imágenes;
- imagen de portada.

---

## Seguridad y acceso

El proyecto utiliza las capacidades de Supabase para separar el acceso público del administrativo.

Entre las medidas implementadas se encuentran:

- autenticación administrativa;
- Row Level Security (RLS);
- políticas de lectura pública para contenido publicado;
- restricciones para operaciones administrativas;
- variables de entorno para configuración local.

Los productos públicos y sus imágenes solo se exponen cuando cumplen las condiciones definidas en las políticas de acceso.

---

## Supabase Storage

Las imágenes de los productos se gestionan mediante Supabase Storage.

El flujo contempla:

- carga de archivos;
- asociación de imágenes con productos;
- orden de visualización;
- imagen principal;
- acceso público controlado según el estado del producto.

---

## Scripts principales

Instalar dependencias:

```bash
npm install
```

Ejecutar en desarrollo:

```bash
npm run dev
```

Generar build:

```bash
npm run build
```

Ejecutar lint:

```bash
npm run lint
```

Ejecutar pruebas:

```bash
npm run test
```

Ejecutar pruebas una sola vez:

```bash
npm run test:run
```

---

## Entorno local de Supabase

Inicializar Supabase:

```bash
npm run supabase:init
```

Levantar el entorno local:

```bash
npm run supabase:start
```

Consultar estado:

```bash
npm run supabase:status
```

Reiniciar la base de datos local y aplicar migraciones:

```bash
npm run supabase:reset
```

Generar tipos TypeScript desde la base de datos:

```bash
npm run db:types
```

---

## Scripts de apoyo

El proyecto incluye scripts para validar distintas partes de la integración:

```bash
npm run core:demo
npm run supabase:demo
npm run admin:bootstrap
npm run admin:demo
npm run repository:demo
npm run storage:demo
npm run images:integration-demo
```

Estos scripts permiten comprobar de forma aislada reglas de dominio, acceso administrativo, repositorios e integración de imágenes.

---

## Variables de entorno

El repositorio incluye un archivo base:

```text
.env.example
```

Las credenciales reales deben mantenerse en un archivo local y nunca versionarse.

La aplicación necesita la configuración correspondiente al proyecto de Supabase para conectarse a la base de datos y servicios asociados.

---

## Estado del proyecto

### Implementado

- estructura principal del catálogo;
- carrito;
- administración;
- autenticación administrativa;
- base de datos PostgreSQL;
- migraciones;
- Supabase Storage;
- gestión de imágenes;
- configuración de tienda;
- pruebas automatizadas;
- separación entre dominio e infraestructura.

### Pendiente

- dirección visual definitiva;
- ajustes responsive finales;
- validación completa con la clienta;
- despliegue productivo;
- configuración final de dominio e infraestructura;
- pruebas de uso con datos reales del negocio.

---

## Próxima etapa

La siguiente fase consiste en cerrar la identidad visual y desplegar una primera versión para pruebas con la boutique.

A partir del uso real se definirán los ajustes necesarios antes de considerarla una versión productiva.

---

## Sobre el proyecto

Boutique Web nació a partir de una necesidad real de una pequeña boutique de confección.

El proyecto busca resolver un problema sencillo sin convertirlo innecesariamente en una plataforma de comercio electrónico compleja: organizar el catálogo, facilitar la selección de productos y llevar al cliente hasta el canal donde el negocio ya atiende y confirma sus ventas.

**Desarrollado por Jose Carlos Nieves Iguaran.**

---

## Autor

**José Carlos Nieves Iguarán**  
Estudiante de Análisis y Desarrollo de Software - SENA
