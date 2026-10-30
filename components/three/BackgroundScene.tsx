"use client";

import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { useIsMobile } from "@/lib/useMediaQuery";
import { Starfield } from "./Starfield";

export function BackgroundScene() {
  const mobile = useIsMobile();
  const [active, setActive] = useState(true);

  useEffect(() => {
    const onVisibilityChange = () => setActive(!document.hidden);

    document.addEventListener("visibilitychange", onVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", onVisibilityChange);
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
    >
      <Canvas
        dpr={[1, mobile ? 1.25 : 1.6]}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: "high-performance",
        }}
        camera={{ position: [0, 0, 8], fov: 60 }}
        frameloop={active ? "always" : "never"}
        style={{ pointerEvents: "none", touchAction: "none" }}
        onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      >
        <Starfield />
      </Canvas>
    </div>
  );
}
