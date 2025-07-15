import React from "react";
import MotionDiv from "./MotionDiv";

export default function MotionFromTop({
  children,
  ...props
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <div style={{ opacity: "0 !important" }}> {children} </div>
      <MotionDiv
        style={{ top: "-20px" }}
        whileInView={{ top: 0, transition: { duration: 0.8 } }}
        {...props}
        className={`absolute inset-0 m-auto ${props.className}`}
      >
        {children}
      </MotionDiv>
    </div>
  );
}
