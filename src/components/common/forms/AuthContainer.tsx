import React from "react";

export default function AuthContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`!max-w-[400px] mx-auto ${className}`}>
      <div className="content py-10 md:py-32 space-y-12"> {children} </div>
      <p className="w-full text-center flex-grow-0 py-6 md:py-7 flex-shrink-0 text-base font-medium text-[#959cb6]">
        © 2025 ALL RIGHTS RESERVED
      </p>
    </div>
  );
}
