import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, SlidersHorizontal } from "lucide-react";
import { listMods, getGames } from "@/lib/data-access";
import { ModCard } from "@/components/ModCard";
import { ModCardSkeleton } from "@/components/ModCardSkeleton";
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
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-white/50">
        <Link href="/" className="hover:text-brand">Home</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-white">{game.name}</span>
      </nav>

      <div className="mb-8 glass-card overflow-hidden rounded-3xl p-8">
        <div className="flex items-center gap-4">
          <span className="text-5xl">{game.icon}</span>
          <div>
            <h1 className="text-3xl font-extrabold text-white sm:text-4xl">{game.name} Mods</h1>
            <p className="mt-1 text-white/50">{game.description}</p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <AdBanner variant="leaderboard" />
      </div>

      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <div className="mb-3 flex items-center gap-2 text-sm font-bold text-white">
            <SlidersHorizontal className="h-4 w-4 text-brand" />
            Categories
          </div>
          <nav className="flex flex-row gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible">
            <Link
              href={`/games/${gameSlug}?sort=${sort}`}
              className={`shrink-0 whitespace-nowrap rounded-lg px-3 py-2 text-sm transition-colors ${
                !subcategory
                  ? "bg-brand/15 font-semibold text-brand"
                  : "text-white/70 hover:bg-white/[0.06]"
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
                    ? "bg-brand/15 font-semibold text-brand"
                    : "text-white/70 hover:bg-white/[0.06]"
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
              <span className="ml-2 text-sm font-normal text-white/35">({mods.length})</span>
            </h2>
            <div className="flex items-center gap-2">
              {sortOptions.map((opt) => (
                <Link
                  key={opt.value}
                  href={`/games/${gameSlug}${subcategory ? `?subcategory=${encodeURIComponent(subcategory)}&sort=${opt.value}` : `?sort=${opt.value}`}`}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                    sort === opt.value
                      ? "bg-brand/15 text-brand-bright ring-1 ring-brand/40"
                      : "text-white/50 hover:bg-white/[0.06] hover:text-white"
                  }`}
                >
                  {opt.label}
                </Link>
              ))}
            </div>
          </div>

          {mods.length === 0 ? (
            <div className="glass-card rounded-2xl p-12 text-center text-white/50">
              No mods found in this category yet. Be the first to upload one!
            </div>
          ) : (
            <>
              <div className="mb-8">
                <AdBanner variant="box" />
              </div>
              <Suspense
                fallback={
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <ModCardSkeleton key={i} />
                    ))}
                  </div>
                }
              >
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {mods.map((mod) => (
                    <ModCard key={mod.id} mod={mod} />
                  ))}
                </div>
              </Suspense>
            </>
          )}
        </section>
      </div>
    </main>
  );
}