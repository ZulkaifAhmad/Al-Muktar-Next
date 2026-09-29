import { NextResponse } from "next/server";
import crypto from "crypto";
import dbConnect from "@/lib/db";
import User from "@/lib/models/user.model";
import { resendOtpSchema } from "@/lib/validation";
import { sendOtpEmail } from "@/lib/email";

function generateOtp() {
  return crypto.randomInt(100000, 999999).toString();
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();

    const result = resendOtpSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email } = result.data;
    const user = await User.findOne({ email: email.toLowerCase() }).select("+otp.expiresIn");

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

    if (user.otp && user.otp.expiresIn) {
      const timeSinceLastOtp = 5 * 60 * 1000 - (user.otp.expiresIn.getTime() - Date.now());
      const cooldown = 60 * 1000;

      if (timeSinceLastOtp < cooldown) {
        const waitSeconds = Math.ceil((cooldown - timeSinceLastOtp) / 1000);
        return NextResponse.json(
          {
            success: false,
            message: `Please wait ${waitSeconds}s before requesting a new OTP`,
          },
          { status: 429 }
        );
      }
    }

    const code = generateOtp();
    const expiresIn = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = { code, expiresIn, attempts: 0 };
    await user.save();

    try {
      await sendOtpEmail(email, code, "verify");
    } catch (emailErr) {
      console.error("Failed to resend OTP email:", emailErr.message);
    }

    return NextResponse.json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error("ResendOtp error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}
