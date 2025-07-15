"use client";

import dynamic from "next/dynamic";

const MotionDiv = dynamic(
  () => import("framer-motion").then((d) => d.motion.div),
  { ssr: false }
);

export default MotionDiv;
