"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import {
  Boxes,
  Upload,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  X,
  User,
  ShieldCheck,
} from "lucide-react";
import { AdBanner } from "./AdBanner";
import { SpringLink } from "@/components/motion/SpringLink";

export function Navbar() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/75 backdrop-blur-2xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-brand/30 bg-gradient-to-br from-brand to-brand-deep shadow-[0_0_24px_-8px_rgba(191,68,23,0.8)]">
            <Boxes className="h-5 w-5 text-white" />
          </div>
          <span className="font-display text-xl font-extrabold tracking-tight">
            <span className="text-white">Mod</span>
            <span className="text-brand-bright">Vault</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-white/55 md:flex">
          <Link href="/" className="transition-colors hover:text-brand-bright">
            Home
          </Link>
          <Link
            href="/games/gtav"
            className="transition-colors hover:text-brand-bright"
          >
            GTA 5
          </Link>
          <Link
            href="/games/minecraft"
            className="transition-colors hover:text-brand-bright"
          >
            Minecraft
          </Link>
          <Link
            href="/games/skyrim"
            className="transition-colors hover:text-brand-bright"
          >
            Skyrim
          </Link>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <SpringLink
            href="/upload"
            wrapperClassName="inline-flex"
            className="flex items-center gap-1.5 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white shadow-[0_0_26px_-10px_rgba(191,68,23,0.95)] transition-colors hover:bg-brand-hover"
          >
            <Upload className="h-4 w-4" />
            Upload Mod
          </SpringLink>
          {status === "authenticated" && session.user ? (
            <div className="flex items-center gap-2">
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 rounded-xl border border-white/15 px-3 py-2 text-sm font-medium text-white/70 transition-colors hover:border-brand/50 hover:text-white"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex items-center rounded-xl p-2 text-white/40 transition-colors hover:bg-red-500/10 hover:text-red-400"
                title="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {status === "loading" ? (
                <User className="h-5 w-5 text-white/30" />
              ) : (
                <>
                  <Link
                    href="/login"
                    className="flex items-center gap-1.5 rounded-xl border border-white/15 px-3 py-2 text-sm font-medium text-white/70 transition-colors hover:border-brand/50 hover:text-white"
                  >
                    <LogIn className="h-4 w-4" />
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="flex items-center gap-1.5 rounded-xl border border-brand/20 bg-brand/10 px-3 py-2 text-sm font-semibold text-brand-bright transition-colors hover:bg-brand/20"
                  >
                    <ShieldCheck className="h-4 w-4" />
                    Register
                  </Link>
                </>
              )}
            </div>
          )}
        </div>

        <button
          className="rounded-lg p-2 text-white/60 transition-colors hover:bg-white/5 md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-[#050505] px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3 text-sm font-medium text-white/70">
            <Link href="/" onClick={() => setOpen(false)}>
              Home
            </Link>
            <Link href="/games/gtav" onClick={() => setOpen(false)}>
              GTA 5
            </Link>
            <Link href="/games/minecraft" onClick={() => setOpen(false)}>
              Minecraft
            </Link>
            <Link href="/games/skyrim" onClick={() => setOpen(false)}>
              Skyrim
            </Link>
            <Link
              href="/upload"
              onClick={() => setOpen(false)}
              className="mt-1 font-semibold text-brand-bright"
            >
              Upload Mod
            </Link>
            {status === "authenticated" ? (
              <>
                <Link href="/dashboard" onClick={() => setOpen(false)}>
                  Dashboard
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-left text-red-400"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setOpen(false)}>
                  Sign In
                </Link>
                <Link href="/register" onClick={() => setOpen(false)}>
                  Register
                </Link>
              </>
            )}
          </nav>
          <div className="mt-4">
            <AdBanner variant="mobile" />
          </div>
        </div>
      )}
    </header>
  );
}
