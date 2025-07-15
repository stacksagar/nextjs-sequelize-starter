"use server";

import { verifyJWT } from "@/utils/jwt";
import { cookies } from "next/headers";

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return { error: "No token provided", status: 401 };
  }

  try {
    const decoded = await verifyJWT(token);

    return decoded as any;
  } catch (error) {
    console.log("error ", error);
    return { error: "Invalid or expired token", status: 401 };
  }
}
