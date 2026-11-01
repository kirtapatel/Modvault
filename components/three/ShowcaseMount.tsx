"use client";

import dynamic from "next/dynamic";

const ShowcaseScene = dynamic(
  () => import("./ShowcaseScene").then((mod) => ({ default: mod.ShowcaseScene })),
  {
    ssr: false,
    loading: () => (
      <div className="relative h-[330px] w-full sm:h-[430px] lg:h-[520px]">
        <div className="absolute inset-x-12 top-1/2 h-44 -translate-y-1/2 animate-pulse rounded-full bg-brand/10 blur-[80px]" />
        <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-brand/20" />
      </div>
    ),
  },
);

export function ShowcaseMount() {
  return <ShowcaseScene />;
}
