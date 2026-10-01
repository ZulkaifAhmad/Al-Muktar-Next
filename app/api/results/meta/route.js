import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Result from "@/lib/models/result.model";
import Course from "@/lib/models/course.model";

export async function GET() {
  try {
    await dbConnect();

    const [dbCourses, resultCourses, resultSessions, totalCount, releasedCount, heldCount] = await Promise.all([
      Course.find().select("title slug _id").lean(),
      Result.distinct("courseName"),
      Result.distinct("session"),
      Result.countDocuments(),
      Result.countDocuments({ isReleased: true }),
      Result.countDocuments({ isReleased: false }),
    ]);

    // Unique list of course titles from DB and existing results
    const courseTitles = new Set();
    dbCourses.forEach((c) => {
      if (c.title) courseTitles.add(c.title.trim());
    });
    resultCourses.forEach((title) => {
      if (title) courseTitles.add(title.trim());
    });

    if (courseTitles.size === 0) {
      [
        "Quran Recitation & Tajweed",
        "Islamic Studies Fundamentals",
        "Arabic Language",
        "Hifz Program",
        "Dars-e-Nizami",
      ].forEach((title) => courseTitles.add(title));
    }

    const sessions = Array.from(
      new Set(
        [
          "2025-2026",
          "2024-2025",
          "Annual Examination 2025-2026",
          "Mid Term 2026",
          ...resultSessions.filter(Boolean),
        ]
      )
    );

    return NextResponse.json({
      success: true,
      courses: Array.from(courseTitles),
      sessions,
      stats: {
        totalResults: totalCount,
        releasedResults: releasedCount,
        heldResults: heldCount,
      },
    });
  } catch (error) {
    console.error("ResultMeta error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch metadata" },
      { status: 500 }
    );
  }
}
