import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, SlidersHorizontal } from "lucide-react";
import { listMods, getGames } from "@/lib/data-access";
import { ModCard } from "@/components/ModCard";
import { AdBanner } from "@/components/AdBanner";
import { CategoryFilters } from "@/components/CategoryFilters";

export async function generateStaticParams() {
  return getGames().map((g) => ({ gameSlug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ gameSlug: string }> }) {
  const { gameSlug } = await params;
  const game = getGameSync(gameSlug);
  if (!game) return { title: "Game not found" };
  return { title: `${game.name} Mods — ModVault`, description: game.description };
}

function getGameSync(slug: string) {
  return getGames().find((g) => g.slug === slug) ?? null;
}

export default async function GamePage({
  params,
  searchParams,
}: {
  params: Promise<{ gameSlug: string }>;
  searchParams: Promise<{ subcategory?: string; sort?: string }>;
}) {
  const { gameSlug } = await params;
  const sp = await searchParams;
  const game = getGameSync(gameSlug);
  if (!game) notFound();

  const subcategory = sp.subcategory;
  const sort = (sp.sort as "newest" | "popular" | "rated") ?? "newest";

  const mods = await listMods({ gameSlug, subcategory, sort, limit: 60 });

  const sortOptions = [
    { value: "newest", label: "Newest" },
    { value: "popular", label: "Most Popular" },
    { value: "rated", label: "Highest Rated" },
  ];

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-slate-400">
        <Link href="/" className="hover:text-fuchsia-400">Home</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-white">{game.name}</span>
      </nav>

      <div className="mb-8 overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/60 p-8">
        <div className="flex items-center gap-4">
          <span className="text-5xl">{game.icon}</span>
          <div>
            <h1 className="text-3xl font-extrabold text-white sm:text-4xl">{game.name} Mods</h1>
            <p className="mt-1 text-slate-400">{game.description}</p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <AdBanner variant="leaderboard" />
      </div>

      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <div className="mb-3 flex items-center gap-2 text-sm font-bold text-white">
            <SlidersHorizontal className="h-4 w-4 text-fuchsia-400" />
            Categories
          </div>
          <nav className="flex flex-row gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible">
            <Link
              href={`/games/${gameSlug}?sort=${sort}`}
              className={`shrink-0 whitespace-nowrap rounded-lg px-3 py-2 text-sm transition-colors ${
                !subcategory
                  ? "bg-gradient-to-r from-violet-500 to-fuchsia-500 font-semibold text-white"
                  : "text-slate-300 hover:bg-slate-800"
              }`}
            >
              All
            </Link>
            {game.subcategories.map((cat) => (
              <Link
                key={cat}
                href={`/games/${gameSlug}?subcategory=${encodeURIComponent(cat)}&sort=${sort}`}
                className={`shrink-0 whitespace-nowrap rounded-lg px-3 py-2 text-sm transition-colors ${
                  subcategory === cat
                    ? "bg-gradient-to-r from-violet-500 to-fuchsia-500 font-semibold text-white"
                    : "text-slate-300 hover:bg-slate-800"
                }`}
              >
                {cat}
              </Link>
            ))}
          </nav>
          <div className="mt-6 hidden lg:block">
            <CategoryFilters gameSlug={gameSlug} subcategory={subcategory} sort={sort} />
          </div>
          <div className="mt-8 hidden lg:block">
            <AdBanner variant="skyscraper" />
          </div>
        </aside>

        <section>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-white">
              {subcategory ? `${subcategory} Mods` : "All Mods"}
              <span className="ml-2 text-sm font-normal text-slate-500">({mods.length})</span>
            </h2>
            <div className="flex items-center gap-2">
              {sortOptions.map((opt) => (
                <Link
                  key={opt.value}
                  href={`/games/${gameSlug}${subcategory ? `?subcategory=${encodeURIComponent(subcategory)}&sort=${opt.value}` : `?sort=${opt.value}`}`}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                    sort === opt.value
                      ? "bg-slate-800 text-fuchsia-400 ring-1 ring-fuchsia-500/40"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  {opt.label}
                </Link>
              ))}
            </div>
          </div>

          {mods.length === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-12 text-center text-slate-400">
              No mods found in this category yet. Be the first to upload one!
            </div>
          ) : (
            <Suspense fallback={<p className="text-slate-400">Loading mods…</p>}>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {mods.map((mod) => (
                  <ModCard key={mod.id} mod={mod} />
                ))}
              </div>
            </Suspense>
          )}
        </section>
      </div>
    </main>
  );
}