import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Application from "@/lib/models/application.model";
import { getAuthUser } from "@/lib/auth";

export async function GET(req) {
  try {
    await dbConnect();
    const auth = await getAuthUser(req);
    if (!auth || !auth.user) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    const applications = await Application.find({ user: auth.id })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, applications });
  } catch (error) {
    console.error("GetMyApplications error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
