import React from "react";
import ForgotPasswordOTP from "./ForgotPasswordOTP";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Signup | Kyridaa",
};

export default function page() {
  return <ForgotPasswordOTP />;
}
