import Link from "next/link";
import { Download, Star, ExternalLink, Clock } from "lucide-react";
import type { Mod } from "@/lib/types";
import { formatNumber, timeAgo } from "@/lib/utils";
import { GameThumb } from "@/components/GameThumb";
import { TiltCard } from "@/components/ui/TiltCard";

export function ModCard({ mod }: { mod: Mod }) {
  return (
    <TiltCard className="h-full rounded-2xl" maxTilt={6} magneticStrength={4}>
      <Link
        href={`/mod/${mod.slug}`}
        className="glass-card glow-card group flex h-full flex-col overflow-hidden rounded-2xl transition-colors duration-300 hover:border-brand/40"
      >
        <div className="relative aspect-[16/10] w-full overflow-hidden">
          <GameThumb
            gameSlug={mod.gameSlug}
            title={mod.title}
            thumbnailUrl={mod.thumbnailUrl}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          {mod.virusChecked && (
            <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full border border-brand/30 bg-black/70 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-brand-bright backdrop-blur">
              <ExternalLink className="h-3 w-3" />
              MediaFire hosted
            </span>
          )}
          <span className="absolute right-3 top-3 rounded-full border border-white/10 bg-black/70 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-white/55 backdrop-blur">
            {mod.gameSlug}
          </span>
        </div>

        <div className="flex flex-1 flex-col p-4">
          <div className="mb-2 flex items-center gap-2 text-[11px] text-white/40">
            <span className="rounded-md border border-brand/20 bg-brand/10 px-1.5 py-0.5 font-medium text-brand-bright">
              {mod.subcategory}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {timeAgo(mod.createdAt)}
            </span>
          </div>
          <h3 className="line-clamp-2 font-display font-bold tracking-tight text-white transition-colors group-hover:text-brand-bright">
            {mod.title}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-white/45">
            {mod.summary}
          </p>

          <div className="mt-auto flex items-center justify-between border-t border-white/10 pt-3 text-sm">
            <span className="flex items-center gap-1 text-brand-bright">
              <Download className="h-4 w-4" />
              {formatNumber(mod.downloads)}
            </span>
            <span className="flex items-center gap-1 text-amber-400">
              <Star className="h-4 w-4 fill-amber-400" />
              {mod.rating.toFixed(1)}
              <span className="text-white/30">({mod.ratingCount})</span>
            </span>
          </div>
        </div>
      </Link>
    </TiltCard>
  );
}
