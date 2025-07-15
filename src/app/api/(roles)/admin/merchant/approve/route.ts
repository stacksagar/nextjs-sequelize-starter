import { NextRequest, NextResponse } from "next/server";
import MerchantProfile from "@/models/MerchantProfile";
import { isAdmin } from "@/server/user.actions";
import User from "@/models/User";
import { where } from "sequelize";

// PATCH: Update a merchant profile by id
export async function PATCH(req: NextRequest) {
  try {
    await isAdmin();
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json(
        { error: "Merchant id is required" },
        { status: 400 }
      );
    }
    const merchant = await MerchantProfile.findByPk(id);
    if (!merchant) {
      return NextResponse.json(
        { error: "Merchant not found" },
        { status: 404 }
      );
    }

    await User.update(
      { merchantVerified: true },
      { where: { id: merchant?.userId } }
    );

    await merchant.update({ status: "approved" });
    return NextResponse.json({ success: true, merchant });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Server error" },
      { status: 500 }
    );
  }
}
