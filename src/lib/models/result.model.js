import mongoose from "mongoose";

const resultSchema = new mongoose.Schema(
  {
    courseName: {
      type: String,
      required: [true, "Course name is required"],
      trim: true,
      index: true,
    },
    title: {
      type: String,
      trim: true,
      default: "Official Examination Result",
    },
    session: {
      type: String,
      trim: true,
      default: "2025-2026",
      index: true,
    },
    pdfUrl: {
      type: String,
      required: [true, "Result PDF file is required"],
      trim: true,
    },
    pdfName: {
      type: String,
      trim: true,
      default: "Result_Document.pdf",
    },
    pdfSize: {
      type: String,
      trim: true,
      default: "",
    },
    description: {
      type: String,
      trim: true,
      default: "Official certified examination result document.",
    },
    isReleased: {
      type: Boolean,
      default: true,
      index: true,
    },
    holdReason: {
      type: String,
      trim: true,
      default: "",
    },
    downloadCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

resultSchema.index({ courseName: 1, isReleased: 1, createdAt: -1 });

const Result = mongoose.models.Result || mongoose.model("Result", resultSchema);
export default Result;
