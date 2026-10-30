"use client";

import { useEffect, useRef, type PointerEvent, type ReactNode } from "react";
import { useMediaQuery, useReducedMotion } from "@/lib/useMediaQuery";

export function TiltCard({
  children,
  className = "",
  maxTilt = 7,
}: {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef<number | null>(null);
  const reducedMotion = useReducedMotion();
  const canHover = useMediaQuery("(hover: hover) and (pointer: fine)");
  const enabled = canHover && !reducedMotion;

  useEffect(() => {
    return () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, []);

  const handleMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!enabled || event.pointerType === "touch") return;

    const element = ref.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    if (frame.current !== null) cancelAnimationFrame(frame.current);

    frame.current = requestAnimationFrame(() => {
      element.style.setProperty("--mx", `${x * 100}%`);
      element.style.setProperty("--my", `${y * 100}%`);
      element.style.setProperty("--rx", `${(0.5 - y) * maxTilt * 2}deg`);
      element.style.setProperty("--ry", `${(x - 0.5) * maxTilt * 2}deg`);
    });
  };

  const handleLeave = () => {
    if (frame.current !== null) {
      cancelAnimationFrame(frame.current);
      frame.current = null;
    }

    const element = ref.current;
    if (!element) return;

    element.style.setProperty("--rx", "0deg");
    element.style.setProperty("--ry", "0deg");
  };

  return (
    <div
      ref={ref}
      className={`tilt-card ${className}`}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      onPointerCancel={handleLeave}
    >
      <div className="tilt-card-inner">{children}</div>
    </div>
  );
}
