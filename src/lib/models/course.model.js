import mongoose from "mongoose";
import { generateUniqueSlug } from "../slug.js";

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, trim: true },
    description: { type: String, trim: true },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      required: true,
    },
    duration: { type: String, required: true },
    image: { type: String },
    students: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

courseSchema.index({ createdAt: -1 });

courseSchema.pre("save", async function () {
  if (this.isModified("title") || !this.slug) {
    const Model = mongoose.models.Course || mongoose.model("Course", courseSchema);
    this.slug = await generateUniqueSlug(Model, this.title, this._id);
  }
});

const Course = mongoose.models.Course || mongoose.model("Course", courseSchema);
export default Course;
