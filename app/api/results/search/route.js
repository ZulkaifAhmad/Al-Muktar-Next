import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Result from "@/lib/models/result.model";

// GET /api/results/search
// Students search by: Student Name (Required) + Father Name (Required) + optional Course / Exam Type / Class
export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);

    const studentName = searchParams.get("studentName")?.trim();
    const fatherName = searchParams.get("fatherName")?.trim();
    const courseName = searchParams.get("courseName")?.trim();
    const examType = searchParams.get("examType")?.trim();
    const className = searchParams.get("className")?.trim();
    const rollNumber = searchParams.get("rollNumber")?.trim();

    if (!studentName || !fatherName) {
      if (!rollNumber) {
        return NextResponse.json(
          {
            success: false,
            message: "Please enter both Student Name and Father Name to search your examination result.",
          },
          { status: 400 }
        );
      }
    }

    const filter = {};

    if (studentName && fatherName) {
      const escapeRegex = (text) => text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
      filter.studentName = { $regex: new RegExp(`^${escapeRegex(studentName)}$`, "i") };
      filter.fatherName = { $regex: new RegExp(`^${escapeRegex(fatherName)}$`, "i") };
    } else if (rollNumber) {
      filter.rollNumber = { $regex: `^${rollNumber}$`, $options: "i" };
    }

    // Optional filters
    if (courseName && courseName !== "all" && courseName !== "") {
      filter.courseName = { $regex: `^${courseName}$`, $options: "i" };
    }

    if (examType && examType !== "all" && examType !== "") {
      filter.examType = examType;
    }

    if (className && className !== "all" && className !== "") {
      filter.className = { $regex: `^${className}$`, $options: "i" };
    }

    let results = await Result.find(filter).sort({ createdAt: -1 }).lean();

    // Fallback search with substring containment if exact match yielded 0
    if ((!results || results.length === 0) && studentName && fatherName) {
      const fallbackFilter = {
        studentName: { $regex: studentName, $options: "i" },
        fatherName: { $regex: fatherName, $options: "i" },
      };
      if (courseName && courseName !== "all" && courseName !== "") {
        fallbackFilter.courseName = { $regex: `^${courseName}$`, $options: "i" };
      }
      if (examType && examType !== "all" && examType !== "") {
        fallbackFilter.examType = examType;
      }
      results = await Result.find(fallbackFilter).sort({ createdAt: -1 }).lean();
    }

    if (!results || results.length === 0) {
      return NextResponse.json({
        success: true,
        found: false,
        message: `No examination result found for Student "${studentName}" (S/O ${fatherName})${
          courseName && courseName !== "all" ? ` in "${courseName}"` : ""
        }. Please verify the spelling or contact the administration.`,
        results: [],
      });
    }

    return NextResponse.json({
      success: true,
      found: true,
      count: results.length,
      results,
    });
  } catch (error) {
    console.error("SearchResult error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to search result" },
      { status: 500 }
    );
  }
}
