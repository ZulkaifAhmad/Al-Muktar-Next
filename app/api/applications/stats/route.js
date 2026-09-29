import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Application from "@/lib/models/application.model";
import { getAuthUser } from "@/lib/auth";

export async function GET(req) {
  try {
    await dbConnect();
    const auth = await getAuthUser(req);
    if (!auth || (auth.role !== "admin" && auth.role !== "superadmin")) {
      return NextResponse.json(
        { success: false, message: "Access denied. Admins only." },
        { status: 403 }
      );
    }

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const [result] = await Application.aggregate([
      {
        $facet: {
          statusCounts: [
            { $group: { _id: "$status", count: { $sum: 1 } } },
          ],
          trend: [
            { $match: { createdAt: { $gte: sevenDaysAgo } } },
            {
              $group: {
                _id: {
                  year: { $year: "$createdAt" },
                  month: { $month: "$createdAt" },
                  day: { $dayOfMonth: "$createdAt" },
                },
                count: { $sum: 1 },
              },
            },
            { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
          ],
          recent: [
            { $sort: { createdAt: -1 } },
            { $limit: 5 },
            { $project: { name: 1, course: 1, shift: 1, createdAt: 1 } },
          ],
        },
      },
    ]);

    const statusMap = {};
    (result?.statusCounts || []).forEach((s) => {
      statusMap[s._id] = s.count;
    });

    const total =
      (statusMap.pending || 0) + (statusMap.approved || 0) + (statusMap.rejected || 0);

    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const countByDate = {};
    (result?.trend || []).forEach((t) => {
      const key = `${t._id.year}-${t._id.month}-${t._id.day}`;
      countByDate[key] = t.count;
    });

    const weeklyTrend = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const year = d.getFullYear();
      const month = d.getMonth() + 1;
      const day = d.getDate();
      const dayName = daysOfWeek[d.getDay()];
      const key = `${year}-${month}-${day}`;

      weeklyTrend.push({
        day: `${dayName} (${monthNames[month - 1]} ${day})`,
        shortDay: dayName,
        date: `${monthNames[month - 1]} ${day}`,
        applications: countByDate[key] || 0,
      });
    }

    return NextResponse.json({
      success: true,
      stats: {
        total,
        pending: statusMap.pending || 0,
        approved: statusMap.approved || 0,
        rejected: statusMap.rejected || 0,
      },
      trend: weeklyTrend,
      recent: result?.recent || [],
    });
  } catch (error) {
    console.error("GetApplicationStats error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
