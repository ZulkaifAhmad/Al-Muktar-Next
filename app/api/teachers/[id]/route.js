import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/db";
import Teacher from "@/lib/models/teacher.model";
import { getAuthUser } from "@/lib/auth";
import { generateUniqueSlug } from "@/lib/slug";

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const resolvedParams = await params;
    const id = resolvedParams?.id;

    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const teacher = await Teacher.findOne(
      isObjectId ? { $or: [{ _id: id }, { slug: id }] } : { slug: id }
    ).lean();

    if (!teacher) {
      return NextResponse.json(
        { success: false, message: "Teacher not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, teacher });
  } catch (error) {
    console.error("GetTeacherById error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch teacher" },
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
        { success: false, message: "Valid teacher identifier is required." },
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
    let teacher = null;

    if (isObjectId) {
      if (mongoose.Types.ObjectId.isValid(decodedId)) {
        teacher = await Teacher.findById(decodedId);
      }
      if (!teacher && mongoose.Types.ObjectId.isValid(rawId)) {
        teacher = await Teacher.findById(rawId);
      }
    }

    if (!teacher) {
      teacher = await Teacher.findOne({
        $or: [
          { slug: decodedId },
          { slug: rawId },
          { slug: decodedId.toLowerCase() },
          { name: decodedId },
        ],
      });
    }

    if (!teacher) {
      return NextResponse.json(
        { success: false, message: "Teacher not found." },
        { status: 404 }
      );
    }

    const {
      name,
      role,
      department,
      experienceYears,
      studentsMentored,
      email,
      phone,
      image,
      quote,
      bio,
      specializations,
      education,
      status,
      order,
    } = await req.json();

    if (name && name !== teacher.name) {
      teacher.name = name;
      teacher.slug = await generateUniqueSlug(Teacher, name, teacher._id);
    }
    if (role !== undefined) teacher.role = role;
    if (department !== undefined) teacher.department = department;
    if (experienceYears !== undefined) teacher.experienceYears = experienceYears;
    if (studentsMentored !== undefined) teacher.studentsMentored = studentsMentored;
    if (email !== undefined) teacher.email = email;
    if (phone !== undefined) teacher.phone = phone;
    if (image !== undefined) teacher.image = image;
    if (quote !== undefined) teacher.quote = quote;
    if (bio !== undefined) teacher.bio = bio;
    if (status !== undefined) teacher.status = status;
    if (order !== undefined) teacher.order = Number(order) || 0;

    if (specializations !== undefined) {
      if (Array.isArray(specializations)) {
        teacher.specializations = specializations;
      } else if (typeof specializations === "string") {
        teacher.specializations = specializations
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      }
    }

    if (education !== undefined && Array.isArray(education)) {
      teacher.education = education;
    }

    await teacher.save();

    return NextResponse.json({
      success: true,
      message: "Teacher updated successfully.",
      teacher,
    });
  } catch (error) {
    console.error("UpdateTeacher error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update teacher" },
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
        { success: false, message: "Valid teacher identifier is required." },
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
    let teacher = null;

    if (isObjectId) {
      if (mongoose.Types.ObjectId.isValid(decodedId)) {
        teacher = await Teacher.findByIdAndDelete(decodedId);
      }
      if (!teacher && mongoose.Types.ObjectId.isValid(rawId)) {
        teacher = await Teacher.findByIdAndDelete(rawId);
      }
    }

    if (!teacher) {
      teacher = await Teacher.findOneAndDelete({
        $or: [
          { slug: decodedId },
          { slug: rawId },
          { slug: decodedId.toLowerCase() },
          { name: decodedId },
        ],
      });
    }

    if (!teacher) {
      return NextResponse.json(
        { success: false, message: "Teacher not found or already deleted." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Teacher deleted successfully.",
    });
  } catch (error) {
    console.error("DeleteTeacher error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to delete teacher" },
      { status: 500 }
    );
  }
}
