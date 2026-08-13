import mongoose from "mongoose";

export interface AdminDoc {
  email: string;
  addedBy: mongoose.Types.ObjectId | string | null;
}

const adminSchema = new mongoose.Schema<AdminDoc>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

const Admin = mongoose.models.Admin || mongoose.model<AdminDoc>("Admin", adminSchema);

export default Admin;