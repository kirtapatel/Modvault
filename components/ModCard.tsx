import Link from "next/link";
import { Download, Star, ExternalLink, Clock } from "lucide-react";
import type { Mod } from "@/lib/types";
import { formatNumber, timeAgo } from "@/lib/utils";
import { GameThumb } from "@/components/GameThumb";

export function ModCard({ mod }: { mod: Mod }) {
  return (
    <Link
      href={`/mod/${mod.slug}`}
      className="glow-card flex flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70"
    >
      <div className="relative aspect-[16/10] w-full">
        <GameThumb gameSlug={mod.gameSlug} title={mod.title} thumbnailUrl={mod.thumbnailUrl} />
        {mod.virusChecked && (
          <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-emerald-500/90 px-2 py-1 text-[11px] font-semibold text-white shadow-lg">
            <ExternalLink className="h-3 w-3" />
            MediaFire hosted
          </span>
        )}
        <span className="absolute right-3 top-3 rounded-full bg-slate-950/80 px-2 py-1 text-[11px] font-medium text-slate-300 backdrop-blur">
          {mod.gameSlug.toUpperCase()}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-1 flex items-center gap-2 text-[11px] text-slate-400">
          <span className="rounded-md bg-violet-500/15 px-1.5 py-0.5 font-medium text-violet-300">
            {mod.subcategory}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {timeAgo(mod.createdAt)}
          </span>
        </div>
        <h3 className="line-clamp-2 font-bold text-white transition-colors group-hover:text-fuchsia-300">
          {mod.title}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-slate-400">{mod.summary}</p>

        <div className="mt-auto flex items-center justify-between border-t border-slate-800 pt-3 text-sm text-slate-400">
          <span className="flex items-center gap-1 text-emerald-400">
            <Download className="h-4 w-4" />
            {formatNumber(mod.downloads)}
          </span>
          <span className="flex items-center gap-1 text-amber-400">
            <Star className="h-4 w-4 fill-amber-400" />
            {mod.rating.toFixed(1)}
            <span className="text-slate-500">({mod.ratingCount})</span>
          </span>
        </div>
      </div>
    </Link>
  );
}