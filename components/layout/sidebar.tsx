"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { classNames } from "@/lib/utils";

const links = [
  { href: "/dashboard", label: "Resumen", icon: "⌂" },
  { href: "/dashboard/products", label: "Productos", icon: "▣" },
  { href: "/dashboard/inventory", label: "Inventario", icon: "▤" },
  { href: "/dashboard/sales", label: "Ventas", icon: "◈" },
  { href: "/dashboard/reports", label: "Reportes", icon: "◉" },
  { href: "/dashboard/users", label: "Usuarios", icon: "◇" }
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
        <img src="/sabor-pos-logo.png" alt="Sabor POS" className="brand-logo" />
        <div>
          <strong>Sabor POS</strong>
          <span>Ventas, inventario y control diario</span>
        </div>
      </div>
      <nav>
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={classNames("nav-link", pathname === link.href && "active")}
          >
            <span className="nav-icon" aria-hidden="true">{link.icon}</span>
            <span>{link.label}</span>
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
