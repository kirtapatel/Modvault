import Link from "next/link";
import { Flame, ExternalLink, Zap, Download, Sparkles } from "lucide-react";
import { listMods } from "@/lib/data-access";
import { GAMES } from "@/lib/types";
import { ModCard } from "@/components/ModCard";
import { SearchBar } from "@/components/SearchBar";
import { AdBanner } from "@/components/AdBanner";
import { GameToken } from "@/components/GameToken";
import { HomeAnimations } from "@/components/HomeAnimations";
import { VaultMount } from "@/components/three/VaultMount";

export const dynamic = "force-dynamic";

const quickTags = ["Vehicles", "Shaders", "Quests", "Skins", "Overhaul", "4K", "Weapons"];

export default async function HomePage() {
  const trending = await listMods({ sort: "popular", limit: 8 });
  const latest = await listMods({ sort: "newest", limit: 8 });

  return (
    <main>
      <section
        data-hero
        className="bg-grid relative overflow-hidden border-b border-white/10"
      >
        <HomeAnimations />
        <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#1bd96a]/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-32 top-20 h-96 w-96 rounded-full bg-teal-500/20 blur-3xl" />
        <div className="pointer-events-none absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-neon-cyan/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-12 sm:px-6 sm:pt-20">
          <div className="grid items-center gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-4">
            <div className="text-center lg:text-left">
              <span
                data-hero-reveal
                className="inline-flex items-center gap-2 rounded-full border border-brand/40 bg-brand/10 px-4 py-1.5 text-xs font-semibold text-brand backdrop-blur"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Downloads hosted by creators on MediaFire
              </span>
              <h1
                data-hero-reveal
                className="mt-6 text-4xl font-extrabold leading-tight text-white sm:text-6xl"
              >
                Discover the best <span className="glow-text">game mods</span> on
                the internet
              </h1>
              <p
                data-hero-reveal
                className="mx-auto mt-5 max-w-xl text-base text-slate-400 sm:text-lg lg:mx-0"
              >
                Download thousands of mods for GTA 5, Minecraft, Skyrim and more.
                Fast, transparent and always free.
              </p>
              <div data-hero-reveal className="mx-auto mt-8 max-w-xl lg:mx-0">
                <SearchBar />
              </div>
              <div
                data-hero-reveal
                className="mt-5 flex flex-wrap items-center justify-center gap-2 lg:justify-start"
              >
                {quickTags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/search?q=${encodeURIComponent(tag)}`}
                    className="rounded-full border border-white/10 bg-slate-900/70 px-3.5 py-1.5 text-xs font-medium text-slate-300 transition-all hover:border-brand/60 hover:text-brand"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
              <p
                data-hero-reveal
                className="mt-5 hidden items-center gap-2 text-xs text-slate-400 lg:flex"
              >
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand" />
                Hover the vault to unlock the collection
              </p>
            </div>

            <div data-vault-parallax className="relative">
              <div className="pointer-events-none absolute left-1/2 top-2 z-10 -translate-x-1/2 rounded-full border border-brand/25 bg-[#071012]/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-brand/80 backdrop-blur">
                Vault 07
              </div>
              <VaultMount />
            </div>
          </div>

          <div
            data-hero-reveal
            className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3"
          >
            {[
              { icon: ExternalLink, title: "Creator-hosted downloads", text: "Download buttons open the creator's MediaFire link." },
              { icon: Zap, title: "Blazing Fast", text: "No queues, no throttling — downloads go straight through MediaFire." },
              { icon: Download, title: "No Paywalls", text: "All core mods are free forever." },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="glass-panel rounded-2xl p-5 text-center transition-all hover:border-brand/40">
                <Icon className="mx-auto h-7 w-7 text-brand" />
                <h3 className="mt-3 font-bold text-white">{title}</h3>
                <p className="mt-1 text-sm text-slate-400">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6">
        <AdBanner variant="leaderboard" />
      </section>

      <section data-reveal className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="h-6 w-6 text-orange-500" />
            <h2 className="text-2xl font-extrabold text-white">Trending Mods</h2>
          </div>
          <Link href="/search?sort=popular" className="text-sm font-medium text-brand hover:text-brand-hover">
            View all →
          </Link>
        </div>
        <div className="no-scrollbar -mx-4 flex snap-x gap-5 overflow-x-auto px-4 pb-2 sm:grid sm:grid-cols-2 sm:overflow-visible md:grid-cols-3 lg:grid-cols-4">
          {trending.map((mod) => (
            <div key={mod.id} className="min-w-[280px] snap-start sm:min-w-0">
              <ModCard mod={mod} />
            </div>
          ))}
        </div>
      </section>

      <section data-reveal className="mx-auto max-w-7xl px-4 pb-8 sm:px-6">
        <div className="glass-panel rounded-2xl p-6 sm:p-8">
          <h2 className="text-center text-lg font-bold text-white">
            Browse by Game
          </h2>
          <p className="mt-1 text-center text-xs text-slate-400">
            Tilt a token to peek inside each world
          </p>
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {GAMES.map((game) => (
              <GameToken key={game.slug} game={game} />
            ))}
          </div>
        </div>
      </section>

      <section data-reveal className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-brand" />
            <h2 className="text-2xl font-extrabold text-white">Latest Uploads</h2>
          </div>
          <Link href="/search?sort=newest" className="text-sm font-medium text-brand hover:text-brand-hover">
            View all →
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {latest.map((mod) => (
            <ModCard key={mod.id} mod={mod} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-6 sm:px-6">
        <AdBanner variant="leaderboard" />
      </section>

      <section data-reveal className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="glass-panel rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-extrabold text-white">
            Are you a <span className="glow-text">modder</span>?
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">
            Share your creations with the world and earn tips from your fans via ko-fi and Patreon.
          </p>
          <Link
            href="/upload"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand to-brand-hover px-6 py-3 font-bold text-white shadow-lg shadow-[#1bd96a]/25 transition-all hover:shadow-[0_0_20px_rgba(27,217,106,0.4)]"
          >
            <Sparkles className="h-5 w-5" />
            Upload Your First Mod
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-4 sm:px-6">
        <AdBanner variant="leaderboard" />
      </section>
    </main>
  );
}