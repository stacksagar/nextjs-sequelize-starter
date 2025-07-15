"use client";
import dynamic from "next/dynamic";
import { useState, useRef, useEffect } from "react";

const CodeInput = dynamic(() => import("./CodeInput"), {
  ssr: false,
});

interface Props {
  onOTP?: (otp: string) => void;
  onOTPs?: (otps: string[]) => void;
  quantity?: number;
}

const OTPInputs = ({ quantity, onOTP, onOTPs }: Props) => {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [otps, setOtps] = useState(new Array(quantity || 4).fill(""));
  const [otp, setOtp] = useState("");

  const handleChange = (index: number, value: string) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otps];
      newOtp[index] = value;
      setOtps(newOtp);

      if (value && index < (quantity || 4) - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleBackspace = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace") {
      const newOtp = [...otps];

      if (otps[index]) {
        // Clear the current field
        newOtp[index] = "";
      } else if (index > 0) {
        // Move focus to the previous field and clear it
        newOtp[index - 1] = "";
        inputRefs.current[index - 1]?.focus();
      }

      setOtps(newOtp);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .slice(0, quantity || 4)
      .split("");
    const newOtp = ["", "", "", ""];

    pastedData.forEach((char, i) => {
      if (/^\d$/.test(char)) {
        newOtp[i] = char;
      }
    });

    setOtps(newOtp);

    // Move focus to the last filled input
    inputRefs.current[pastedData.length - 1]?.focus();
  };

  useEffect(() => {
    setOtp(otps?.join(""));
    onOTPs && onOTPs(otps);  
  }, [otps]);

  useEffect(() => {
    onOTP && onOTP(otp);
  }, [otp]);

  return (
    <div className="flex gap-x-1 sm:gap-x-2 justify-center">
      {otps.map((digit, index) => (
        <CodeInput
          key={index}
          ref={(el: any) => (inputRefs.current[index] = el) as any}
          title="code"
          type="text"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleBackspace(index, e)}
          onPaste={handlePaste}
        />
      ))}
    </div>
  );
};

export default OTPInputs;
