"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function UserRoleForm({
  id,
  role,
  isActive
}: {
  id: string;
  role: "admin" | "manager" | "cashier";
  isActive: boolean;
}) {
  const router = useRouter();
  const [nextRole, setNextRole] = useState(role);
  const [active, setActive] = useState(isActive);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function save() {
    setLoading(true);
    setError("");

    const response = await fetch(`/api/users/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        role: nextRole,
        is_active: active
      })
    });

    const result = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(result.error ?? "No se pudo actualizar el usuario");
      return;
    }

    router.refresh();
  }

  return (
    <div className="form-grid">
      {error ? <div className="alert alert-error">{error}</div> : null}
      <div className="inline-actions">
        <div className="field">
          <label>Rol</label>
          <select value={nextRole} onChange={(e) => setNextRole(e.target.value as typeof role)}>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="cashier">Cajero</option>
          </select>
        </div>
        <div className="field">
          <label>Estado</label>
          <select value={active ? "true" : "false"} onChange={(e) => setActive(e.target.value === "true")}>
            <option value="true">Activo</option>
            <option value="false">Inactivo</option>
          </select>
        </div>
      </div>
      <button type="button" className="button-secondary" onClick={save} disabled={loading}>
        {loading ? "Guardando..." : "Guardar cambios"}
      </button>
    </div>
  );
}
