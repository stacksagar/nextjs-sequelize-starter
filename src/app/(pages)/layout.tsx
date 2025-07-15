"use client";

import axios from "axios";
import React, { useEffect } from "react";

export default function layout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    axios.get("/api/auth/refresh");
  }, []);

  return children;
}
