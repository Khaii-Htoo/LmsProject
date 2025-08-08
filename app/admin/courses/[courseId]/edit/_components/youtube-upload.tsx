"use client";

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { motion } from "framer-motion";

const YouTubeUpload = () => {
  // State for all our component needs
  const [videoTitle, setVideoTitle] = useState("");
  const [videoDescription, setVideoDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
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
      setVideoUrl(null);

      // Create a FormData object to send the file and text data
      const formData = new FormData();
      formData.append("video", file);
      formData.append("title", videoTitle || file.name); // Use file name as fallback title
      formData.append("description", videoDescription);

      try {
        const response = await axios.post("/api/upload-youtube", formData, {
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
      className="flex flex-col items-center justify-center w-full max-w-lg mx-auto p-6 border-2 border-dashed rounded-lg bg-gray-50 text-gray-700"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Input fields for Title and Description */}
      <div className="w-full mb-4 space-y-3">
        <input
          type="text"
          placeholder="Video Title"
          value={videoTitle}
          onChange={(e) => setVideoTitle(e.target.value)}
          disabled={isUploading}
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
        />
        <textarea
          placeholder="Video Description"
          value={videoDescription}
          onChange={(e) => setVideoDescription(e.target.value)}
          disabled={isUploading}
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          rows={3}
        />
      </div>

      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`w-full p-8 text-center border-2 border-dashed rounded-md cursor-pointer ${
          isUploading
            ? "cursor-not-allowed bg-gray-200"
            : "bg-white hover:bg-gray-100"
        } ${isDragActive ? "border-blue-500" : "border-gray-300"}`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the video here ...</p>
        ) : (
          <p>Drag & drop a video, or click to select</p>
        )}
      </div>

      {/* Progress Bar and Status */}
      {isUploading && (
        <div className="mt-4 w-full">
          <div className="h-2 w-full rounded-full bg-gray-200">
            <motion.div
              className="h-full rounded-full bg-blue-500"
              style={{ width: `${uploadProgress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
          <p className="text-center text-sm mt-2">
            Uploading: {uploadProgress}%
          </p>
        </div>
      )}

      {uploadError && (
        <div className="mt-4 text-red-500 text-center">{uploadError}</div>
      )}

      {videoUrl && (
        <div className="mt-4 text-center p-4 bg-green-100 rounded-md">
          <p className="text-green-700 font-semibold">
            Video uploaded successfully!
          </p>
          <a
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline hover:text-blue-800"
          >
            View your video on YouTube
          </a>
        </div>
      )}
    </motion.div>
  );
};

export default YouTubeUpload;
