import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is Required"],
      unique: true,
      trim: true,
      minLength: 3,
      maxLength: 30,
    },

    email: {
      type: String,
      required: [true, "Email is Required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },

    password: {
      type: String,
      required: [true, "Password is Required"],
      minLength: [6, "Password must be at least 6 characters"],
      select: false, // won't be returned in queries by default
    },

    role: {
      type: String,
      enum: {
        values: ["user", "admin", "superadmin"],
        message: "Role must be either user, admin, or superadmin",
      },
      default: "user",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    // OTP for email verification on signup
    otp: {
      code: {
        type: String,
        select: false,
      },
      expiresIn: {
        type: Date,
        select: false,
      },
      attempts: {
        type: Number,
        default: 0,
        select: false,
      },
    },

    // Separate OTP for password reset
    resetOtp: {
      code: {
        type: String,
        select: false,
      },
      expiresIn: {
        type: Date,
        select: false,
      },
      attempts: {
        type: Number,
        default: 0,
        select: false,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Index for admin user count query and sorting
userSchema.index({ isVerified: 1 });
userSchema.index({ role: 1 });
userSchema.index({ createdAt: -1 });

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
