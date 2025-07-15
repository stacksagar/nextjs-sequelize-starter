import React from "react";
import { Input } from "@mantine/core";
import Label from "./Label";
import { MCInputType } from "./MCInput";

export default function MCInputCircle({ labelProps, ...props }: MCInputType) {
  const label = labelProps?.label || props.id?.split("-").join(" ");
  return (
    <div>
      {label ? (
        <Label
          htmlFor={props.id}
          {...labelProps}
          className={`capitalize font-medium text-[15px] block mb-1 ${labelProps?.className}`}
        >
          {label}
        </Label>
      ) : null}

      <Input
        name={props.name || props?.id}
        maxLength={props.maxLength}
        {...props}
        className={`mc_input rounded-full-mc ${props.className}`}
      />
    </div>
  );
}
