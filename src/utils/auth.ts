import { cookies } from "next/headers"; 
import User, { UserRole } from "@/models/User";
import { verifyJWT } from "./jwt";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export interface Session {
  userId: string;
  email: string;
  role: UserRole;
}

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return null;
  }

  try {
    const verified = await verifyJWT(token);

    return verified?.payload as unknown as Session;
  } catch (error) {
    return null;
  }
}

export async function getSessionUser() {
  const session = await getSession();
  if (!session || !session?.userId) return null;
  const user = await User.findByPk(session?.userId);
  if (!user || !user?.dataValues?.password) return null;
  const { password, ...userInfo } = user?.dataValues;
  return userInfo as User;
}

export function checkRole(requiredRole: UserRole, userRole: UserRole): boolean {
  if (userRole === UserRole.ADMIN) return true;
  if (requiredRole === UserRole.MERCHANT && userRole === UserRole.MERCHANT)
    return true;
  if (requiredRole === UserRole.USER && userRole === UserRole.USER) return true;
  return false;
}
