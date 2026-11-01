import { Suspense } from "react";
import Link from "next/link";
import { SearchX } from "lucide-react";
import { listMods } from "@/lib/data-access";
import { ModCard } from "@/components/ModCard";
import { ModCardSkeleton } from "@/components/ModCardSkeleton";
import { SearchBar } from "@/components/SearchBar";
import { AdBanner } from "@/components/AdBanner";

export const metadata = { title: "Search — ModVault" };

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; sort?: string; tag?: string }>;
}) {
  const sp = await searchParams;
  const q = sp.q ?? "";
  const tag = sp.tag;
  const sort = (sp.sort as "newest" | "popular" | "rated") ?? "newest";

  const mods = q || tag ? await listMods({ search: q || undefined, tag, sort, limit: 48 }) : [];

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="mb-6 text-2xl font-extrabold text-white">
        {q ? (
          <>Search results for <span className="glow-text">&quot;{q}&quot;</span></>
        ) : (
          "Search Mods"
        )}
      </h1>

      <SearchBar className="mb-8 max-w-2xl" />

      <div className="mb-8">
        <AdBanner variant="leaderboard" />
      </div>

      {mods.length === 0 ? (
        <div className="glass-card rounded-3xl p-16 text-center">
          <SearchX className="mx-auto h-12 w-12 text-white/25" />
          <h3 className="mt-4 text-lg font-bold text-white">No mods found</h3>
          <p className="mt-1 text-sm text-white/35">
            Try a different search term, or check the game category pages.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link href="/games/gtav" className="rounded-lg bg-white/[0.06] px-4 py-2 text-sm font-semibold text-white hover:bg-white/[0.08]">Browse GTA 5</Link>
            <Link href="/games/minecraft" className="rounded-lg bg-white/[0.06] px-4 py-2 text-sm font-semibold text-white hover:bg-white/[0.08]">Browse Minecraft</Link>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-6 flex items-center gap-2">
            {[{ v: "newest", l: "Newest" }, { v: "popular", l: "Most Popular" }, { v: "rated", l: "Highest Rated" }].map((o) => (
              <Link
                key={o.v}
                href={`/search?${new URLSearchParams({ ...(q ? { q } : {}), ...(tag ? { tag } : {}), sort: o.v }).toString()}`}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  sort === o.v ? "bg-brand/15 text-brand-bright ring-1 ring-brand/40" : "text-white/50 hover:bg-white/[0.06] hover:text-white"
                }`}
              >
                {o.l}
              </Link>
            ))}
          </div>
          <Suspense
            fallback={
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <ModCardSkeleton key={i} />
                ))}
              </div>
            }
          >
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {mods.map((mod) => (
                <ModCard key={mod.id} mod={mod} />
              ))}
            </div>
          </Suspense>
        </>
      )}

      <div className="mt-10">
        <AdBanner variant="leaderboard" />
      </div>
    </main>
  );
}