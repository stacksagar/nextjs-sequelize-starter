import { NextRequest, NextResponse } from "next/server";
import MerchantProfile from "@/models/MerchantProfile";
import { isAdmin } from "@/server/user.actions";

// PATCH: Update a merchant profile by id
export async function PATCH(req: NextRequest) {
  try {
    await isAdmin();
    const { id, ...updateData } = await req.json();
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
    await merchant.update(updateData);
    return NextResponse.json({ success: true, merchant });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Server error" },
      { status: 500 }
    );
  }
}

// DELETE: Delete a merchant profile by id
export async function DELETE(req: NextRequest) {
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
    await merchant.destroy();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Server error" },
      { status: 500 }
    );
  }
}
