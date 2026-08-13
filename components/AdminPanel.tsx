"use client";

import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Boxes,
  Users,
  ShieldCheck,
  Trash2,
  Plus,
  Loader2,
  Search,
  RefreshCw,
  ChevronRight,
  Crown,
  ExternalLink,
  Save,
} from "lucide-react";
import { formatNumber, timeAgo } from "@/lib/utils";

type Tab = "overview" | "mods" | "users" | "admins";

interface Stats {
  mods: number;
  users: number;
  admins: number;
  downloads: number;
  latestMods: { id: string; title: string; slug: string; game: string; downloads: number; createdAt: string; creatorName: string }[];
}

interface AdminMod {
  id: string;
  title: string;
  slug: string;
  game: string;
  subcategory: string;
  downloads: number;
  createdAt: string;
  creatorName: string;
  creatorEmail: string;
  virusChecked: boolean;
  mediaFireUrl: string;
}

interface AdminUser {
  id: string;
  name: string;
  email: string;
  isPremium: boolean;
  createdAt: string;
}

export function AdminPanel() {
  const [tab, setTab] = useState<Tab>("overview");
  const [stats, setStats] = useState<Stats | null>(null);
  const [mods, setMods] = useState<AdminMod[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [admins, setAdmins] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [isOwner, setIsOwner] = useState(false);
  const [editingModId, setEditingModId] = useState<string | null>(null);
  const [editingLink, setEditingLink] = useState("");

  async function loadAll() {
    setLoading(true);
    setError("");
    try {
      const [s, m, u, a] = await Promise.all([
        fetch("/api/admin/stats").then((r) => r.json()),
        fetch("/api/admin/mods").then((r) => r.json()),
        fetch("/api/admin/users").then((r) => r.json()),
        fetch("/api/admin/admins").then((r) => r.json()),
      ]);
      setStats(s.mods !== undefined ? s : null);
      setMods(m.mods ?? []);
      setUsers(u.users ?? []);
      setAdmins(a.admins ?? []);
      setIsOwner((await fetch("/api/admin/me").then((r) => r.json())).owner === true);
    } catch (e) {
      setError("Failed to load admin data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  async function deleteMod(id: string) {
    if (!confirm("Delete this mod permanently?")) return;
    setBusy(true);
    const res = await fetch("/api/admin/mods", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setBusy(false);
    if (res.ok) {
      setMods((prev) => prev.filter((m) => m.id !== id));
      setStats((prev) => (prev ? { ...prev, mods: Math.max(0, prev.mods - 1) } : prev));
    } else {
      const d = await res.json().catch(() => ({}));
      setError(d.error || "Failed to delete mod.");
    }
  }

  function startLinkEdit(mod: AdminMod) {
    setEditingModId(mod.id);
    setEditingLink(mod.mediaFireUrl);
    setError("");
  }

  async function saveMediaFireLink(id: string) {
    const url = editingLink.trim();
    if (!/^https?:\/\//i.test(url) || !/mediafire\.com/i.test(url)) {
      setError("Please enter a valid MediaFire link.");
      return;
    }

    setBusy(true);
    const res = await fetch("/api/admin/mods", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, mediaFireUrl: url }),
    });
    const d = await res.json().catch(() => ({}));
    setBusy(false);

    if (res.ok) {
      setMods((prev) => prev.map((mod) => (mod.id === id ? { ...mod, mediaFireUrl: d.mediaFireUrl ?? url } : mod)));
      setEditingModId(null);
      setEditingLink("");
      setError("");
    } else {
      setError(d.error || "Failed to update MediaFire link.");
    }
  }

  async function deleteUser(id: string) {
    if (!confirm("Delete this user permanently? This cannot be undone.")) return;
    setBusy(true);
    const res = await fetch("/api/admin/users", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setBusy(false);
    if (res.ok) {
      setUsers((prev) => prev.filter((u) => u.id !== id));
      setStats((prev) => (prev ? { ...prev, users: Math.max(0, prev.users - 1) } : prev));
    } else {
      const d = await res.json().catch(() => ({}));
      setError(d.error || "Failed to delete user.");
    }
  }

  async function addAdmin() {
    const email = newAdminEmail.trim();
    if (!email) return;
    setBusy(true);
    const res = await fetch("/api/admin/admins", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setBusy(false);
    const d = await res.json().catch(() => ({}));
    if (res.ok) {
      setAdmins(d.admins ?? [...admins, email.toLowerCase()]);
      setNewAdminEmail("");
      setError("");
    } else {
      setError(d.error || "Failed to add admin.");
    }
  }

  async function removeAdmin(email: string) {
    if (!confirm(`Remove ${email} from admins?`)) return;
    setBusy(true);
    const res = await fetch("/api/admin/admins", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setBusy(false);
    const d = await res.json().catch(() => ({}));
    if (res.ok) {
      setAdmins(d.admins ?? admins.filter((a) => a !== email));
    } else {
      setError(d.error || "Failed to remove admin.");
    }
  }

  const tabs = [
    { id: "overview" as Tab, label: "Overview", icon: LayoutDashboard },
    { id: "mods" as Tab, label: `Mods (${stats?.mods ?? 0})`, icon: Boxes },
    { id: "users" as Tab, label: `Users (${stats?.users ?? 0})`, icon: Users },
    { id: "admins" as Tab, label: "Admins", icon: ShieldCheck },
  ];

  const filteredMods = mods.filter((m) =>
    (m.title + m.game + m.creatorName + m.creatorEmail).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[230px_1fr]">
      <aside className="flex flex-row gap-2 overflow-x-auto pb-2 lg:flex-col lg:pb-0">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors lg:w-full ${
              tab === t.id
                ? "bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <t.icon className="h-4 w-4" />
            {t.label}
          </button>
        ))}
      </aside>

      <section className="min-w-0">
        {error && (
          <div className="mb-4 flex items-center justify-between rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            <span>{error}</span>
            <button onClick={() => setError("")} className="text-red-300 hover:text-white">✕</button>
          </div>
        )}

        {loading ? (
          <p className="flex items-center gap-2 text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading…
          </p>
        ) : (
          <>
            {tab === "overview" && stats && (
              <div>
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                  {[
                    { label: "Total Mods", value: formatNumber(stats.mods), icon: Boxes, color: "text-violet-400" },
                    { label: "Total Users", value: formatNumber(stats.users), icon: Users, color: "text-sky-400" },
                    { label: "Admins", value: formatNumber(stats.admins), icon: ShieldCheck, color: "text-emerald-400" },
                    { label: "Total Downloads", value: formatNumber(stats.downloads), icon: LayoutDashboard, color: "text-fuchsia-400" },
                  ].map(({ label, value, icon: Icon, color }) => (
                    <div key={label} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                      <Icon className={`h-6 w-6 ${color}`} />
                      <p className="mt-3 text-2xl font-extrabold text-white">{value}</p>
                      <p className="text-xs text-slate-500">{label}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-8">
                  <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-white">
                    <Boxes className="h-5 w-5 text-fuchsia-400" /> Latest Uploads
                  </h3>
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/60">
                    {stats.latestMods.length === 0 ? (
                      <p className="p-6 text-sm text-slate-500">No mods yet.</p>
                    ) : (
                      stats.latestMods.map((m) => (
                        <div key={m.id} className="flex items-center justify-between gap-3 border-b border-slate-800 px-4 py-3 last:border-0">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-white">{m.title}</p>
                            <p className="text-xs text-slate-500">
                              {m.game} · by {m.creatorName} · {formatNumber(m.downloads)} downloads
                            </p>
                          </div>
                          <span className="shrink-0 text-xs text-slate-500">{timeAgo(m.createdAt)}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {tab === "mods" && (
              <div>
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-slate-400">{mods.length} mods · search to filter</p>
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search mods…"
                      className="w-full rounded-xl border border-slate-700 bg-slate-800/60 py-2 pl-9 pr-3 text-sm text-white outline-none focus:border-fuchsia-500"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60">
                  {filteredMods.length === 0 ? (
                    <p className="p-6 text-sm text-slate-500">No mods found.</p>
                  ) : (
                    <table className="w-full min-w-[900px] text-left text-sm">
                      <thead>
                        <tr className="border-b border-slate-800 text-xs uppercase tracking-wider text-slate-500">
                          <th className="px-4 py-3">Mod</th>
                          <th className="px-4 py-3">Creator</th>
                          <th className="px-4 py-3">Downloads</th>
                          <th className="px-4 py-3">MediaFire link</th>
                          <th className="px-4 py-3">Uploaded</th>
                          <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredMods.map((m) => (
                          <tr key={m.id} className="border-b border-slate-800/60 last:border-0 hover:bg-slate-800/30">
                            <td className="px-4 py-3">
                              <p className="font-semibold text-white">{m.title}</p>
                              <p className="text-xs text-slate-500">{m.game} · {m.subcategory}</p>
                            </td>
                            <td className="px-4 py-3 text-slate-300">{m.creatorName}</td>
                            <td className="px-4 py-3 text-slate-300">{formatNumber(m.downloads)}</td>
                            <td className="max-w-[280px] px-4 py-3">
                              {editingModId === m.id ? (
                                <div className="flex min-w-[260px] items-center gap-2">
                                  <input
                                    value={editingLink}
                                    onChange={(e) => setEditingLink(e.target.value)}
                                    placeholder="https://www.mediafire.com/file/..."
                                    className="min-w-0 flex-1 rounded-lg border border-slate-700 bg-slate-800/60 px-2.5 py-1.5 text-xs text-white outline-none focus:border-fuchsia-500"
                                    aria-label={`MediaFire link for ${m.title}`}
                                  />
                                  <button
                                    onClick={() => saveMediaFireLink(m.id)}
                                    disabled={busy}
                                    className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-emerald-500/15 px-2.5 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/25 disabled:opacity-40"
                                  >
                                    <Save className="h-3.5 w-3.5" /> Save
                                  </button>
                                </div>
                              ) : (
                                <div className="flex min-w-[220px] items-center gap-2">
                                  {m.mediaFireUrl ? (
                                    <a
                                      href={m.mediaFireUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex min-w-0 items-center gap-1 truncate text-xs text-fuchsia-300 hover:text-fuchsia-200"
                                      title={m.mediaFireUrl}
                                    >
                                      <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                                      <span className="truncate">{m.mediaFireUrl}</span>
                                    </a>
                                  ) : (
                                    <span className="text-xs text-slate-600">No link</span>
                                  )}
                                  <button
                                    onClick={() => startLinkEdit(m)}
                                    disabled={busy}
                                    className="shrink-0 rounded-lg px-2 py-1.5 text-xs font-semibold text-slate-400 hover:bg-slate-800 hover:text-white disabled:opacity-40"
                                  >
                                    Edit
                                  </button>
                                </div>
                              )}
                            </td>
                            <td className="px-4 py-3 text-slate-400">{timeAgo(m.createdAt)}</td>
                            <td className="px-4 py-3">
                              <div className="flex justify-end gap-2">
                                <a href={`/mod/${m.slug}`} className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-700">
                                  View
                                </a>
                                <button
                                  onClick={() => deleteMod(m.id)}
                                  disabled={busy}
                                  className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-red-500/10 hover:text-red-400"
                                  title="Delete mod"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            )}

            {tab === "users" && (
              <div>
                <p className="mb-4 text-sm text-slate-400">{users.length} users</p>
                <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60">
                  {users.length === 0 ? (
                    <p className="p-6 text-sm text-slate-500">No users yet.</p>
                  ) : (
                    <table className="w-full min-w-[500px] text-left text-sm">
                      <thead>
                        <tr className="border-b border-slate-800 text-xs uppercase tracking-wider text-slate-500">
                          <th className="px-4 py-3">User</th>
                          <th className="px-4 py-3">VIP</th>
                          <th className="px-4 py-3">Joined</th>
                          <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((u) => (
                          <tr key={u.id} className="border-b border-slate-800/60 last:border-0 hover:bg-slate-800/30">
                            <td className="px-4 py-3">
                              <p className="font-semibold text-white">{u.name}</p>
                              <p className="text-xs text-slate-500">{u.email}</p>
                            </td>
                            <td className="px-4 py-3">
                              {u.isPremium ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-fuchsia-500/15 px-2 py-0.5 text-xs font-bold text-fuchsia-300">
                                  <Crown className="h-3 w-3" /> VIP
                                </span>
                              ) : (
                                <span className="text-xs text-slate-600">—</span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-slate-400">{timeAgo(u.createdAt)}</td>
                            <td className="px-4 py-3 text-right">
                              <button
                                onClick={() => deleteUser(u.id)}
                                disabled={busy}
                                className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-red-500/10 hover:text-red-400"
                                title="Delete user"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            )}

            {tab === "admins" && (
              <div>
                <p className="mb-4 text-sm text-slate-400">
                  Administrators can access the panel. {isOwner ? "You are the owner and can add/remove admins." : "Only the owner can add or remove admins."}
                </p>

                <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <input
                      value={newAdminEmail}
                      onChange={(e) => setNewAdminEmail(e.target.value)}
                      placeholder="admin@example.com"
                      disabled={!isOwner}
                      className="flex-1 rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-2.5 text-sm text-white outline-none focus:border-fuchsia-500 disabled:opacity-40"
                    />
                    <button
                      onClick={addAdmin}
                      disabled={busy || !isOwner}
                      className="flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-fuchsia-500/25 transition-all hover:brightness-110 disabled:opacity-40"
                    >
                      <Plus className="h-4 w-4" /> Add Admin
                    </button>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/60">
                  {admins.map((email) => (
                    <div key={email} className="flex items-center justify-between gap-3 border-b border-slate-800 px-4 py-3 last:border-0">
                      <span className="flex items-center gap-2 text-sm font-semibold text-white">
                        {email === "pkirtan546@gmail.com" && <Crown className="h-4 w-4 text-amber-400" />}
                        {email}
                        {email === "pkirtan546@gmail.com" && (
                          <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold text-amber-400">OWNER</span>
                        )}
                      </span>
                      <button
                        onClick={() => removeAdmin(email)}
                        disabled={busy || !isOwner || email === "pkirtan546@gmail.com"}
                        className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-red-500/10 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-30"
                        title="Remove admin"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  onClick={loadAll}
                  className="mt-4 flex items-center gap-1.5 text-sm text-slate-400 transition-colors hover:text-white"
                >
                  <RefreshCw className="h-3.5 w-3.5" /> Refresh
                </button>
              </div>
            )}
          </>
        )}

        <div className="mt-8 flex items-center justify-end">
          <a href="/" className="flex items-center gap-1 text-sm text-slate-500 transition-colors hover:text-fuchsia-400">
            Back to site <ChevronRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </section>
    </div>
  );
}