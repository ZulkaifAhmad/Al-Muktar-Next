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
    const { results, defaultCourse, defaultSession } = body;

    if (!results || !Array.isArray(results) || results.length === 0) {
      return NextResponse.json(
        { success: false, message: "No result records provided for bulk import." },
        { status: 400 }
      );
    }

    let insertedCount = 0;
    let updatedCount = 0;
    let failedCount = 0;
    const errors = [];

    for (let i = 0; i < results.length; i++) {
      const raw = results[i];
      try {
        const rollNumber = String(raw.rollNumber || raw["Roll No"] || raw["Roll Number"] || raw["RollNo"] || "").trim().toUpperCase();
        const studentName = String(raw.studentName || raw["Student Name"] || raw["Name"] || "").trim();
        const fatherName = String(raw.fatherName || raw["Father Name"] || raw["Guardian Name"] || "").trim();
        const courseName = String(raw.courseName || raw["Course"] || raw["Course Name"] || defaultCourse || "Quran & Islamic Studies").trim();
        const examSession = String(raw.examSession || raw["Session"] || raw["Exam Session"] || raw["Exam"] || defaultSession || "Annual Examination 2025-2026").trim();
        const batchYear = String(raw.batchYear || raw["Batch"] || raw["Year"] || "2025-2026").trim();

        if (!rollNumber || !studentName) {
          failedCount++;
          errors.push(`Row ${i + 1}: Missing Roll Number or Student Name`);
          continue;
        }

        // Subjects parsing if array or comma separated
        let subjects = [];
        if (Array.isArray(raw.subjects) && raw.subjects.length > 0) {
          subjects = raw.subjects;
        }

        // Extract total & obtained marks
        let totalMarks = Number(raw.totalMarks || raw["Total Marks"] || raw["Total"] || 100);
        let obtainedMarks = Number(raw.obtainedMarks || raw["Obtained Marks"] || raw["Marks"] || raw["Obtained"] || 0);

        if (isNaN(totalMarks) || totalMarks <= 0) totalMarks = 100;
        if (isNaN(obtainedMarks)) obtainedMarks = 0;

        let percentage = Number(raw.percentage || raw["Percentage"] || raw["%"] || 0);
        if (!percentage || isNaN(percentage)) {
          percentage = totalMarks > 0 ? Number(((obtainedMarks / totalMarks) * 100).toFixed(2)) : 0;
        }

        let grade = String(raw.grade || raw["Grade"] || "").trim();
        if (!grade) {
          if (percentage >= 90) grade = "A+";
          else if (percentage >= 80) grade = "A";
          else if (percentage >= 70) grade = "B";
          else if (percentage >= 60) grade = "C";
          else if (percentage >= 50) grade = "D";
          else grade = "F";
        }

        let status = String(raw.status || raw["Status"] || raw["Result Status"] || "").trim();
        if (!status || !["Pass", "Fail", "Withheld", "Position Holder", "Promoted", "Distinction"].includes(status)) {
          status = percentage >= 50 ? "Pass" : "Fail";
        }

        const position = String(raw.position || raw["Position"] || raw["Rank"] || "").trim();
        const remarks = String(raw.remarks || raw["Remarks"] || raw["Comments"] || (status === "Pass" ? "Passed with good performance" : "Needs Improvement")).trim();
        const resultPdfUrl = String(raw.resultPdfUrl || raw["PDF URL"] || raw["PdfUrl"] || "").trim();
        const pdfName = String(raw.pdfName || raw["PDF Name"] || "").trim();

        const docData = {
          rollNumber,
          studentName,
          fatherName,
          courseName,
          courseSlug: raw.courseSlug || "",
          examSession,
          batchYear,
          subjects,
          totalMarks,
          obtainedMarks,
          percentage,
          grade,
          status,
          position,
          remarks,
          resultPdfUrl,
          pdfName,
          published: raw.published !== false,
          issueDate: raw.issueDate ? new Date(raw.issueDate) : new Date(),
        };

        const existing = await Result.findOne({
          rollNumber,
          courseName,
          examSession,
        });

        if (existing) {
          await Result.findByIdAndUpdate(existing._id, docData);
          updatedCount++;
        } else {
          await Result.create(docData);
          insertedCount++;
        }
      } catch (rowErr) {
        failedCount++;
        errors.push(`Row ${i + 1}: ${rowErr.message}`);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Bulk import completed! Inserted: ${insertedCount}, Updated: ${updatedCount}, Failed: ${failedCount}`,
      stats: {
        total: results.length,
        inserted: insertedCount,
        updated: updatedCount,
        failed: failedCount,
        errors,
      },
    });
  } catch (error) {
    console.error("BulkImportResults error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to process bulk import" },
      { status: 500 }
    );
  }
}
