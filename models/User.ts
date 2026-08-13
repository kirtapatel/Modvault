import mongoose from "mongoose";
import bcrypt from "bcryptjs";

export interface UserDoc {
  name: string;
  email: string;
  password: string;
  avatar: string;
  bio: string;
  isPremium: boolean;
  koFi: string;
  patreon: string;
  favorites: mongoose.Types.ObjectId[];
  comparePassword?: (candidate: string) => Promise<boolean>;
}

const userSchema = new mongoose.Schema<UserDoc>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    avatar: { type: String, default: "" },
    bio: { type: String, default: "" },
    isPremium: { type: Boolean, default: false },
    koFi: { type: String, default: "" },
    patreon: { type: String, default: "" },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Mod" }],
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = function (candidate: string): Promise<boolean> {
  return bcrypt.compare(candidate, this.password);
};

const User = mongoose.models.User || mongoose.model<UserDoc>("User", userSchema);

export default User;