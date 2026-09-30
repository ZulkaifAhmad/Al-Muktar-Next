import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/db";
import Blog from "@/lib/models/blog.model";
import "@/lib/models/user.model";
import { getAuthUser } from "@/lib/auth";
import { generateUniqueSlug } from "@/lib/slug";

function getBlogFilter(slug) {
  const isObjectId = mongoose.Types.ObjectId.isValid(slug);
  return isObjectId ? { $or: [{ slug }, { _id: slug }] } : { slug };
}

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const resolvedParams = await params;
    const rawId = resolvedParams?.id;

    if (!rawId || rawId === "undefined" || rawId === "null") {
      return NextResponse.json(
        { success: false, message: "Valid blog identifier is required." },
        { status: 400 }
      );
    }

    let decodedId = rawId;
    try {
      decodedId = decodeURIComponent(rawId).trim();
    } catch {
      decodedId = rawId.trim();
    }

    const isObjectId = mongoose.Types.ObjectId.isValid(decodedId) || mongoose.Types.ObjectId.isValid(rawId);
    const filter = isObjectId
      ? {
          $or: [
            { _id: decodedId },
            { _id: rawId },
            { slug: decodedId },
            { slug: rawId },
            { slug: decodedId.toLowerCase() },
          ],
        }
      : {
          $or: [
            { slug: decodedId },
            { slug: rawId },
            { slug: decodedId.toLowerCase() },
          ],
        };

    const blog = await Blog.findOneAndUpdate(
      filter,
      { $inc: { views: 1 } },
      { returnDocument: "after", new: true }
    )
      .populate("comments.user", "username email role")
      .populate("comments.replies.user", "username email role")
      .lean();

    if (!blog) {
      return NextResponse.json(
        { success: false, message: "Blog not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, blog });
  } catch (error) {
    console.error("GetBlogBySlug error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch blog" },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const auth = await getAuthUser(req);
    if (!auth || (auth.role !== "admin" && auth.role !== "superadmin")) {
      return NextResponse.json(
        { success: false, message: "Access denied. Admins only." },
        { status: 403 }
      );
    }

    const resolvedParams = await params;
    const rawId = resolvedParams?.id;

    if (!rawId || rawId === "undefined" || rawId === "null") {
      return NextResponse.json(
        { success: false, message: "Valid blog identifier is required." },
        { status: 400 }
      );
    }

    let decodedId = rawId;
    try {
      decodedId = decodeURIComponent(rawId).trim();
    } catch {
      decodedId = rawId.trim();
    }

    const isObjectId = mongoose.Types.ObjectId.isValid(decodedId) || mongoose.Types.ObjectId.isValid(rawId);
    let blog = null;

    if (isObjectId) {
      if (mongoose.Types.ObjectId.isValid(decodedId)) {
        blog = await Blog.findById(decodedId);
      }
      if (!blog && mongoose.Types.ObjectId.isValid(rawId)) {
        blog = await Blog.findById(rawId);
      }
    }

    if (!blog) {
      blog = await Blog.findOne({
        $or: [
          { slug: decodedId },
          { slug: rawId },
          { slug: decodedId.toLowerCase() },
          { title: decodedId },
        ],
      });
    }

    if (!blog) {
      return NextResponse.json(
        { success: false, message: "Blog not found." },
        { status: 404 }
      );
    }

    const { title, subject, description, content, images, status } = await req.json();

    if (title && title !== blog.title) {
      blog.title = title;
      blog.slug = await generateUniqueSlug(Blog, title, blog._id);
    }
    if (subject !== undefined) blog.subject = subject;
    if (description !== undefined) blog.description = description;
    if (content !== undefined) blog.content = content;
    if (images !== undefined) blog.images = images;
    if (status !== undefined) blog.status = status;

    await blog.save();
    return NextResponse.json({ success: true, blog });
  } catch (error) {
    console.error("UpdateBlog error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update blog" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const auth = await getAuthUser(req);
    if (!auth || (auth.role !== "admin" && auth.role !== "superadmin")) {
      return NextResponse.json(
        { success: false, message: "Access denied. Admins only." },
        { status: 403 }
      );
    }

    const resolvedParams = await params;
    const rawId = resolvedParams?.id;

    if (!rawId || rawId === "undefined" || rawId === "null") {
      return NextResponse.json(
        { success: false, message: "Valid blog identifier is required." },
        { status: 400 }
      );
    }

    let decodedId = rawId;
    try {
      decodedId = decodeURIComponent(rawId).trim();
    } catch {
      decodedId = rawId.trim();
    }

    const isObjectId = mongoose.Types.ObjectId.isValid(decodedId) || mongoose.Types.ObjectId.isValid(rawId);
    let blog = null;

    if (isObjectId) {
      if (mongoose.Types.ObjectId.isValid(decodedId)) {
        blog = await Blog.findByIdAndDelete(decodedId);
      }
      if (!blog && mongoose.Types.ObjectId.isValid(rawId)) {
        blog = await Blog.findByIdAndDelete(rawId);
      }
    }

    if (!blog) {
      blog = await Blog.findOneAndDelete({
        $or: [
          { slug: decodedId },
          { slug: rawId },
          { slug: decodedId.toLowerCase() },
          { title: decodedId },
        ],
      });
    }

    if (!blog) {
      return NextResponse.json(
        { success: false, message: "Blog not found or already deleted." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Blog deleted successfully." });
  } catch (error) {
    console.error("DeleteBlog error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to delete blog" },
      { status: 500 }
    );
  }
}
