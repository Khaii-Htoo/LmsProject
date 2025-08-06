// components/FileUpload.tsx
import { cn } from "@/lib/utils";
import React, { useRef, useState } from "react";
import { motion } from "motion/react";
import { IconUpload, IconX, IconTrash } from "@tabler/icons-react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

const mainVariant = {
  initial: { x: 0, y: 0 },
  animate: { x: 20, y: -20, opacity: 0.9 },
};

const secondaryVariant = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
};

interface UploadedFile {
  file: File;
  url?: string;
  key?: string;
  isUploading: boolean;
  isDeleting: boolean;
  progress: number;
}

export const FileUpload = ({
  onChange,
  onUploadComplete,
  onDeleteComplete,
}: {
  onChange?: (file: File | null) => void;
  onUploadComplete?: (
    uploadedFile: { key: string; url: string; fileName: string } | null
  ) => void;
  onDeleteComplete?: () => void;
}) => {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const deleteFromS3 = async (key: string) => {
    try {
      setUploadedFile((prev) => (prev ? { ...prev, isDeleting: true } : null));

      const deleteResponse = await fetch("/api/s3/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key }),
      });

      if (!deleteResponse.ok) {
        const errorData = await deleteResponse.json();
        throw new Error(errorData.message || "Failed to delete file");
      }

      const result = await deleteResponse.json();
      console.log("Delete successful:", result);

      toast.success("File deleted successfully");

      // Clear the file from state
      removeFile(false); // false = don't show API delete call again

      // Call callback
      onDeleteComplete && onDeleteComplete();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(
        `Failed to delete file: ${error instanceof Error ? error.message : "Unknown error"}`
      );

      setUploadedFile((prev) => (prev ? { ...prev, isDeleting: false } : null));
    }
  };

  const uploadToS3 = async (file: File) => {
    try {
      setIsUploading(true);
      setUploadedFile({
        file,
        isUploading: true,
        isDeleting: false,
        progress: 0,
      });

      // Step 1: Get presigned URL
      const presignedResponse = await fetch("/api/s3/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type,
          size: file.size,
        }),
      });

      if (!presignedResponse.ok) {
        const errorData = await presignedResponse.json();
        throw new Error(errorData.message || "Failed to get presigned URL");
      }

      const { presignedUrl, key } = await presignedResponse.json();

      // Step 2: Upload to S3
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100);
            setUploadedFile((prev) => (prev ? { ...prev, progress } : null));
          }
        };

        xhr.onload = () => {
          if (xhr.status === 200 || xhr.status === 204) {
            const fileUrl = `https://t3.storage.dev/${process.env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES}/${key}`;

            setUploadedFile((prev) =>
              prev
                ? {
                    ...prev,
                    isUploading: false,
                    progress: 100,
                    url: fileUrl,
                    key,
                  }
                : null
            );

            toast.success(`${file.name} uploaded successfully`);

            onUploadComplete &&
              onUploadComplete({
                key,
                url: fileUrl,
                fileName: file.name,
              });

            resolve();
          } else {
            reject(new Error(`Upload failed with status: ${xhr.status}`));
          }
        };

        xhr.onerror = () => {
          reject(new Error("Upload failed due to network error"));
        };

        xhr.open("PUT", presignedUrl);
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.send(file);
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(
        `Failed to upload ${error instanceof Error ? error.message : "Unknown error"}`
      );

      setUploadedFile((prev) =>
        prev ? { ...prev, isUploading: false, progress: 0 } : null
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = async (newFiles: File[]) => {
    if (newFiles.length === 0) return;

    const file = newFiles[0];

    // If there's an existing file, delete it from S3 first
    if (uploadedFile?.key) {
      await deleteFromS3(uploadedFile.key);
    } else if (uploadedFile) {
      // Just remove from UI if no S3 key yet
      URL.revokeObjectURL(uploadedFile.file.name);
    }

    onChange && onChange(file);
    await uploadToS3(file);
  };

  const removeFile = (shouldDeleteFromS3: boolean = true) => {
    if (uploadedFile) {
      if (shouldDeleteFromS3 && uploadedFile.key && !uploadedFile.isUploading) {
        // Delete from S3
        deleteFromS3(uploadedFile.key);
        return; // deleteFromS3 will call removeFile(false) after successful deletion
      }

      // Just remove from UI
      URL.revokeObjectURL(uploadedFile.file.name);
      setUploadedFile(null);
      onChange && onChange(null);
      onUploadComplete && onUploadComplete(null);
    }
  };

  const handleClick = () => {
    if (!isUploading && !uploadedFile?.isDeleting) {
      fileInputRef.current?.click();
    }
  };

  const { getRootProps, isDragActive } = useDropzone({
    multiple: false,
    noClick: true,
    onDrop: handleFileChange,
    onDropRejected: (rejectedFiles) => {
      rejectedFiles.forEach(({ file, errors }) => {
        errors.forEach((error) => {
          toast.error(`${file.name}: ${error.message}`);
        });
      });
    },
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"],
    },
    maxSize: 10 * 1024 * 1024, // 10MB limit
    disabled: isUploading || uploadedFile?.isDeleting,
  });

  return (
    <div className="w-full" {...getRootProps()}>
      <motion.div
        onClick={handleClick}
        whileHover="animate"
        className={cn(
          "p-2 group/file block rounded-lg cursor-pointer sm:w-full relative overflow-hidden w-[300px]",
          uploadedFile && "h-auto min-h-60",
          (isUploading || uploadedFile?.isDeleting) &&
            "cursor-not-allowed opacity-70"
        )}
      >
        <input
          ref={fileInputRef}
          id="file-upload-handle"
          type="file"
          accept="image/*"
          onChange={(e) => handleFileChange(Array.from(e.target.files || []))}
          className="hidden"
          disabled={isUploading || uploadedFile?.isDeleting}
        />

        <div className="flex flex-col items-center justify-center min-h-60 relative">
          {!uploadedFile && (
            <>
              <p className="relative z-20 font-sans font-bold text-neutral-700 dark:text-neutral-300 text-base">
                Upload Image
              </p>
              <p className="relative z-20 font-sans font-normal text-neutral-400 dark:text-neutral-400 text-base mt-2">
                Drag or drop your image here or click to upload
              </p>
              <p className="relative z-20 font-sans font-normal text-neutral-500 dark:text-neutral-500 text-sm mt-1">
                Maximum file size: 10MB
              </p>
            </>
          )}

          <div className="relative w-full mt-10 px-4">
            {uploadedFile && (
              <div className="max-w-sm mx-auto">
                <motion.div
                  layoutId="file-upload"
                  className={cn(
                    "relative overflow-hidden z-40 bg-white dark:bg-neutral-900 rounded-md",
                    "shadow-sm border border-neutral-200 dark:border-neutral-700"
                  )}
                >
                  {/* Delete button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(true); // true = delete from S3
                    }}
                    disabled={
                      uploadedFile.isUploading || uploadedFile.isDeleting
                    }
                    className="absolute top-2 right-2 z-50 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Delete image"
                  >
                    {uploadedFile.isDeleting ? (
                      <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <IconTrash className="h-3 w-3" />
                    )}
                  </button>

                  <div className="aspect-square relative">
                    <img
                      src={URL.createObjectURL(uploadedFile.file)}
                      alt={uploadedFile.file.name}
                      className="w-full h-full object-cover rounded-t-md"
                    />

                    {/* Upload overlay */}
                    {uploadedFile.isUploading && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="text-white text-center">
                          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                          <p className="text-sm">{uploadedFile.progress}%</p>
                        </div>
                      </div>
                    )}

                    {/* Delete overlay */}
                    {uploadedFile.isDeleting && (
                      <div className="absolute inset-0 bg-red-500 bg-opacity-50 flex items-center justify-center">
                        <div className="text-white text-center">
                          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                          <p className="text-sm">Deleting...</p>
                        </div>
                      </div>
                    )}

                    {/* Success indicator */}
                    {uploadedFile.url &&
                      !uploadedFile.isUploading &&
                      !uploadedFile.isDeleting && (
                        <div className="absolute top-2 left-2 bg-green-500 text-white rounded-full p-1">
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
                  </div>

                  <div className="p-3">
                    <p
                      className="text-sm text-neutral-600 dark:text-neutral-400 truncate font-medium"
                      title={uploadedFile.file.name}
                    >
                      {uploadedFile.file.name}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
                      {(uploadedFile.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>

                    {uploadedFile.isUploading && (
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadedFile.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {uploadedFile.isDeleting && (
                      <div className="mt-2">
                        <span className="text-xs text-red-600 font-medium">
                          🗑️ Deleting from server...
                        </span>
                      </div>
                    )}

                    {uploadedFile.url &&
                      !uploadedFile.isUploading &&
                      !uploadedFile.isDeleting && (
                        <div className="mt-2">
                          <span className="text-xs text-green-600 font-medium">
                            ✓ Upload Complete
                          </span>
                        </div>
                      )}
                  </div>
                </motion.div>
              </div>
            )}

            {!uploadedFile && (
              <>
                <motion.div
                  layoutId="file-upload"
                  variants={mainVariant}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                  }}
                  className={cn(
                    "relative group-hover/file:shadow-2xl z-40 bg-white dark:bg-neutral-900 flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-md",
                    "shadow-[0px_10px_50px_rgba(0,0,0,0.1)]"
                  )}
                >
                  {isDragActive ? (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-neutral-600 flex flex-col items-center"
                    >
                      Drop image here
                      <IconUpload className="h-4 w-4 text-neutral-600 dark:text-neutral-400 mt-1" />
                    </motion.p>
                  ) : (
                    <div className="text-center">
                      <IconUpload className="h-6 w-6 text-neutral-600 dark:text-neutral-300 mx-auto" />
                      <p className="text-xs text-neutral-500 mt-1">
                        Click or drag
                      </p>
                    </div>
                  )}
                </motion.div>

                <motion.div
                  variants={secondaryVariant}
                  className="absolute opacity-0 border border-dashed border-sky-400 inset-0 z-30 bg-transparent flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-md"
                ></motion.div>
              </>
            )}
          </div>

          {/* Status messages */}
          {isUploading && (
            <div className="mt-4 text-center">
              <p className="text-sm text-blue-600 dark:text-blue-400">
                Uploading image... Please wait
              </p>
            </div>
          )}

          {uploadedFile?.isDeleting && (
            <div className="mt-4 text-center">
              <p className="text-sm text-red-600 dark:text-red-400">
                Deleting image... Please wait
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
