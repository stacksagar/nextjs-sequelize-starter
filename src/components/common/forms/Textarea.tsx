import React, { TextareaHTMLAttributes } from "react";
import Label from "./Label";
interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  labelProps?: { label?: string } & React.LabelHTMLAttributes<HTMLLabelElement>;
}

export default function Textarea({ label, labelProps, ...props }: Props) {
  return (
    <div>
      <Label
        htmlFor={props.id}
        {...labelProps}
        className={`capitalize font-medium text-[15px] block mb-1 ${labelProps?.className}`}
      >
        {label || labelProps?.label || props.id?.split("-").join(" ")}
      </Label>

      <textarea
        {...props}
        className={`w-full min-h-24 border border-gray-200 dark:border-gray-800 dark:bg-gray-900 outline-none rounded-lg p-3 bg-white dark:text-gray-300 dark:focus:border-blue-500 ${props.className}`}
      />
    </div>
  );
}
