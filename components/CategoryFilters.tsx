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
      <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">Quick Sort</p>
      <div className="flex flex-col gap-1">
        {shortcuts.map((s) => {
          const active = sort === s;
          return (
            <Link
              key={s}
              href={`/games/${gameSlug}${subcategory ? `?subcategory=${encodeURIComponent(subcategory)}&sort=${s}` : `?sort=${s}`}`}
              className={`rounded-lg px-3 py-2 text-sm transition-colors ${
                active ? "bg-slate-800 text-fuchsia-400" : "text-slate-400 hover:bg-slate-800 hover:text-white"
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