create or replace function public.current_user_is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select private.is_admin();
$$;

revoke all
on function public.current_user_is_admin()
from public;

grant execute
on function public.current_user_is_admin()
to authenticated;