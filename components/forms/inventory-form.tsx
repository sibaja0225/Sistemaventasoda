"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function InventoryForm({
  products
}: {
  products: Array<{ id: string; name: string; sku: string }>;
}) {
  const router = useRouter();
  const [productId, setProductId] = useState(products[0]?.id ?? "");
  const [movementType, setMovementType] = useState("in");
  const [quantity, setQuantity] = useState("1");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const response = await fetch("/api/inventory", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        product_id: productId,
        movement_type: movementType,
        quantity: Number(quantity),
        notes
      })
    });

    const result = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(result.error ?? "No se pudo registrar el movimiento");
      return;
    }

    setMessage("Movimiento guardado correctamente");
    setQuantity("1");
    setNotes("");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="form-grid">
      {error ? <div className="alert alert-error">{error}</div> : null}
      {message ? <div className="alert alert-success">{message}</div> : null}
      <div className="field">
        <label>Producto</label>
        <select value={productId} onChange={(e) => setProductId(e.target.value)} required>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name} ({product.sku})
            </option>
          ))}
        </select>
      </div>
      <div className="inline-actions">
        <div className="field">
          <label>Tipo de movimiento</label>
          <select value={movementType} onChange={(e) => setMovementType(e.target.value)} required>
            <option value="in">Entrada</option>
            <option value="out">Salida</option>
            <option value="adjustment">Ajuste</option>
          </select>
        </div>
        <div className="field">
          <label>Cantidad</label>
          <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
        </div>
      </div>
      <div className="field">
        <label>Notas</label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} />
      </div>
      <button className="button" type="submit" disabled={loading}>
        {loading ? "Guardando..." : "Registrar movimiento"}
      </button>
    </form>
  );
}
