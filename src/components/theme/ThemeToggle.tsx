import dynamic from "next/dynamic";
import React from "react";

const ThemeWorker = dynamic(() => import("./ThemeWorker"), { ssr: false });

export default function ThemeToggle() {
  return <ThemeWorker />;
}
