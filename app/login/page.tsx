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

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "16px"
          }}
        >

    <img
  src="/sabor-pos-logo.png"
  alt="Sabor POS"
  style={{
    width: "98px",
    height: "108px",
    objectFit: "contain",
    flexShrink: 0
  }}
/>

          <div>
            <h1 style={{ margin: 0 }}>Soda POS</h1>
            <p style={{ marginTop: "4px" }}>
              El sabor de administrar tu negocio fácilmente.
            </p>
          </div>

        </div>

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
