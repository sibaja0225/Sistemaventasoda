import { ensureRole } from "@/lib/auth";
import { getUsersData } from "@/lib/dashboard-data";
import { UserRoleForm } from "@/components/forms/user-role-form";
import { formatDate } from "@/lib/utils";

export default async function UsersPage() {
  await ensureRole(["admin"]);
  const users = await getUsersData();

  return (
    <section className="page-grid">
      <header className="page-header">
        <h1>Gestion de usuarios</h1>
        <p>Administra roles y activa o desactiva el acceso al sistema.</p>
      </header>

      <div className="three-columns">
        {users.map((user) => (
          <article className="card" key={user.id}>
            <h2>{user.full_name}</h2>
            <p className="muted">{user.email}</p>
            <p className="muted">Creado: {formatDate(user.created_at)}</p>
            <UserRoleForm id={user.id} role={user.role} isActive={user.is_active} />
          </article>
        ))}
      </div>
    </section>
  );
}
