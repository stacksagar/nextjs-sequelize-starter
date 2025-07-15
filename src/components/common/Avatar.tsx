import React from "react";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  url?: string;
  loading?: boolean;
}

export default function Avatar({ url, ...all }: Props) {
  return (
    <div className="w-10">
      <button
        {...all}
        className={`!w-10 !h-10 flex items-center justify-center relative rounded-[50px] overflow-hidden focus:outline-2 focus:outline-blue-800 cursor-pointer ${all.className}`}
      >
        <img
          title="profile image"
          className="w-full h-full object-cover object-center"
          src={url || "/images/avatar.jpg"}
        />
      </button>
    </div>
  );
}
