"use client";

import { X, Zap, ShieldCheck } from "lucide-react";

export function PremiumModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-fuchsia-500/40 bg-slate-900 p-8 shadow-2xl shadow-fuchsia-500/20"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-xl shadow-fuchsia-500/40">
          <Zap className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-center text-2xl font-extrabold text-white">
          Go <span className="glow-text">VIP</span>
        </h3>
        <p className="mt-2 text-center text-sm text-slate-400">
          Unlock uncapped download speed, early access to mods and zero ads forever.
        </p>

        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/60 p-6 text-center">
          <p className="text-sm text-slate-400">Monthly subscription</p>
          <p className="mt-1 text-5xl font-extrabold text-white">
            $4.99
            <span className="text-base font-medium text-slate-500">/mo</span>
          </p>
          <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-400">
            <ShieldCheck className="h-3.5 w-3.5" />
            Cancel anytime
          </p>
        </div>

        <ul className="mt-6 space-y-2 text-sm text-slate-300">
          <li>⚡ Uncapped download speed</li>
          <li>🚫 Zero ads across the whole site</li>
          <li>🔓 Early access to freshly released mods</li>
          <li>🎨 Exclusive VIP badges on your profile</li>
        </ul>

        <button className="mt-6 w-full rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 py-3.5 font-bold text-white shadow-lg shadow-fuchsia-500/25 transition-all hover:brightness-110">
          Upgrade to VIP
        </button>
        <p className="mt-3 text-center text-xs text-slate-500">
          Payment processing integration ready (Stripe/ko-fi).
        </p>
      </div>
    </div>
  );
}