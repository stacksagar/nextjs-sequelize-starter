import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export function useLogout(options?: { redirectTo?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function logout() {
    setLoading(true);
    setError(null);
    try {
      await axios.post("/api/auth/logout");
      toast.success("Logged out successfully");
      if (options?.redirectTo) {
        location?.replace(options.redirectTo);
      } else {
        window.location.href = "/";
      }
    } catch (err: any) {
      setError(err?.response?.data?.error || "Logout failed");
      toast.error(err?.response?.data?.error || "Logout failed");
    } finally {
      setLoading(false);
    }
  }

  return { logout, loading, error };
}
