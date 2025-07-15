import React, { InputHTMLAttributes } from "react";
import MotionZoomEffect from "../MotionZoomEffect";
import OutlineCircleIcon from "@/components/icons/OutlineCircleIcon";

interface Props extends InputHTMLAttributes<HTMLInputElement> {}

export default function InputUploaderBox({ ...inputProps }: Props) {
  return (
    <MotionZoomEffect className="relative border border-gray-300 dark:border-gray-800 rounded-2xl p-4 flex flex-col gap-y-2 justify-center items-center">
      <OutlineCircleIcon>
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_168_16802)">
            <path
              d="M13.3326 13.3332L9.99923 9.9999M9.99923 9.9999L6.6659 13.3332M9.99923 9.9999V17.4999M16.9909 15.3249C17.8037 14.8818 18.4458 14.1806 18.8158 13.3321C19.1858 12.4835 19.2627 11.5359 19.0344 10.6388C18.8061 9.7417 18.2855 8.94616 17.5548 8.37778C16.8241 7.80939 15.925 7.50052 14.9992 7.4999H13.9492C13.697 6.52427 13.2269 5.61852 12.5742 4.85073C11.9215 4.08295 11.1033 3.47311 10.181 3.06708C9.2587 2.66104 8.25636 2.46937 7.24933 2.50647C6.2423 2.54358 5.25679 2.80849 4.36688 3.28129C3.47697 3.7541 2.70583 4.42249 2.11142 5.23622C1.51701 6.04996 1.11481 6.98785 0.935051 7.9794C0.755293 8.97095 0.802655 9.99035 1.07358 10.961C1.3445 11.9316 1.83194 12.8281 2.49923 13.5832"
              stroke="#060ACD"
              strokeWidth="1.66667"
              strokeLinecap="round"
            />
          </g>
          <defs>
            <clipPath id="clip0_168_16802">
              <rect width="20" height="20" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </OutlineCircleIcon>

      <div className="flex items-center gap-x-2">
        <div
          style={{
            color: "#060ACD",
            fontSize: 14,
            fontWeight: "600",
            wordWrap: "break-word",
          }}
        >
          Click to upload
        </div>
        <div
          style={{
            color: "#555555",
            fontSize: 14,
            fontWeight: "400",
            wordWrap: "break-word",
          }}
        >
          or drag and drop
        </div>
      </div>

      <div
        style={{
          alignSelf: "stretch",
          textAlign: "center",
          fontSize: 12,
          fontWeight: "400",
          wordWrap: "break-word",
        }}
      >
        SVG, PNG, JPG or GIF (max. 800x400px)
      </div>

      <input
        type="file"
        {...inputProps}
        className="absolute inset-0 w-full h-full opacity-0"
      />
    </MotionZoomEffect>
  );
}
