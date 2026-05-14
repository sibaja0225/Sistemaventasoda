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

        <img
          src="/sabor-pos-logo.svg"
          alt="Sabor POS"
          className="login-logo"
        />

        <h1>Bienvenido a Sabor POS</h1>

        <p>El sabor de administrar tu negocio fácilmente.</p>

        {params.error ? (
          <div className="alert alert-error">{params.error}</div>
        ) : null}

        {params.success ? (
          <div className="alert alert-success">{params.success}</div>
        ) : null}

        <LoginForm />

        <p className="muted">
          No tienes cuenta? <Link href="/register">Crear cuenta</Link>
        </p>

      </section>
    </main>
  );
}
