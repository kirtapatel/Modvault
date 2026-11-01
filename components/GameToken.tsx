import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { GameCategory } from "@/lib/types";
import { TiltCard } from "@/components/ui/TiltCard";

export function GameToken({ game }: { game: GameCategory }) {
  return (
    <TiltCard className="h-full rounded-2xl" maxTilt={12} magneticStrength={10}>
      <Link
        href={`/games/${game.slug}`}
        className={`game-token group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br ${game.gradient} p-6 shadow-2xl shadow-black/50 transition-all duration-500 hover:border-brand/40 hover:shadow-[0_34px_90px_-34px_rgba(191,68,23,0.55)]`}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_25%_15%,rgba(255,255,255,0.12),transparent_46%)]" />
        <div className="pointer-events-none absolute -right-10 -top-12 h-36 w-36 rounded-full border border-brand/20 bg-brand/5 blur-md" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 to-transparent" />

        <span className="tilt-depth relative flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-black/30 text-4xl shadow-lg shadow-black/30">
          {game.icon}
        </span>
        <h3 className="tilt-depth relative mt-5 font-display text-xl font-extrabold tracking-tight text-white">
          {game.name}
        </h3>
        <p className="relative mt-1 text-sm leading-relaxed text-white/55">
          {game.description}
        </p>
        <span className="relative mt-5 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-brand-bright opacity-80 transition-opacity group-hover:opacity-100">
          Explore mods
          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </Link>
    </TiltCard>
  );
}
