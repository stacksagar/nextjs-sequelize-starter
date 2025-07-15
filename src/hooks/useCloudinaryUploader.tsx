import React, { useState } from "react";
import axios from "axios";
import { cloud_name, upload_preset } from "@/config/cloudinary";

export default function useCloudinaryUploader() {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<any>(null);
  const [url, setUrl] = useState("");

  const handleFiileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    callback?: (url: string) => void
  ) => {
    const file = event?.target?.files && event.target.files[0];
    if (!file) return;

    setUploading(true);
    setPreview(URL.createObjectURL(file));
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", upload_preset);

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
        formData
      );
      setUrl(response.data.secure_url);
      callback && callback(response.data.secure_url);
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setUploading(false);
    }
  };

  return { preview, url, setUrl, handleFiileChange, uploading };
}
