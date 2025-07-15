import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/server/user.actions";

// GET /api/auth/me - Get current user info
export async function GET(request: NextRequest) {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to get user info" },
      { status: 401 }
    );
  }
}
