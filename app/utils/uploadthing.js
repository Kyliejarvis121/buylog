import { generateUploadButton, generateUploadDropzone } from "@uploadthing/react";

export const uploadFiles = async (files) => {
  try {
    const endpoint = "/api/uploadthing";

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    const response = await fetch(endpoint, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Upload failed");
    }

    return data; // returns uploaded file URLs
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
};
