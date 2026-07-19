create table public.shop_settings (
  id text primary key,
  business_name text not null,
  whatsapp_number text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint shop_settings_singleton
    check (id = 'default'),

  constraint shop_settings_business_name_not_blank
    check (
      length(trim(business_name))
      between 1 and 120
    ),

  constraint shop_settings_whatsapp_number_format
    check (
      whatsapp_number is null
      or whatsapp_number ~ '^[1-9][0-9]{7,14}$'
    )
);

create or replace function
  public.touch_shop_settings_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger
  shop_settings_set_updated_at
before update
on public.shop_settings
for each row
execute function
  public.touch_shop_settings_updated_at();

insert into public.shop_settings (
  id,
  business_name,
  whatsapp_number
)
values (
  'default',
  'Boutique',
  null
)
on conflict (id) do nothing;

alter table public.shop_settings
enable row level security;

revoke all
on table public.shop_settings
from anon, authenticated;

grant select
on table public.shop_settings
to anon;

grant select, update
on table public.shop_settings
to authenticated;

create policy
  "shop settings are publicly readable"
on public.shop_settings
for select
to anon, authenticated
using (
  id = 'default'
);

create policy
  "admins can update shop settings"
on public.shop_settings
for update
to authenticated
using (
  (select private.is_admin())
)
with check (
  (select private.is_admin())
  and id = 'default'
);