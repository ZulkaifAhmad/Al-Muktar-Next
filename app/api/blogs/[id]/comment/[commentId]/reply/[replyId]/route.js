import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/db";
import Blog from "@/lib/models/blog.model";
import { getAuthUser } from "@/lib/auth";

function getBlogFilter(slug) {
  const isObjectId = mongoose.Types.ObjectId.isValid(slug);
  return isObjectId ? { $or: [{ slug }, { _id: slug }] } : { slug };
}

export async function PUT(req, { params }) {
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
    const replyId = resolvedParams?.replyId;
    const { comment } = await req.json();

    if (!comment || !comment.trim()) {
      return NextResponse.json(
        { success: false, message: "Reply content is required." },
        { status: 400 }
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
        { success: false, message: "Comment not found." },
        { status: 404 }
      );
    }

    const replyDoc = commentDoc.replies?.id(replyId);
    if (!replyDoc) {
      return NextResponse.json(
        { success: false, message: "Reply not found." },
        { status: 404 }
      );
    }

    const isOwner = replyDoc.user && replyDoc.user.toString() === auth.id;
    const isAdmin = auth.role === "admin" || auth.role === "superadmin";

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { success: false, message: "You are not authorized to edit this reply." },
        { status: 403 }
      );
    }

    replyDoc.comment = comment.trim();
    replyDoc.updatedAt = new Date();
    await blog.save();

    return NextResponse.json({
      success: true,
      message: "Reply updated successfully",
      comments: blog.comments,
      reply: replyDoc,
    });
  } catch (error) {
    console.error("UpdateReply error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update reply" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
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
    const replyId = resolvedParams?.replyId;

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
        { success: false, message: "Comment not found." },
        { status: 404 }
      );
    }

    const replyDoc = commentDoc.replies?.id(replyId);
    if (!replyDoc) {
      return NextResponse.json(
        { success: false, message: "Reply not found." },
        { status: 404 }
      );
    }

    const isOwner = replyDoc.user && replyDoc.user.toString() === auth.id;
    const isAdmin = auth.role === "admin" || auth.role === "superadmin";

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { success: false, message: "You are not authorized to delete this reply." },
        { status: 403 }
      );
    }

    commentDoc.replies.pull({ _id: replyId });
    await blog.save();

    return NextResponse.json({
      success: true,
      message: "Reply deleted successfully",
      comments: blog.comments,
    });
  } catch (error) {
    console.error("DeleteReply error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to delete reply" },
      { status: 500 }
    );
  }
}
