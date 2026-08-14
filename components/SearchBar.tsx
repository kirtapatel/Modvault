"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";

export function SearchBar({ className = "" }: { className?: string }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (submitted) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitted]);

  return (
    <form
      className={`flex items-center gap-2 rounded-2xl border border-white/10 bg-[#161d26]/80 px-4 py-3 shadow-2xl shadow-black/30 backdrop-blur transition-colors focus-within:border-brand ${className}`}
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
    >
      <Search className="h-5 w-5 shrink-0 text-brand" />
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search mods, e.g. 'Realistic Vehicle Pack'..."
        className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
      />
      <kbd className="hidden shrink-0 rounded-md border border-white/10 bg-slate-800/80 px-1.5 py-0.5 font-sans text-[10px] font-semibold text-slate-400 sm:block">
        Ctrl K
      </kbd>
      <button
        type="submit"
        className="rounded-lg bg-gradient-to-r from-brand to-brand-hover px-4 py-1.5 text-sm font-semibold text-white transition-all hover:shadow-[0_0_20px_rgba(27,217,106,0.4)]"
      >
        Search
      </button>
    </form>
  );
}