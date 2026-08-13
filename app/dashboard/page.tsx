import { Suspense } from "react";
import type { Metadata } from "next";
import { DashboardContent } from "@/components/DashboardContent";
import { AdBanner } from "@/components/AdBanner";

export const metadata: Metadata = {
  title: "Dashboard — ModVault",
  description: "Manage your ModVault account, uploads and favorites.",
};

export default function DashboardPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="mb-3 text-3xl font-extrabold text-white">
        Creator <span className="glow-text">Dashboard</span>
      </h1>
      <p className="mb-8 text-sm text-slate-400">
        Manage your profile, uploaded mods and saved favorites.
      </p>
      <Suspense fallback={<p className="text-slate-400">Loading dashboard…</p>}>
        <DashboardContent />
      </Suspense>
      <div className="mt-10">
        <AdBanner variant="leaderboard" />
      </div>
    </main>
  );
}