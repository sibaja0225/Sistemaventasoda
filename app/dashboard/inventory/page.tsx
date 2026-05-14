import { ensureRole } from "@/lib/auth";
import { getInventoryMovements, getProducts } from "@/lib/dashboard-data";
import { InventoryForm } from "@/components/forms/inventory-form";
import { formatDate } from "@/lib/utils";

export default async function InventoryPage() {
  await ensureRole(["admin", "manager"]);
  const [products, movements] = await Promise.all([getProducts(), getInventoryMovements()]);

  return (
    <section className="page-grid">
      <header className="page-header">
        <h1>Inventario</h1>
        <p>Controla entradas, salidas y ajustes de stock en tiempo real.</p>
      </header>

      <div className="two-columns">
        <article className="card">
          <h2>Registrar movimiento</h2>
          {products.length ? (
            <InventoryForm products={products.map((product) => ({ id: product.id, name: product.name, sku: product.sku }))} />
          ) : (
            <div className="topbar-card">Primero necesitas crear productos para poder mover inventario.</div>
          )}
        </article>

        <article className="card">
          <h2>Existencias</h2>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>SKU</th>
                  <th>Stock</th>
                  <th>Minimo</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>{product.sku}</td>
                    <td>{product.stock}</td>
                    <td>{product.min_stock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </div>

      <article className="card">
        <h2>Ultimos movimientos</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Producto</th>
                <th>Tipo</th>
                <th>Cantidad</th>
                <th>Notas</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {movements.length ? (
                movements.map((movement) => {
                  const product = movement.products as { name?: string; sku?: string } | null;

                  return (
                    <tr key={movement.id}>
                      <td>
                        {product?.name ?? "Producto"}
                        <div className="muted">{product?.sku ?? ""}</div>
                      </td>
                      <td>{movement.movement_type}</td>
                      <td>{movement.quantity}</td>
                      <td>{movement.notes ?? "-"}</td>
                      <td>{formatDate(movement.created_at)}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5}>No hay movimientos registrados.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
}
