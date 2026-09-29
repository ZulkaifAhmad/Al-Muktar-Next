import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/lib/models/user.model";

export async function POST(req) {
  try {
    await dbConnect();
    const { email: rawEmail, otp } = await req.json();
    const email = rawEmail?.trim().toLowerCase();

    if (!email || !otp) {
      return NextResponse.json(
        { success: false, message: "Email and OTP not found in request body" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email }).select("+otp.code +otp.expiresIn +otp.attempts");

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    if (user.isVerified) {
      return NextResponse.json(
        { success: false, message: "Account already verified" },
        { status: 400 }
      );
    }

    if (!user.otp || !user.otp.code) {
      return NextResponse.json(
        { success: false, message: "No OTP found, please request a new one" },
        { status: 400 }
      );
    }

    if (user.otp.expiresIn < new Date()) {
      return NextResponse.json(
        { success: false, message: "OTP has expired, please request a new one" },
        { status: 400 }
      );
    }

    if (user.otp.attempts >= 5) {
      return NextResponse.json(
        { success: false, message: "Too many attempts, please request a new OTP" },
        { status: 429 }
      );
    }

    if (user.otp.code !== otp) {
      user.otp.attempts += 1;
      await user.save();
      return NextResponse.json(
        { success: false, message: "Invalid OTP" },
        { status: 400 }
      );
    }

    user.isVerified = true;
    user.otp = undefined;
    await user.save();

    return NextResponse.json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    console.error("VerifyEmail error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}
