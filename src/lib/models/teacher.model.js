import mongoose from "mongoose";
import { generateUniqueSlug } from "../slug.js";

const educationSchema = new mongoose.Schema({
  degree: { type: String, trim: true },
  institution: { type: String, trim: true },
  year: { type: String, trim: true },
});

const teacherSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, sparse: true, trim: true },
    role: { type: String, required: true, trim: true },
    department: { type: String, required: true, trim: true },
    experienceYears: { type: String, default: "5+ Years", trim: true },
    studentsMentored: { type: String, default: "200+", trim: true },
    email: { type: String, trim: true, default: "" },
    phone: { type: String, trim: true, default: "" },
    image: { type: String, default: "" },
    quote: { type: String, trim: true, default: "" },
    bio: { type: String, trim: true, default: "" },
    specializations: [{ type: String, trim: true }],
    education: [educationSchema],
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

teacherSchema.index({ status: 1, order: 1, createdAt: -1 });

teacherSchema.pre("save", async function () {
  if (this.isModified("name") || !this.slug) {
    const Model = mongoose.models.Teacher || mongoose.model("Teacher", teacherSchema);
    this.slug = await generateUniqueSlug(Model, this.name, this._id);
  }
});

const Teacher = mongoose.models.Teacher || mongoose.model("Teacher", teacherSchema);
export default Teacher;
