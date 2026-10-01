import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Result from "@/lib/models/result.model";
import { getAuthUser } from "@/lib/auth";
import { resultUpdateSchema, validatePayload } from "@/lib/validations";

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const result = await Result.findById(id).lean();
    if (!result) {
      return NextResponse.json(
        { success: false, message: "Result document not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("GetResultById error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch result" },
      { status: 500 }
    );
  }
}

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

    const { id } = await params;
    const body = await req.json();

    const validation = validatePayload(resultUpdateSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: validation.error },
        { status: 400 }
      );
    }

    const updated = await Result.findByIdAndUpdate(id, validation.data, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Result document not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Result document updated successfully.",
      result: updated,
    });
  } catch (error) {
    console.error("UpdateResult error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update result" },
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

    const { id } = await params;
    const deleted = await Result.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Result document not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Result PDF deleted successfully.",
    });
  } catch (error) {
    console.error("DeleteResult error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to delete result" },
      { status: 500 }
    );
  }
}
