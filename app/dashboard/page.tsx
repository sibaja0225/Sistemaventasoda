import { getDashboardData } from "@/lib/dashboard-data";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function DashboardPage() {
  const { metrics, recentSales, products } = await getDashboardData();
  const lowStockProducts = products.filter((product) => product.stock <= product.min_stock).slice(0, 6);

  return (
    <section className="page-grid">
      <header className="page-header">
        <h1>Resumen general</h1>
        <p>Ten a mano el estado actual de tu soda: ventas, inventario y alertas importantes.</p>
      </header>

      <div className="cards-grid">
        <article className="card">
          <div className="metric-label">Ventas de hoy</div>
          <p className="metric-value">{formatCurrency(metrics.todaySalesTotal)}</p>
        </article>
        <article className="card">
          <div className="metric-label">Facturas de hoy</div>
          <p className="metric-value">{metrics.todaySalesCount}</p>
        </article>
        <article className="card">
          <div className="metric-label">Productos registrados</div>
          <p className="metric-value">{metrics.totalProducts}</p>
        </article>
        <article className="card">
          <div className="metric-label">Valor del inventario</div>
          <p className="metric-value">{formatCurrency(metrics.inventoryValue)}</p>
        </article>
      </div>

      <div className="two-columns">
        <article className="card">
          <h2>Ventas recientes</h2>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Factura</th>
                  <th>Cliente</th>
                  <th>Pago</th>
                  <th>Total</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {recentSales.length ? (
                  recentSales.map((sale) => (
                    <tr key={sale.id}>
                      <td>{sale.invoice_number}</td>
                      <td>{sale.customer_name ?? "Consumidor final"}</td>
                      <td>{sale.payment_method}</td>
                      <td>{formatCurrency(sale.total_amount)}</td>
                      <td>{formatDate(sale.created_at)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5}>Aun no hay ventas registradas.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </article>

        <article className="card">
          <h2>Alertas de stock</h2>
          <p className="muted">Productos que ya estan en el limite minimo o por debajo.</p>
          <div className="form-grid">
            {lowStockProducts.length ? (
              lowStockProducts.map((product) => (
                <div key={product.id} className="topbar-card">
                  <strong>{product.name}</strong>
                  <div className="muted">{product.category}</div>
                  <span className="status-badge status-warning">
                    Stock {product.stock} / Minimo {product.min_stock}
                  </span>
                </div>
              ))
            ) : (
              <div className="topbar-card">Todo el inventario esta por encima del minimo.</div>
            )}
          </div>
        </article>
      </div>
    </section>
  );
}
