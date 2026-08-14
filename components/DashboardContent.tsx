"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  Heart,
  UploadCloud,
  Trash2,
  Download,
  Settings,
  Save,
  LogOut,
  Loader2,
  Boxes,
  X,
  Check,
  ExternalLink,
} from "lucide-react";
import type { Mod } from "@/lib/types";
import { formatNumber, formatDate } from "@/lib/utils";

interface DashboardData {
  user?: {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
    bio: string;
    isPremium: boolean;
    koFi: string;
    patreon: string;
  } | null;
  favoriteMods: Mod[];
  uploadedMods: Mod[];
  demo?: boolean;
  admin?: boolean;
}

export function DashboardContent() {
  const { data: session } = useSession();
  const [data, setData] = useState<DashboardData | null>(null);
  const [tab, setTab] = useState<"settings" | "mods" | "favorites">("settings");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [koFi, setKoFi] = useState("");
  const [patreon, setPatreon] = useState("");

  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [editingLink, setEditingLink] = useState("");

  useEffect(() => {
    fetch("/api/user/dashboard")
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        if (d.user) {
          setName(d.user.name ?? "");
          setBio(d.user.bio ?? "");
          setKoFi(d.user.koFi ?? "");
          setPatreon(d.user.patreon ?? "");
        }
      })
      .catch(() => setData({ favoriteMods: [], uploadedMods: [] }))
      .finally(() => setLoading(false));
  }, []);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setError("");
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, bio, koFi, patreon }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setError(d.error || "Failed to save profile.");
        return;
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      setError("Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteMod(slug: string) {
    if (!confirm("Delete this mod permanently?")) return;
    const res = await fetch(`/api/mods/${slug}`, { method: "DELETE" });
    if (res.ok) {
      setData((prev) => (prev ? { ...prev, uploadedMods: prev.uploadedMods.filter((m) => m.slug !== slug) } : prev));
    } else {
      setError("Failed to delete mod.");
    }
  }

  function startLinkEdit(mod: Mod) {
    setEditingSlug(mod.slug);
    setEditingLink(mod.files?.[0]?.url ?? "");
    setError("");
  }

  async function saveFileLink(slug: string) {
    const url = editingLink.trim();
    if (!url) {
      setError("Please paste a MediaFire share link.");
      return;
    }
    if (!/^https?:\/\//i.test(url) || !/mediafire\.com/i.test(url)) {
      setError("Please enter a valid MediaFire link (mediafire.com).");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/mods/${slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileUrl: url }),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(d.error || "Failed to update download link.");
        return;
      }
      setData((prev) =>
        prev
          ? {
              ...prev,
              uploadedMods: prev.uploadedMods.map((m) =>
                m.slug === slug && m.files && m.files[0]
                  ? { ...m, files: [{ ...m.files[0], url }] }
                  : m
              ),
            }
          : prev
      );
      setEditingSlug(null);
      setEditingLink("");
      setError("");
    } catch {
      setError("Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="flex items-center gap-2 text-slate-500"><Loader2 className="h-4 w-4 animate-spin" />Loading your data…</p>;
  }

  if (!session || !data?.user) {
    return (
      <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-12 text-center">
        <h2 className="text-xl font-bold text-white">Sign in to view your dashboard</h2>
        <p className="mt-2 text-sm text-slate-400">{data?.demo ? "Database not connected — this is demo view." : ""}</p>
        <Link href="/login" className="mt-5 inline-block rounded-xl bg-gradient-to-r from-brand to-brand-hover px-6 py-3 font-bold text-white shadow-lg shadow-[#1bd96a]/25 transition-all hover:shadow-[0_0_20px_rgba(27,217,106,0.4)]">
          Sign In
        </Link>
      </div>
    );
  }

  const tabs = [
    { id: "settings" as const, label: "Account", icon: Settings },
    { id: "mods" as const, label: `My Mods (${data.uploadedMods.length})`, icon: UploadCloud },
    { id: "favorites" as const, label: `Favorites (${data.favoriteMods.length})`, icon: Heart },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
      <aside className="flex flex-row gap-2 overflow-x-auto pb-2 lg:flex-col lg:pb-0">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors lg:w-full ${
              tab === t.id ? "bg-gradient-to-r from-brand to-brand-hover text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <t.icon className="h-4 w-4" />
            {t.label}
          </button>
        ))}
        {data.admin && (
          <Link
            href="/admin"
            className="flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-amber-300 transition-colors hover:bg-amber-500/10 lg:w-full"
          >
            <Boxes className="h-4 w-4" />
            Admin Panel
          </Link>
        )}
        <button
          onClick={() => {
            const { signOut } = require("next-auth/react");
            signOut({ callbackUrl: "/" });
          }}
          className="flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-red-400 transition-colors hover:bg-red-500/10 lg:w-full"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </aside>

      <section>
        {error && <div className="mb-4 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</div>}

        {tab === "settings" && (
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8">
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-teal-400 text-xl font-extrabold text-white">
                {data.user!.avatar ? <img src={data.user!.avatar} alt="" className="h-full w-full rounded-2xl object-cover" /> : data.user!.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{data.user!.name}</h2>
                <p className="text-sm text-slate-400">{data.user!.email}</p>
              </div>
            </div>

            <form onSubmit={saveProfile} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-300">Display name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-3 text-sm text-white outline-none focus:border-brand" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-300">Bio</label>
                <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} placeholder="Tell the community about yourself…" className="w-full resize-y rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-3 text-sm text-white outline-none focus:border-brand" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-300">Ko-fi link</label>
                  <input value={koFi} onChange={(e) => setKoFi(e.target.value)} placeholder="https://ko-fi.com/you" className="w-full rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-3 text-sm text-white outline-none focus:border-brand" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-300">Patreon link</label>
                  <input value={patreon} onChange={(e) => setPatreon(e.target.value)} placeholder="https://patreon.com/you" className="w-full rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-3 text-sm text-white outline-none focus:border-brand" />
                </div>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button type="submit" disabled={saving} className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand to-brand-hover px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#1bd96a]/25 transition-all hover:shadow-[0_0_20px_rgba(27,217,106,0.4)] disabled:opacity-50">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  {saving ? "Saving…" : "Save changes"}
                </button>
                {saved && <span className="text-sm text-emerald-400">Saved!</span>}
              </div>
            </form>
          </div>
        )}

        {tab === "mods" && (
          <div className="space-y-3">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-slate-400">Mods you have published.</p>
              <Link href="/upload" className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-brand to-brand-hover px-4 py-2 text-sm font-bold text-white transition-all hover:shadow-[0_0_20px_rgba(27,217,106,0.4)]">
                <UploadCloud className="h-4 w-4" /> Upload new
              </Link>
            </div>
            {data.uploadedMods.length === 0 ? (
              <Empt state="mods" />
            ) : (
              data.uploadedMods.map((m) => (
                <div key={m.id} className="rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-3">
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <Link href={`/mod/${m.slug}`} className="block truncate font-bold text-white hover:text-brand">{m.title}</Link>
                      <p className="mt-0.5 flex items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1"><Download className="h-3 w-3" />{formatNumber(m.downloads)}</span>
                        <span>{m.subcategory}</span>
                        <span>{formatDate(m.createdAt)}</span>
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <Link href={`/mod/${m.slug}`} className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-700">View</Link>
                      <button onClick={() => deleteMod(m.slug)} className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-red-500/10 hover:text-red-400" title="Delete">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-2.5 flex flex-col gap-2 border-t border-slate-800 pt-2.5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-center gap-2 text-xs">
                      <span className="shrink-0 font-semibold text-slate-400">Download link:</span>
                      {editingSlug === m.slug ? (
                        <input
                          value={editingLink}
                          onChange={(e) => setEditingLink(e.target.value)}
                          placeholder="https://www.mediafire.com/file/..."
                          className="min-w-0 flex-1 rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-1.5 text-xs text-white outline-none focus:border-brand"
                          aria-label={`MediaFire link for ${m.title}`}
                        />
                      ) : m.files?.[0]?.url ? (
                        <a
                          href={m.files[0].url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex min-w-0 items-center gap-1 truncate text-brand hover:text-brand-hover"
                          title={m.files[0].url}
                        >
                          <ExternalLink className="h-3 w-3 shrink-0" />
                          <span className="truncate">{m.files[0].url}</span>
                        </a>
                      ) : (
                        <span className="text-slate-600">No link yet</span>
                      )}
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      {editingSlug === m.slug ? (
                        <>
                          <button
                            onClick={() => saveFileLink(m.slug)}
                            disabled={saving}
                            className="inline-flex items-center gap-1 rounded-lg bg-brand/15 px-2.5 py-1.5 text-xs font-semibold text-brand hover:bg-brand/25 disabled:opacity-40"
                          >
                            <Check className="h-3.5 w-3.5" /> Save
                          </button>
                          <button
                            onClick={() => { setEditingSlug(null); setEditingLink(""); setError(""); }}
                            className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-400 hover:bg-slate-800 hover:text-white"
                          >
                            <X className="h-3.5 w-3.5" /> Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => startLinkEdit(m)}
                          className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-400 hover:bg-slate-800 hover:text-white"
                        >
                          Edit link
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {tab === "favorites" && (
          <div className="space-y-3">
            {data.favoriteMods.length === 0 ? (
              <Empt state="favs" />
            ) : (
              data.favoriteMods.map((m) => (
                <div key={m.id} className="flex items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-3">
                  <Link href={`/mod/${m.slug}`} className="min-w-0">
                    <span className="block truncate font-bold text-white hover:text-brand">{m.title}</span>
                    <span className="mt-0.5 block text-xs text-slate-500">{m.game} · {m.subcategory}</span>
                  </Link>
                  <Link href={`/mod/${m.slug}`} className="shrink-0 rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-700">View</Link>
                </div>
              ))
            )}
          </div>
        )}
      </section>
    </div>
  );
}

function Empt({ state }: { state: "mods" | "favs" }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-10 text-center">
      <Boxes className="mx-auto h-10 w-10 text-slate-600" />
      <p className="mt-3 text-sm text-slate-400">
        {state === "mods" ? "You haven't uploaded any mods yet." : "No favorites yet. Tap the heart on any mod to save it here."}
      </p>
      {state === "mods" && (
        <Link href="/upload" className="mt-4 inline-block text-sm font-semibold text-brand hover:text-brand-hover">
          Upload your first mod →
        </Link>
      )}
    </div>
  );
}