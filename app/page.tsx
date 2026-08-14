import Link from "next/link";
import { Flame, TrendingUp, ExternalLink, Zap, Download, Sparkles } from "lucide-react";
import { listMods } from "@/lib/data-access";
import { GAMES } from "@/lib/types";
import { ModCard } from "@/components/ModCard";
import { SearchBar } from "@/components/SearchBar";
import { AdBanner } from "@/components/AdBanner";

export const dynamic = "force-dynamic";

const quickTags = ["Vehicles", "Shaders", "Quests", "Skins", "Overhaul", "4K", "Weapons"];

export default async function HomePage() {
  const trending = await listMods({ sort: "popular", limit: 8 });
  const latest = await listMods({ sort: "newest", limit: 8 });

  return (
    <main>
      <section className="bg-grid relative overflow-hidden border-b border-white/10">
        <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#1bd96a]/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-32 top-20 h-96 w-96 rounded-full bg-teal-500/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-16 sm:px-6 sm:pt-24">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand/40 bg-brand/10 px-4 py-1.5 text-xs font-semibold text-brand">
              <ExternalLink className="h-3.5 w-3.5" />
              Downloads hosted by creators on MediaFire
            </span>
            <h1 className="mt-6 text-4xl font-extrabold leading-tight text-white sm:text-6xl">
              Discover the best <span className="glow-text">game mods</span> on the internet
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base text-slate-400 sm:text-lg">
              Download thousands of mods for GTA 5, Minecraft, Skyrim and more.
              Fast, transparent and always free.
            </p>
            <div className="mt-8">
              <SearchBar />
            </div>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
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
          </div>

          <div className="mx-auto mt-14 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { icon: ExternalLink, title: "Creator-hosted downloads", text: "Download buttons open the creator's MediaFire link." },
              { icon: Zap, title: "Blazing Fast", text: "No queues, no throttling — downloads go straight through MediaFire." },
              { icon: Download, title: "No Paywalls", text: "All core mods are free forever." },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 text-center transition-all hover:border-brand/40">
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

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
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

      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6">
        <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-8">
          <h2 className="text-center text-lg font-bold text-white">Browse by Game</h2>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {GAMES.map((game) => (
              <Link
                key={game.slug}
                href={`/games/${game.slug}`}
                className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br ${game.gradient} p-6 transition-all hover:-translate-y-1`}
              >
                <span className="text-4xl">{game.icon}</span>
                <h3 className="mt-4 text-xl font-extrabold text-white">{game.name}</h3>
                <p className="mt-1 text-sm text-white/80">{game.description}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-white opacity-80 transition-opacity group-hover:opacity-100">
                  <TrendingUp className="h-4 w-4" />
                  Explore mods
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
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

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-8 text-center">
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