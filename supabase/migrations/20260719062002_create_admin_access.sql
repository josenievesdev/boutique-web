create schema if not exists private;

revoke all on schema private from public;
grant usage on schema private to authenticated;

create table public.admin_users (
  user_id uuid primary key references auth.users(id)
    on update cascade
    on delete cascade,
  email text not null,
  created_at timestamptz not null default now(),

  constraint admin_users_email_not_blank
    check (char_length(btrim(email)) > 0)
);

alter table public.admin_users enable row level security;

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select
    (select auth.uid()) is not null
    and exists (
      select 1
      from public.admin_users
      where admin_users.user_id = (select auth.uid())
    );
$$;

revoke all
on function private.is_admin()
from public;

grant execute
on function private.is_admin()
to authenticated;

create policy "Admins can manage categories"
on public.categories
for all
to authenticated
using (
  (select private.is_admin())
)
with check (
  (select private.is_admin())
);

create policy "Admins can manage products"
on public.products
for all
to authenticated
using (
  (select private.is_admin())
)
with check (
  (select private.is_admin())
);

create policy "Admins can manage product images"
on public.product_images
for all
to authenticated
using (
  (select private.is_admin())
)
with check (
  (select private.is_admin())
);

grant select, insert, update, delete
on public.categories,
   public.products,
   public.product_images
to authenticated;

grant all
on public.admin_users
to service_role;