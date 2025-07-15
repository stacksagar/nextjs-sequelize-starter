import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import User from "@/models/User";
import VerificationCode from "@/models/VerificationCode";
import { Op } from "sequelize";
import { verifyJWT } from "@/utils/jwt";
import connectDB from "@/config/connectDB";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { code } = await request.json();
    const cookieStore = await cookies();
    const token =
      cookieStore.get("token")?.value ||
      request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const decoded = await verifyJWT(token);

    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const user = await User.findByPk(decoded?.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Find the verification code
    const verificationCode = await VerificationCode.findOne({
      where: {
        userId: user.id,
        code: code.toUpperCase(),
        expiresAt: {
          [Op.gt]: new Date(),
        },
      },
    });

    if (!verificationCode) {
      return NextResponse.json(
        { error: "Invalid or expired verification code" },
        { status: 400 }
      );
    }

    // Update user verification status
    user.isVerified = true;
    await user.save();

    // Delete the used verification code
    await verificationCode.destroy();

    return NextResponse.json(
      { message: "Email verified successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
