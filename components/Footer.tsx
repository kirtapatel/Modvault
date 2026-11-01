import Link from "next/link";
import { Boxes, Globe, MessageCircle, Mail, Heart } from "lucide-react";
import { AdBanner } from "./AdBanner";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-white/10 bg-black">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="py-4">
          <AdBanner variant="leaderboard" />
        </div>
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-brand/30 bg-gradient-to-br from-brand to-brand-deep">
                <Boxes className="h-4 w-4 text-white" />
              </div>
              <span className="font-display text-lg font-extrabold tracking-tight">
                <span className="text-white">Mod</span>
                <span className="text-brand-bright">Vault</span>
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-white/45">
              The safest place to discover, share and download mods for your
              favorite games.
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-white/35">
              Platform
            </h4>
            <ul className="space-y-2 text-sm text-white/50">
              <li>
                <Link href="/upload" className="transition-colors hover:text-brand-bright">
                  Upload a Mod
                </Link>
              </li>
              <li>
                <Link href="/games/gtav" className="transition-colors hover:text-brand-bright">
                  GTA 5 Mods
                </Link>
              </li>
              <li>
                <Link href="/games/minecraft" className="transition-colors hover:text-brand-bright">
                  Minecraft Mods
                </Link>
              </li>
              <li>
                <Link href="/games/skyrim" className="transition-colors hover:text-brand-bright">
                  Skyrim Mods
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-white/35">
              Creators
            </h4>
            <ul className="space-y-2 text-sm text-white/50">
              <li>
                <Link href="/register" className="transition-colors hover:text-brand-bright">
                  Become a Creator
                </Link>
              </li>
              <li>
                <Link href="/upload" className="transition-colors hover:text-brand-bright">
                  Creator Guide
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="transition-colors hover:text-brand-bright">
                  Creator Dashboard
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-white/35">
              Connect
            </h4>
            <div className="flex gap-3">
              <a
                href="#"
                className="rounded-xl border border-white/10 p-2 text-white/40 transition-colors hover:border-brand/50 hover:text-brand-bright"
              >
                <Globe className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="rounded-xl border border-white/10 p-2 text-white/40 transition-colors hover:border-brand/50 hover:text-brand-bright"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="rounded-xl border border-white/10 p-2 text-white/40 transition-colors hover:border-brand/50 hover:text-brand-bright"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-sm text-white/30 sm:flex-row">
          <p>© {new Date().getFullYear()} ModVault. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="h-3.5 w-3.5 fill-brand text-brand" /> for
            the modding community.
          </p>
        </div>
      </div>
    </footer>
  );
}
