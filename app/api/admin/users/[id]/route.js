import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/lib/models/user.model";
import { getAuthUser, isSuperAdminUser } from "@/lib/auth";

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const auth = await getAuthUser(req);
    if (!auth || !auth.user || !isSuperAdminUser(auth.user)) {
      return NextResponse.json(
        {
          success: false,
          message: "Access Denied: Only Super Administrators have permission to delete user and administrator accounts.",
        },
        { status: 403 }
      );
    }

    const resolvedParams = await params;
    const id = resolvedParams?.id;

    const targetUser = await User.findById(id);
    if (!targetUser) {
      return NextResponse.json(
        { success: false, message: "User account not found." },
        { status: 404 }
      );
    }

    if (targetUser._id.toString() === auth.user._id.toString()) {
      return NextResponse.json(
        {
          success: false,
          message: "You cannot delete your own active administrator account.",
        },
        { status: 400 }
      );
    }

    await User.findByIdAndDelete(id);
    return NextResponse.json({
      success: true,
      message: `Account '${targetUser.username}' (${targetUser.role}) has been deleted successfully.`,
    });
  } catch (error) {
    console.error("DeleteUser error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
