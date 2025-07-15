import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import User from "@/models/User";
import connectDB from "@/config/connectDB";
import { signJWT, verifyJWT } from "@/utils/jwt";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const cookieStore = await cookies();
    const token =
      cookieStore.get("token")?.value ||
      request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ error: "No token provided" });
    }

    const decoded = await verifyJWT(token);

    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const user = await User.findByPk(decoded?.userId as string);
    if (!user) {
      return NextResponse.json({ error: "User not found" });
    }

    // Check if the current token was set with long expiration (30 days)
    // We'll use a heuristic: if the token is still valid after more than 24 hours,
    // it was likely set with rememberMe=true
    const isLongLived =
      decoded.exp && decoded.exp - Math.floor(Date.now() / 1000) > 24 * 60 * 60;

    const jwtExpiration = isLongLived ? "30d" : "24h";
    const maxAge = isLongLived ? 30 * 24 * 60 * 60 : 24 * 60 * 60;

    const newToken = await signJWT(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        merchantVerified: user.merchantVerified,
      },
      jwtExpiration
    );

    cookieStore.set("token", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge,
      path: "/",
    });

    const { password, ...userWithoutPassword } = user?.toJSON();

    return NextResponse.json({
      message: "Token refreshed successfully",
      user: userWithoutPassword,
      token: newToken,
    });
  } catch (error) {
    console.error("Token refresh error:", error);
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 401 }
    );
  }
}
