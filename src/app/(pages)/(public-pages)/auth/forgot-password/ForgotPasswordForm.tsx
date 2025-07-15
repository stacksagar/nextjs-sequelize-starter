"use client";

import AuthContainer from "@/components/common/forms/AuthContainer";
import FormHeader from "@/components/common/forms/FormHeader";
import MCInput from "@/components/common/forms/MCInput";
import { Button } from "@mantine/core";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "react-toastify";

export default function ForgotPasswordForm() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e?.preventDefault();

    setLoading(true);
    const email = (
      e.currentTarget.elements.namedItem("email") as HTMLInputElement
    ).value;

    if (!email) {
      toast.error("Email is required.");
      setLoading(false);
      return;
    }

    try {
      await toast.promise(axios.post("/api/auth/forgot-password", { email }), {
        pending: "Sending code...",
        success: "Code sent to your email.",
        error: "Failed to send code. Please try again.",
      });
      // Persist email for OTP step
      if (typeof window !== "undefined") {
        localStorage.setItem("kuponna_reset_email", email);
      }
      router.push("/auth/forgot-password/otp");
    } catch (error) {
      console.error("Error sending forgot password code:", error);
      toast.error("Failed to send code. Please try again.");
      // Optionally, you can handle specific error cases here
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit}>
      <AuthContainer>
        <FormHeader
          title="Forgot Password 👋"
          description={
            <>
              <p>
                Enter the email address or mobile phone number associated with
                your account.
              </p>
            </>
          }
        />

        <div className="space-y-6">
          {/* <MCInput
            size="lg"
            id="phone-number"
            placeholder="081-----"
            required
          /> */}
          <MCInput
            size="lg"
            id="email"
            type="email"
            placeholder="Your e-mail address"
            required
          />

          <Button
            disabled={loading}
            loading={loading}
            type="submit"
            size="lg"
            className="!bg-[#060acd] !w-full"
          >
            {loading ? "Sending..." : "Send Code"}
          </Button>

          <div className="space-y-2 pt-4">
            <div className="w-full flex items-center gap-x-1 justify-center text-lg text-[#060acd]">
              <span>Already have an account?</span>
              <a
                href="/auth/login"
                className="text-right font-semibold text-[#060acd] hover:underline"
              >
                Sign in
              </a>
            </div>
            <div className="w-full flex items-center gap-x-1 justify-center text-lg text-[#060acd]">
              <span>Don't you have an account?</span>
              <Link
                href="/auth/signup"
                className="text-right font-semibold text-[#060acd] hover:underline"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </AuthContainer>
    </form>
  );
}
