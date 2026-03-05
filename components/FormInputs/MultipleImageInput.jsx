import { UploadDropzone } from "@/lib/uploadthing";
import { XCircle } from "lucide-react";
import Image from "next/image";
import React from "react";
import toast from "react-hot-toast";

export default function MultipleImageInput({
  label,
  imageUrls,
  setImageUrls,
  className = "col-span-full",
  endpoint = "",
}) {
  const MAX_IMAGES = 8;

  function handleImageRemove(imageIndex) {
    const updatedImages = imageUrls.filter(
      (image, index) => index !== imageIndex
    );
    setImageUrls(updatedImages);
  }

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-900 dark:text-slate-50 mb-2">
        {label}
      </label>

      <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
        Select and upload up to 8 images at once.
      </p>

      {/* Image Previews */}
      {imageUrls.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
          {imageUrls.map((imageUrl, i) => (
            <div key={i} className="relative">
              <button
                onClick={() => handleImageRemove(i)}
                className="absolute -top-2 -right-2 bg-white text-red-600 rounded-full"
              >
                <XCircle className="w-5 h-5" />
              </button>
              <Image
                src={imageUrl}
                alt="Product image"
                width={300}
                height={200}
                className="w-full h-24 object-cover rounded"
              />
            </div>
          ))}
        </div>
      )}

      {/* Upload Dropzone (only if limit not reached) */}
      {imageUrls.length < MAX_IMAGES && (
        <UploadDropzone
          endpoint={endpoint}
          onClientUploadComplete={(res) => {
            const urls = res.map((item) => item.url);

            if (imageUrls.length + urls.length > MAX_IMAGES) {
              toast.error(`You can only upload up to ${MAX_IMAGES} images`);
              return;
            }

            setImageUrls([...imageUrls, ...urls]);
          }}
          onUploadError={(error) => {
            toast.error("Image Upload Failed, Try Again");
            console.error(error);
          }}
        />
      )}

      {/* Limit reached message */}
      {imageUrls.length >= MAX_IMAGES && (
        <p className="text-xs text-green-600 mt-2">
          Maximum of {MAX_IMAGES} images uploaded.
        </p>
      )}
    </div>
  );
}