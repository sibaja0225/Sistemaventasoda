"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type InvoiceActionsProps = {
  sale: {
    id: string;
    invoice_number: string;
    customer_name: string | null;
    payment_method: string;
  };
};

export function InvoiceActions({ sale }: InvoiceActionsProps) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [customerName, setCustomerName] = useState(sale.customer_name ?? "");
  const [paymentMethod, setPaymentMethod] = useState(sale.payment_method);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const response = await fetch(`/api/sales/${sale.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        customer_name: customerName,
        payment_method: paymentMethod
      })
    });

    const result = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(result.error ?? "No fue posible actualizar la factura");
      return;
    }

    setEditing(false);
    router.refresh();
  }

  async function handleDelete() {
    const confirmed = window.confirm(`¿Seguro que deseas eliminar la factura ${sale.invoice_number}?`);

    if (!confirmed) return;

    setLoading(true);
    setError("");

    const response = await fetch(`/api/sales/${sale.id}`, {
      method: "DELETE"
    });

    const result = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(result.error ?? "No fue posible eliminar la factura");
      return;
    }

    router.refresh();
  }

  if (editing) {
    return (
      <div className="invoice-actions-panel">
        {error ? <div className="mini-error">{error}</div> : null}
        <form onSubmit={handleUpdate} className="invoice-edit-form">
          <input
            value={customerName}
            onChange={(event) => setCustomerName(event.target.value)}
            placeholder="Cliente"
          />
          <select value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)}>
            <option value="efectivo">Efectivo</option>
            <option value="tarjeta">Tarjeta</option>
            <option value="sinpe">SINPE</option>
            <option value="mixto">Mixto</option>
          </select>
          <div className="table-actions">
            <button className="button" type="submit" disabled={loading}>
              Guardar
            </button>
            <button className="button-secondary" type="button" onClick={() => setEditing(false)} disabled={loading}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="table-actions">
      {error ? <div className="mini-error">{error}</div> : null}
      <button className="button-secondary" type="button" onClick={() => setEditing(true)} disabled={loading}>
        Editar
      </button>
      <button className="button-danger" type="button" onClick={handleDelete} disabled={loading}>
        Eliminar
      </button>
    </div>
  );
}
