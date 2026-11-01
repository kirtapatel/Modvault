import Link from "next/link";
import { ExternalLink, ChevronRight } from "lucide-react";
import { formatBytes } from "@/lib/utils";
import { AdBanner } from "@/components/AdBanner";
import { DownloadGate } from "@/components/DownloadGate";

export async function generateMetadata({ params }: { params: Promise<{ modId: string }> }) {
  const { modId } = await params;
  const mod = (await findModByAnyId(modId)) ?? null;
  return { title: mod ? `Download ${mod.title} — ModVault` : "Download — ModVault" };
}

async function findModByAnyId(id: string) {
  const { getModBySlug, getModById } = await import("@/lib/data-access");
  const mod = (await getModBySlug(id)) ?? (await getModById(id));
  if (mod) return mod;
  const { demoMods } = await import("@/lib/demo-data");
  const m = demoMods.find((d) => d.id === id);
  if (m) return m;
  return null;
}

export default async function DownloadPage({ params }: { params: Promise<{ modId: string }> }) {
  const { modId } = await params;
  const mod = await findModByAnyId(modId);
  const file = mod?.files?.[0];

  if (!mod) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="text-2xl font-extrabold text-white">Mod not found</h1>
        <Link href="/" className="mt-4 inline-block text-brand hover:text-brand-hover">← Back to home</Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-white/50">
        <Link href="/" className="hover:text-brand">Home</Link>
        <ChevronRight className="h-4 w-4" />
        <Link href={`/mod/${mod.slug}`} className="truncate hover:text-brand">{mod.title}</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-white">Download</span>
      </nav>

      <div className="glass-card overflow-hidden rounded-3xl p-6 sm:p-8">
        <div className="mb-6 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-3 py-1 text-xs font-bold text-brand-bright">
            <ExternalLink className="h-4 w-4" />
            Hosted on MediaFire
          </span>
          <h1 className="mt-3 text-xl font-extrabold text-white sm:text-2xl">{mod.title}</h1>
          <p className="mt-1 text-sm text-white/50">
            Version {file?.version ?? "1.0"} · {file ? formatBytes(file.sizeBytes) : "Unknown size"}
            {file?.gameVersion && <> · Works with game version {file.gameVersion}</>}
          </p>
        </div>

        <div className="rounded-2xl border border-dashed border-brand/40 bg-brand/5 p-6">
          <DownloadGate slug={mod.slug} file={file ?? null} />
        </div>

        <p className="mt-4 text-center text-xs text-white/35">
          By downloading you agree to the ModVault Terms of Service. Files are provided by independent creators.
        </p>
      </div>

      <div className="mt-8">
        <AdBanner variant="leaderboard" />
      </div>
    </main>
  );
}