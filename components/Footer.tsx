import Link from "next/link";
import { Boxes, Globe, MessageCircle, Mail, Heart } from "lucide-react";
import { AdBanner } from "./AdBanner";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-800 bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="py-4">
          <AdBanner variant="leaderboard" />
        </div>
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500">
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
              <li><Link href="/upload" className="hover:text-fuchsia-400">Upload a Mod</Link></li>
              <li><Link href="/games/gtav" className="hover:text-fuchsia-400">GTA 5 Mods</Link></li>
              <li><Link href="/games/minecraft" className="hover:text-fuchsia-400">Minecraft Mods</Link></li>
              <li><Link href="/games/skyrim" className="hover:text-fuchsia-400">Skyrim Mods</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-300">Creators</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link href="/register" className="hover:text-fuchsia-400">Become a Creator</Link></li>
              <li><Link href="/upload" className="hover:text-fuchsia-400">Creator Guide</Link></li>
              <li><Link href="/dashboard" className="hover:text-fuchsia-400">Creator Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-300">Connect</h4>
            <div className="flex gap-3">
              <a href="#" className="rounded-lg border border-slate-700 p-2 text-slate-400 transition-colors hover:border-fuchsia-500/60 hover:text-fuchsia-400">
                <Globe className="h-4 w-4" />
              </a>
              <a href="#" className="rounded-lg border border-slate-700 p-2 text-slate-400 transition-colors hover:border-fuchsia-500/60 hover:text-fuchsia-400">
                <MessageCircle className="h-4 w-4" />
              </a>
              <a href="#" className="rounded-lg border border-slate-700 p-2 text-slate-400 transition-colors hover:border-fuchsia-500/60 hover:text-fuchsia-400">
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-slate-800 pt-6 text-sm text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} ModVault. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="h-3.5 w-3.5 fill-fuchsia-500 text-fuchsia-500" /> for the modding community.
          </p>
        </div>
      </div>
    </footer>
  );
}