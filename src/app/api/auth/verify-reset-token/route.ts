import { NextRequest, NextResponse } from "next/server";
import PasswordReset from "@/models/PasswordReset";
import { Op } from "sequelize";
import connectDB from "@/config/connectDB";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { email, token } = await request.json();

    if (!email || !token) {
      return NextResponse.json(
        { error: "Email and token are required" },
        { status: 400 }
      );
    }

    const resetToken = await PasswordReset.findOne({
      where: {
        token,
        isUsed: false,
        expiresAt: {
          [Op.gt]: new Date(), // Token not expired
        },
      },
      include: [
        {
          association: "user",
          where: { email },
          attributes: ["id", "email"],
        },
      ],
    });

    if (!resetToken) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Token verified successfully", resetToken },
      { status: 200 }
    );
  } catch (error) {
    console.error("Verify reset token error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
