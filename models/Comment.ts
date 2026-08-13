import mongoose from "mongoose";

export interface CommentDoc {
  text: string;
  author: mongoose.Types.ObjectId;
  mod: mongoose.Types.ObjectId;
}

const commentSchema = new mongoose.Schema<CommentDoc>(
  {
    text: { type: String, required: true, trim: true, maxlength: 1000 },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    mod: { type: mongoose.Schema.Types.ObjectId, ref: "Mod", required: true, index: true },
  },
  { timestamps: true }
);

const Comment = mongoose.models.Comment || mongoose.model<CommentDoc>("Comment", commentSchema);

export default Comment;