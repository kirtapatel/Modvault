"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Heart } from "lucide-react";

export function FavoriteButton({ modId, slug }: { modId: string; slug: string }) {
  const { status } = useSession();
  const [active, setActive] = useState(false);
  const [busy, setBusy] = useState(false);

  async function toggle() {
    if (status !== "authenticated") {
      window.location.href = `/login?callbackUrl=/mod/${slug}`;
      return;
    }
    if (busy) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/mods/${slug}/favorite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ modId }),
      });
      const data = await res.json().catch(() => ({}));
      if (data.favorite !== undefined) setActive(data.favorite);
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      onClick={toggle}
      className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
        active
          ? "border-rose-500/60 bg-rose-500/15 text-rose-400"
          : "border-white/10 text-slate-300 hover:border-rose-500/60 hover:text-rose-400"
      }`}
    >
      <Heart className={`h-4 w-4 ${active ? "fill-rose-400" : ""}`} />
      {active ? "Favorited" : "Favorite"}
    </button>
  );
}