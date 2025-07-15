import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import VerificationCode from "@/models/VerificationCode";
import { z } from "zod";
import connectDB from "@/config/connectDB";
import { generateVerificationCode } from "@/utils/verification";
import { addMinutes } from "date-fns";
import { cookies } from "next/headers";
import { sendEmail } from "@/lib/sendEmail";
import { signJWT } from "@/utils/jwt";
import verifyEmailTemplate from "@/templates/verifyEmail";

enum UserRole {
  USER = "user",
  MERCHANT = "merchant",
}

const registerSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.nativeEnum(UserRole),
});

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Validate request body
    const body = await request.json();
    const validatedData = registerSchema.parse(body);

    // Check if user already exists - case insensitive
    const existingUser = await User.findOne({
      where: {
        email: validatedData.email.toLowerCase(),
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Create new user - email is stored in lowercase
    const user = await User.create({
      ...validatedData,
      email: validatedData.email.toLowerCase(),
      role: validatedData?.role === "merchant" ? "merchant" : "user",
      isVerified: false,
    });

    // Generate verification code
    const code = generateVerificationCode();
    const expiresAt = addMinutes(new Date(), 30); // 30 minutes expiry

    // Create verification code record
    await VerificationCode.create({
      userId: user.id,
      code,
      expiresAt,
    });

    try {
      await sendEmail({
        to: user.email,
        subject: "Verify Your Email - Kuponna",
        body: verifyEmailTemplate({
          code,
          name: user.name,
        }),
      });
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError);
      // Continue with registration even if email fails
    }

    // Generate JWT token
    const token = await signJWT({
      userId: user.id,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      merchantVerified: user.merchantVerified,
    });

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60, // 24 hours
      path: "/",
    });

    // Remove password from response
    const { password, ...userWithoutPassword } = user?.toJSON();

    return NextResponse.json(
      {
        message:
          "User registered successfully. Please check your email for verification code.",
        token,
        user: userWithoutPassword,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
