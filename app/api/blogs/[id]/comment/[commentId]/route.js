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
    const { comment } = await req.json();

    if (!comment || !comment.trim()) {
      return NextResponse.json(
        { success: false, message: "Comment content is required." },
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

    const isOwner = commentDoc.user && commentDoc.user.toString() === auth.id;
    const isAdmin = auth.role === "admin" || auth.role === "superadmin";

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { success: false, message: "You are not authorized to edit this comment." },
        { status: 403 }
      );
    }

    commentDoc.comment = comment.trim();
    commentDoc.updatedAt = new Date();
    await blog.save();

    return NextResponse.json({
      success: true,
      message: "Comment updated successfully",
      comments: blog.comments,
      comment: commentDoc,
    });
  } catch (error) {
    console.error("UpdateComment error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update comment" },
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

    const isOwner = commentDoc.user && commentDoc.user.toString() === auth.id;
    const isAdmin = auth.role === "admin" || auth.role === "superadmin";

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { success: false, message: "You are not authorized to delete this comment." },
        { status: 403 }
      );
    }

    blog.comments.pull({ _id: commentId });
    await blog.save();

    return NextResponse.json({
      success: true,
      message: "Comment deleted successfully",
      comments: blog.comments,
    });
  } catch (error) {
    console.error("DeleteComment error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to delete comment" },
      { status: 500 }
    );
  }
}
