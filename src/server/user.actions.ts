"use server";

import connectDB from "@/config/connectDB";
import { getSession } from "./auth.actions";
import User from "@/models/User";

export async function getUserId() {
  const user = await getUser();
  return user?.id;
}

export async function getUser() {
  await connectDB();

  const session = await getSession();

  const user = await User.findByPk(session?.userId as string);
  if (!user || !user?.dataValues?.password) return undefined;

  const { password, ...userData } = user?.dataValues;
  return JSON.parse(JSON.stringify(userData)) as User;
}

export async function isAuthenticated() {
  const user = await getUser();
  if (!user) throw new Error("User not found");
  return user;
}

export async function isAdmin() {
  const user = await isAuthenticated();
  if (user?.role !== "admin") throw new Error("Access denied");

  return user;
}

export async function isMerchant() {
  const user = await isAuthenticated();
  if (user?.role === "user") throw new Error("Access denied");

  return user;
}

export async function isVerified() {
  const user = await isAuthenticated();
  if (!user?.isVerified) throw new Error("User is not verified");

  return user;
}

export async function isUser() {
  const user = await isAuthenticated();
  if (user?.role !== "user") throw new Error("Access denied");

  return user;
}
