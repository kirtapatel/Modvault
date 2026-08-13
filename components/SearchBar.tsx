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
      className={`flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3 shadow-2xl shadow-violet-900/20 backdrop-blur transition-colors focus-within:border-fuchsia-500 ${className}`}
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
    >
      <Search className="h-5 w-5 shrink-0 text-fuchsia-400" />
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search mods, e.g. 'Realistic Vehicle Pack'..."
        className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
      />
      <button
        type="submit"
        className="rounded-lg bg-gradient-to-r from-violet-500 to-fuchsia-500 px-4 py-1.5 text-sm font-semibold text-white transition-all hover:brightness-110"
      >
        Search
      </button>
    </form>
  );
}