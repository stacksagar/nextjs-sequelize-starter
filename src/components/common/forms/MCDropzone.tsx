import UploadCircleShadowIcon from "@/components/icons/UploadCircleShadowIcon";
import { Dropzone, DropzoneProps } from "@mantine/dropzone";
import React from "react";

export default function MCDropzone({
  label,
  ...props
}: DropzoneProps & { label?: string }) {
  return (
    <Dropzone
      {...props}
      className="w-full border-2 border-dashed border-gray-300 dark:border-gray-800 dark:bg-gray-900 rounded-lg p-8 hover:dark:bg-gray-800"
    >
      <div className="flex flex-col items-center justify-center text-center gap-y-1.5">
        <UploadCircleShadowIcon />
        <p className="text-blue-500 dark:text-blue-400">
          <span> Click to upload </span> or drag and drop
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-300">{label}</p>
      </div>
    </Dropzone>
  );
}
