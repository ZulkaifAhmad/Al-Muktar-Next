import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Teacher from "@/lib/models/teacher.model";
import { getAuthUser } from "@/lib/auth";
import { teacherCreateSchema, validatePayload } from "@/lib/validations";

export async function GET() {
  try {
    await dbConnect();
    const teachers = await Teacher.find().sort({ order: 1, createdAt: -1 }).lean();
    return NextResponse.json({ success: true, count: teachers.length, teachers });
  } catch (error) {
    console.error("GetAllTeachers error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch teachers" },
      { status: 500 }
    );
  }
}

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
    const validation = validatePayload(teacherCreateSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: validation.error },
        { status: 400 }
      );
    }

    let parsedSpecs = [];
    if (Array.isArray(validation.data.specializations)) {
      parsedSpecs = validation.data.specializations;
    } else if (typeof validation.data.specializations === "string") {
      parsedSpecs = validation.data.specializations
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }

    const teacher = await Teacher.create({
      ...validation.data,
      specializations: parsedSpecs,
      education: Array.isArray(body.education) ? body.education : [],
    });

    return NextResponse.json(
      {
        success: true,
        message: "Teacher added successfully.",
        teacher,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("CreateTeacher error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to create teacher" },
      { status: 500 }
    );
  }
}
