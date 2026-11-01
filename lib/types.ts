export interface Creator {
  id: string;
  name: string;
  avatar: string | null;
  bio: string | null;
  koFi: string | null;
  patreon: string | null;
}

export interface ModFile {
  id: string;
  version: string;
  gameVersion: string;
  url: string;
  sizeBytes: number;
}

export interface ModComment {
  id: string;
  modSlug: string;
  author: string;
  authorId: string;
  avatar: string | null;
  text: string;
  createdAt: string;
}

export interface Mod {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: string;
  creator: Creator;
  game: string;
  gameSlug: string;
  subcategory: string;
  thumbnailUrl: string | null;
  tags: string[];
  downloads: number;
  rating: number;
  ratingCount: number;
  virusChecked: boolean;
  createdAt: string;
  files: ModFile[];
  screenshots: string[];
}

export interface GameCategory {
  slug: string;
  name: string;
  description: string;
  icon: string;
  gradient: string;
  subcategories: string[];
}

export const GAMES: GameCategory[] = [
  {
    slug: "gtav",
    name: "GTA 5",
    description: "Seamless mods for Grand Theft Auto V",
    icon: "🚗",
    gradient: "from-[#bf4417]/35 via-[#1a0b06] to-black",
    subcategories: ["Vehicles", "Scripts", "Maps", "Weapons", "Skins", "Visuals"],
  },
  {
    slug: "minecraft",
    name: "Minecraft",
    description: "The world's most modded game",
    icon: "⛏️",
    gradient: "from-[#d97706]/30 via-[#1a1408] to-black",
    subcategories: ["Mods", "Texture Packs", "Maps", "Shaders", "Data Packs", "Skins"],
  },
  {
    slug: "skyrim",
    name: "Skyrim",
    description: "Skyrim Special Edition overhaul mods",
    icon: "🏔️",
    gradient: "from-[#7c2d12]/40 via-[#150c08] to-black",
    subcategories: ["Overhauls", "Gameplay", "Graphics", "Armor & Weapons", "Quests", "UI"],
  },
];