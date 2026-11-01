"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Heart } from "lucide-react";

export function FavoriteButton({ modId, slug }: { modId: string; slug: string }) {
  const router = useRouter();
  const { status } = useSession();
  const [active, setActive] = useState(false);
  const [busy, setBusy] = useState(false);

  async function toggle() {
    if (status !== "authenticated") {
      router.push(`/login?callbackUrl=/mod/${slug}`);
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
      className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${
        active
          ? "border-brand/50 bg-brand/15 text-brand-bright"
          : "border-white/10 text-white/70 hover:border-brand/50 hover:text-brand-bright"
      }`}
    >
      <Heart className={`h-4 w-4 ${active ? "fill-brand-bright" : ""}`} />
      {active ? "Favorited" : "Favorite"}
    </button>
  );
}