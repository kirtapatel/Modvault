"use client";

import { useRef, type PointerEvent, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useMediaQuery, useReducedMotion } from "@/lib/useMediaQuery";

const tiltSpring = { stiffness: 220, damping: 20, mass: 0.55 };
const magnetSpring = { stiffness: 170, damping: 18, mass: 0.6 };

export function TiltCard({
  children,
  className = "",
  maxTilt = 7,
  magneticStrength = 6,
}: {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
  magneticStrength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const canHover = useMediaQuery("(hover: hover) and (pointer: fine)");
  const enabled = canHover && !reducedMotion;

  const rotateX = useSpring(useMotionValue(0), tiltSpring);
  const rotateY = useSpring(useMotionValue(0), tiltSpring);
  const translateX = useSpring(useMotionValue(0), magnetSpring);
  const translateY = useSpring(useMotionValue(0), magnetSpring);

  const handleMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!enabled || event.pointerType === "touch") return;

    const element = ref.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    element.style.setProperty("--mx", `${x * 100}%`);
    element.style.setProperty("--my", `${y * 100}%`);

    rotateX.set((0.5 - y) * maxTilt * 2);
    rotateY.set((x - 0.5) * maxTilt * 2);
    translateX.set((x - 0.5) * magneticStrength * 2);
    translateY.set((y - 0.5) * magneticStrength * 2);
  };

  const handleLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    translateX.set(0);
    translateY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={`tilt-card ${className}`}
      style={{
        rotateX,
        rotateY,
        x: translateX,
        y: translateY,
        transformPerspective: 1000,
        transformStyle: "preserve-3d",
      }}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      onPointerCancel={handleLeave}
    >
      <div className="relative z-[1] h-full" style={{ transformStyle: "preserve-3d" }}>
        {children}
      </div>
    </motion.div>
  );
}
