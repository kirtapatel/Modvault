import mongoose from "mongoose";

export interface ModFileDoc {
  mod: mongoose.Types.ObjectId;
  version: string;
  gameVersion: string;
  key: string;
  url: string;
  sizeBytes: number;
}

const modFileSchema = new mongoose.Schema<ModFileDoc>(
  {
    mod: { type: mongoose.Schema.Types.ObjectId, ref: "Mod", required: true, index: true },
    version: { type: String, required: true },
    gameVersion: { type: String, required: true },
    key: { type: String, default: "" },
    url: { type: String, default: "" },
    sizeBytes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const ModFile = mongoose.models.ModFile || mongoose.model<ModFileDoc>("ModFile", modFileSchema);

export default ModFile;