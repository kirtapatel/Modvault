import mongoose from "mongoose";

export interface ModDoc {
  title: string;
  slug: string;
  summary: string;
  description: string;
  creator: mongoose.Types.ObjectId;
  game: string;
  gameSlug: string;
  subcategory: string;
  thumbnailUrl: string;
  screenshots: string[];
  tags: string[];
  downloads: number;
  ratingValue: number;
  ratingCount: number;
  virusChecked: boolean;
}

const modSchema = new mongoose.Schema<ModDoc>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    summary: { type: String, required: true, trim: true, maxlength: 300 },
    description: { type: String, required: true },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    game: { type: String, required: true },
    gameSlug: { type: String, required: true, index: true },
    subcategory: { type: String, required: true },
    thumbnailUrl: { type: String, default: "" },
    screenshots: { type: [String], default: [] },
    tags: { type: [String], default: [] },
    downloads: { type: Number, default: 0 },
    ratingValue: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    virusChecked: { type: Boolean, default: true },
  },
  { timestamps: true }
);

modSchema.index({ gameSlug: 1, createdAt: -1 });

const Mod = mongoose.models.Mod || mongoose.model<ModDoc>("Mod", modSchema);

export default Mod;