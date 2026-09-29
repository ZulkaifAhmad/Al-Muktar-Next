import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/db";
import Student from "@/lib/models/student.model";
import { getAuthUser } from "@/lib/auth";
import { generateUniqueSlug } from "@/lib/slug";

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const resolvedParams = await params;
    const id = resolvedParams?.id;

    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const student = await Student.findOne(
      isObjectId ? { $or: [{ _id: id }, { slug: id }] } : { slug: id }
    ).lean();

    if (!student) {
      return NextResponse.json(
        { success: false, message: "Student record not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, student });
  } catch (error) {
    console.error("GetStudentById error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch student" },
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

    const resolvedParams = await params;
    const rawId = resolvedParams?.id;

    if (!rawId || rawId === "undefined" || rawId === "null") {
      return NextResponse.json(
        { success: false, message: "Valid student identifier is required." },
        { status: 400 }
      );
    }

    let decodedId = rawId;
    try {
      decodedId = decodeURIComponent(rawId).trim();
    } catch {
      decodedId = rawId.trim();
    }

    const isObjectId = mongoose.Types.ObjectId.isValid(decodedId) || mongoose.Types.ObjectId.isValid(rawId);
    let student = null;

    if (isObjectId) {
      if (mongoose.Types.ObjectId.isValid(decodedId)) {
        student = await Student.findById(decodedId);
      }
      if (!student && mongoose.Types.ObjectId.isValid(rawId)) {
        student = await Student.findById(rawId);
      }
    }

    if (!student) {
      student = await Student.findOne({
        $or: [
          { slug: decodedId },
          { slug: rawId },
          { slug: decodedId.toLowerCase() },
          { name: decodedId },
        ],
      });
    }

    if (!student) {
      return NextResponse.json(
        { success: false, message: "Student record not found." },
        { status: 404 }
      );
    }

    const {
      name,
      program,
      batchYear,
      category,
      currentRole,
      currentOrganization,
      location,
      image,
      message,
      keyAchievement,
      status,
      order,
    } = await req.json();

    if (name && name !== student.name) {
      student.name = name;
      student.slug = await generateUniqueSlug(Student, name, student._id);
    }
    if (program !== undefined) student.program = program;
    if (batchYear !== undefined) student.batchYear = batchYear;
    if (category !== undefined) student.category = category;
    if (currentRole !== undefined) student.currentRole = currentRole;
    if (currentOrganization !== undefined) student.currentOrganization = currentOrganization;
    if (location !== undefined) student.location = location;
    if (image !== undefined) student.image = image;
    if (message !== undefined) student.message = message;
    if (keyAchievement !== undefined) student.keyAchievement = keyAchievement;
    if (status !== undefined) student.status = status;
    if (order !== undefined) student.order = Number(order) || 0;

    await student.save();

    return NextResponse.json({
      success: true,
      message: "Student profile updated successfully.",
      student,
    });
  } catch (error) {
    console.error("UpdateStudent error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update student" },
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
    const rawId = resolvedParams?.id;

    if (!rawId || rawId === "undefined" || rawId === "null") {
      return NextResponse.json(
        { success: false, message: "Valid student identifier is required." },
        { status: 400 }
      );
    }

    let decodedId = rawId;
    try {
      decodedId = decodeURIComponent(rawId).trim();
    } catch {
      decodedId = rawId.trim();
    }

    const isObjectId = mongoose.Types.ObjectId.isValid(decodedId) || mongoose.Types.ObjectId.isValid(rawId);
    let student = null;

    if (isObjectId) {
      if (mongoose.Types.ObjectId.isValid(decodedId)) {
        student = await Student.findByIdAndDelete(decodedId);
      }
      if (!student && mongoose.Types.ObjectId.isValid(rawId)) {
        student = await Student.findByIdAndDelete(rawId);
      }
    }

    if (!student) {
      student = await Student.findOneAndDelete({
        $or: [
          { slug: decodedId },
          { slug: rawId },
          { slug: decodedId.toLowerCase() },
          { name: decodedId },
        ],
      });
    }

    if (!student) {
      return NextResponse.json(
        { success: false, message: "Student record not found or already deleted." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Student profile deleted successfully.",
    });
  } catch (error) {
    console.error("DeleteStudent error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to delete student" },
      { status: 500 }
    );
  }
}
