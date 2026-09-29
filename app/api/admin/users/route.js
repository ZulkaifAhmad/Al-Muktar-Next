import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/lib/models/user.model";
import { getAuthUser, isSuperAdminUser } from "@/lib/auth";

export async function GET(req) {
  try {
    await dbConnect();
    const auth = await getAuthUser(req);
    if (!auth || (auth.role !== "admin" && auth.role !== "superadmin")) {
      return NextResponse.json(
        { success: false, message: "Access denied. Admins only." },
        { status: 403 }
      );
    }

    const rawUsers = await User.find()
      .select("username email role isVerified createdAt")
      .sort({ createdAt: -1 })
      .lean();

    const users = rawUsers.map((u) => {
      const isSuper = isSuperAdminUser(u);
      return {
        ...u,
        role: isSuper ? "superadmin" : u.role,
      };
    });

    return NextResponse.json({ success: true, users });
  } catch (error) {
    console.error("GetAllUsers error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
