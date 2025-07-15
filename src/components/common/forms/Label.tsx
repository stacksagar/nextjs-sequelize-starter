import React from "react";

interface Props extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
}

export default function Label({ children, ...all }: Props) {
  return (
    <label
      {...all}
      className={`flex-grow-0 flex-shrink-0 text-sm text-left text-[#0c1421] dark:text-gray-200 ${all.className}`}
    >
      {children}
    </label>
  );
}
