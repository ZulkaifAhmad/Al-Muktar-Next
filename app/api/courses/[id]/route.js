import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/db";
import Course from "@/lib/models/course.model";
import Application from "@/lib/models/application.model";
import { getAuthUser } from "@/lib/auth";
import { generateUniqueSlug } from "@/lib/slug";

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const resolvedParams = await params;
    const slug = resolvedParams?.id;

    if (!slug || slug === "undefined" || slug === "null") {
      return NextResponse.json(
        { success: false, message: "Valid course identifier is required." },
        { status: 400 }
      );
    }

    let decodedSlug = slug;
    try {
      decodedSlug = decodeURIComponent(slug).trim();
    } catch {
      decodedSlug = slug.trim();
    }

    const isObjectId =
      mongoose.Types.ObjectId.isValid(decodedSlug) || mongoose.Types.ObjectId.isValid(slug);

    const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const orConditions = [
      { slug: decodedSlug },
      { slug: slug },
      { slug: decodedSlug.toLowerCase() },
      { slug: slug.toLowerCase() },
      { title: decodedSlug },
      { title: slug },
      { title: { $regex: new RegExp(`^${escapeRegex(decodedSlug)}$`, "i") } },
      { slug: { $regex: new RegExp(`^${escapeRegex(decodedSlug)}$`, "i") } },
    ];

    if (isObjectId) {
      if (mongoose.Types.ObjectId.isValid(decodedSlug)) {
        orConditions.push({ _id: new mongoose.Types.ObjectId(decodedSlug) });
      }
      if (mongoose.Types.ObjectId.isValid(slug) && slug !== decodedSlug) {
        orConditions.push({ _id: new mongoose.Types.ObjectId(slug) });
      }
    }

    const course = await Course.findOneAndUpdate(
      { $or: orConditions },
      { $inc: { views: 1 } },
      { returnDocument: "after" }
    ).lean();

    if (!course) {
      return NextResponse.json(
        { success: false, message: "Course not found." },
        { status: 404 }
      );
    }

    const applicationCount = await Application.countDocuments({
      $or: [
        { course: course.slug },
        { course: course.title },
        { course: course._id.toString() },
      ],
    });

    return NextResponse.json({
      success: true,
      course: {
        ...course,
        applicationCount,
        students: applicationCount,
      },
    });
  } catch (error) {
    console.error("GetCourse error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch course" },
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
        { success: false, message: "Valid course identifier is required." },
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
    let course = null;

    if (isObjectId) {
      if (mongoose.Types.ObjectId.isValid(decodedId)) {
        course = await Course.findById(decodedId);
      }
      if (!course && mongoose.Types.ObjectId.isValid(rawId)) {
        course = await Course.findById(rawId);
      }
    }

    if (!course) {
      course = await Course.findOne({
        $or: [
          { slug: decodedId },
          { slug: rawId },
          { slug: decodedId.toLowerCase() },
          { title: decodedId },
          { title: rawId },
        ],
      });
    }

    if (!course) {
      return NextResponse.json(
        { success: false, message: "Course not found." },
        { status: 404 }
      );
    }

    const { title, description, level, duration, image } = await req.json();

    if (title && title !== course.title) {
      course.title = title;
      course.slug = await generateUniqueSlug(Course, title, course._id);
    }
    if (description !== undefined) course.description = description;
    if (level !== undefined) course.level = level;
    if (duration !== undefined) course.duration = duration;
    if (image !== undefined) course.image = image;

    await course.save();
    return NextResponse.json({ success: true, course });
  } catch (error) {
    console.error("UpdateCourse error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update course" },
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
        { success: false, message: "Valid course identifier is required." },
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
    let course = null;

    if (isObjectId) {
      if (mongoose.Types.ObjectId.isValid(decodedId)) {
        course = await Course.findByIdAndDelete(decodedId);
      }
      if (!course && mongoose.Types.ObjectId.isValid(rawId)) {
        course = await Course.findByIdAndDelete(rawId);
      }
    }

    if (!course) {
      course = await Course.findOneAndDelete({
        $or: [
          { slug: decodedId },
          { slug: rawId },
          { slug: decodedId.toLowerCase() },
          { title: decodedId },
          { title: rawId },
        ],
      });
    }

    if (!course) {
      return NextResponse.json(
        { success: false, message: "Course not found or already deleted." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Course deleted successfully." });
  } catch (error) {
    console.error("DeleteCourse error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to delete course" },
      { status: 500 }
    );
  }
}
