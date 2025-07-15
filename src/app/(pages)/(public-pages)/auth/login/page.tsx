import React from "react";
import LoginForm from "./LoginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | Kyridaa",
};

export default function page() {
  return <LoginForm />;
}
