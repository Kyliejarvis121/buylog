// @/utils/uploadthing.js
/**
 * Upload files to UploadThing API
 * @param {string} slug - The slug of your uploader/router
 * @param {File[]} files - Array of File objects
 * @returns {Promise<Array<{ fileUrl: string }>>} - Uploaded file URLs
 */
export const uploadFiles = async (slug, files) => {
    if (!slug) throw new Error("No slug provided for upload");
    if (!files || !files.length) throw new Error("No files provided");
  
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));
  
      const response = await fetch(`/api/uploadthing/${slug}`, {
        method: "POST",
        body: formData,
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }
  
      return data.map((item) => ({
        fileUrl: item.fileUrl || item.url || "",
      }));
    } catch (err) {
      console.error("Upload error:", err);
      throw err;
    }
  };
  
