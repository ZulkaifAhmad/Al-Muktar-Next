import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Notification from "@/lib/models/notification.model";

export async function GET() {
  try {
    await dbConnect();
    const notifications = await Notification.find()
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, notifications });
  } catch (error) {
    console.error("GetAllNotificationsPublic error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}
