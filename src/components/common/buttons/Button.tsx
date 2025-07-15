import React from "react";
import MotionZoomEffect from "../MotionZoomEffect";
import { FaSpinner } from "react-icons/fa";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  loading?: boolean;
  icon?: React.ReactNode | string;
}

export default function Button({ children, loading, icon, ...all }: Props) {
  return (
    <MotionZoomEffect>
      <button
        {...all}
        className={`flex justify-center items-center flex-grow-0 flex-shrink-0 h-[48px] md:h-[54px] relative gap-x-1.5 sm:gap-3 px-4 py-2.5 sm:px-6 sm:py-4 rounded-full bg-[#060acd] text-white cursor-pointer focus:ring-4 focus:ring-blue-500 transform transition-all disabled:!opacity-75 ${all.className} `}
      >
        {icon || <span />}
        {children}
        {loading ? <FaSpinner className="animate-spin" /> : <span />}
      </button>
    </MotionZoomEffect>
  );
}
