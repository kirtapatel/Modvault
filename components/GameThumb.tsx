import type { Mod } from "@/lib/types";

const gradients: Record<string, string> = {
  gtav: "from-orange-500/80 to-rose-600/80",
  minecraft: "from-emerald-500/80 to-green-700/80",
  skyrim: "from-sky-500/80 to-indigo-700/80",
};

export function GameThumb({
  gameSlug,
  title,
  thumbnailUrl,
}: {
  gameSlug: string;
  title: string;
  thumbnailUrl: string | null;
}) {
  if (thumbnailUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={thumbnailUrl}
        alt={title}
        className="h-full w-full object-cover"
        loading="lazy"
      />
    );
  }
  const gradient = gradients[gameSlug] ?? "from-slate-600 to-slate-800";
  return (
    <div className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${gradient}`}>
      <div className="text-center">
        <div className="mx-auto mb-2 h-16 w-16 rounded-2xl border border-white/20 bg-white/10 backdrop-blur" />
        <span className="text-xs font-semibold uppercase tracking-widest text-white/80">
          {gameSlug}
        </span>
        <span className="mt-1 block text-[10px] text-white/60">{title}</span>
      </div>
    </div>
  );
}