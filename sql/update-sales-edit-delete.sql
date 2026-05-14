-- Ejecuta este archivo en Supabase > SQL Editor
-- Permite editar y eliminar facturas desde la pagina de Ventas y Reportes.

create policy if not exists "sales_update_manager"
on public.sales
for update
to authenticated
using (public.current_user_role() in ('admin', 'manager'))
with check (public.current_user_role() in ('admin', 'manager'));

create policy if not exists "sales_delete_manager"
on public.sales
for delete
to authenticated
using (public.current_user_role() in ('admin', 'manager'));

grant update, delete on public.sales to authenticated;
