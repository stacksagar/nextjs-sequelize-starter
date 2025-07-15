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
    </div>
  );
}
