"use client";

import React from "react";
import MotionDiv from "./MotionDiv";

export default function CardMotionEffect({
  children,
  ...props
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <MotionDiv
      whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.97, transition: { duration: 0.3 } }}
      style={{ transform: "scale(0.97)" }}
      whileInView={{ scale: 1, transition: { duration: 0.4 } }}
      {...props}
    >
      {children}
    </MotionDiv>
  );
}
