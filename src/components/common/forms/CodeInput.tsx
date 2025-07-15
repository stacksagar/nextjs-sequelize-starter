import React, { useRef, useState } from "react";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  ref?: any;
}

export default function CodeInput({ children, onChange, ...all }: Props) {
  const input = useRef<HTMLInputElement>(null);

  const [value, setValue] = useState("");

  return (
    <input
      ref={input}
      className={`${
        value
          ? "border-[#060acd] text-[#060acd] dark:border-[#060acd]"
          : "border-zinc-200"
      } w-12 h-12 md:w-14 md:h-14 font-extrabold !text-2xl rounded-[10px] outline-none border-2 inline-flex justify-between items-center overflow-hidden text-center focus:border-[#060acd] dark:bg-darkMinimalism dark:bg-opacity-50 dark:border-gray-800 dark:focus:ring ${
        all.className
      }`}
      onChange={(e) => {
        onChange && onChange(e); 
        setValue(e?.target?.value);
      }}
      value={value}
      {...all}
    />
  );
}
