import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import PasswordReset from "@/models/PasswordReset";
import { Op } from "sequelize";
import connectDB from "@/config/connectDB";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { email, token, newPassword } = await request.json();

    if (!email || !token || !newPassword) {
      return NextResponse.json(
        { error: "Email, token and new password are required" },
        { status: 400 }
      );
    }

    // Validate password
    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    const resetToken = await PasswordReset.findOne({
      where: {
        token: token.toUpperCase(),
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
      console.log("not");
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user password
    await User.update(
      { password: hashedPassword },
      { where: { id: resetToken.userId } }
    );

    await PasswordReset.destroy({ where: { id: resetToken.id } });

    return NextResponse.json(
      { message: "Password reset successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
