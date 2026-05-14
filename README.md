Sabor POS

Sistema web diseñado para la gestión de ventas, inventario y facturación básica en pequeños negocios tipo soda.
Permite administrar productos, controlar existencias, registrar ventas y generar reportes de manera rápida y sencilla.

Tecnologías utilizadas
Next.js 
React
Supabase Auth
Base de datos PostgreSQL

Funcionalidades principales

Inicio de sesión y registro de usuarios
Dashboard con resumen general del sistema
Gestión y registro de productos
Control de inventario
Registro de ventas
Generación de facturas básicas
Reportes diarios y mensuales
Administración de usuarios por roles
Roles del sistema

Acceso completo al sistema:

Productos
Inventario
Ventas
Reportes
Gestión de usuarios

Manager tiene acceso a:

Productos
Inventario
Reportes

Cashier(cajero) tiene acceso a:

Ventas
Consulta de productos
Panel principal

Notas importantes
El primer usuario registrado obtiene automáticamente el rol admin.
Las ventas utilizan una función SQL transaccional para descontar inventario automáticamente.
El sistema utiliza autenticación con Supabase Auth.
Si ya existe una base de datos en Supabase, el script SQL puede adaptarse o fusionarse con las tablas actuales.

Estructura general del sistema

Autenticación de usuarios
Gestión de productos
Inventario
Ventas y facturación
Reportes
Gestión de usuarios

Objetivo del proyecto

Sabor POS busca facilitar la administración de pequeños negocios tipo soda mediante una plataforma moderna, rápida y fácil de usar, optimizando el control de ventas e inventario en un solo sistema.
