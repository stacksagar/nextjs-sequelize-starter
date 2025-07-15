import React from "react";
import MotionZoomEffect from "../MotionZoomEffect";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  loading?: boolean;
}

export default function ButtonOutline({ children, ...all }: Props) {
  return (
    <MotionZoomEffect>
      <button
        {...all}
        className={`flex justify-center items-center flex-grow-0 flex-shrink-0 h-[56px] md:h-[64px] relative gap-3 px-6 py-4 rounded-full text-slate-700 border-1 border-slate-300 cursor-pointer focus:ring-4 focus:ring-blue-500 transform transition-all hover:scale-105 ${all.className} `}
      >
        {children}
      </button>
    </MotionZoomEffect>
  );
}
