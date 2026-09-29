import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import User from "@/lib/models/user.model";

export async function PUT(req) {
  try {
    const auth = await getAuthUser(req);
    if (!auth || !auth.user) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    const { username, email } = await req.json();

    if (!username && !email) {
      return NextResponse.json(
        { success: false, message: "Please provide username or email to update." },
        { status: 400 }
      );
    }

    const cleanUsername = username?.trim();
    const cleanEmail = email?.trim().toLowerCase();

    const duplicate = await User.findOne({
      _id: { $ne: auth.user._id },
      $or: [
        ...(cleanUsername ? [{ username: cleanUsername }] : []),
        ...(cleanEmail ? [{ email: cleanEmail }] : []),
      ],
    });

    if (duplicate) {
      return NextResponse.json(
        {
          success: false,
          message: "Username or email is already taken by another account.",
        },
        { status: 400 }
      );
    }

    const user = await User.findById(auth.user._id);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }

    if (cleanUsername) user.username = cleanUsername;
    if (cleanEmail) user.email = cleanEmail;

    await user.save();

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully.",
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        role: auth.role,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error("UpdateProfile error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update profile." },
      { status: 500 }
    );
  }
}
