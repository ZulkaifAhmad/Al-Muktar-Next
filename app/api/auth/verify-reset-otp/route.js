import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/db";
import User from "@/lib/models/user.model";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_here";

export async function POST(req) {
  try {
    await dbConnect();
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json(
        { success: false, message: "Email and OTP are required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() }).select(
      "+resetOtp.code +resetOtp.expiresIn +resetOtp.attempts"
    );

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    if (!user.resetOtp || !user.resetOtp.code) {
      return NextResponse.json(
        { success: false, message: "No reset OTP found. Request a new one." },
        { status: 400 }
      );
    }

    if (user.resetOtp.expiresIn < new Date()) {
      return NextResponse.json(
        { success: false, message: "OTP has expired. Request a new one." },
        { status: 400 }
      );
    }

    if (user.resetOtp.attempts >= 5) {
      return NextResponse.json(
        { success: false, message: "Too many attempts. Request a new OTP." },
        { status: 429 }
      );
    }

    if (user.resetOtp.code !== otp) {
      user.resetOtp.attempts += 1;
      await user.save();
      return NextResponse.json(
        { success: false, message: "Invalid OTP." },
        { status: 400 }
      );
    }

    const resetToken = jwt.sign(
      { id: user._id.toString(), purpose: "reset" },
      JWT_SECRET,
      { expiresIn: "10m" }
    );

    user.resetOtp = undefined;
    await user.save();

    return NextResponse.json({
      success: true,
      resetToken,
      message: "OTP verified.",
    });
  } catch (error) {
    console.error("VerifyResetOtp error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}
