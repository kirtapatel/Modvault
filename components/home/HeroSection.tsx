"use client";

import Link from "next/link";
import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "motion/react";
import { ExternalLink, Zap, Download } from "lucide-react";
import { SearchBar } from "@/components/SearchBar";
import { ShowcaseMount } from "@/components/three/ShowcaseMount";

const quickTags = ["Vehicles", "Shaders", "Quests", "Skins", "Overhaul", "4K", "Weapons"];

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.075, delayChildren: 0.08 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease },
  },
};

const features = [
  {
    icon: ExternalLink,
    title: "Creator-hosted downloads",
    text: "Download buttons open the creator's MediaFire link.",
  },
  {
    icon: Zap,
    title: "Blazing Fast",
    text: "No queues, no throttling — downloads go straight through MediaFire.",
  },
  {
    icon: Download,
    title: "No Paywalls",
    text: "All core mods are free forever.",
  },
];

export function HeroSection() {
  const reducedMotion = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const showcaseY = useTransform(
    scrollYProgress,
    [0, 1],
    [0, reducedMotion ? 0 : -70],
  );

  return (
    <section
      ref={heroRef}
      className="relative overflow-hidden border-b border-white/10 bg-black"
    >
      <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-12 sm:px-6 sm:pt-20">
        <div className="grid items-center gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:gap-4">
          <motion.div
            variants={container}
            initial={reducedMotion ? false : "hidden"}
            animate="show"
            className="text-center lg:text-left"
          >
            <motion.span
              variants={item}
              className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Downloads hosted by creators on MediaFire
            </motion.span>

            <motion.h1
              variants={item}
              className="mt-6 text-4xl font-extrabold leading-[1.02] tracking-tighter text-white sm:text-6xl lg:text-7xl"
            >
              Discover the best{" "}
              <span className="glow-text">game mods</span> on the internet
            </motion.h1>

            <motion.p
              variants={item}
              className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/55 sm:text-lg lg:mx-0"
            >
              Download thousands of mods for GTA 5, Minecraft, Skyrim and more.
              Fast, transparent and always free.
            </motion.p>

            <motion.div
              variants={item}
              className="mx-auto mt-8 max-w-xl lg:mx-0"
            >
              <SearchBar />
            </motion.div>

            <motion.div
              variants={item}
              className="mt-5 flex flex-wrap items-center justify-center gap-2 lg:justify-start"
            >
              {quickTags.map((tag) => (
                <Link
                  key={tag}
                  href={`/search?q=${encodeURIComponent(tag)}`}
                  className="rounded-full border border-white/10 bg-white/[0.035] px-3.5 py-1.5 text-xs font-medium text-white/60 backdrop-blur transition-all duration-300 hover:border-brand/50 hover:bg-brand/10 hover:text-brand"
                >
                  {tag}
                </Link>
              ))}
            </motion.div>

            <motion.p
              variants={item}
              className="mt-5 hidden items-center gap-2 text-xs text-white/40 lg:flex"
            >
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-bright" />
              Hover the core to open the spatial vault
            </motion.p>
          </motion.div>

          <motion.div
            style={{ y: showcaseY }}
            initial={reducedMotion ? false : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.18, ease }}
            className="relative"
          >
            <div className="pointer-events-none absolute left-1/2 top-2 z-10 -translate-x-1/2 rounded-full border border-brand/30 bg-black/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-brand backdrop-blur">
              Vault Core 07
            </div>
            <ShowcaseMount />
          </motion.div>
        </div>

        <motion.div
          initial={reducedMotion ? false : "hidden"}
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          variants={container}
          className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3"
        >
          {features.map(({ icon: Icon, title, text }) => (
            <motion.div
              key={title}
              variants={item}
              className="glass-panel rounded-2xl p-5 text-center transition-all duration-300 hover:border-brand/40"
            >
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl border border-brand/25 bg-brand/10">
                <Icon className="h-5 w-5 text-brand-bright" />
              </div>
              <h3 className="mt-3 font-display font-bold text-white">{title}</h3>
              <p className="mt-1 text-sm text-white/45">{text}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
