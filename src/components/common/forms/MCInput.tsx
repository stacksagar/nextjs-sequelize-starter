import React, { InputHTMLAttributes } from "react";
import { Input, InputProps } from "@mantine/core";
import Label from "./Label";

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  labelClassname?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  Icon?: React.ReactNode;
  labelProps?: { label?: string } & React.LabelHTMLAttributes<HTMLLabelElement>;
}

export type MCInputType = Props & InputProps;

export default function MCInput({ labelProps, ...inputProps }: MCInputType) {
  return (
    <div>
      <Label
        htmlFor={inputProps.id}
        {...labelProps}
        className={`capitalize font-medium text-[15px] block mb-1 ${labelProps?.className}`}
      >
        {labelProps?.label || inputProps.id?.split("-").join(" ")}
        <small className="inline-block px-2 lowercase">{inputProps?.required ? "*" : "(optional)"}</small>
      </Label>

      <Input
        name={inputProps.name || inputProps?.id}
        {...inputProps}
        className={`mc_input ${inputProps.className}`}
        required={inputProps.required}
      />
    </div>
  );
}
