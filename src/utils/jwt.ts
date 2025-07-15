import { SignJWT, jwtVerify, JWTPayload } from "jose";

const JWT_SECRET = process.env.JWT_SECRET;

export interface JwtPayload extends JWTPayload {
  userId: string;
  email: string;
  role: string;
  isVerified: boolean;
  merchantVerified: boolean;
}

export async function signJWT(
  payload: JwtPayload,
  expiresIn: string = "24h"
): Promise<string> {
  try {
    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(expiresIn)
      .sign(new TextEncoder().encode(JWT_SECRET));

    return token;
  } catch (error) {
    console.error("JWT signing error:", error);
    throw new Error("Failed to sign JWT token");
  }
}

export async function verifyJWT(token: string): Promise<JwtPayload | null> {
  try {
    const verified = await jwtVerify(
      token,
      new TextEncoder().encode(JWT_SECRET)
    );
    return verified.payload as unknown as JwtPayload;
  } catch (error) {
    console.error("JWT verification error:", error);
    return null;
  }
}

export function extractTokenFromHeader(
  authHeader: string | undefined
): string | null {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.split(" ")[1];
}

export function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const expirationTime = payload.exp * 1000; // Convert to milliseconds
    return Date.now() >= expirationTime;
  } catch (error) {
    console.error("Error checking token expiration:", error);
    return true;
  }
}

export function decodeJWT(token: string): JwtPayload | null {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload as JwtPayload;
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
}
