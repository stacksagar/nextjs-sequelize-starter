import { NextRequest, NextResponse } from "next/server";
import MerchantProfile from "@/models/MerchantProfile";
import { getUser, isMerchant } from "@/server/user.actions";

// PATCH /api/merchant/business-profile - Update merchant's business profile
export async function PATCH(request: NextRequest) {
  try {
    const user = await isMerchant();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    // Find the merchant profile for this user
    const merchantProfile = await MerchantProfile.findOne({
      where: { userId: user.id },
    });
    if (!merchantProfile) {
      return NextResponse.json(
        { error: "Merchant profile not found" },
        { status: 404 }
      );
    }
    const updateBody = await request.json();
    // Only block updating these fields
    const notAllowed = ["id", "userId", "status", "createdAt", "updatedAt"];
    const updateData: any = {};
    for (const key in updateBody) {
      if (
        !notAllowed.includes(key) &&
        Object.prototype.hasOwnProperty.call(merchantProfile.toJSON(), key)
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
    await merchantProfile.update(updateData);
    return NextResponse.json({
      message: "Business profile updated successfully",
      merchantProfile,
    });
  } catch (error) {
    console.error("Update merchant profile error:", error);
    return NextResponse.json(
      { error: "Failed to update business profile" },
      { status: 500 }
    );
  }
}
