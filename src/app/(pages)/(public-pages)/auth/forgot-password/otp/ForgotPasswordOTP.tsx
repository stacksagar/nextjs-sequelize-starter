"use client";

import AuthContainer from "@/components/common/forms/AuthContainer";
import FormHeader from "@/components/common/forms/FormHeader";
import { Button } from "@mantine/core";
import Image from "next/image";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const OTPInputs = dynamic(() => import("@/components/common/forms/OTPInputs"), {
  ssr: false,
});

export default function ForgotPasswordOTP() {
  const router = useRouter();
  const [timer, setTimer] = React.useState(30);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = React.useState(false);
  const [otp, setOtp] = useState("");

  React.useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  // Get email from localStorage (set it in ForgotPasswordForm after submit)
  const email =
    typeof window !== "undefined"
      ? localStorage.getItem("kuponna_reset_email")
      : "";

  const handleResend = async () => {
    if (!email) {
      toast.error("No email found. Please go back and enter your email again.");
      return;
    }
    setResending(true);
    try {
      await axios.post("/api/auth/resend-reset-code", { email });
      toast.success("Reset code resent to your email.");
      setTimer(30);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.error || "Failed to resend code. Please try again."
      );
    } finally {
      setResending(false);
    }
  };

  async function verifyOTP(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email || !otp) {
      toast.error("Please enter the code sent to your email.");
      return;
    }
    setLoading(true);
    try {
      await axios.post("/api/auth/verify-reset-token", {
        email,
        token: otp,
      });

      // Save the resetToken (JWT) in localStorage for next step
      if (typeof window !== "undefined") {
        localStorage.setItem("kuponna_reset_email", email);
        localStorage.setItem("kuponna_reset_otp", otp);
      }
      toast.success("OTP verified. Set your new password.");
      router.push("/auth/new-password");
    } catch (err: any) {
      toast.error(
        err?.response?.data?.error ||
          "Invalid or expired code. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={verifyOTP}>
      <AuthContainer>
        <FormHeader
          title={<p className="w-full text-center">Check your mail 👋</p>}
          description={
            <>
              <p className="w-full text-center text-[#4F4F4F] leading-[1.6] tracking-[0.2px]">
                A code has been sent to your device.
              </p>
            </>
          }
        />

        <div className="space-y-6 w-full">
          <Image
            width={138}
            height={138}
            className="mx-auto"
            src="/icons/otp-verified.png"
            alt=""
          />

          <div className="flex gap-x-1 justify-center items-center">
            <span className="text-gray-500 text-sm font-normal leading-none">
              Code not received?
            </span>
            {timer > 0 ? (
              <span className="text-blue-800 !text-sm font-normal underline leading-none cursor-not-allowed select-none">
                Resend code in 00:{timer.toString().padStart(2, "0")}
              </span>
            ) : (
              <button
                type="button"
                className="text-blue-800 !text-sm font-normal underline leading-none cursor-pointer"
                onClick={handleResend}
                disabled={resending}
              >
                {resending ? "Resending..." : "Resend code"}
              </button>
            )}
          </div>

          <OTPInputs onOTP={setOtp} quantity={6} />
        </div>

        <Button
          loading={loading}
          type="submit"
          size="lg"
          className="!bg-blue-800 !w-full"
        >
          Verify
        </Button>
      </AuthContainer>
    </form>
  );
}
