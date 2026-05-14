import { ensureRole } from "@/lib/auth";
import { getProducts } from "@/lib/dashboard-data";
import { ProductForm } from "@/components/forms/product-form";
import { ProductActions } from "@/components/forms/product-actions";
import { formatCurrency } from "@/lib/utils";

export default async function ProductsPage() {
  await ensureRole(["admin", "manager"]);
  const products = await getProducts();

  return (
    <section className="page-grid">
      <header className="page-header">
        <h1>Productos</h1>
        <p>Registra alimentos, bebidas y cualquier articulo que vendas en la soda.</p>
      </header>

      <div className="two-columns">
        <article className="card">
          <h2>Nuevo producto</h2>
          <ProductForm />
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
                    <td><ProductActions product={product} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </div>
    </section>
  );
}
