import React from "react";
import MotionZoomEffect from "../MotionZoomEffect";
import { FaSpinner } from "react-icons/fa";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon?: React.ReactNode | string;
  loading?: boolean;
  outline?: boolean;
  className?: string;
}

export default function ButtonMedium({
  icon,
  outline,
  loading,
  children,
  ...all
}: Props) {
  return (
    <MotionZoomEffect value={0.01}>
      <button
        {...all}
        className={`${
          outline
            ? "border border-[#E0E2E7] dark:border-gray-800 text-stone-500 dark:text-gray-300"
            : "bg-[#060acd] text-white"
        } flex justify-center items-center flex-grow-0 flex-shrink-0 h-[40px] sm:h-[48px] relative gap-3 px-4 sm:px-6 sm:py-4 rounded-full cursor-pointer focus:ring-4 focus:ring-blue-500 transform transition-all disabled:!opacity-75 !text-xs sm:!text-base whitespace-nowrap w-full ${
          all.className
        } `}
        disabled={loading ? true : false}
      >
        <div className="flex items-center w-full justify-between gap-x-1 sm:gap-x-2">
          {icon || <span />}
          {children}
          {loading ? <FaSpinner className="animate-spin" /> : <span />}
        </div>
      </button>
    </MotionZoomEffect>
  );
}
