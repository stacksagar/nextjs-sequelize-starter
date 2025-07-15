import { BellIcon } from "lucide-react";
import React from "react";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  count?: number;
}

export default function HeaderBellBtn({ count, ...all }: Props) {
  return (
    <button {...all} className="w-8 h-10 relative cursor-pointer">
      <BellIcon />
      <div className="w-8 h-8 left-0 top-[6.38px] absolute opacity-0" />

      {count ? (
        <div className="w-5 h-5 left-[12px] -top-1 absolute rounded-[34px] inline-flex justify-center items-center bg-rose-800">
          <div className="justify-start text-white text-[10px] font-medium leading-none">
            {count || 0}
          </div>
        </div>
      ) : null}
    </button>
  );
}
