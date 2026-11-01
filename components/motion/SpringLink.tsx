"use client";

import Link from "next/link";
import { motion } from "motion/react";
import type { ReactNode } from "react";

const spring = {
  type: "spring" as const,
  stiffness: 420,
  damping: 28,
  mass: 0.6,
};

export function SpringLink({
  href,
  children,
  className = "",
  wrapperClassName = "inline-flex",
}: {
  href: string;
  children: ReactNode;
  className?: string;
  wrapperClassName?: string;
}) {
  return (
    <motion.div
      className={wrapperClassName}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.955 }}
      transition={spring}
    >
      <Link href={href} className={className}>
        {children}
      </Link>
    </motion.div>
  );
}
