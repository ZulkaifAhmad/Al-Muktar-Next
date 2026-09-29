import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Blog from "@/lib/models/blog.model";
import { getAuthUser } from "@/lib/auth";

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

    const blogs = await Blog.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, blogs });
  } catch (error) {
    console.error("GetAllBlogsAdmin error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}
