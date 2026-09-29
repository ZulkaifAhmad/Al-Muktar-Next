import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Notification from "@/lib/models/notification.model";
import { getAuthUser } from "@/lib/auth";

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
    const id = resolvedParams?.id;
    const {
      title,
      description,
      image,
      badge,
      buttonText,
      buttonUrl,
      isActive,
    } = await req.json();

    const notification = await Notification.findById(id);
    if (!notification) {
      return NextResponse.json(
        { success: false, message: "Notification not found" },
        { status: 404 }
      );
    }

    if (title !== undefined) notification.title = title ? title.trim() : "";
    if (description !== undefined) notification.description = description ? description.trim() : "";
    if (image !== undefined) notification.image = image || "";
    if (badge !== undefined) notification.badge = badge ? badge.trim() : "Announcement";
    if (buttonText !== undefined) notification.buttonText = buttonText ? buttonText.trim() : "";
    if (buttonUrl !== undefined) notification.buttonUrl = buttonUrl ? buttonUrl.trim() : "";
    if (isActive !== undefined) notification.isActive = Boolean(isActive);

    await notification.save();

    return NextResponse.json({
      success: true,
      message: "Notification updated successfully",
      notification,
    });
  } catch (error) {
    console.error("UpdateNotification error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update notification" },
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
    const id = resolvedParams?.id;

    const notification = await Notification.findByIdAndDelete(id);
    if (!notification) {
      return NextResponse.json(
        { success: false, message: "Notification not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (error) {
    console.error("DeleteNotification error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to delete notification" },
      { status: 500 }
    );
  }
}
