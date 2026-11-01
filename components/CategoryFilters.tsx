import Link from "next/link";

const shortcuts = ["newest", "popular", "rated"];

export function CategoryFilters({
  gameSlug,
  subcategory,
  sort,
}: {
  gameSlug: string;
  subcategory?: string;
  sort: string;
}) {
  return (
    <div>
      <p className="mb-2 text-xs font-bold uppercase tracking-wider text-white/35">Quick Sort</p>
      <div className="flex flex-col gap-1">
        {shortcuts.map((s) => {
          const active = sort === s;
          return (
            <Link
              key={s}
              href={`/games/${gameSlug}${subcategory ? `?subcategory=${encodeURIComponent(subcategory)}&sort=${s}` : `?sort=${s}`}`}
              className={`rounded-lg px-3 py-2 text-sm transition-colors ${
                active ? "bg-brand/15 text-brand" : "text-white/50 hover:bg-white/[0.05] hover:text-white"
              }`}
            >
              {s === "newest" ? "Newest first" : s === "popular" ? "Most popular" : "Highest rated"}
            </Link>
          );
        })}
      </div>
    </div>
  );
}