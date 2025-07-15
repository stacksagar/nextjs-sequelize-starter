"use client";

import React, { useState } from "react";
import { Input } from "@mantine/core";
import Label from "./Label";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { MCInputType } from "./MCInput";

export default function MCInputPassword({
  labelProps,
  ...inputProps
}: MCInputType) {
  const [visible, setVisible] = useState(false);
  return (
    <div>
      <Label
        htmlFor={inputProps.id}
        {...labelProps}
        className={`capitalize font-medium text-[15px] block mb-1 ${labelProps?.className}`}
      >
        {labelProps?.label || inputProps.id?.split("-").join(" ")}
      </Label>

      <div className="relative">
        <Input
          name={inputProps.name || inputProps?.id}
          {...inputProps}
          type={visible ? "text" : "password"}
          className={`mc_input ${inputProps.className}`}
        />

        <button
          type="button"
          onClick={() => setVisible((p) => !p)}
          className="absolute right-0 inset-y-0 h-full flex items-center px-3"
        >
          {visible ? <BsEye /> : <BsEyeSlash />}
        </button>
      </div>
    </div>
  );
}
