import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import PasswordReset from "@/models/PasswordReset";
import { generateVerificationCode } from "@/utils/verification";
import { addMinutes } from "date-fns";
import { sendEmail } from "@/lib/sendEmail";
import { getForgotPasswordEmailTemplate } from "@/templates/forgotPasswordEmail";
import connectDB from "@/config/connectDB";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { error: "No account found with this email" },
        { status: 404 }
      );
    }

    // Generate OTP
    const otp = generateVerificationCode();
    const expiresAt = addMinutes(new Date(), 30); // 30 minutes expiry

    // Delete any existing unused password reset tokens for this user
    await PasswordReset.destroy({
      where: {
        userId: user.id,
        isUsed: false,
      },
    });

    // Create new password reset token
    await PasswordReset.create({
      userId: user.id,
      token: otp,
      expiresAt,
    });

    // Send email with OTP
    await sendEmail({
      to: user.email,
      subject: "Password Reset Request",
      body: getForgotPasswordEmailTemplate(otp),
    });

    return NextResponse.json(
      { message: "Password reset instructions sent to your email" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
