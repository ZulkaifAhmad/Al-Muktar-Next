import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Result from "@/lib/models/result.model";
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

    const { id } = await params;
    const body = await req.json().catch(() => ({}));

    const result = await Result.findById(id);
    if (!result) {
      return NextResponse.json(
        { success: false, message: "Result record not found." },
        { status: 404 }
      );
    }

    // Toggle release status or set explicitly
    const nextState = typeof body.isReleased === "boolean" ? body.isReleased : !result.isReleased;
    result.isReleased = nextState;
    if (body.holdReason !== undefined) {
      result.holdReason = body.holdReason;
    }
    await result.save();

    return NextResponse.json({
      success: true,
      message: nextState
        ? `Result for "${result.courseName}" has been Released (Live) on the public website.`
        : `Result for "${result.courseName}" has been placed On Hold (Hidden).`,
      isReleased: result.isReleased,
      result,
    });
  } catch (error) {
    console.error("ToggleReleaseResult error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to toggle result release state" },
      { status: 500 }
    );
  }
}
