import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Result from "@/lib/models/result.model";
import { getAuthUser } from "@/lib/auth";

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
    const { results, defaultCourse, defaultClass, defaultExamType, defaultSession } = body;

    if (!results || !Array.isArray(results) || results.length === 0) {
      return NextResponse.json(
        { success: false, message: "No result records provided for batch entry." },
        { status: 400 }
      );
    }

    let insertedCount = 0;
    let failedCount = 0;
    const errors = [];

    for (let i = 0; i < results.length; i++) {
      const item = results[i];
      try {
        const studentName = String(item.studentName || "").trim();
        const fatherName = String(item.fatherName || "").trim();
        const courseName = String(item.courseName || defaultCourse || "").trim();
        const className = String(item.className || defaultClass || "General Class").trim();
        const examType = String(item.examType || defaultExamType || "Annual").trim();

        if (!studentName || !fatherName || !courseName) {
          failedCount++;
          errors.push(`Row ${i + 1}: Student Name, Father Name, and Course Name are required.`);
          continue;
        }

        const docData = {
          studentName,
          fatherName,
          rollNumber: item.rollNumber ? String(item.rollNumber).trim().toUpperCase() : "",
          courseName,
          courseId: item.courseId || null,
          className,
          examType,
          examSession: item.examSession || defaultSession || "Annual Examination 2025-2026",
          batchYear: item.batchYear || "2025-2026",
          subjects: Array.isArray(item.subjects) ? item.subjects : [],
          customFields: Array.isArray(item.customFields) ? item.customFields : [],
          totalMarks: Number(item.totalMarks) || 100,
          obtainedMarks: Number(item.obtainedMarks) || 0,
          percentage: Number(item.percentage) || 0,
          grade: item.grade || "Pass",
          status: item.status || "Pass",
          position: item.position || "",
          remarks: item.remarks || "Commendable academic performance",
          isReleased: item.isReleased !== false,
          holdReason: item.holdReason || "",
          issueDate: item.issueDate ? new Date(item.issueDate) : new Date(),
        };

        await Result.create(docData);
        insertedCount++;
      } catch (err) {
        failedCount++;
        errors.push(`Row ${i + 1} (${item.studentName || "Unnamed"}): ${err.message}`);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Batch upload complete! Successfully saved ${insertedCount} student results.${
        failedCount > 0 ? ` (${failedCount} failed)` : ""
      }`,
      stats: {
        total: results.length,
        inserted: insertedCount,
        failed: failedCount,
        errors,
      },
    });
  } catch (error) {
    console.error("BatchUploadResults error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to process batch results entry" },
      { status: 500 }
    );
  }
}
