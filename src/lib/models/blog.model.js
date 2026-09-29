import mongoose from "mongoose";
import { generateUniqueSlug } from "../slug.js";

const replySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: { type: String, required: true, trim: true },
  comment: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
});

const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: { type: String, required: true, trim: true },
  comment: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
  replies: [replySchema],
});

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    subject: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: "" },
    content: { type: String, required: true },
    slug: { type: String, unique: true, trim: true },
    images: [{ type: String }],
    status: { type: String, enum: ["published", "draft"], default: "published" },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    views: { type: Number, default: 1 },
    comments: [commentSchema],
  },
  { timestamps: true }
);

// Auto-generate slug from title before save
blogSchema.pre("save", async function () {
  if (this.isModified("title") || !this.slug) {
    const Model = mongoose.models.Blog || mongoose.model("Blog", blogSchema);
    this.slug = await generateUniqueSlug(Model, this.title, this._id);
  }
});

blogSchema.index({ status: 1, createdAt: -1 });

const Blog = mongoose.models.Blog || mongoose.model("Blog", blogSchema);
export default Blog;
