import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Notification from "@/lib/models/notification.model";

export async function GET() {
  try {
    await dbConnect();
    const notifications = await Notification.find({ isActive: true })
      .sort({ updatedAt: -1, createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      notifications: notifications || [],
      notification: notifications[0] || null,
    });
  } catch (error) {
    console.error("GetActiveNotification error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch active notifications" },
      { status: 500 }
    );
  }
}
