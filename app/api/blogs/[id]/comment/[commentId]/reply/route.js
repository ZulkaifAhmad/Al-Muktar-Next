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
    const commentId = resolvedParams?.commentId;
    const { comment } = await req.json();

    if (!comment || !comment.trim()) {
      return NextResponse.json(
        { success: false, message: "Reply content is required." },
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

    const blog = await Blog.findOne(getBlogFilter(slug));
    if (!blog) {
      return NextResponse.json(
        { success: false, message: "Blog post not found." },
        { status: 404 }
      );
    }

    const commentDoc = blog.comments.id(commentId);
    if (!commentDoc) {
      return NextResponse.json(
        { success: false, message: "Parent comment not found." },
        { status: 404 }
      );
    }

    if (!Array.isArray(commentDoc.replies)) {
      commentDoc.replies = [];
    }

    const newReply = {
      user: user._id,
      name: user.username,
      comment: comment.trim(),
      createdAt: new Date(),
    };

    commentDoc.replies.push(newReply);
    await blog.save();

    return NextResponse.json(
      {
        success: true,
        message: "Reply added successfully",
        comments: blog.comments,
        reply: newReply,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("AddReply error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to add reply" },
      { status: 500 }
    );
  }
}
