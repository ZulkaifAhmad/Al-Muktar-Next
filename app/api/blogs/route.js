import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Blog from "@/lib/models/blog.model";
import { getAuthUser } from "@/lib/auth";
import { blogCreateSchema, validatePayload } from "@/lib/validations";

export async function GET() {
  try {
    await dbConnect();
    const blogs = await Blog.find({ status: "published" })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, blogs });
  } catch (error) {
    console.error("GetAllBlogs error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}

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

    const body = await req.json();
    const validation = validatePayload(blogCreateSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: validation.error },
        { status: 400 }
      );
    }

    const blog = await Blog.create({
      ...validation.data,
      author: auth.id,
      views: 1,
    });

    return NextResponse.json({ success: true, blog }, { status: 201 });
  } catch (error) {
    console.error("CreateBlog error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to create blog" },
      { status: 500 }
    );
  }
}
