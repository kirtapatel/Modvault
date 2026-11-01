"use client";

import { useRef, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Download, ExternalLink, FileArchive } from "lucide-react";
import { Countdown } from "@/components/Countdown";
import { AdBanner } from "@/components/AdBanner";
import type { ModFile } from "@/lib/types";

export function DownloadGate({ slug, file }: { slug: string; file: ModFile | null }) {
  const { status } = useSession();
  const [started, setStarted] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
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
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-brand-hover shadow-xl shadow-brand/30">
            <Download className="h-9 w-9 text-white" />
          </div>
        )}
        {started && <Countdown seconds={5} onComplete={beginDownload} />}
        {!started && (
          <div className="text-center sm:text-left">
            <p className="text-lg font-bold text-white">Ready to download?</p>
            <p className="mt-1 text-sm text-white/50">
              Hit the button to start your free download. A 5-second countdown will begin.
            </p>
          </div>
        )}
      </div>

      <button
        onClick={() => {
          trackAndStart();
          setStarted(true);
        }}
        disabled={downloaded}
        className="flex w-full items-center justify-between gap-3 rounded-xl border border-[#bf4417]/40 bg-brand/10 px-4 py-4 text-left transition-all hover:border-brand hover:bg-brand/15 disabled:opacity-60"
      >
        <div>
          <p className="flex items-center gap-2 font-bold text-white">
            <Download className="h-5 w-5 text-brand" />
            Free Download
          </p>
          <p className="mt-0.5 text-xs text-white/50">Takes you straight to MediaFire</p>
        </div>
        <span className="rounded-lg bg-brand px-3 py-1.5 text-xs font-bold text-white shadow-lg shadow-brand/30">Free</span>
      </button>

      {downloaded && (
        <div className="mt-5 rounded-xl border border-brand/30 bg-brand/10 p-4 text-center">
          {missingFile || fileMissingDemo ? (
            <>
              <p className="text-sm font-semibold text-white">This is a demo mod.</p>
              <p className="mt-1 text-xs text-white/50">
                Once linked to a real MediaFire file, your download will start automatically.
              </p>
            </>
          ) : (
            <>
              <p className="flex items-center justify-center gap-2 text-sm font-semibold text-brand-bright">
                <ExternalLink className="h-4 w-4" />
                {isMediaFire ? "Opening MediaFire…" : "Opening download…"}
              </p>
              <p className="mt-1 text-xs text-white/50">
                {isMediaFire
                  ? "If you are not redirected automatically, use the button below."
                  : "If the download did not start, use the button below."}
              </p>
              {file?.url && (
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-2 rounded-xl bg-brand/15 px-5 py-2.5 text-sm font-bold text-brand-bright transition-colors hover:bg-brand/20"
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

      <div className="mt-5 flex items-center justify-center gap-4 text-xs text-white/35">
        <span className="flex items-center gap-1"><FileArchive className="h-3.5 w-3.5" />Supports .zip .rar .jar files</span>
        <span className="flex items-center gap-1"><ExternalLink className="h-3.5 w-3.5" />External MediaFire link</span>
        {status !== "authenticated" && (
          <Link href="/login" className="text-brand hover:text-brand-hover">Sign in for faster access</Link>
        )}
      </div>
    </div>
  );
}
