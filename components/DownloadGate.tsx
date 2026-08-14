"use client";

import { useRef, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Download, Zap, ExternalLink, FileArchive } from "lucide-react";
import { Countdown } from "@/components/Countdown";
import { PremiumModal } from "@/components/PremiumModal";
import { AdBanner } from "@/components/AdBanner";
import type { ModFile } from "@/lib/types";

export function DownloadGate({ modId, slug, file }: { modId: string; slug: string; file: ModFile | null }) {
  const { status } = useSession();
  const [started, setStarted] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [premiumOpen, setPremiumOpen] = useState(false);
  const [missingFile, setMissingFile] = useState(false);
  const didTrack = useRef(false);

  function trackAndStart() {
    if (didTrack.current) return;
    didTrack.current = true;
    fetch(`/api/mods/${slug}/download`, { method: "POST" }).catch(() => {});
  }

  function beginDownload() {
    setDownloaded(true);
    if (!file?.url) {
      setMissingFile(true);
      return;
    }
    window.location.href = file.url;
  }

  const fileMissingDemo = file !== null && (file.url.startsWith("https://example.com"));
  const isMediaFire = file !== null && /mediafire\.com/i.test(file.url);

  return (
    <div>
      <div className="mb-6 flex flex-col items-center gap-5 sm:flex-row">
        {!started && (
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-xl shadow-fuchsia-500/30">
            <Download className="h-9 w-9 text-white" />
          </div>
        )}
        {started && <Countdown seconds={5} onComplete={beginDownload} />}
        {!started && (
          <div className="text-center sm:text-left">
            <p className="text-lg font-bold text-white">Ready to download?</p>
            <p className="mt-1 text-sm text-slate-400">
              Hit the button to start your free download. A 5-second countdown will begin.
            </p>
          </div>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <button
          onClick={() => {
            trackAndStart();
            setStarted(true);
          }}
          disabled={downloaded}
          className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-800/70 px-4 py-3.5 text-left transition-colors hover:border-emerald-500/60"
        >
          <div>
            <p className="flex items-center gap-2 font-bold text-white">
              <Download className="h-5 w-5 text-emerald-400" />
              Free Download
            </p>
            <p className="mt-0.5 text-xs text-slate-400">2 MB/s speed limit</p>
          </div>
          <span className="text-2xl">⬇️</span>
        </button>

        <button
          onClick={() => setPremiumOpen(true)}
          className="relative flex items-center justify-between rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-3.5 text-left shadow-lg shadow-fuchsia-500/30 transition-all hover:brightness-110"
        >
          <div>
            <p className="flex items-center gap-2 font-bold text-white">
              <Zap className="h-5 w-5 fill-amber-300 text-amber-300" />
              VIP Speed
            </p>
            <p className="mt-0.5 text-xs text-white/70">Uncapped · No ads</p>
          </div>
          <span className="rounded-lg bg-white/20 px-2 py-1 text-xs font-bold text-white">$4.99/mo</span>
        </button>
      </div>

      {downloaded && (
        <div className="mt-5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-center">
          {missingFile || fileMissingDemo ? (
            <>
              <p className="text-sm font-semibold text-white">This is a demo mod.</p>
              <p className="mt-1 text-xs text-slate-400">
                Once linked to a real MediaFire file, your download will start automatically.
              </p>
            </>
          ) : (
            <>
              <p className="flex items-center justify-center gap-2 text-sm font-semibold text-emerald-400">
                <ExternalLink className="h-4 w-4" />
                {isMediaFire ? "Opening MediaFire…" : "Opening download…"}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                {isMediaFire
                  ? "If you are not redirected automatically, use the button below."
                  : "If the download did not start, use the button below."}
              </p>
              {file?.url && (
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-2 rounded-xl bg-emerald-500/20 px-5 py-2.5 text-sm font-bold text-emerald-300 transition-colors hover:bg-emerald-500/30"
                >
                  <Download className="h-4 w-4" />
                  Go to {isMediaFire ? "MediaFire" : "download page"}
                </a>
              )}
            </>
          )}
        </div>
      )}

      <div className="mt-6">
        <AdBanner label="Interstitial Ad" variant="leaderboard" />
      </div>

      <div className="mt-5 flex items-center justify-center gap-4 text-xs text-slate-500">
        <span className="flex items-center gap-1"><FileArchive className="h-3.5 w-3.5" />Supports .zip .rar .jar files</span>
        <span className="flex items-center gap-1"><ExternalLink className="h-3.5 w-3.5" />External MediaFire link</span>
        <Link href="/login" className="text-fuchsia-400 hover:text-fuchsia-300">Sign in for faster access</Link>
      </div>

      <PremiumModal open={premiumOpen} onClose={() => setPremiumOpen(false)} />
    </div>
  );
}