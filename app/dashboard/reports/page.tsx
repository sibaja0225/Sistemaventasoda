import { ensureRole } from "@/lib/auth";
import { getReportsData } from "@/lib/dashboard-data";
import { formatCurrency, formatDate } from "@/lib/utils";
import { InvoiceActions } from "@/components/forms/invoice-actions";

export default async function ReportsPage() {
  await ensureRole(["admin", "manager"]);
  const { todaySales, monthSales, products, topProducts } = await getReportsData();
  const todayTotal = todaySales.reduce((sum, sale) => sum + sale.total_amount, 0);
  const monthTotal = monthSales.reduce((sum, sale) => sum + sale.total_amount, 0);
  const averageTicket = todaySales.length ? todayTotal / todaySales.length : 0;
  const lowStock = products.filter((product) => product.stock <= product.min_stock);
  const maxTopQuantity = topProducts[0]?.quantity ?? 1;

  return (
    <section className="page-grid">
      <header className="page-header">
        <h1>Reportes</h1>
        <p>Consulta el rendimiento diario y mensual del negocio para tomar mejores decisiones.</p>
      </header>

      <div className="cards-grid">
        <article className="card">
          <div className="metric-label">Total vendido hoy</div>
          <p className="metric-value">{formatCurrency(todayTotal)}</p>
        </article>
        <article className="card">
          <div className="metric-label">Ventas del mes</div>
          <p className="metric-value">{formatCurrency(monthTotal)}</p>
        </article>
        <article className="card">
          <div className="metric-label">Ticket promedio hoy</div>
          <p className="metric-value">{formatCurrency(averageTicket)}</p>
        </article>
        <article className="card">
          <div className="metric-label">Productos con stock bajo</div>
          <p className="metric-value">{lowStock.length}</p>
        </article>
      </div>



      <article className="card">
        <h2>Facturas del mes</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Factura</th>
                <th>Pago</th>
                <th>Total</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {monthSales.length ? (
                monthSales.map((sale) => (
                  <tr key={sale.id}>
                    <td>{sale.invoice_number}</td>
                    <td>{sale.payment_method}</td>
                    <td>{formatCurrency(sale.total_amount)}</td>
                    <td>{formatDate(sale.created_at)}</td>
                    <td><InvoiceActions sale={sale} /></td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5}>No hay facturas registradas este mes.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </article>

      <div className="two-columns">
        <article className="card">
          <h2>Productos mas vendidos</h2>
          <div className="report-bars">
            {topProducts.length ? (
              topProducts.map((product) => (
                <div key={product.name} className="report-bar">
                  <div>
                    <strong>{product.name}</strong>
                    <div className="muted">
                      {product.quantity} unidades | {formatCurrency(product.subtotal)}
                    </div>
                  </div>
                  <div
                    className="report-bar-fill"
                    style={{ width: `${Math.max(15, (product.quantity / maxTopQuantity) * 100)}%` }}
                  />
                </div>
              ))
            ) : (
              <div className="topbar-card">Todavia no hay suficientes datos de ventas.</div>
            )}
          </div>
        </article>

        <article className="card">
          <h2>Alertas de inventario</h2>
          <div className="form-grid">
            {lowStock.length ? (
              lowStock.map((product) => (
                <div key={product.id} className="topbar-card">
                  <strong>{product.name}</strong>
                  <div className="muted">
                    Stock {product.stock} | Minimo {product.min_stock}
                  </div>
                  <div>{formatCurrency(product.sale_price)} precio de venta</div>
                </div>
              ))
            ) : (
              <div className="topbar-card">No hay productos en alerta de inventario.</div>
            )}
          </div>
        </article>
      </div>
    </section>
  );
}
