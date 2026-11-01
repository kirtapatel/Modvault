import Link from "next/link";
import { Flame, Sparkles } from "lucide-react";
import { listMods } from "@/lib/data-access";
import { GAMES } from "@/lib/types";
import { ModCard } from "@/components/ModCard";
import { AdBanner } from "@/components/AdBanner";
import { GameToken } from "@/components/GameToken";
import { HeroSection } from "@/components/home/HeroSection";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/motion/Reveal";
import { SpringLink } from "@/components/motion/SpringLink";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const trending = await listMods({ sort: "popular", limit: 8 });
  const latest = await listMods({ sort: "newest", limit: 8 });

  return (
    <main>
      <HeroSection />

      <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6">
        <AdBanner variant="leaderboard" />
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <Reveal>
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-brand-bright" />
              <h2 className="text-2xl font-extrabold tracking-tight text-white">
                Trending Mods
              </h2>
            </div>
            <Link
              href="/search?sort=popular"
              className="text-sm font-medium text-brand transition-colors hover:text-brand-bright"
            >
              View all →
            </Link>
          </div>
        </Reveal>
        <StaggerGroup
          stagger={0.055}
          className="no-scrollbar -mx-4 flex snap-x gap-5 overflow-x-auto px-4 pb-2 sm:grid sm:grid-cols-2 sm:overflow-visible md:grid-cols-3 lg:grid-cols-4"
        >
          {trending.map((mod) => (
            <StaggerItem
              key={mod.id}
              className="min-w-[280px] snap-start sm:min-w-0"
            >
              <ModCard mod={mod} />
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6">
        <Reveal>
          <div className="glass-panel rounded-3xl p-6 sm:p-8">
            <div className="text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.24em] text-brand">
                Choose your world
              </span>
              <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-white">
                Browse by Game
              </h2>
              <p className="mt-1 text-xs text-white/40">
                Tilt a token to peek inside each world
              </p>
            </div>
            <StaggerGroup
              stagger={0.09}
              className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3"
            >
              {GAMES.map((game) => (
                <StaggerItem key={game.slug} className="h-full">
                  <GameToken game={game} />
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <Reveal>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-brand-bright" />
              <h2 className="text-2xl font-extrabold tracking-tight text-white">
                Latest Uploads
              </h2>
            </div>
            <Link
              href="/search?sort=newest"
              className="text-sm font-medium text-brand transition-colors hover:text-brand-bright"
            >
              View all →
            </Link>
          </div>
        </Reveal>
        <StaggerGroup
          stagger={0.055}
          className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        >
          {latest.map((mod) => (
            <StaggerItem key={mod.id}>
              <ModCard mod={mod} />
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-6 sm:px-6">
        <AdBanner variant="leaderboard" />
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <Reveal>
          <div className="glass-panel relative overflow-hidden rounded-3xl p-8 text-center">
            <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-[520px] -translate-x-1/2 rounded-full bg-brand/20 blur-[110px]" />
            <h2 className="relative text-2xl font-extrabold tracking-tight text-white">
              Are you a <span className="glow-text">modder</span>?
            </h2>
            <p className="relative mx-auto mt-2 max-w-md text-sm text-white/50">
              Share your creations with the world and earn tips from your fans
              via ko-fi and Patreon.
            </p>
            <SpringLink
              href="/upload"
              wrapperClassName="relative mt-5 inline-flex"
              className="inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-3 font-bold text-white shadow-[0_0_30px_-8px_rgba(191,68,23,0.8)] transition-colors hover:bg-brand-hover"
            >
              <Sparkles className="h-5 w-5" />
              Upload Your First Mod
            </SpringLink>
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-4 sm:px-6">
        <AdBanner variant="leaderboard" />
      </section>
    </main>
  );
}
