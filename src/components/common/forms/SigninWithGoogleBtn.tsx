import React from "react";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string | boolean;
  loading?: boolean;
}

export default function SigninWithGoogleBtn({ text, ...props }: Props) {
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
        <g clipPath="url(#clip0_64_20190)">
          <path
            d="M28.2283 14.8225C28.2283 13.8709 28.1511 12.914 27.9865 11.9778H14.7812V17.3689H22.3433C22.0295 19.1077 21.0212 20.6458 19.5448 21.6232V25.1213H24.0563C26.7056 22.6829 28.2283 19.082 28.2283 14.8225Z"
            fill="#4285F4"
          />
          <path
            d="M14.7803 28.501C18.5561 28.501 21.7404 27.2612 24.0605 25.1213L19.549 21.6232C18.2938 22.4771 16.6734 22.9607 14.7854 22.9607C11.133 22.9607 8.0362 20.4966 6.92505 17.1837H2.26953V20.7898C4.64616 25.5174 9.48688 28.501 14.7803 28.501Z"
            fill="#34A853"
          />
          <path
            d="M6.92088 17.1837C6.33444 15.4449 6.33444 13.5621 6.92088 11.8234V8.21729H2.2705C0.284833 12.1732 0.284833 16.8339 2.2705 20.7898L6.92088 17.1837Z"
            fill="#FBBC04"
          />
          <path
            d="M14.7803 6.04127C16.7762 6.01041 18.7053 6.76146 20.1508 8.14012L24.1479 4.14305C21.6169 1.76642 18.2578 0.45979 14.7803 0.500943C9.48687 0.500943 4.64616 3.48459 2.26953 8.21728L6.91991 11.8234C8.02591 8.50536 11.1279 6.04127 14.7803 6.04127Z"
            fill="#EA4335"
          />
        </g>
      </svg>
      <p className="flex-grow-0 flex-shrink-0 w-[159px] text-base text-left text-[#313957]">
        {typeof text === "string" ? text : "Sign in with Google"}
      </p>
    </button>
  );
}
