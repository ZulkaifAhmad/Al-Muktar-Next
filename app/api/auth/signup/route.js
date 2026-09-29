import { NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import User from "@/lib/models/user.model";
import { signupSchema, validatePayload } from "@/lib/validations";
import { sendOtpEmail } from "@/lib/email";

function generateOtp() {
  return crypto.randomInt(100000, 999999).toString();
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();

    const validation = validatePayload(signupSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: validation.error },
        { status: 400 }
      );
    }

    const { username, email, password } = validation.data;
    const normalizedEmail = email.toLowerCase().trim();
    const normalizedUsername = username.trim();

    // Check if an account already exists with this email
    const existingUser = await User.findOne({ email: normalizedEmail }).select(
      "+password +otp.code +otp.expiresIn +otp.attempts"
    );

    const hashPassword = await bcrypt.hash(password, 10);
    const otp = generateOtp();
    const expiresIn = new Date(Date.now() + 10 * 60 * 1000);

    if (existingUser) {
      // 1. If already verified, do not allow re-signup
      if (existingUser.isVerified) {
        return NextResponse.json(
          {
            success: false,
            message: "An account with this email is already verified. Please log in.",
          },
          { status: 409 }
        );
      }

      // 2. If unverified, check if the desired username is taken by another account
      const isUsernameTaken = await User.findOne({
        username: { $regex: new RegExp(`^${normalizedUsername}$`, "i") },
        _id: { $ne: existingUser._id },
      });

      if (isUsernameTaken) {
        return NextResponse.json(
          {
            success: false,
            message: "This username is already taken by another account. Please choose a different username.",
          },
          { status: 400 }
        );
      }

      // 3. Update the existing unverified account credentials and issue fresh OTP
      existingUser.username = normalizedUsername;
      existingUser.password = hashPassword;
      existingUser.otp = {
        code: otp,
        expiresIn,
        attempts: 0,
      };

      await existingUser.save();

      try {
        await sendOtpEmail(normalizedEmail, otp, "verify");
      } catch (emailErr) {
        console.error("Failed to send verification email on account update:", emailErr.message);
      }

      return NextResponse.json(
        {
          success: true,
          message: "Account credentials updated. A new verification OTP has been sent to your email.",
        },
        { status: 200 }
      );
    }

    // 4. If no account with this email exists, check username availability
    const isUsernameTaken = await User.findOne({
      username: { $regex: new RegExp(`^${normalizedUsername}$`, "i") },
    });

    if (isUsernameTaken) {
      return NextResponse.json(
        {
          success: false,
          message: "This username is already taken. Please choose another username.",
        },
        { status: 400 }
      );
    }

    // 5. Create new user entity
    const newUser = new User({
      username: normalizedUsername,
      email: normalizedEmail,
      password: hashPassword,
      otp: {
        code: otp,
        expiresIn,
        attempts: 0,
      },
    });

    await newUser.save();

    try {
      await sendOtpEmail(normalizedEmail, otp, "verify");
    } catch (emailErr) {
      console.error("Failed to send verification email:", emailErr.message);
    }

    return NextResponse.json(
      {
        success: true,
        message: "User registered successfully. Check your email for the OTP.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Signup failed" },
      { status: 500 }
    );
  }
}
