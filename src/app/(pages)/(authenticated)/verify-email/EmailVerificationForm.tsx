"use client";

import OTPInputs from "@/components/common/forms/OTPInputs";
import OutlineCircleIcon from "@/components/icons/OutlineCircleIcon";
import { Button } from "@mantine/core";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { BiEnvelopeOpen } from "react-icons/bi";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import useResendVerification from "@/hooks/useResendVerification";
import User from "@/models/User";

export default function EmailVerificationForm({ user }: { user?: User }) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await axios.post("/api/auth/verify-email", { code });
      toast.success("Email verified successfully!");
      if (user?.role === "merchant") {
        router.push("/account-setup");
      } else {
        router.push("/profile");
      }
    } catch (err: any) {
      setError(err?.response?.data?.error || "Verification failed");
    } finally {
      setLoading(false);
    }
  }

  const { handleResend, resendTimer, resending, setResendTimer } =
    useResendVerification();

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  return (
    <form className="py-20 lg:py-32" onSubmit={handleSubmit}>
      <div className="w-fit lg:w-[600px] p-5 mx-auto shadow rounded-lg space-y-9">
        <div className="w-full space-y-5">
          <div className="w-full flex justify-center">
            <OutlineCircleIcon width={48} height={48}>
              <BiEnvelopeOpen size="24" className="text-[#060ACD]" />
            </OutlineCircleIcon>
          </div>

          <div className="space-y-2">
            <div className="self-stretch text-center justify-start  text-lg font-medium leading-7">
              Please check your email.
            </div>

            <div className="self-stretch text-center justify-start text-sm font-normal leading-tight">
              <span>We've sent a code to</span>
              <span> {user?.email} </span>
            </div>
          </div>

          <OTPInputs onOTP={setCode} quantity={6} />

          {error && (
            <div className="text-red-600 text-sm font-medium text-center">
              {error}
            </div>
          )}

          <div className="flex gap-x-1 justify-center items-center">
            <span className="text-gray-500 text-sm font-normal leading-none">
              Code not received?
            </span>
            {resendTimer > 0 ? (
              <span className="text-blue-800 !text-sm font-normal underline leading-none cursor-not-allowed select-none">
                Resend code in 00:{resendTimer.toString().padStart(2, "0")}
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
        </div>

        <div className="flex justify-between gap-x-2">
          <Link href="/auth/signup" className="block w-full">
            <Button
              type="button"
              size="md"
              className="!bg-transparent !text-gray-700 !border !border-zinc-300 !w-full"
              disabled={loading}
            >
              Cancel
            </Button>
          </Link>

          <Button
            type="submit"
            size="md"
            className="!bg-blue-800 !w-full"
            loading={loading}
            disabled={code.length !== 6}
          >
            Confirm
          </Button>
        </div>
      </div>
    </form>
  );
}
