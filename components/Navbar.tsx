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

export function Navbar() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-80">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-lg shadow-fuchsia-500/30">
            <Boxes className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-extrabold tracking-tight">
            <span className="text-white">Mod</span>
            <span className="glow-text">Vault</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-300 md:flex">
          <Link href="/" className="transition-colors hover:text-fuchsia-400">Home</Link>
          <Link href="/games/gtav" className="transition-colors hover:text-fuchsia-400">GTA 5</Link>
          <Link href="/games/minecraft" className="transition-colors hover:text-fuchsia-400">Minecraft</Link>
          <Link href="/games/skyrim" className="transition-colors hover:text-fuchsia-400">Skyrim</Link>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/upload"
            className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-violet-500 to-fuchsia-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/25 transition-all hover:brightness-110"
          >
            <Upload className="h-4 w-4" />
            Upload Mod
          </Link>
          {status === "authenticated" && session.user ? (
            <div className="flex items-center gap-2">
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 rounded-lg border border-slate-700 px-3 py-2 text-sm font-medium transition-colors hover:border-fuchsia-500/60 hover:text-white"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex items-center rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-500/10 hover:text-red-400"
                title="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {status === "loading" ? (
                <User className="h-5 w-5 text-slate-500" />
              ) : (
                <>
                  <Link
                    href="/login"
                    className="flex items-center gap-1.5 rounded-lg border border-slate-700 px-3 py-2 text-sm font-medium transition-colors hover:border-violet-500/60 hover:text-white"
                  >
                    <LogIn className="h-4 w-4" />
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/20"
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
          className="rounded-lg p-2 text-slate-300 hover:bg-slate-800 md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-800 bg-slate-950 px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3 text-sm font-medium text-slate-200">
            <Link href="/" onClick={() => setOpen(false)}>Home</Link>
            <Link href="/games/gtav" onClick={() => setOpen(false)}>GTA 5</Link>
            <Link href="/games/minecraft" onClick={() => setOpen(false)}>Minecraft</Link>
            <Link href="/games/skyrim" onClick={() => setOpen(false)}>Skyrim</Link>
            <Link href="/upload" onClick={() => setOpen(false)} className="mt-1 text-fuchsia-400">Upload Mod</Link>
            {status === "authenticated" ? (
              <>
                <Link href="/dashboard" onClick={() => setOpen(false)}>Dashboard</Link>
                <button onClick={() => signOut({ callbackUrl: "/" })} className="text-left text-red-400">
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setOpen(false)}>Sign In</Link>
                <Link href="/register" onClick={() => setOpen(false)}>Register</Link>
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