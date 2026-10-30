import Link from "next/link";
import { TrendingUp } from "lucide-react";
import type { GameCategory } from "@/lib/types";
import { TiltCard } from "@/components/ui/TiltCard";

export function GameToken({ game }: { game: GameCategory }) {
  return (
    <TiltCard className="h-full rounded-2xl" maxTilt={10}>
      <Link
        href={`/games/${game.slug}`}
        className={`game-token group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br ${game.gradient} p-6 shadow-2xl shadow-black/40 transition-shadow duration-300 hover:shadow-[0_34px_90px_-34px_rgba(27,217,106,0.6)]`}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_28%_18%,rgba(255,255,255,0.3),transparent_46%)]" />
        <div className="pointer-events-none absolute -right-10 -top-12 h-36 w-36 rounded-full border border-white/20 bg-white/10 blur-md" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/30 to-transparent" />

        <span className="tilt-depth relative text-5xl drop-shadow-[0_0_20px_rgba(255,255,255,0.35)]">
          {game.icon}
        </span>
        <h3 className="tilt-depth relative mt-4 text-xl font-extrabold text-white">
          {game.name}
        </h3>
        <p className="relative mt-1 text-sm text-white/80">{game.description}</p>
        <span className="relative mt-4 inline-flex items-center gap-1 text-sm font-semibold text-white opacity-80 transition-opacity group-hover:opacity-100">
          <TrendingUp className="h-4 w-4" />
          Explore mods
        </span>
      </Link>
    </TiltCard>
  );
}
