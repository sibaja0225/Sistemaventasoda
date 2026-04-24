import { createClient } from "@/lib/supabase/server";
import { getMonthRange, getTodayRange } from "@/lib/utils";
import type { Database } from "@/types/database";

type Product = Database["public"]["Tables"]["products"]["Row"];
type Sale = Database["public"]["Tables"]["sales"]["Row"];
type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type InventoryMovement = Database["public"]["Tables"]["inventory_movements"]["Row"] & {
  products: { name?: string; sku?: string } | null;
};
type SaleItemReport = {
  product_id: string;
  quantity: number;
  subtotal: number;
  products: { name?: string } | null;
};

export async function getDashboardData() {
  const supabase = await createClient();
  const db = supabase as any;
  const today = getTodayRange();
  const month = getMonthRange();

  const [{ data: products }, { data: todaySales }, { data: monthSales }, { data: recentSales }] =
    await Promise.all([
      db.from("products").select("*").order("name"),
      db
        .from("sales")
        .select("id, invoice_number, customer_name, payment_method, total_amount, created_at")
        .gte("created_at", today.start)
        .lte("created_at", today.end)
        .order("created_at", { ascending: false }),
      db
        .from("sales")
        .select("id, invoice_number, customer_name, payment_method, total_amount, created_at")
        .gte("created_at", month.start)
        .lte("created_at", month.end)
        .order("created_at", { ascending: false }),
      db
        .from("sales")
        .select("id, invoice_number, customer_name, payment_method, total_amount, created_at")
        .order("created_at", { ascending: false })
        .limit(6)
    ]);

  const safeProducts = (products ?? []) as Product[];
  const safeTodaySales = (todaySales ?? []) as Sale[];
  const safeMonthSales = (monthSales ?? []) as Sale[];

  return {
    products: safeProducts,
    recentSales: (recentSales ?? []) as Sale[],
    metrics: {
      totalProducts: safeProducts.length,
      lowStockCount: safeProducts.filter((product) => product.stock <= product.min_stock).length,
      inventoryValue: safeProducts.reduce((sum, product) => sum + product.stock * product.cost_price, 0),
      todaySalesTotal: safeTodaySales.reduce((sum, sale) => sum + sale.total_amount, 0),
      todaySalesCount: safeTodaySales.length,
      monthSalesTotal: safeMonthSales.reduce((sum, sale) => sum + sale.total_amount, 0)
    }
  };
}

export async function getProducts() {
  const supabase = await createClient();
  const db = supabase as any;
  const { data } = await db.from("products").select("*").order("name");
  return (data ?? []) as Product[];
}

export async function getInventoryMovements() {
  const supabase = await createClient();
  const db = supabase as any;
  const { data } = await db
    .from("inventory_movements")
    .select("id, product_id, movement_type, quantity, notes, created_at, products(name, sku)")
    .order("created_at", { ascending: false })
    .limit(30);

  return (data ?? []) as InventoryMovement[];
}

export async function getSalesData() {
  const supabase = await createClient();
  const db = supabase as any;
  const [{ data: sales }, { data: products }] = await Promise.all([
    db
      .from("sales")
      .select("id, invoice_number, customer_name, payment_method, total_amount, created_at")
      .order("created_at", { ascending: false })
      .limit(20),
    db.from("products").select("id, name, sku, stock, sale_price, active").eq("active", true).order("name")
  ]);

  return {
    sales: (sales ?? []) as Sale[],
    products: (products ?? []) as Array<Pick<Product, "id" | "name" | "sku" | "stock" | "sale_price" | "active">>
  };
}

export async function getReportsData() {
  const supabase = await createClient();
  const db = supabase as any;
  const today = getTodayRange();
  const month = getMonthRange();

  const [{ data: todaySales }, { data: monthSales }, { data: products }, { data: saleItems }] =
    await Promise.all([
      db
        .from("sales")
        .select("id, invoice_number, total_amount, payment_method, created_at")
        .gte("created_at", today.start)
        .lte("created_at", today.end)
        .order("created_at", { ascending: false }),
      db
        .from("sales")
        .select("id, invoice_number, total_amount, payment_method, created_at")
        .gte("created_at", month.start)
        .lte("created_at", month.end)
        .order("created_at", { ascending: false }),
      db.from("products").select("id, name, stock, min_stock, sale_price, cost_price").order("name"),
      db
        .from("sale_items")
        .select("product_id, quantity, subtotal, products(name)")
        .order("subtotal", { ascending: false })
        .limit(50)
    ]);

  const productTotals = new Map<string, { name: string; quantity: number; subtotal: number }>();

  ((saleItems ?? []) as SaleItemReport[]).forEach((item) => {
    const key = item.product_id;
    const current = productTotals.get(key) ?? {
      name: (item.products as { name?: string } | null)?.name ?? "Producto",
      quantity: 0,
      subtotal: 0
    };

    current.quantity += item.quantity;
    current.subtotal += item.subtotal;

    productTotals.set(key, current);
  });

  return {
    todaySales: (todaySales ?? []) as Sale[],
    monthSales: (monthSales ?? []) as Sale[],
    products: (products ?? []) as Product[],
    topProducts: [...productTotals.values()].sort((a, b) => b.quantity - a.quantity).slice(0, 5)
  };
}

export async function getUsersData() {
  const supabase = await createClient();
  const db = supabase as any;
  const { data } = await db.from("profiles").select("*").order("created_at", { ascending: false });
  return (data ?? []) as Profile[];
}
