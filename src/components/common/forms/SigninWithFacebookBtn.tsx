import React from "react";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string | boolean;
  loading?: boolean;
}

export default function SigninWithFacebookBtn({ text, ...props }: Props) {
  return (
    <button
      type="button"
      className="w-full focus:ring focus:ring-blue-500 cursor-pointer flex justify-center items-center self-stretch flex-grow-0 flex-shrink-0 relative gap-4 px-[9px] py-3 rounded-[40px] bg-[#f3f9fa]"
      {...props}
    >
      <svg
        width={29}
        height={29}
        viewBox="0 0 29 29"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-grow-0 flex-shrink-0 w-7 h-7 relative"
        preserveAspectRatio="none"
      >
        <g clipPath="url(#clip0_64_34013)">
          <path
            d="M28.5 14.5C28.5 6.76801 22.232 0.5 14.5 0.5C6.76801 0.5 0.5 6.76801 0.5 14.5C0.5 21.4877 5.61957 27.2796 12.3125 28.3299V18.5469H8.75781V14.5H12.3125V11.4156C12.3125 7.90687 14.4027 5.96875 17.6005 5.96875C19.1318 5.96875 20.7344 6.24219 20.7344 6.24219V9.6875H18.9691C17.23 9.6875 16.6875 10.7668 16.6875 11.875V14.5H20.5703L19.9496 18.5469H16.6875V28.3299C23.3804 27.2796 28.5 21.4877 28.5 14.5Z"
            fill="#1877F2"
          />
          <path
            d="M19.9496 18.5469L20.5703 14.5H16.6875V11.875C16.6875 10.7679 17.23 9.6875 18.9691 9.6875H20.7344V6.24219C20.7344 6.24219 19.1323 5.96875 17.6005 5.96875C14.4027 5.96875 12.3125 7.90688 12.3125 11.4156V14.5H8.75781V18.5469H12.3125V28.3299C13.762 28.5567 15.238 28.5567 16.6875 28.3299V18.5469H19.9496Z"
            fill="white"
          />
        </g>
      </svg>
      <p className="flex-grow-0 flex-shrink-0 w-[159px] text-base text-left text-[#313957]">
        {typeof text === "string" ? text : "Sign in with Facebook"}
      </p>
    </button>
  );
}
