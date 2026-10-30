"use client";

import dynamic from "next/dynamic";

const VaultScene = dynamic(
  () => import("./VaultScene").then((mod) => ({ default: mod.VaultScene })),
  {
    ssr: false,
    loading: () => (
      <div className="relative h-[320px] w-full sm:h-[420px] lg:h-[500px]">
        <div className="absolute inset-x-10 top-1/2 h-52 -translate-y-1/2 animate-pulse rounded-full bg-brand/10 blur-3xl" />
      </div>
    ),
  },
);

export function VaultMount() {
  return <VaultScene />;
}
