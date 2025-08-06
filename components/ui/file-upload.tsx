// components/FileUpload.tsx
import { cn } from "@/lib/utils";
import React, { useRef, useState } from "react";
import { motion } from "motion/react";
import { IconUpload, IconX } from "@tabler/icons-react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

const mainVariant = {
  initial: {
    x: 0,
    y: 0,
  },
  animate: {
    x: 20,
    y: -20,
    opacity: 0.9,
  },
};

const secondaryVariant = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
};

interface UploadedFile {
  file: File;
  url?: string;
  key?: string;
  isUploading: boolean;
  progress: number;
}

export const FileUpload = ({
  onChange,
  onUploadComplete,
}: {
  onChange?: (files: File[]) => void;
  onUploadComplete?: (
    uploadedFiles: { key: string; url: string; fileName: string }[]
  ) => void;
}) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadToS3 = async (file: File, fileIndex: number) => {
    try {
      // Update file status to uploading
      setFiles((prev) =>
        prev.map((f, idx) =>
          idx === fileIndex ? { ...f, isUploading: true, progress: 0 } : f
        )
      );

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
            setFiles((prev) =>
              prev.map((f, idx) => (idx === fileIndex ? { ...f, progress } : f))
            );
          }
        };

        xhr.onload = () => {
          if (xhr.status === 200 || xhr.status === 204) {
            const fileUrl = `https://t3.storage.dev/${process.env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES}/${key}`;

            // Update file with success status
            setFiles((prev) =>
              prev.map((f, idx) =>
                idx === fileIndex
                  ? {
                      ...f,
                      isUploading: false,
                      progress: 100,
                      url: fileUrl,
                      key,
                    }
                  : f
              )
            );

            toast.success(`${file.name} uploaded successfully`);
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
        `Failed to upload ${file.name}: ${error instanceof Error ? error.message : "Unknown error"}`
      );

      // Update file with error status
      setFiles((prev) =>
        prev.map((f, idx) =>
          idx === fileIndex ? { ...f, isUploading: false, progress: 0 } : f
        )
      );
    }
  };

  const handleFileChange = async (newFiles: File[]) => {
    if (newFiles.length === 0) return;

    // Add new files to state
    const newUploadFiles: UploadedFile[] = newFiles.map((file) => ({
      file,
      isUploading: false,
      progress: 0,
    }));

    setFiles((prevFiles) => [...prevFiles, ...newUploadFiles]);
    onChange && onChange(newFiles);

    setIsUploading(true);

    // Upload each file
    const startIndex = files.length;
    for (let i = 0; i < newFiles.length; i++) {
      await uploadToS3(newFiles[i], startIndex + i);
    }

    setIsUploading(false);

    // Call onUploadComplete with successfully uploaded files
    const uploadedFiles = files
      .filter((f) => f.url && f.key)
      .map((f) => ({
        key: f.key!,
        url: f.url!,
        fileName: f.file.name,
      }));

    onUploadComplete && onUploadComplete(uploadedFiles);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, idx) => idx !== index));
    URL.revokeObjectURL(files[index].file.name);
  };

  const handleClick = () => {
    if (!isUploading) {
      fileInputRef.current?.click();
    }
  };

  const { getRootProps, isDragActive } = useDropzone({
    multiple: true,
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
    disabled: isUploading,
  });

  return (
    <div className="w-full" {...getRootProps()}>
      <motion.div
        onClick={handleClick}
        whileHover="animate"
        className={cn(
          "p-2 group/file block rounded-lg cursor-pointer w-full relative overflow-hidden",
          files.length > 0 && "h-auto min-h-60",
          isUploading && "cursor-not-allowed opacity-70"
        )}
      >
        <input
          ref={fileInputRef}
          id="file-upload-handle"
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleFileChange(Array.from(e.target.files || []))}
          className="hidden"
          disabled={isUploading}
        />

        <div className="flex flex-col items-center justify-center min-h-60 relative">
          {files.length === 0 && (
            <>
              <p className="relative z-20 font-sans font-bold text-neutral-700 dark:text-neutral-300 text-base">
                Upload Images
              </p>
              <p className="relative z-20 font-sans font-normal text-neutral-400 dark:text-neutral-400 text-base mt-2">
                Drag or drop your images here or click to upload
              </p>
              <p className="relative z-20 font-sans font-normal text-neutral-500 dark:text-neutral-500 text-sm mt-1">
                Maximum file size: 10MB
              </p>
            </>
          )}

          <div className="relative w-full mt-10 px-4">
            {files.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {files.map((uploadFile, idx) => (
                  <motion.div
                    key={"file" + idx}
                    layoutId={idx === 0 ? "file-upload" : "file-upload-" + idx}
                    className={cn(
                      "relative overflow-hidden z-40 bg-white dark:bg-neutral-900 rounded-md group",
                      "shadow-sm border border-neutral-200 dark:border-neutral-700"
                    )}
                  >
                    {/* Remove button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(idx);
                      }}
                      disabled={uploadFile.isUploading}
                      className="absolute top-2 right-2 z-50 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors disabled:opacity-50"
                    >
                      <IconX className="h-3 w-3" />
                    </button>

                    <div className="aspect-square relative">
                      <img
                        src={URL.createObjectURL(uploadFile.file)}
                        alt={uploadFile.file.name}
                        className="w-full h-full object-cover rounded-t-md"
                      />

                      {/* Upload overlay */}
                      {uploadFile.isUploading && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                          <div className="text-white text-center">
                            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                            <p className="text-sm">{uploadFile.progress}%</p>
                          </div>
                        </div>
                      )}

                      {/* Success indicator */}
                      {uploadFile.url && !uploadFile.isUploading && (
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

                    <div className="p-2">
                      <p
                        className="text-xs text-neutral-600 dark:text-neutral-400 truncate"
                        title={uploadFile.file.name}
                      >
                        {uploadFile.file.name}
                      </p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-500">
                        {(uploadFile.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      {uploadFile.isUploading && (
                        <div className="mt-1">
                          <div className="w-full bg-gray-200 rounded-full h-1">
                            <div
                              className="bg-blue-500 h-1 rounded-full transition-all duration-300"
                              style={{ width: `${uploadFile.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {files.length === 0 && (
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
                      Drop images here
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

          {/* Upload status */}
          {isUploading && (
            <div className="mt-4 text-center">
              <p className="text-sm text-blue-600 dark:text-blue-400">
                Uploading files... Please wait
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
