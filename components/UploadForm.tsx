"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  UploadCloud,
  Link2,
  Plus,
  X,
  CheckCircle2,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { GAMES } from "@/lib/types";

type Step = 1 | 2 | 3;

interface PendingFile {
  name: string;
  url: string;
  size: number;
  version: string;
  gameVersion: string;
}

export function UploadForm() {
  const { status } = useSession();
  const router = useRouter();

  const [step, setStep] = useState<Step>(1);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successUrl, setSuccessUrl] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [gameSlug, setGameSlug] = useState("gtav");
  const [subcategory, setSubcategory] = useState(GAMES[0].subcategories[0]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [gameVersion, setGameVersion] = useState("Any");

  const [files, setFiles] = useState<PendingFile[]>([]);
  const [newLink, setNewLink] = useState("");
  const [newLinkName, setNewLinkName] = useState("");
  const [newLinkSize, setNewLinkSize] = useState("");
  const [newLinkVersion, setNewLinkVersion] = useState("");

  const game = GAMES.find((g) => g.slug === gameSlug) ?? GAMES[0];

  if (status === "loading") {
    return <p className="text-center text-slate-500">Checking your session…</p>;
  }

  if (status === "unauthenticated") {
    return (
      <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-12 text-center">
        <UploadCloud className="mx-auto h-12 w-12 text-slate-600" />
        <h2 className="mt-4 text-xl font-bold text-white">You must be signed in to upload</h2>
        <p className="mt-1 text-sm text-slate-400">Create a free creator account to start sharing mods.</p>
        <Link href="/register" className="mt-5 inline-block rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-6 py-3 font-bold text-white shadow-lg shadow-fuchsia-500/25 hover:brightness-110">
          Create an Account
        </Link>
      </div>
    );
  }

  function toggleTag(tag: string) {
    setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  }

  function addTag() {
    const t = tagInput.trim().toLowerCase();
    if (t && !tags.includes(t)) setTags((prev) => [...prev, t]);
    setTagInput("");
  }

  function addLink() {
    const url = newLink.trim();
    if (!url) return;
    if (!/^https?:\/\//i.test(url)) {
      setError("Please enter a full link starting with http:// or https://");
      return;
    }
    if (!/mediafire\.com/i.test(url)) {
      setError("Please paste a MediaFire share link (mediafire.com).");
      return;
    }
    const name = newLinkName.trim() || `Mod file ${files.length + 1}.zip`;
    const sizeBytes = newLinkSize.trim() ? Number(newLinkSize.trim()) * 1024 * 1024 : 0;
    setFiles((prev) => [
      ...prev,
      {
        name,
        url,
        size: sizeBytes,
        version: newLinkVersion.trim() || "1.0",
        gameVersion: "Any",
      },
    ]);
    setNewLink("");
    setNewLinkName("");
    setNewLinkSize("");
    setNewLinkVersion("");
    setError("");
  }

  async function submit() {
    setError("");
    setSubmitting(true);
    try {
      if (files.length === 0) throw new Error("Please add at least one MediaFire link.");
      if (!summary.trim()) throw new Error("A short summary is required.");
      if (!description.trim()) throw new Error("A description is required.");

      const invalid = files.find((f) => !f.url || !/^https?:\/\//i.test(f.url));
      if (invalid) throw new Error(`Invalid link for "${invalid.name}". Links must start with http:// or https://`);

      const modResponse = await fetch("/api/mods", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          summary: summary.trim(),
          description,
          game: game.name,
          gameSlug,
          subcategory,
          tags,
          files: files.map((f) => ({
            version: f.version ?? "1.0",
            gameVersion: f.gameVersion ?? gameVersion,
            key: "",
            url: f.url ?? "",
            sizeBytes: f.size ?? 0,
          })),
          thumbnailUrl: "",
        }),
      });
      const modData = await modResponse.json();
      if (!modResponse.ok) throw new Error(modData.error || "Failed to create mod.");

      setSuccessUrl(modData.mod.slug);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  if (successUrl) {
    return (
      <div className="rounded-3xl border border-emerald-500/40 bg-emerald-500/10 p-12 text-center">
        <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-400" />
        <h2 className="mt-4 text-2xl font-extrabold text-white">Mod published!</h2>
        <p className="mt-2 text-sm text-slate-400">Your mod is now live on ModVault.</p>
        <Link href={`/mod/${successUrl}`} className="mt-6 inline-block rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-6 py-3 font-bold text-white shadow-lg shadow-fuchsia-500/25 hover:brightness-110">
          View your mod
        </Link>
      </div>
    );
  }

  const canNext1 = title.trim().length > 0;
  const canNext2 = canNext1 && summary.trim().length > 0 && description.trim().length > 0;

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8">
      <div className="mb-8 flex items-center justify-between">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex flex-1 items-center">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                step >= s ? "bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white" : "bg-slate-800 text-slate-500"
              }`}
            >
              {s}
            </div>
            {s < 3 && <div className={`mx-2 h-0.5 flex-1 rounded ${step > s ? "bg-fuchsia-500" : "bg-slate-800"}`} />}
          </div>
        ))}
      </div>

      {error && (
        <div className="mb-5 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {step === 1 && (
        <div className="space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-300">Mod title *</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Realistic Vehicle Pack"
              className="w-full rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-3 text-sm text-white outline-none focus:border-fuchsia-500"
            />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-300">Game *</label>
              <select
                value={gameSlug}
                onChange={(e) => { setGameSlug(e.target.value); setSubcategory(GAMES.find((g) => g.slug === e.target.value)?.subcategories[0] ?? ""); }}
                className="w-full rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-3 text-sm text-white outline-none focus:border-fuchsia-500"
              >
                {GAMES.map((g) => (
                  <option key={g.slug} value={g.slug}>{g.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-300">Category *</label>
              <select
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-3 text-sm text-white outline-none focus:border-fuchsia-500"
              >
                {game.subcategories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-300">Tags</label>
            <div className="flex flex-wrap gap-2">
              {game.subcategories.concat(["4K", "Performance", "Realistic", "New", "Bugfix"]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => toggleTag(t)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                    tags.includes(t) ? "border-fuchsia-500 bg-fuchsia-500/20 text-fuchsia-300" : "border-slate-700 text-slate-400 hover:border-fuchsia-500/60"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="mt-2 flex gap-2">
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
                placeholder="Add custom tag…"
                className="flex-1 rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-2 text-sm text-white outline-none focus:border-fuchsia-500"
              />
              <button type="button" onClick={addTag} className="rounded-xl bg-slate-800 px-4 text-sm font-semibold text-white hover:bg-slate-700">Add</button>
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-300">Short summary *</label>
            <input
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              maxLength={300}
              placeholder="One or two sentences describing your mod…"
              className="w-full rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-3 text-sm text-white outline-none focus:border-fuchsia-500"
            />
            <p className="mt-1 text-right text-xs text-slate-500">{summary.length}/300</p>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-300">Description (Markdown supported) *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={10}
              placeholder={"## Overview\n\nDescribe your mod…\n\n## Features\n\n- Feature 1\n- Feature 2\n\n## Installation\n\n1. Step\n2. Step"}
              className="w-full resize-y rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-3 font-mono text-sm text-white outline-none focus:border-fuchsia-500"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-300">Game version compatibility</label>
            <input
              value={gameVersion}
              onChange={(e) => setGameVersion(e.target.value)}
              placeholder="e.g. 1.0.2944 or Any"
              className="w-full rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-3 text-sm text-white outline-none focus:border-fuchsia-500"
            />
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-5">
          <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950/50 px-4 py-3 text-sm text-slate-300">
            <UploadCloud className="h-5 w-5 shrink-0 text-fuchsia-400" />
            Upload your file to{" "}
            <a href="https://www.mediafire.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-fuchsia-400 hover:text-fuchsia-300">
              MediaFire <ExternalLink className="inline h-3 w-3" />
            </a>
            , copy the share link, then paste it below.
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <label className="mb-1.5 block text-sm font-semibold text-slate-300">MediaFire file link *</label>
            <input
              value={newLink}
              onChange={(e) => setNewLink(e.target.value)}
              placeholder="https://www.mediafire.com/file/..."
              className="w-full rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-3 text-sm text-white outline-none focus:border-fuchsia-500"
            />
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-400">File name</label>
                <input
                  value={newLinkName}
                  onChange={(e) => setNewLinkName(e.target.value)}
                  placeholder="my-mod.zip"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800/60 px-3 py-2 text-sm text-white outline-none focus:border-fuchsia-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-400">Size (MB)</label>
                <input
                  value={newLinkSize}
                  onChange={(e) => setNewLinkSize(e.target.value)}
                  placeholder="e.g. 120"
                  type="number"
                  min="0"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800/60 px-3 py-2 text-sm text-white outline-none focus:border-fuchsia-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-400">Version</label>
                <input
                  value={newLinkVersion}
                  onChange={(e) => setNewLinkVersion(e.target.value)}
                  placeholder="1.0"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800/60 px-3 py-2 text-sm text-white outline-none focus:border-fuchsia-500"
                />
              </div>
            </div>
            <button
              onClick={addLink}
              className="mt-3 flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-fuchsia-500/25 transition-all hover:brightness-110"
            >
              <Plus className="h-4 w-4" />
              Add Link
            </button>
          </div>

          {files.length > 0 && (
            <ul className="space-y-2">
              {files.map((f) => (
                <li key={f.url} className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-2.5">
                  <div className="min-w-0">
                    <span className="flex items-center gap-2 text-sm text-slate-300">
                      <Link2 className="h-4 w-4 shrink-0 text-violet-400" />
                      <span className="truncate">{f.name}</span>
                    </span>
                    <a href={f.url} target="_blank" rel="noopener noreferrer" className="mt-0.5 block truncate text-xs text-slate-500 hover:text-fuchsia-400">
                      {f.url}
                    </a>
                  </div>
                  <div className="flex shrink-0 items-center gap-2 pl-3">
                    <span className="text-xs text-slate-500">
                      {f.size ? `${(f.size / 1024 / 1024).toFixed(1)} MB` : "size n/a"} · v{f.version}
                    </span>
                    <button onClick={() => setFiles((prev) => prev.filter((x) => x.url !== f.url))} className="text-slate-500 hover:text-red-400">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
            <ShieldCheck className="h-5 w-5 shrink-0" />
            Visitors are redirected to MediaFire after the download countdown.
          </div>
        </div>
      )}

      <div className="mt-8 flex items-center justify-between border-t border-slate-800 pt-6">
        <button
          onClick={() => setStep((s) => (s > 1 ? (s - 1) as Step : s))}
          disabled={step === 1}
          className="flex items-center gap-1 rounded-xl border border-slate-700 px-5 py-2.5 text-sm font-semibold text-slate-300 transition-colors hover:border-slate-500 disabled:opacity-30"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </button>
        {step < 3 ? (
          <button
            onClick={() => { setError(""); if (step === 1 && !canNext1) { setError("Give your mod a title to continue."); return; } if (step === 2 && !canNext2) { setError("Summary and description are required."); return; } setStep((s) => (s + 1) as Step); }}
            className="flex items-center gap-1 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-fuchsia-500/25 transition-all hover:brightness-110"
          >
            Continue
            <ChevronRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            onClick={submit}
            disabled={submitting}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/25 transition-all hover:brightness-110 disabled:opacity-50"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
            {submitting ? "Publishing…" : "Publish Mod"}
          </button>
        )}
      </div>
    </div>
  );
}