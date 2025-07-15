import React from "react";
import SignupForm from "./SignupForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Signup | Kyridaa",
};

export default function page() {
  return <SignupForm />;
}
