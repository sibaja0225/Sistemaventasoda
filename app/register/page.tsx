import Link from "next/link";
import { RegisterForm } from "@/components/forms/register-form";

export default async function RegisterPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <h1>Crea tu cuenta</h1>
        <p>El primer usuario registrado quedara con rol administrador.</p>
        {params.error ? <div className="alert alert-error">{params.error}</div> : null}
        <RegisterForm />
        <p className="muted">
          Ya tienes cuenta? <Link href="/login">Iniciar sesion</Link>
        </p>
      </section>
    </main>
  );
}
