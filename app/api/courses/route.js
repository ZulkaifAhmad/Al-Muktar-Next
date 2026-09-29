import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Course from "@/lib/models/course.model";
import Application from "@/lib/models/application.model";
import { getAuthUser } from "@/lib/auth";
import { courseCreateSchema, validatePayload } from "@/lib/validations";

export async function GET() {
  try {
    await dbConnect();
    const courses = await Course.find().sort({ createdAt: -1 }).lean();

    let countMap = {};
    try {
      const counts = await Application.aggregate([
        {
          $group: {
            _id: "$course",
            count: { $sum: 1 },
          },
        },
      ]);
      counts.forEach((item) => {
        if (item._id) {
          countMap[item._id] = item.count;
        }
      });
    } catch {
      countMap = {};
    }

    const coursesWithCount = courses.map((course) => {
      const count =
        (countMap[course.slug] || 0) +
        (countMap[course.title] || 0) +
        (countMap[course._id?.toString()] || 0);
      return {
        ...course,
        applicationCount: count,
        students: course.students || count,
      };
    });

    return NextResponse.json({ success: true, courses: coursesWithCount });
  } catch (error) {
    console.error("GetAllCourses error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch courses" },
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
    const validation = validatePayload(courseCreateSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: validation.error },
        { status: 400 }
      );
    }

    const course = await Course.create(validation.data);
    return NextResponse.json({ success: true, course }, { status: 201 });
  } catch (error) {
    console.error("CreateCourse error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to create course" },
      { status: 500 }
    );
  }
}
