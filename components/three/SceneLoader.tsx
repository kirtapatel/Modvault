"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Boxes } from "lucide-react";
import { useReducedMotion } from "@/lib/useMediaQuery";

const STORAGE_KEY = "modvault-intro-seen";

export function SceneLoader() {
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (pathname !== "/") return;

    const holdFor = reducedMotion ? 250 : 1150;
    const fadeFor = reducedMotion ? 120 : 500;

    const frame = window.requestAnimationFrame(() => {
      try {
        if (window.sessionStorage.getItem(STORAGE_KEY) === "1") return;
        window.sessionStorage.setItem(STORAGE_KEY, "1");
      } catch {
        // storage can be unavailable in private mode — still show the intro once
      }

      setVisible(true);
      window.setTimeout(() => setLeaving(true), holdFor);
      window.setTimeout(() => setVisible(false), holdFor + fadeFor);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [pathname, reducedMotion]);

  if (!visible) return null;

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050a0c]/95 backdrop-blur-xl transition-opacity duration-500 ${
        leaving ? "opacity-0" : "opacity-100"
      }`}
      role="status"
      aria-live="polite"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(27,217,106,0.16),transparent_45%)]" />

      <div className="relative flex h-28 w-28 items-center justify-center">
        <div className="absolute inset-0 rounded-full border border-brand/25" />
        <div className="vault-ring absolute inset-2 rounded-full border-2 border-transparent border-r-neon-cyan border-t-brand" />
        <div className="absolute inset-5 rounded-full bg-brand/15 blur-xl" />
        <Boxes className="relative h-8 w-8 text-brand" />
      </div>

      <p className="mt-7 text-xs font-semibold uppercase tracking-[0.38em] text-brand">
        Unlocking ModVault
      </p>

      <div className="mt-5 h-1 w-52 overflow-hidden rounded-full bg-white/10">
        <div className="loader-sweep h-full w-1/2 rounded-full bg-gradient-to-r from-transparent via-brand to-neon-cyan" />
      </div>

      <span className="sr-only">Loading the 3D experience</span>
    </div>
  );
}
