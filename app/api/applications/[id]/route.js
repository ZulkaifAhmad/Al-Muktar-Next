import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Application from "@/lib/models/application.model";
import { getAuthUser } from "@/lib/auth";

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
    const id = resolvedParams?.id;

    const application = await Application.findByIdAndDelete(id);
    if (!application) {
      return NextResponse.json(
        { success: false, message: "Application not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Application deleted.",
    });
  } catch (error) {
    console.error("DeleteApplication error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
