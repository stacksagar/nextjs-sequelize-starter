import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJWT } from "@/utils/jwt";
import User from "@/models/User";
import VerificationCode from "@/models/VerificationCode";
import { generateVerificationCode } from "@/utils/verification";
import { addMinutes } from "date-fns";
import { sendEmail } from "@/lib/sendEmail";
import { getVerificationEmailTemplate } from "@/templates/verificationEmail";
import connectDB from "@/config/connectDB";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

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

    if (user.isVerified) {
      return NextResponse.json(
        { error: "Email already verified" },
        { status: 400 }
      );
    }

    // Delete any existing verification codes
    await VerificationCode.destroy({
      where: { userId: user.id },
    });

    // Generate new verification code
    const code = generateVerificationCode();
    const expiresAt = addMinutes(new Date(), 30); // 30 minutes expiry

    // Create new verification code
    await VerificationCode.create({
      userId: user.id,
      code: code.toUpperCase(),
      expiresAt,
    });

    await sendEmail({
      to: user.email,
      subject: "Verification Code",
      body: getVerificationEmailTemplate(code),
    });

    return NextResponse.json(
      { message: "Verification code sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Resend verification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
