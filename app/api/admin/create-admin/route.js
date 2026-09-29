import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import User from "@/lib/models/user.model";
import { getAuthUser } from "@/lib/auth";

export async function POST(req) {
  try {
    await dbConnect();
    const auth = await getAuthUser(req);
    if (!auth || (auth.role !== "admin" && auth.role !== "superadmin")) {
      return NextResponse.json(
        { success: false, message: "Access denied. Admins only." },
        { status: 403 }
      );
    }

    const { username, email, password } = await req.json();

    if (!username || !email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Username, email, and password are required.",
        },
        { status: 400 }
      );
    }

    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (trimmedUsername.length < 3 || trimmedUsername.length > 30) {
      return NextResponse.json(
        {
          success: false,
          message: "Username must be between 3 and 30 characters.",
        },
        { status: 400 }
      );
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a valid email address.",
        },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        {
          success: false,
          message: "Password must be at least 6 characters.",
        },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({
      $or: [{ username: trimmedUsername }, { email: trimmedEmail }],
    });

    if (existingUser) {
      const field = existingUser.email === trimmedEmail ? "Email" : "Username";
      return NextResponse.json(
        {
          success: false,
          message: `${field} is already in use by another account.`,
        },
        { status: 409 }
      );
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newAdmin = new User({
      username: trimmedUsername,
      email: trimmedEmail,
      password: hashPassword,
      role: "admin",
      isVerified: true,
    });

    await newAdmin.save();

    return NextResponse.json(
      {
        success: true,
        message: `Admin account '${trimmedUsername}' created successfully.`,
        admin: {
          _id: newAdmin._id,
          username: newAdmin.username,
          email: newAdmin.email,
          role: newAdmin.role,
          isVerified: newAdmin.isVerified,
          createdAt: newAdmin.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("CreateAdmin error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
