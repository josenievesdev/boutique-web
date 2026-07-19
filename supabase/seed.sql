insert into public.categories (
  id,
  name,
  slug,
  description,
  active,
  position
)
values (
  '10000000-0000-0000-0000-000000000001',
  'Vestidos',
  'vestidos',
  'Vestidos disponibles y diseños confeccionados sobre pedido.',
  true,
  1
);

insert into public.products (
  id,
  name,
  slug,
  short_description,
  description,
  price_in_pesos,
  previous_price_in_pesos,
  category_id,
  status,
  featured,
  customizable,
  made_to_order,
  preparation_days
)
values
(
  '20000000-0000-0000-0000-000000000001',
  'Vestido Aurora',
  'vestido-aurora',
  'Vestido elegante confeccionado sobre pedido.',
  'Vestido disponible en diferentes tallas, colores y acabados.',
  180000,
  null,
  '10000000-0000-0000-0000-000000000001',
  'published',
  true,
  true,
  true,
  8
),
(
  '20000000-0000-0000-0000-000000000002',
  'Vestido Luna',
  'vestido-luna',
  'Producto de demostración todavía no publicado.',
  'Este producto permite comprobar que los borradores no sean públicos.',
  150000,
  null,
  '10000000-0000-0000-0000-000000000001',
  'draft',
  false,
  true,
  true,
  6
);

insert into public.product_images (
  id,
  product_id,
  storage_path,
  alt_text,
  position,
  is_cover
)
values (
  '30000000-0000-0000-0000-000000000001',
  '20000000-0000-0000-0000-000000000001',
  'products/vestido-aurora/cover.webp',
  'Vestido Aurora visto de frente',
  1,
  true
);