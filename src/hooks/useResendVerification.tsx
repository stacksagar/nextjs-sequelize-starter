import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

export default function useResendVerification() {
  const [error, setError] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(30);
  const [resending, setResending] = useState(false);

  async function handleResend() {
    setResending(true);
    setError(null);
    try {
      await axios.post("/api/auth/resend-verification");
      toast.info("Verification code resent!");
      setResendTimer(30);
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to resend code");
    } finally {
      setResending(false);
    }
  }

  return { handleResend, error, resendTimer, setResendTimer, resending };
}
