"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { MessageSquare, Send } from "lucide-react";
import type { ModComment } from "@/lib/types";
import { formatDate, initials } from "@/lib/utils";

export function CommentsSection({ modSlug }: { modSlug: string }) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<ModComment[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/mods/${modSlug}/comments`)
      .then((r) => r.json())
      .then((data) => {
        if (data.comments) setComments(data.comments);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [modSlug]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() || posting) return;
    setPosting(true);
    setError("");
    try {
      const res = await fetch(`/api/mods/${modSlug}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.trim() }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (res.status === 401) {
          window.location.href = `/login?callbackUrl=/mod/${modSlug}`;
          return;
        }
        setError(data.error || "Failed to post comment.");
        return;
      }
      const data = await res.json();
      setComments((prev) => [
        ...prev,
        {
          id: data.comment.id,
          modSlug,
          author: session?.user?.name ?? "You",
          authorId: session?.user?.id ?? "",
          avatar: session?.user?.image ?? null,
          text: text.trim(),
          createdAt: new Date().toISOString(),
        },
      ]);
      setText("");
    } catch {
      setError("Something went wrong.");
    } finally {
      setPosting(false);
    }
  }

  return (
    <div>
      <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-white">
        <MessageSquare className="h-5 w-5 text-brand" />
        Comments ({comments.length})
      </h2>

      <form onSubmit={submit} className="mb-6 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={session ? "Share your thoughts…" : "Sign in to leave a comment"}
          className="w-full rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-brand"
        />
        <button
          type="submit"
          disabled={posting}
          className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-brand to-brand-hover px-4 py-3 text-sm font-bold text-white transition-all hover:shadow-[0_0_20px_rgba(27,217,106,0.4)] disabled:opacity-50"
        >
          {posting ? "…" : <><Send className="h-4 w-4" /> Post</>}
        </button>
      </form>
      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

      {loading ? (
        <p className="text-sm text-slate-500">Loading comments…</p>
      ) : comments.length === 0 ? (
        <p className="text-sm text-slate-500">No comments yet. Be the first!</p>
      ) : (
        <ul className="space-y-4">
          {comments.map((c) => (
            <li key={c.id} className="flex gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand/15 text-xs font-bold text-brand">
                {c.avatar ? (
                  <img src={c.avatar} alt={c.author} className="h-full w-full rounded-full object-cover" />
                ) : (
                  initials(c.author)
                )}
              </div>
              <div className="flex-1 rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-white">{c.author}</span>
                  <span className="text-xs text-slate-500">{formatDate(c.createdAt)}</span>
                </div>
                <p className="mt-1 text-sm text-slate-300">{c.text}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}