import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/db";
import Blog from "@/lib/models/blog.model";
import User from "@/lib/models/user.model";
import { getAuthUser } from "@/lib/auth";

function getBlogFilter(slug) {
  const isObjectId = mongoose.Types.ObjectId.isValid(slug);
  return isObjectId ? { $or: [{ slug }, { _id: slug }] } : { slug };
}

export async function POST(req, { params }) {
  try {
    await dbConnect();
    const auth = await getAuthUser(req);
    if (!auth || !auth.user) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    const resolvedParams = await params;
    const slug = resolvedParams?.id;
    const { comment } = await req.json();

    if (!comment || !comment.trim()) {
      return NextResponse.json(
        { success: false, message: "Comment content is required." },
        { status: 400 }
      );
    }

    const user = await User.findById(auth.id);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User account not found." },
        { status: 401 }
      );
    }

    const newComment = {
      user: user._id,
      name: user.username,
      comment: comment.trim(),
      createdAt: new Date(),
      replies: [],
    };

    const blog = await Blog.findOneAndUpdate(
      getBlogFilter(slug),
      { $push: { comments: { $each: [newComment], $position: 0 } } },
      { returnDocument: "after" }
    );

    if (!blog) {
      return NextResponse.json(
        { success: false, message: "Blog post not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Comment added successfully",
        comments: blog.comments,
        comment: newComment,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("AddComment error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to add comment" },
      { status: 500 }
    );
  }
}
