"use client";

import AuthContainer from "@/components/common/forms/AuthContainer";
import FormHeader from "@/components/common/forms/FormHeader"; 
import { Button } from "@mantine/core";
import axios from "axios";
import React from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import MCInputPassword from "@/components/common/forms/MCInputPassword";

export default function NewPasswordForm() {
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  // Get email, otp from localStorage
  const email =
    typeof window !== "undefined"
      ? localStorage.getItem("kuponna_reset_email") || ""
      : "";
  const otp =
    typeof window !== "undefined"
      ? localStorage.getItem("kuponna_reset_otp") || ""
      : "";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email || !otp) {
      toast.error(
        "Missing reset credentials. Please restart the reset process."
      );
      return;
    }
    if (!newPassword || newPassword.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await axios.post("/api/auth/reset-password", {
        email,
        token: otp,
        newPassword,
      });
      toast.success("Password reset successfully. Please login.");
      // Optionally clear localStorage
      localStorage.removeItem("kuponna_reset_email");
      localStorage.removeItem("kuponna_reset_otp");
      localStorage.removeItem("kuponna_reset_token");
      router.push("/auth/login");
    } catch (err: any) {
      toast.error(
        err?.response?.data?.error ||
          "Failed to reset password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <AuthContainer>
        <FormHeader
          title="Forgot Password 👋"
          description={
            <>
              <p>Setup your new password.</p>
            </>
          }
        />

        <div className="space-y-6">
          <MCInputPassword
            size="lg"
            id="new-password"
            type="password"
            placeholder="At least 8 characters!"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <MCInputPassword
            size="lg"
            id="confirm-password"
            type="password"
            placeholder="Confirm new password!"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <Button
            type="submit"
            size="lg"
            className="!bg-[#060acd] !w-full"
            loading={loading}
          >
            Update Password
          </Button>
        </div>
      </AuthContainer>
    </form>
  );
}
