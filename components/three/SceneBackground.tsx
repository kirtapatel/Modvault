"use client";

import dynamic from "next/dynamic";

const BackgroundScene = dynamic(
  () =>
    import("./BackgroundScene").then((mod) => ({
      default: mod.BackgroundScene,
    })),
  { ssr: false, loading: () => null },
);

export function SceneBackground() {
  return <BackgroundScene />;
}
