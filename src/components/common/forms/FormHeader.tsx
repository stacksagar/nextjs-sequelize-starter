import React from "react";
interface Props {
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
}
export default function FormHeader({ title, description }: Props) {
  return (
    <div className="flex flex-col justify-start items-start flex-grow-0 flex-shrink-0 relative gap-7">
      <div className="w-full flex-grow-0 flex-shrink-0 text-3xl md:text-4xl font-bold ">
        {title}
      </div>
      <div className="w-full text-lg md:text-xl text-left text-[#4f4f4f] space-y-1 tracking-tight !font-light">
        {description}
      </div>
    </div>
  );
}
