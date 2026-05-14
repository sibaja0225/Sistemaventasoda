import { getSalesData } from "@/lib/dashboard-data";
import { SaleForm } from "@/components/forms/sale-form";
import { InvoiceActions } from "@/components/forms/invoice-actions";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function SalesPage() {
  const { sales, products } = await getSalesData();

  return (
    <section className="page-grid">
      <header className="page-header">
        <h1>Ventas y facturacion</h1>
        <p>Registra ventas con descuento automatico del inventario y un consecutivo de factura.</p>
      </header>

      <div className="two-columns">
        <article className="card">
          <h2>Nueva venta</h2>
          {products.length ? (
            <SaleForm products={products} />
          ) : (
            <div className="topbar-card">No hay productos activos disponibles para vender.</div>
          )}
        </article>
        <article className="card">
          <h2>Historial de facturas</h2>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Factura</th>
                  <th>Cliente</th>
                  <th>Pago</th>
                  <th>Total</th>
                  <th>Fecha</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {sales.length ? (
                  sales.map((sale) => (
                    <tr key={sale.id}>
                      <td>{sale.invoice_number}</td>
                      <td>{sale.customer_name ?? "Consumidor final"}</td>
                      <td>{sale.payment_method}</td>
                      <td>{formatCurrency(sale.total_amount)}</td>
                      <td>{formatDate(sale.created_at)}</td>
                      <td><InvoiceActions sale={sale} /></td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6}>Aun no hay facturas generadas.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </article>
      </div>
    </section>
  );
}
