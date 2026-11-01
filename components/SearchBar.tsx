"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Search } from "lucide-react";

const pressSpring = {
  type: "spring" as const,
  stiffness: 520,
  damping: 24,
  mass: 0.5,
};

export function SearchBar({ className = "" }: { className?: string }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (submitted) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitted]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
        return;
      }

      if (
        event.key === "Escape" &&
        document.activeElement === inputRef.current
      ) {
        inputRef.current?.blur();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <motion.form
      className={`glass-card flex items-center gap-2 rounded-2xl px-4 py-3 shadow-2xl shadow-black/30 transition-colors duration-300 focus-within:border-brand/60 focus-within:shadow-[0_0_36px_-10px_rgba(191,68,23,0.65)] ${className}`}
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
      whileTap={reducedMotion ? undefined : { scale: 0.992 }}
      transition={pressSpring}
    >
      <Search className="h-5 w-5 shrink-0 text-brand-bright" />
      <input
        ref={inputRef}
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search mods, e.g. 'Realistic Vehicle Pack'..."
        aria-label="Search mods"
        autoComplete="off"
        className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/30"
      />
      <kbd className="hidden shrink-0 rounded-md border border-white/10 bg-white/[0.04] px-1.5 py-0.5 font-sans text-[10px] font-semibold text-white/40 sm:block">
        Ctrl K
      </kbd>
      <motion.button
        type="submit"
        className="rounded-lg bg-brand px-4 py-1.5 text-sm font-semibold text-white shadow-[0_0_22px_-8px_rgba(191,68,23,0.9)] transition-colors hover:bg-brand-hover"
        whileHover={reducedMotion ? undefined : { y: -1 }}
        whileTap={reducedMotion ? undefined : { scale: 0.93 }}
        transition={pressSpring}
      >
        Search
      </motion.button>
    </motion.form>
  );
}
