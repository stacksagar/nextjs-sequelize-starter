import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import { z } from "zod";
import { cookies } from "next/headers";
import connectDB from "@/config/connectDB";
import { signJWT } from "@/utils/jwt";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  rememberMe: z.boolean().optional().default(false),
});

export async function POST(request: NextRequest) {
  try {
    // Connect to database
    await connectDB();

    // Validate request body
    const body = await request.json();
    const validatedData = loginSchema.parse(body);

    // Find user

    const user = await User.findOne({
      where: {
        email: validatedData.email.toLowerCase(), // Ensure case-insensitive comparison
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Verify password using the model's method
    const isValidPassword = await user.comparePassword(validatedData.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Update last login
    await user.update({ lastLogin: new Date() });

    // Generate JWT token with dynamic expiration
    const jwtExpiration = validatedData.rememberMe ? "30d" : "24h";
    const token = await signJWT(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        isVerified: user?.isVerified,
        merchantVerified: user?.merchantVerified,
      },
      jwtExpiration
    );

    // Set cookie with dynamic maxAge based on rememberMe option
    const cookieStore = await cookies();
    const maxAge = validatedData.rememberMe
      ? 30 * 24 * 60 * 60 // 30 days
      : 24 * 60 * 60; // 24 hours

    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge,
      path: "/",
    });

    // Remove password from response
    const { password, ...userWithoutPassword } = user?.toJSON();

    return NextResponse.json({
      message: "Login successful",
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error", errors: error },
      { status: 500 }
    );
  }
}
