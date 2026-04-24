"use client";

import { useState } from "react";
import { ProductForm } from "@/components/forms/product-form";
import { formatCurrency } from "@/lib/utils";

type Product = {
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

type ProductsClientProps = {
  products: Product[];
};

export function ProductsClient({ products }: ProductsClientProps) {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  return (
    <div className="two-columns">
      <article className="card">
        <h2>{editingProduct ? "Editar producto" : "Nuevo producto"}</h2>
        {editingProduct && (
          <button
            type="button"
            className="button button-secondary"
            style={{ marginBottom: "1rem" }}
            onClick={() => setEditingProduct(null)}
          >
            Cancelar edicion
          </button>
        )}
        <ProductForm
          key={editingProduct?.id ?? "new"}
          product={editingProduct ?? undefined}
          onSuccess={() => setEditingProduct(null)}
        />
      </article>
      <article className="card">
        <h2>Catalogo actual</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Producto</th>
                <th>SKU</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <strong>{product.name}</strong>
                    <div className="muted">{product.category}</div>
                  </td>
                  <td>{product.sku}</td>
                  <td>{formatCurrency(product.sale_price)}</td>
                  <td>{product.stock}</td>
                  <td>
                    <span className={`status-badge ${product.active ? "status-ok" : "status-neutral"}`}>
                      {product.active ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="button button-small"
                      onClick={() => setEditingProduct(product)}
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </div>
  );
}
