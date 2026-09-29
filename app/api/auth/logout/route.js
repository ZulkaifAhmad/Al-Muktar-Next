import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/db";
import { blocklistToken } from "@/lib/auth";

export async function POST(req) {
  try {
    await dbConnect();
    const token = req.cookies.get("token")?.value;

    if (token) {
      try {
        const decoded = jwt.decode(token);
        if (decoded?.id) {
          await blocklistToken(token, decoded.id);
        }
      } catch {
        // ignore decode errors
      }
    }

    const response = NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });

    response.cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}
