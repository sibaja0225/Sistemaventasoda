"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { classNames } from "@/lib/utils";

const links = [
  { href: "/dashboard", label: "Resumen" },
  { href: "/dashboard/products", label: "Productos" },
  { href: "/dashboard/inventory", label: "Inventario" },
  { href: "/dashboard/sales", label: "Ventas" },
  { href: "/dashboard/reports", label: "Reportes" },
  { href: "/dashboard/users", label: "Usuarios" }
];

export function Sidebar({
  role,
  name
}: {
  role: "admin" | "manager" | "cashier";
  name: string;
}) {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <div className="brand">
        <strong>La Soda App</strong>
        <span>Ventas, inventario y control diario</span>
      </div>
      <nav>
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={classNames("nav-link", pathname === link.href && "active")}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <footer>
        <strong>{name}</strong>
        <div className="muted">Rol: {role}</div>
      </footer>
    </aside>
  );
}
