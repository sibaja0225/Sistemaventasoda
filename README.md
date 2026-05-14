# Sistema de ventas para soda

Aplicacion web full-stack para controlar ventas, inventario, facturacion basica, reportes y usuarios en un pequeno negocio tipo soda.

## Tecnologias

- Next.js 15
- React 19
- Supabase Auth + Base de datos PostgreSQL
- Route Handlers de Next.js como backend

## Modulos incluidos

- Inicio de sesion y creacion de cuenta
- Dashboard con resumen general
- Registro de productos
- Control de inventario
- Registro de ventas con factura basica
- Reportes diarios y mensuales
- Gestion de usuarios por roles

## Configuracion

1. Crea un archivo `.env.local` basado en `.env.example`.
2. Coloca tu `NEXT_PUBLIC_SUPABASE_URL` y tu `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
3. Abre el editor SQL de Supabase y ejecuta el archivo [sql/supabase-schema.sql](/C:/Users/Mariángel/Documents/Codex/2026-04-23/necesito-tu-ayuda-creandome-una-aplicacion/sql/supabase-schema.sql).
4. Instala dependencias con `npm.cmd install`.
5. Ejecuta el proyecto con `npm.cmd run dev`.

## Roles

- `admin`: acceso total, productos, inventario, reportes y usuarios
- `manager`: productos, inventario y reportes
- `cashier`: ventas, consulta de productos y panel principal

## Notas importantes

- El primer usuario que se registre queda como `admin`.
- Las ventas usan una funcion SQL transaccional para descontar inventario automaticamente.
- Si ya tienes una base creada en Supabase, puedes adaptar o fusionar el script SQL con tus tablas actuales.
