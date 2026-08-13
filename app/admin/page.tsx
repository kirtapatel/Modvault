import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { isAdminSession, ensureOwnerAdmin } from "@/lib/admin";
import { AdminPanel } from "@/components/AdminPanel";

export const metadata: Metadata = {
  title: "Admin Panel — ModVault",
  description: "ModVault administration.",
};

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user) {
    redirect(`/login?callbackUrl=/admin`);
  }

  const allowed = await isAdminSession(session);
  if (!allowed) {
    return (
      <main className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="text-2xl font-extrabold text-white">Access denied</h1>
        <p className="mt-3 text-sm text-slate-400">
          Your account is not an admin. Only approved administrators can access this panel.
        </p>
        <Link href="/" className="mt-6 inline-block text-fuchsia-400 hover:text-fuchsia-300">
          ← Back to home
        </Link>
      </main>
    );
  }

  await ensureOwnerAdmin();

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white">
            Admin <span className="glow-text">Panel</span>
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Signed in as {session.user.email}
          </p>
        </div>
        <Link
          href="/"
          className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:border-fuchsia-500/60 hover:text-white"
        >
          ← View site
        </Link>
      </div>
      <AdminPanel />
    </main>
  );
}