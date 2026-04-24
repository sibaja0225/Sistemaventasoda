import { ensureRole } from "@/lib/auth";
import { getProducts } from "@/lib/dashboard-data";
import { ProductsClient } from "@/components/products-client";

export default async function ProductsPage() {
  await ensureRole(["admin", "manager"]);
  const products = await getProducts();

  return (
    <section className="page-grid">
      <header className="page-header">
        <h1>Productos</h1>
        <p>Registra alimentos, bebidas y cualquier articulo que vendas en la soda.</p>
      </header>

      <ProductsClient products={products} />
    </section>
  );
}
