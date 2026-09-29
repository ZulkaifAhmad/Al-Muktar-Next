import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Notification from "@/lib/models/notification.model";
import { getAuthUser } from "@/lib/auth";

export async function PATCH(req, { params }) {
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
    const notification = await Notification.findById(id);

    if (!notification) {
      return NextResponse.json(
        { success: false, message: "Notification not found" },
        { status: 404 }
      );
    }

    const nextState = !notification.isActive;
    notification.isActive = nextState;
    await notification.save();

    return NextResponse.json({
      success: true,
      message: nextState ? "Notification activated on website" : "Notification deactivated",
      notification,
    });
  } catch (error) {
    console.error("ToggleNotificationStatus error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to toggle notification status" },
      { status: 500 }
    );
  }
}
