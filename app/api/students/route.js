import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Student from "@/lib/models/student.model";
import { getAuthUser } from "@/lib/auth";
import { studentCreateSchema, validatePayload } from "@/lib/validations";

export async function GET() {
  try {
    await dbConnect();
    const students = await Student.find().sort({ order: 1, createdAt: -1 }).lean();
    return NextResponse.json({ success: true, count: students.length, students });
  } catch (error) {
    console.error("GetAllStudents error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch students" },
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
    const validation = validatePayload(studentCreateSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: validation.error },
        { status: 400 }
      );
    }

    const student = await Student.create(validation.data);

    return NextResponse.json(
      {
        success: true,
        message: "Student profile added successfully.",
        student,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("CreateStudent error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to create student" },
      { status: 500 }
    );
  }
}
