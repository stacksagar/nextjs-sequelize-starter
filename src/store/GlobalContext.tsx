"use client";

import Notification from "@/models/Notification";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { createContext, useContext } from "react";

interface GlobalContextType {
  notifications?: Notification[];
  refetchNotifications: () => Promise<any>;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const useGlobalContext = () => {
  const ctx = useContext(GlobalContext);
  if (!ctx)
    throw new Error("Global Context must be used within a GlobalProvider");
  return ctx;
};

export const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { data: notifications = [], refetch: refetchNotifications } = useQuery<
    Notification[]
  >({
    queryKey: ["userNotifications"],
    queryFn: async () => {
      const res = await axios.get(`/api/user/notifications`);
      return res.data.items || [];
    },
  });

  return (
    <GlobalContext.Provider
      value={{
        notifications,
        refetchNotifications,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
