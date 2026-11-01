import type { CommentDoc } from "@/models/Comment";
import type { ModDoc } from "@/models/Mod";
import type { ModFileDoc } from "@/models/ModFile";
import type { UserDoc } from "@/models/User";

type Lean<T> = T & { _id: unknown };

export type LeanMod = Lean<Omit<ModDoc, "creator">> & {
  creator?: LeanUserPublic | null;
  createdAt?: Date | string;
};

export type LeanModFile = Lean<
  Pick<ModFileDoc, "version" | "gameVersion" | "key" | "url" | "sizeBytes">
>;

export type LeanUserPublic = Lean<
  Pick<
    UserDoc,
    "name" | "email" | "avatar" | "bio" | "isPremium" | "koFi" | "patreon"
  >
> & {
  createdAt?: Date | string;
};

export type LeanComment = Lean<CommentDoc> & {
  createdAt?: Date | string;
};
