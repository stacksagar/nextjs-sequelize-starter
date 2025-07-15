import Link from "next/link";
import React from "react";

interface Props {
  text?: string;
  linkText?: string;
  link?: string;
}

export default function FormFooterText({ text, linkText, link }: Props) {
  return (
    <div className="flex-grow-0 flex-shrink-0 w-full text-lg text-center text-[#060acd] space-x-1">
      <span className="flex-grow-0 flex-shrink-0 text-lg text-center text-[#060acd]">
        {text}
      </span>
      <Link
        href={link || "#"}
        className="flex-grow-0 flex-shrink-0text-lg font-medium text-center text-[#060acd] hover:underline"
      >
        {linkText}
      </Link>
    </div>
  );
}
