import React from "react";
import ForgotPasswordForm from "./NewPasswordForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Signup | Kyridaa",
};

export default function page() {
  return <ForgotPasswordForm />;
}
