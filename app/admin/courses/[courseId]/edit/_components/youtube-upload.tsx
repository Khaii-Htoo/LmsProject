"use client";

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { motion } from "framer-motion";

interface PropsType {
  videoUrl: string;
  setVideoUrl: (videoUrl: string) => void;
}

const YouTubeUpload = ({ videoUrl, setVideoUrl }: PropsType) => {
  // State for all our component needs
  const [videoTitle, setVideoTitle] = useState("");
  const [videoDescription, setVideoDescription] = useState("");
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      // Reset state for a new upload
      setIsUploading(true);
      setUploadError(null);
      setUploadProgress(0);
      setVideoUrl("");

      // Create a FormData object to send the file and text data
      const formData = new FormData();
      formData.append("video", file);
      formData.append("title", videoTitle || file.name); // Use file name as fallback title
      formData.append("description", videoDescription);

      try {
        const url = "/api/upload-tigris"; //api/upload-youtube
        const response = await axios.post(url, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            // A safer way to calculate progress
            if (progressEvent.total) {
              const progress = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadProgress(progress);
            }
          },
        });

        setVideoUrl(response.data.videoUrl);
      } catch (error) {
        console.error("Upload failed:", error);
        setUploadError("Upload failed. Please check the console for details.");
      } finally {
        setIsUploading(false);
      }
    },
    [videoTitle, videoDescription]
  ); // Add dependencies

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "video/*": [] }, // Accept only video files
    disabled: isUploading, // Disable dropzone while uploading
  });

  return (
    <motion.div
      className="flex flex-col items-center justify-center w-full max-w-lg mx-auto p-8 rounded-2xl bg-white dark:bg-gray-900 shadow-lg transition-colors duration-300"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Dropzone */}
      {!videoUrl && (
        <div
          {...getRootProps()}
          className={`w-full p-8 text-center rounded-xl cursor-pointer transition-all duration-300 border-2 ${
            isUploading
              ? "border-gray-400 bg-gray-100 dark:bg-gray-800 dark:border-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
              : isDragActive
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900 dark:border-blue-600"
                : "border-gray-300 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-600 text-gray-700 dark:text-gray-200"
          }`}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p className="text-blue-600 dark:text-blue-400 font-medium">
              Release to drop the video here...
            </p>
          ) : (
            <>
              <svg
                className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M36 12l4 4m-4 4v-4"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Drag and drop your video here, or{" "}
                <span className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
                  click to browse
                </span>
              </p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                MP4, MOV, AVI, up to 1GB
              </p>
            </>
          )}
        </div>
      )}

      {/* Progress Bar and Status */}
      {isUploading && (
        <div className="mt-6 w-full">
          <div className="h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-blue-500 dark:bg-blue-400"
              style={{ width: `${uploadProgress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <p className="text-center text-sm mt-2 text-gray-600 dark:text-gray-300">
            Uploading: {uploadProgress}%
          </p>
        </div>
      )}

      {uploadError && (
        <div className="mt-4 text-red-500 text-center">{uploadError}</div>
      )}

      {videoUrl && (
        <div className="mt-6 text-center p-5 bg-green-50 dark:bg-green-900 rounded-xl">
          <p className="text-green-700 dark:text-green-300 font-semibold">
            Video uploaded successfully!
          </p>
          <a
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300"
          >
            View your video
          </a>
        </div>
      )}
    </motion.div>
  );
};

export default YouTubeUpload;
