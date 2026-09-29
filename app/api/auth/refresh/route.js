import { NextResponse } from "next/server";
import { rotateAuthToken } from "@/lib/auth";

export async function POST(req) {
  try {
    const rotation = await rotateAuthToken(req);
    if (!rotation) {
      return NextResponse.json(
        { success: false, message: "Session expired or invalid token." },
        { status: 401 }
      );
    }

    const { user, token, role } = rotation;

    const response = NextResponse.json({
      success: true,
      message: "Token rotated successfully",
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        role,
        isVerified: user.isVerified,
      },
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error("Token rotation error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to rotate token" },
      { status: 500 }
    );
  }
}
