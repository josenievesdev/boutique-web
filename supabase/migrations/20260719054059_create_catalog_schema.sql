create type public.product_status as enum (
  'draft',
  'published',
  'hidden',
  'out_of_stock',
  'archived'
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  active boolean not null default true,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint categories_name_not_blank
    check (char_length(btrim(name)) > 0),

  constraint categories_slug_not_blank
    check (char_length(btrim(slug)) > 0),

  constraint categories_slug_format
    check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),

  constraint categories_position_not_negative
    check (position >= 0)
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  short_description text not null default '',
  description text not null default '',
  price_in_pesos integer not null,
  previous_price_in_pesos integer,
  category_id uuid references public.categories(id)
    on update cascade
    on delete restrict,
  status public.product_status not null default 'draft',
  featured boolean not null default false,
  customizable boolean not null default false,
  made_to_order boolean not null default false,
  preparation_days integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint products_name_not_blank
    check (char_length(btrim(name)) > 0),

  constraint products_slug_not_blank
    check (char_length(btrim(slug)) > 0),

  constraint products_slug_format
    check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),

  constraint products_price_not_negative
    check (price_in_pesos >= 0),

  constraint products_previous_price_valid
    check (
      previous_price_in_pesos is null
      or previous_price_in_pesos > price_in_pesos
    ),

  constraint products_preparation_days_valid
    check (
      preparation_days is null
      or preparation_days > 0
    ),

  constraint published_products_require_category
    check (
      status <> 'published'
      or category_id is not null
    )
);

create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id)
    on update cascade
    on delete cascade,
  storage_path text not null unique,
  alt_text text not null default '',
  position integer not null,
  is_cover boolean not null default false,
  created_at timestamptz not null default now(),

  constraint product_images_storage_path_not_blank
    check (char_length(btrim(storage_path)) > 0),

  constraint product_images_position_positive
    check (position > 0),

  constraint product_images_position_unique
    unique (product_id, position)
);

create index products_category_id_idx
  on public.products(category_id);

create index products_status_idx
  on public.products(status);

create index products_featured_published_idx
  on public.products(featured)
  where status = 'published';

create index product_images_product_position_idx
  on public.product_images(product_id, position);

create unique index product_images_single_cover_idx
  on public.product_images(product_id)
  where is_cover = true;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger categories_set_updated_at
before update on public.categories
for each row
execute function public.set_updated_at();

create trigger products_set_updated_at
before update on public.products
for each row
execute function public.set_updated_at();

alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;

create policy "Public can read active categories"
on public.categories
for select
to anon, authenticated
using (active = true);

create policy "Public can read published products"
on public.products
for select
to anon, authenticated
using (
  status = 'published'
  and exists (
    select 1
    from public.categories
    where categories.id = products.category_id
      and categories.active = true
  )
);

create policy "Public can read images from published products"
on public.product_images
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.products
    inner join public.categories
      on categories.id = products.category_id
    where products.id = product_images.product_id
      and products.status = 'published'
      and categories.active = true
  )
);

grant usage on schema public to anon, authenticated;

grant select
on public.categories,
   public.products,
   public.product_images
to anon, authenticated;