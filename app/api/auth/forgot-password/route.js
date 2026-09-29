import { NextResponse } from "next/server";
import crypto from "crypto";
import dbConnect from "@/lib/db";
import User from "@/lib/models/user.model";
import { sendOtpEmail } from "@/lib/email";

function generateOtp() {
  return crypto.randomInt(100000, 999999).toString();
}

export async function POST(req) {
  try {
    await dbConnect();
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() }).select(
      "+resetOtp.expiresIn"
    );

    if (!user) {
      return NextResponse.json(
        { success: false, message: "No account found with this email." },
        { status: 404 }
      );
    }

    if (!user.isVerified) {
      return NextResponse.json(
        {
          success: false,
          message: "Email is not verified. Please verify your account first.",
        },
        { status: 400 }
      );
    }

    // Cooldown: prevent spam (1 minute between resets)
    if (user.resetOtp && user.resetOtp.expiresIn) {
      const elapsed = Date.now() - (user.resetOtp.expiresIn.getTime() - 10 * 60 * 1000);
      if (elapsed < 60 * 1000) {
        const waitSeconds = Math.ceil((60 * 1000 - elapsed) / 1000);
        return NextResponse.json(
          {
            success: false,
            message: `Please wait ${waitSeconds}s before requesting another OTP.`,
          },
          { status: 429 }
        );
      }
    }

    const otp = generateOtp();
    const expiresIn = new Date(Date.now() + 10 * 60 * 1000);

    user.resetOtp = { code: otp, expiresIn, attempts: 0 };
    await user.save();

    try {
      await sendOtpEmail(user.email, otp, "reset");
    } catch (emailErr) {
      console.error("Failed to send reset OTP:", emailErr.message);
    }

    return NextResponse.json({
      success: true,
      message: "OTP sent to your email. Valid for 10 minutes.",
    });
  } catch (error) {
    console.error("ForgotPassword error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}
