create extension if not exists pgcrypto;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'user_role') then
    create type public.user_role as enum ('admin', 'manager', 'cashier');
  end if;

  if not exists (select 1 from pg_type where typname = 'movement_type') then
    create type public.movement_type as enum ('in', 'out', 'adjustment', 'sale');
  end if;
end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text not null,
  role public.user_role not null default 'cashier',
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  sku text not null unique,
  sale_price numeric(12,2) not null check (sale_price >= 0),
  cost_price numeric(12,2) not null default 0 check (cost_price >= 0),
  stock integer not null default 0 check (stock >= 0),
  min_stock integer not null default 0 check (min_stock >= 0),
  active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.inventory_movements (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  movement_type public.movement_type not null,
  quantity integer not null check (quantity > 0),
  notes text,
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.sales (
  id uuid primary key default gen_random_uuid(),
  invoice_number text not null unique,
  customer_name text,
  payment_method text not null,
  total_amount numeric(12,2) not null check (total_amount >= 0),
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.sale_items (
  id uuid primary key default gen_random_uuid(),
  sale_id uuid not null references public.sales(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete restrict,
  quantity integer not null check (quantity > 0),
  unit_price numeric(12,2) not null check (unit_price >= 0),
  subtotal numeric(12,2) not null check (subtotal >= 0)
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists trg_products_updated_at on public.products;
create trigger trg_products_updated_at
before update on public.products
for each row
execute function public.set_updated_at();

create or replace function public.current_user_role()
returns public.user_role
language sql
security definer
set search_path = public
stable
as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  assigned_role public.user_role;
begin
  if (select count(*) from public.profiles) = 0 then
    assigned_role := 'admin';
  else
    assigned_role := 'cashier';
  end if;

  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    assigned_role
  )
  on conflict (id) do update
  set
    email = excluded.email,
    full_name = excluded.full_name;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

create or replace function public.generate_invoice_number()
returns text
language plpgsql
as $$
begin
  return 'FAC-' || to_char(timezone('utc', now()), 'YYYYMMDD-HH24MISSMS');
end;
$$;

create or replace function public.register_sale(
  p_customer_name text,
  p_payment_method text,
  p_items jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user uuid := auth.uid();
  sale_id uuid := gen_random_uuid();
  generated_invoice text;
  item_record jsonb;
  db_product public.products%rowtype;
  line_quantity integer;
  line_subtotal numeric(12,2);
  total_sale numeric(12,2) := 0;
begin
  if current_user is null then
    raise exception 'Usuario no autenticado';
  end if;

  if p_items is null or jsonb_array_length(p_items) = 0 then
    raise exception 'La venta debe incluir al menos un producto';
  end if;

  generated_invoice := public.generate_invoice_number();

  for item_record in select * from jsonb_array_elements(p_items)
  loop
    select *
    into db_product
    from public.products
    where id = (item_record ->> 'product_id')::uuid
    for update;

    if db_product.id is null then
      raise exception 'Producto no encontrado';
    end if;

    line_quantity := greatest((item_record ->> 'quantity')::integer, 0);

    if line_quantity <= 0 then
      raise exception 'Cantidad invalida';
    end if;

    if db_product.stock < line_quantity then
      raise exception 'Stock insuficiente para %', db_product.name;
    end if;

    line_subtotal := db_product.sale_price * line_quantity;
    total_sale := total_sale + line_subtotal;
  end loop;

  insert into public.sales (id, invoice_number, customer_name, payment_method, total_amount, created_by)
  values (sale_id, generated_invoice, nullif(trim(p_customer_name), ''), p_payment_method, total_sale, current_user);

  for item_record in select * from jsonb_array_elements(p_items)
  loop
    select *
    into db_product
    from public.products
    where id = (item_record ->> 'product_id')::uuid
    for update;

    line_quantity := (item_record ->> 'quantity')::integer;
    line_subtotal := db_product.sale_price * line_quantity;

    insert into public.sale_items (sale_id, product_id, quantity, unit_price, subtotal)
    values (sale_id, db_product.id, line_quantity, db_product.sale_price, line_subtotal);

    update public.products
    set stock = stock - line_quantity
    where id = db_product.id;

    insert into public.inventory_movements (product_id, movement_type, quantity, notes, created_by)
    values (db_product.id, 'sale', line_quantity, 'Salida por venta ' || generated_invoice, current_user);
  end loop;

  return sale_id;
end;
$$;

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.inventory_movements enable row level security;
alter table public.sales enable row level security;
alter table public.sale_items enable row level security;

drop policy if exists "profiles_select" on public.profiles;
create policy "profiles_select"
on public.profiles
for select
to authenticated
using (auth.uid() = id or public.current_user_role() in ('admin', 'manager'));

drop policy if exists "profiles_update_admin" on public.profiles;
create policy "profiles_update_admin"
on public.profiles
for update
to authenticated
using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');

drop policy if exists "products_select_all" on public.products;
create policy "products_select_all"
on public.products
for select
to authenticated
using (true);

drop policy if exists "products_manage_catalog" on public.products;
create policy "products_manage_catalog"
on public.products
for all
to authenticated
using (public.current_user_role() in ('admin', 'manager'))
with check (public.current_user_role() in ('admin', 'manager'));

drop policy if exists "inventory_select_all" on public.inventory_movements;
create policy "inventory_select_all"
on public.inventory_movements
for select
to authenticated
using (true);

drop policy if exists "inventory_insert_manager" on public.inventory_movements;
create policy "inventory_insert_manager"
on public.inventory_movements
for insert
to authenticated
with check (public.current_user_role() in ('admin', 'manager'));

drop policy if exists "sales_select_all" on public.sales;
create policy "sales_select_all"
on public.sales
for select
to authenticated
using (true);

drop policy if exists "sales_insert_all" on public.sales;
create policy "sales_insert_all"
on public.sales
for insert
to authenticated
with check (auth.uid() = created_by);

drop policy if exists "sale_items_select_all" on public.sale_items;
create policy "sale_items_select_all"
on public.sale_items
for select
to authenticated
using (true);

drop policy if exists "sale_items_insert_all" on public.sale_items;
create policy "sale_items_insert_all"
on public.sale_items
for insert
to authenticated
with check (true);

grant usage on schema public to anon, authenticated;
grant select, insert, update on public.profiles to authenticated;
grant select, insert, update, delete on public.products to authenticated;
grant select, insert on public.inventory_movements to authenticated;
grant select, insert on public.sales to authenticated;
grant select, insert on public.sale_items to authenticated;
grant execute on function public.register_sale(text, text, jsonb) to authenticated;
