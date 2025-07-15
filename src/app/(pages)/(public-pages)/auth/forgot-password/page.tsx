import React from "react";
import ForgotPasswordForm from "./ForgotPasswordForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Signup | Kyridaa",
};

export default function page() {
  return <ForgotPasswordForm />;
}
