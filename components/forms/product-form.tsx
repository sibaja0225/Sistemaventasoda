"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type ProductFormProps = {
  product?: {
    id: string;
    name: string;
    category: string;
    sku: string;
    sale_price: number;
    cost_price: number;
    stock: number;
    min_stock: number;
    active: boolean;
  };
};

const emptyState = {
  name: "",
  category: "",
  sku: "",
  sale_price: "",
  cost_price: "",
  stock: "",
  min_stock: "",
  active: true
};

export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: product?.name ?? emptyState.name,
    category: product?.category ?? emptyState.category,
    sku: product?.sku ?? emptyState.sku,
    sale_price: String(product?.sale_price ?? emptyState.sale_price),
    cost_price: String(product?.cost_price ?? emptyState.cost_price),
    stock: String(product?.stock ?? emptyState.stock),
    min_stock: String(product?.min_stock ?? emptyState.min_stock),
    active: product?.active ?? emptyState.active
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const payload = {
      ...form,
      sale_price: Number(form.sale_price),
      cost_price: Number(form.cost_price),
      stock: Number(form.stock),
      min_stock: Number(form.min_stock)
    };

    const response = await fetch(product ? `/api/products/${product.id}` : "/api/products", {
      method: product ? "PATCH" : "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(result.error ?? "No fue posible guardar el producto");
      return;
    }

    setMessage(product ? "Producto actualizado correctamente" : "Producto creado correctamente");

    if (!product) {
      setForm(emptyState);
    }

    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="form-grid">
      {error ? <div className="alert alert-error">{error}</div> : null}
      {message ? <div className="alert alert-success">{message}</div> : null}
      <div className="field">
        <label>Nombre</label>
        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
      </div>
      <div className="inline-actions">
        <div className="field">
          <label>Categoria</label>
          <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required />
        </div>
        <div className="field">
          <label>SKU</label>
          <input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} required />
        </div>
      </div>
      <div className="inline-actions">
        <div className="field">
          <label>Precio de venta</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.sale_price}
            onChange={(e) => setForm({ ...form, sale_price: e.target.value })}
            required
          />
        </div>
        <div className="field">
          <label>Precio de costo</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.cost_price}
            onChange={(e) => setForm({ ...form, cost_price: e.target.value })}
            required
          />
        </div>
      </div>
      <div className="inline-actions">
        <div className="field">
          <label>Stock actual</label>
          <input
            type="number"
            min="0"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
            required
          />
        </div>
        <div className="field">
          <label>Stock minimo</label>
          <input
            type="number"
            min="0"
            value={form.min_stock}
            onChange={(e) => setForm({ ...form, min_stock: e.target.value })}
            required
          />
        </div>
      </div>
      <div className="field">
        <label>Estado</label>
        <select
          value={form.active ? "true" : "false"}
          onChange={(e) => setForm({ ...form, active: e.target.value === "true" })}
        >
          <option value="true">Activo</option>
          <option value="false">Inactivo</option>
        </select>
      </div>
      <button className="button" type="submit" disabled={loading}>
        {loading ? "Guardando..." : product ? "Actualizar producto" : "Crear producto"}
      </button>
    </form>
  );
}
