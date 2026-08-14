import Link from "next/link";
import { Boxes, Globe, MessageCircle, Mail, Heart } from "lucide-react";
import { AdBanner } from "./AdBanner";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-white/10 bg-[#12181f]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="py-4">
          <AdBanner variant="leaderboard" />
        </div>
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand to-brand-hover">
                <Boxes className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-extrabold">
                <span className="text-white">Mod</span>
                <span className="glow-text">Vault</span>
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              The safest place to discover, share and download mods for your favorite games.
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-300">Platform</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link href="/upload" className="hover:text-brand">Upload a Mod</Link></li>
              <li><Link href="/games/gtav" className="hover:text-brand">GTA 5 Mods</Link></li>
              <li><Link href="/games/minecraft" className="hover:text-brand">Minecraft Mods</Link></li>
              <li><Link href="/games/skyrim" className="hover:text-brand">Skyrim Mods</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-300">Creators</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link href="/register" className="hover:text-brand">Become a Creator</Link></li>
              <li><Link href="/upload" className="hover:text-brand">Creator Guide</Link></li>
              <li><Link href="/dashboard" className="hover:text-brand">Creator Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-300">Connect</h4>
            <div className="flex gap-3">
              <a href="#" className="rounded-lg border border-white/10 p-2 text-slate-400 transition-colors hover:border-brand/60 hover:text-brand">
                <Globe className="h-4 w-4" />
              </a>
              <a href="#" className="rounded-lg border border-white/10 p-2 text-slate-400 transition-colors hover:border-brand/60 hover:text-brand">
                <MessageCircle className="h-4 w-4" />
              </a>
              <a href="#" className="rounded-lg border border-white/10 p-2 text-slate-400 transition-colors hover:border-brand/60 hover:text-brand">
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-sm text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} ModVault. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="h-3.5 w-3.5 fill-brand text-brand" /> for the modding community.
          </p>
        </div>
      </div>
    </footer>
  );
}