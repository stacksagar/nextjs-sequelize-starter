"use client";

import React from "react";
import MotionDiv from "./MotionDiv";

export default function MotionZoomEffect({
  children,
  onClick,
  value = 0.02,
  ...props
}: {
  className?: string;
  value?: number;
  onClick?: any;
  children: React.ReactNode;
}) {
  return (
    <MotionDiv
      onClick={() => {
        onClick && onClick();
      }}
      whileHover={{ scale: 1 + value, transition: { duration: 0.2 } }}
      whileTap={{ scale: 1 - value, transition: { duration: 0.3 } }}
      style={{ transform: `scale(${1 - value})` }}
      whileInView={{ scale: 1, transition: { duration: 0.4 } }}
      {...props}
    >
      {children}
    </MotionDiv>
  );
}
