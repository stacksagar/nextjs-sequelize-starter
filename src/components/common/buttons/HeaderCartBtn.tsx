import { ShoppingCartIcon } from "lucide-react";
import React from "react";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  count?: number;
}

export default function HeaderCartBtn({ count, ...all }: Props) {
  return (
    <button {...all} className="w-10 h-9 relative cursor-pointer">
      <ShoppingCartIcon />
      <div className="w-5 h-5 left-[12px] -top-1 absolute rounded-[34px] inline-flex justify-center items-center bg-amber-800">
        <div className="justify-start text-white text-[10px] font-medium  leading-none">
          {count || 0}
        </div>
      </div>
    </button>
  );
}
