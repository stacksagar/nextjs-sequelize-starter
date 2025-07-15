import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  // Clear the authentication cookie
  const cookieStore = await cookies();
  const token =
    cookieStore.get("token")?.value ||
    request.headers.get("Authorization")?.replace("Bearer ", "");

  cookieStore.delete("token");

  return NextResponse.json({
    message: token ? "Logged out successfully" : "Not logged in",
  });
}
