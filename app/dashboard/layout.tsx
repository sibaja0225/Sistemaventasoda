import type { ReactNode } from "react";
import { getCurrentProfile } from "@/lib/auth";
import { Sidebar } from "@/components/layout/sidebar";
import { SignOutButton } from "@/components/layout/sign-out-button";

export default async function DashboardLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  const { profile } = await getCurrentProfile();

  return (
    <div className="dashboard-shell">
      <Sidebar role={profile.role} name={profile.full_name} />
      <main className="main-content">
        <div className="topbar">
          <div className="topbar-card">
            <strong>{profile.full_name}</strong>
            <div className="muted">{profile.email}</div>
          </div>
          <SignOutButton />
        </div>
        {children}
      </main>
    </div>
  );
}
