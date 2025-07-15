import { NextRequest, NextResponse } from "next/server";
import MerchantProfile from "@/models/MerchantProfile";
import { cookies } from "next/headers";
import { verifyJWT } from "@/utils/jwt";

// POST: Create MerchantProfile
export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token =
      cookieStore.get("token")?.value ||
      req.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    const payload = await verifyJWT(token);
    const userId = payload?.userId;

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized: No userId in token" },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await req.json();
    // Check if profile already exists
    let merchantProfile = await MerchantProfile.findOne({ where: { userId } });
    if (merchantProfile) {
      // Update existing profile with provided data
      await merchantProfile.update(body);
      return NextResponse.json({
        success: true,
        merchantProfile,
        updated: true,
      });
    }

    // Create new MerchantProfile
    merchantProfile = await MerchantProfile.create({
      ...body,
      userId,
    });
    return NextResponse.json({ success: true, merchantProfile, created: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Server error", details: error },
      { status: 500 }
    );
  }
}
