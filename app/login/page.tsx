import Link from "next/link";
import { LoginForm } from "@/components/forms/login-form";

export default async function LoginPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <h1>Bienvenida a tu sistema de soda</h1>
        <p>Inicia sesion para administrar ventas, inventario, reportes y usuarios.</p>
        {params.error ? <div className="alert alert-error">{params.error}</div> : null}
        {params.success ? <div className="alert alert-success">{params.success}</div> : null}
        <LoginForm />
        <p className="muted">
          No tienes cuenta? <Link href="/register">Crear cuenta</Link>
        </p>
      </section>
    </main>
  );
}
