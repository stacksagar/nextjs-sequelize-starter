import React from "react";
import EmailVerificationForm from "./EmailVerificationForm";
import { Metadata } from "next";
import { getUser } from "@/server/user.actions";

export const metadata: Metadata = {
  title: "Verify Your Email | Kyridaa",
};

export default async function page() {
  const user = await getUser();
  return <EmailVerificationForm user={user} />;
}
