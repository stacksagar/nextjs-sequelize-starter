import React from "react";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  count?: number;
  children: any;
}

export default function CountButton({ children, count, ...all }: Props) {
  return (
    <button {...all} className="w-10 h-9 relative cursor-pointer">
      <div className="MdiLightCart w-8 h-8 left-0 top-[6px] absolute overflow-hidden">
        <div className="Vector left-[1.33px] top-[4px] absolute">
          {children}
        </div>
      </div>
      <div className="Frame1618868608 w-5 h-5 left-[22.31px] top-0 absolute bg-Emerald-800 rounded-[34px] inline-flex justify-center items-center bg-green-800">
        <div className="justify-start text-white text-[10px] font-medium  leading-none">
          {count || 0}
        </div>
      </div>
    </button>
  );
}
