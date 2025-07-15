import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import { getUserId } from "@/server/user.actions";

// PATCH /api/user/profile - Update user info (auth required)
export async function PATCH(request: NextRequest) {
  try {
    const userId = await getUserId();
    const user = await User.findByPk(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updateBody = await request.json();
    // Prevent updating password, id, createdAt, updatedAt, lastLogin, role, isVerified, merchantVerified
    const notAllowed = [
      "id",
      "password",
      "createdAt",
      "updatedAt",
      "lastLogin",
      "role",
      "isVerified",
      "merchantVerified",
    ];
    const updateData: any = {};
    for (const key in updateBody) {
      if (
        !notAllowed.includes(key) &&
        Object.prototype.hasOwnProperty.call(user?.toJSON(), key)
      ) {
        updateData[key] = updateBody[key];
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }
    await user.update(updateData);
    const { password, ...userWithoutPassword } = user?.toJSON();
    return NextResponse.json({
      message: "Profile updated successfully",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
