import React from "react";
import { Input } from "@mantine/core";
import Label from "./Label";
import { MCInputType } from "./MCInput";

export default function MCInputWithIcon({
  Icon,
  labelProps,
  ...inputProps
}: MCInputType) {
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
          className={`mc_input mc_input_with_icon ${inputProps.className}`}
        />

        <div className="absolute left-0 inset-y-0 h-full flex items-center px-3">
          {Icon}
        </div>
      </div>
    </div>
  );
}
