// @/utils/uploadthing.js
import { generateUploadButton, generateUploadDropzone } from "@uploadthing/react";

/**
 * Uploads one or multiple files to your UploadThing API
 * @param {File[]} files - Array of File objects to upload
 * @returns {Promise<Array<{ fileUrl: string }>>} - Array of uploaded file info
 */
export const uploadFiles = async (files) => {
  if (!files || !files.length) {
    throw new Error("No files provided for upload");
  }

  try {
    const endpoint = "/api/uploadthing"; // Your backend UploadThing endpoint
    const formData = new FormData();

    // Append all files to form data
    files.forEach((file) => formData.append("files", file));

    // Send request to backend
    const response = await fetch(endpoint, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Upload failed");
    }

    // Ensure we always return an array of { fileUrl }
    return data.map((item) => ({
      fileUrl: item.fileUrl || item.url || "",
    }));
  } catch (err) {
    console.error("Upload error:", err);
    throw err;
  }
};

