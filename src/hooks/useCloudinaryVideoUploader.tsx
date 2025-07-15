import React, { useState } from "react";
import axios from "axios";
import { cloud_name, upload_preset } from "@/config/cloudinary"; // Assuming you have these in your config

export default function useCloudinaryVideoUploader() {
  const [uploading, setUploading] = useState(false); 
  const [uploadPercentage, setPercentage] = useState(0); // Optional: Track upload progress
  const [preview, setPreview] = useState<string | null>(null); // It's good practice to type this more specifically
  const [url, setUrl] = useState<string>("");
  const [error, setError] = useState<string | null>(null); // Added error state

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    callback?: (url: string) => void
  ) => {
    const file = event?.target?.files && event.target.files[0];
    if (!file) return;

    // Optional: Add a check for video file types
    if (!file.type.startsWith("video/")) {
      setError("Please select a video file.");
      console.error("Invalid file type: Not a video.");
      setPreview(null);
      setUrl("");
      return;
    }

    setUploading(true);
    setError(null); // Reset error on new upload attempt
    setPreview(URL.createObjectURL(file)); // Create a local preview URL

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", upload_preset); // Your Cloudinary upload preset

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloud_name}/video/upload`, // Changed to video/upload
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          // Optional: Add onUploadProgress for better UX
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setPercentage(percentCompleted);
              console.log(`Upload Progress: ${percentCompleted}%`);
              // You could set a progress state here to display in the UI
            }
          },
        }
      );
      const secureUrl = response.data.secure_url;
      setUrl(secureUrl);
      setPreview(secureUrl); // Optionally, set preview to the Cloudinary URL once uploaded
      callback && callback(secureUrl);
    } catch (err: any) {
      console.error("Error uploading video:", err);
      setError(
        err.response?.data?.error?.message ||
          "An unknown error occurred during upload."
      );
      setPreview(null); // Clear preview on error
      setUrl(""); // Clear URL on error
    } finally {
      setUploading(false);
      // Clean up the object URL to prevent memory leaks
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    }
  };

  const resetUploader = () => {
    setPreview(null);
    setUrl("");
    setUploading(false);
    setError(null);
  };

  return {
    preview,
    url,
    setUrl,
    handleFileChange,
    uploading,
    error,
    resetUploader,
    uploadPercentage
  };
}
