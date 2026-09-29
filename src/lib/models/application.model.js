import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    name: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    fatherName: {
      type: String,
      required: [true, "Father's name is required"],
      trim: true,
    },
    whatsapp: {
      type: String,
      required: [true, "WhatsApp number is required"],
      trim: true,
    },
    mobile: {
      type: String,
      required: [true, "Mobile number is required"],
      trim: true,
    },
    course: {
      type: String,
      required: [true, "Course selection is required"],
      trim: true,
    },
    shift: {
      type: String,
      required: [true, "Shift selection is required"],
      enum: ["morning", "evening"],
    },
    qualification: {
      type: String,
      required: [true, "Qualification is required"],
    },
    age: {
      type: Number,
      required: [true, "Age is required"],
      min: [4, "Age must be at least 4"],
      max: [70, "Age must be 70 or below"],
    },
    cnic: {
      type: String,
      required: [true, "CNIC / B-Form is required"],
      trim: true,
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

applicationSchema.index({ course: 1 });
applicationSchema.index({ user: 1, createdAt: -1 });
applicationSchema.index({ status: 1 });
applicationSchema.index({ createdAt: -1 });

const Application = mongoose.models.Application || mongoose.model("Application", applicationSchema);

export default Application;
