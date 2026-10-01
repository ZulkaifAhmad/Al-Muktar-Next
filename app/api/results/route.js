import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Result from "@/lib/models/result.model";
import { getAuthUser } from "@/lib/auth";
import { resultCreateSchema, validatePayload } from "@/lib/validations";

// GET /api/results - Fetch course PDF results
export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);

    const courseName = searchParams.get("courseName")?.trim();
    const isReleased = searchParams.get("isReleased")?.trim();
    const query = searchParams.get("q")?.trim();
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "100", 10);
    const skip = (page - 1) * limit;

    const filter = {};

    if (courseName && courseName !== "all") {
      filter.courseName = courseName;
    }

    if (isReleased === "true") {
      filter.isReleased = true;
    } else if (isReleased === "false") {
      filter.isReleased = false;
    }

    if (query) {
      filter.$or = [
        { courseName: { $regex: query, $options: "i" } },
        { title: { $regex: query, $options: "i" } },
        { session: { $regex: query, $options: "i" } },
      ];
    }

    const total = await Result.countDocuments(filter);
    const results = await Result.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return NextResponse.json({
      success: true,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      results,
    });
  } catch (error) {
    console.error("GetResults error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch results" },
      { status: 500 }
    );
  }
}

// POST /api/results - Upload course PDF result (Admin only)
export async function POST(req) {
  try {
    await dbConnect();
    const auth = await getAuthUser(req);
    if (!auth || (auth.role !== "admin" && auth.role !== "superadmin")) {
      return NextResponse.json(
        { success: false, message: "Access denied. Admins only." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const validation = validatePayload(resultCreateSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: validation.error },
        { status: 400 }
      );
    }

    const newResult = await Result.create(validation.data);

    return NextResponse.json(
      {
        success: true,
        message: `Result PDF for "${newResult.courseName}" uploaded successfully.`,
        result: newResult,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("CreateResult error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to upload result PDF" },
      { status: 500 }
    );
  }
}
