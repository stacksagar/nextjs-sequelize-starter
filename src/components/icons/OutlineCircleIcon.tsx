import React from "react";

export default function OutlineCircleIcon({
  children,
  width = 40,
  height = 40,
  outline = "#E8F1FF",
  background = "#B3CCFF",
}: {
  children: React.ReactNode;
  width?: number;
  height?: number;
  outline?: string;
  background?: string;
}) {
  return (
    <div
      style={{
        width,
        height,
        background,
        outline: `${outline} 5px solid`,
        outlineOffset: "-5px",
      }}
      className="flex items-center justify-center rounded-full"
    >
      <div
        style={{
          // width: width / 2,
          // height: height / 2,
          overflow: "hidden",
        }}
      >
        {children}
      </div>
    </div>
  );
}
