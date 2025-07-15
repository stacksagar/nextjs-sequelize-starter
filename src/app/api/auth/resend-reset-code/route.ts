import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import PasswordReset from "@/models/PasswordReset";
import { generateVerificationCode } from "@/utils/verification";
import { addMinutes, isAfter } from "date-fns";
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

    // Try to find an existing, unexpired, unused reset code
    let reset = await PasswordReset.findOne({
      where: {
        userId: user.id,
        isUsed: false,
        expiresAt: { $gt: new Date() },
      },
      order: [["createdAt", "DESC"]],
    });

    let otp: string;
    let expiresAt: Date;

    if (reset && isAfter(new Date(reset.expiresAt), new Date())) {
      // Reuse existing code
      otp = reset.token;
      expiresAt = reset.expiresAt;
    } else {
      // Delete any old unused codes
      await PasswordReset.destroy({
        where: {
          userId: user.id,
          isUsed: false,
        },
      });
      // Generate new code
      otp = generateVerificationCode();
      expiresAt = addMinutes(new Date(), 30);
      await PasswordReset.create({
        userId: user.id,
        token: otp,
        expiresAt,
      });
    }

    // Send email with OTP
    await sendEmail({
      to: user.email,
      subject: "Password Reset Request",
      body: getForgotPasswordEmailTemplate(otp),
    });

    return NextResponse.json(
      { message: "Reset code sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Resend reset code error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
