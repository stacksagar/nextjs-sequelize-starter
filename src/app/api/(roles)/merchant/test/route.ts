import { isMerchant } from "@/server/user.actions";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await isMerchant();
    return NextResponse.json({ message: "Merchant test route", user });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Server error" },
      { status: 500 }
    );
  }
}
