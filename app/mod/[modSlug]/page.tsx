import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Download,
  ExternalLink,
  User,
  Tag,
  ChevronRight,
  Share2,
  Calendar,
  Boxes,
} from "lucide-react";
import { getModBySlug } from "@/lib/data-access";
import { formatBytes, formatDate, formatNumber, initials } from "@/lib/utils";
import { GameThumb } from "@/components/GameThumb";
import { RatingStars } from "@/components/RatingStars";
import { AdBanner } from "@/components/AdBanner";
import { MarkdownView } from "@/components/MarkdownView";
import { CommentsSection } from "@/components/CommentsSection";
import { FavoriteButton } from "@/components/FavoriteButton";
import { ScreenshotGallery } from "@/components/ScreenshotGallery";

export async function generateMetadata({ params }: { params: Promise<{ modSlug: string }> }) {
  const { modSlug } = await params;
  const mod = await getModBySlug(modSlug);
  return { title: mod ? `${mod.title} — ModVault` : "Mod not found", description: mod?.summary };
}

const tabs = [
  { id: "description", label: "Description" },
  { id: "changelog", label: "File Versions" },
  { id: "comments", label: "Comments" },
];

export default async function ModDetailPage({ params }: { params: Promise<{ modSlug: string }> }) {
  const { modSlug } = await params;
  const mod = await getModBySlug(modSlug);
  if (!mod) notFound();

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <nav className="mb-6 flex flex-wrap items-center gap-1.5 text-sm text-white/50">
        <Link href="/" className="hover:text-brand">Home</Link>
        <ChevronRight className="h-4 w-4" />
        <Link href={`/games/${mod.gameSlug}`} className="hover:text-brand">{mod.game}</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-white">{mod.title}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="space-y-8 min-w-0">
          <div className="glass-card overflow-hidden rounded-3xl">
            <div className="relative aspect-[16/9] w-full">
              <GameThumb gameSlug={mod.gameSlug} title={mod.title} thumbnailUrl={mod.thumbnailUrl ?? mod.screenshots?.[0] ?? null} />
              {mod.virusChecked && (
                <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-brand/95 px-3 py-1.5 text-xs font-bold text-white shadow-lg">
                  <ExternalLink className="h-4 w-4" />
                  Hosted on MediaFire
                </div>
              )}
            </div>
            <div className="p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-extrabold text-white sm:text-3xl">{mod.title}</h1>
                  <div className="mt-2 flex items-center gap-3 text-sm text-white/50">
                    <span className="rounded-md bg-brand/15 px-2 py-0.5 text-xs font-semibold text-brand">{mod.game}</span>
                    <span className="rounded-md bg-brand/15 px-2 py-0.5 text-xs font-semibold text-brand">{mod.subcategory}</span>
                    <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{formatDate(mod.createdAt)}</span>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <RatingStars rating={mod.rating} />
                    <span className="text-sm font-semibold text-white">{mod.rating.toFixed(1)}</span>
                    <span className="text-xs text-white/35">({mod.ratingCount} ratings)</span>
                    <span className="ml-2 flex items-center gap-1 text-sm text-white/50">
                      <Download className="h-4 w-4 text-brand-bright" />
                      {formatNumber(mod.downloads)} downloads
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <FavoriteButton modId={mod.id} slug={mod.slug} />
                  <button className="flex items-center gap-1.5 rounded-lg border border-white/15 px-3 py-2 text-sm font-medium text-white/70 transition-colors hover:border-brand/60 hover:text-white">
                    <Share2 className="h-4 w-4" />
                    Share
                  </button>
                </div>
              </div>

              <p className="mt-4 text-white/70">{mod.summary}</p>

              {mod.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <Tag className="h-4 w-4 text-white/35" />
                  {mod.tags.map((t) => (
                    <Link
                      key={t}
                      href={`/search?q=${encodeURIComponent(t)}`}
                      className="rounded-full border border-white/15 bg-white/[0.06] px-3 py-1 text-xs text-white/70 transition-colors hover:border-brand/60 hover:text-white"
                    >
                      {t}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          <AdBanner variant="leaderboard" />

          <ScreenshotGallery images={mod.screenshots} />

          <div className="flex items-center justify-between glass-card rounded-2xl px-4 py-3">
            <span className="flex items-center gap-2 text-sm font-bold text-white">
              <Download className="h-5 w-5 text-brand" />
              Download {mod.title}
            </span>
            <Link
              href={`/download/${mod.id}`}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand to-brand-hover px-5 py-2.5 font-bold text-white shadow-lg shadow-brand/30 transition-all hover:shadow-[0_0_20px_rgba(191,68,23,0.4)]"
            >
              <Download className="h-5 w-5" />
              Free Download
            </Link>
          </div>

          <div className="glass-card rounded-3xl p-6">
            <div className="mb-4 flex gap-2 border-b border-white/10 pb-3">
              {tabs.map((tab) => (
                <a
                  key={tab.id}
                  href={`#${tab.id}`}
                  className="rounded-lg px-3 py-1.5 text-sm font-semibold text-white/50 transition-colors hover:text-white"
                >
                  {tab.label}
                </a>
              ))}
            </div>

            <div id="description">
              <MarkdownView content={mod.description} />
            </div>

            <div id="changelog" className="mt-8">
              <h2 className="mb-3 text-lg font-bold text-white">Available Versions</h2>
              <div className="space-y-2">
                {mod.files.length === 0 && (
                  <p className="text-sm text-white/50">No files uploaded yet.</p>
                )}
                {mod.files.map((file) => (
                  <div
                    key={file.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/30 px-4 py-3"
                  >
                    <div>
                      <p className="font-semibold text-white">Version {file.version}</p>
                      <p className="text-xs text-white/35">Game version: {file.gameVersion} · {formatBytes(file.sizeBytes)}</p>
                    </div>
                    <Link
                      href={`/download/${mod.id}`}
                      className="flex items-center gap-1.5 rounded-lg bg-brand/15 px-4 py-2 text-sm font-semibold text-brand transition-colors hover:bg-brand/25"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            <div id="comments" className="mt-8">
              <CommentsSection modSlug={mod.slug} />
            </div>
          </div>

          <AdBanner variant="box" />
        </div>

        <aside className="space-y-5">
          <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-bright text-lg font-extrabold text-white">
                {mod.creator.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={mod.creator.avatar} alt={mod.creator.name} className="h-full w-full rounded-full object-cover" />
                ) : (
                  initials(mod.creator.name)
                )}
              </div>
              <div>
                <p className="flex items-center gap-1 font-bold text-white">
                  <User className="h-3.5 w-3.5 text-brand" />
                  {mod.creator.name}
                </p>
                <p className="text-xs text-white/35">Creator</p>
              </div>
            </div>
            {mod.creator.bio && <p className="mt-3 text-sm text-white/50">{mod.creator.bio}</p>}
            {(mod.creator.koFi || mod.creator.patreon) && (
              <div className="mt-4 flex gap-2">
                {mod.creator.koFi && (
                  <a href={mod.creator.koFi} target="_blank" rel="noopener noreferrer"
                     className="flex-1 rounded-lg bg-[#ff5e5b] px-3 py-2 text-center text-sm font-bold text-white transition-all hover:brightness-110">
                    💖 Tip on ko-fi
                  </a>
                )}
                {mod.creator.patreon && (
                  <a href={mod.creator.patreon} target="_blank" rel="noopener noreferrer"
                     className="flex-1 rounded-lg bg-[#ff424d] px-3 py-2 text-center text-sm font-bold text-white transition-all hover:brightness-110">
                    <span className="flex items-center justify-center gap-1"><Boxes className="h-3.5 w-3.5" />Patreon</span>
                  </a>
                )}
              </div>
            )}
          </div>

          <AdBanner variant="box" />
        </aside>
      </div>
    </main>
  );
}