import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import User from "@/models/User";
import connectDB from "@/config/connectDB";
import bcrypt from "bcryptjs";
import { verifyJWT } from "@/utils/jwt";

export async function PATCH(request: NextRequest) {
  try {
    await connectDB();
    const cookieStore = await cookies();
    const token =
      cookieStore.get("token")?.value ||
      request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    const decoded = await verifyJWT(token);

    if (!decoded || !decoded.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const user = await User.findByPk(decoded.userId as string);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword)
      throw new Error("Current and new passwords are required");

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isPasswordValid) throw new Error("Current password is incorrect");

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await user.update({ password: hashedPassword });

    return NextResponse.json({
      message: "Password changed successfully",
      ok: true,
    });
  } catch (error: any) {
    console.error("Change password error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to change password" },
      { status: 500 }
    );
  }
}
