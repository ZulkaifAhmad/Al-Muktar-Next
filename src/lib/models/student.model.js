import mongoose from "mongoose";
import { generateUniqueSlug } from "../slug.js";

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, sparse: true, trim: true },
    program: { type: String, required: true, trim: true },
    batchYear: { type: String, default: "Class of 2024", trim: true },
    category: { type: String, default: "General", trim: true },
    currentRole: { type: String, required: true, trim: true },
    currentOrganization: { type: String, required: true, trim: true },
    location: { type: String, default: "Pakistan", trim: true },
    image: { type: String, default: "" },
    message: { type: String, trim: true, default: "" },
    keyAchievement: { type: String, trim: true, default: "" },
    status: {
      type: String,
      enum: ["active", "inactive", "featured"],
      default: "active",
    },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

studentSchema.index({ status: 1, order: 1, createdAt: -1 });

studentSchema.pre("save", async function () {
  if (this.isModified("name") || !this.slug) {
    const Model = mongoose.models.Student || mongoose.model("Student", studentSchema);
    this.slug = await generateUniqueSlug(Model, this.name, this._id);
  }
});

const Student = mongoose.models.Student || mongoose.model("Student", studentSchema);
export default Student;
