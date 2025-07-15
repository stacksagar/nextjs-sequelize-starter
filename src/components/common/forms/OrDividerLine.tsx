import React from "react";

export default function OrDividerLine() {
  return (
    <div className="flex justify-center items-center flex-grow-0 flex-shrink-0 w-full relative gap-4 py-2.5">
      <svg
        width={170}
        height={2}
        viewBox="0 0 170 2"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-grow"
        preserveAspectRatio="none"
      >
        <line y1={1} x2="169.5" y2={1} stroke="#CFDFE2" />
      </svg>
      <p className="flex-grow-0 flex-shrink-0 text-base text-center text-[#294957]">
        Or
      </p>
      <svg
        width={170}
        height={2}
        viewBox="0 0 170 2"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-grow"
        preserveAspectRatio="none"
      >
        <line x1="0.5" y1={1} x2={170} y2={1} stroke="#CFDFE2" />
      </svg>
    </div>
  );
}
