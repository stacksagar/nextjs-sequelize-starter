"use client";

import User from "@/models/User";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useUser = () => {
  const {
    data: user,
    isLoading,
    error,
    refetch: refetchUser,
  } = useQuery<User | null>({
    queryKey: ["currentUser"],
    queryFn: async () => {
      try {
        const res = await axios.get("/api/auth/me");
        return res.data.user || null;
      } catch (error) {
        // If user is not authenticated, return null instead of throwing
        return null;
      }
    },
    retry: false, // Don't retry on auth failures
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    user,
    isLoading,
    error,
    refetchUser,
    isAuthenticated: !!user,
  };
};
