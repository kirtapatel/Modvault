"use client";

import { useEffect, useState } from "react";
import { Timer } from "lucide-react";

export function Countdown({ seconds, onComplete }: { seconds: number; onComplete: () => void }) {
  const [remaining, setRemaining] = useState(seconds);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (remaining <= 0) {
      if (!done) {
        setDone(true);
        onComplete();
      }
      return;
    }
    const t = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(t);
  }, [remaining, done, onComplete]);

  const pct = ((seconds - remaining) / seconds) * 100;

  return (
    <div className="flex items-center gap-4">
      <div className="relative flex h-20 w-20 items-center justify-center">
        <svg className="h-20 w-20 -rotate-90" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="34" fill="none" stroke="#1e293b" strokeWidth="6" />
          <circle
            cx="40"
            cy="40"
            r="34"
            fill="none"
            stroke="url(#countdownGrad)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 34}
            strokeDashoffset={2 * Math.PI * 34 * (1 - pct / 100)}
          />
          <defs>
            <linearGradient id="countdownGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#d946ef" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute flex flex-col items-center">
          <Timer className="mb-0.5 h-3 w-3 text-fuchsia-400" />
          <span className="text-2xl font-extrabold text-white">{remaining}</span>
        </div>
      </div>
      <div>
        <p className="text-sm font-semibold text-white">
          {done ? "Your download is starting…" : "Your download starts in"}
        </p>
        <p className="text-xs text-slate-400">Please wait for the countdown to finish.</p>
      </div>
    </div>
  );
}