// app/api/upload/route.ts

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3 } from "@/lib/s3-client";
import { fileUploadSchema } from "@/lib/zod-schems";

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    console.log("Upload request received:", { body });

    // Validate request body
    const validation = fileUploadSchema.safeParse(body);
    if (!validation.success) {
      console.error("Validation failed:", validation.error);
      return NextResponse.json(
        {
          error: "Invalid request body",
          details: validation.error,
        },
        { status: 400 }
      );
    }

    const { fileName, contentType, size } = validation.data;
    const uniqueKey = `uploads/${new Date().getFullYear()}/${new Date().getMonth() + 1}/${uuidv4()}-${fileName}`;

    console.log("Processing upload:", {
      fileName,
      contentType,
      size,
      uniqueKey,
    });

    // Create S3 command
    const command = new PutObjectCommand({
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
      Key: uniqueKey,
      ContentType: contentType,
      ContentLength: Number(size),
      // Optional: Add metadata
      Metadata: {
        originalName: fileName,
        uploadedAt: new Date().toISOString(),
      },
    });

    // Generate presigned URL
    const presignedUrl = await getSignedUrl(S3, command, {
      expiresIn: 3600, // 1 hour instead of 360 seconds
    });

    console.log("Presigned URL generated successfully");

    const response = {
      presignedUrl,
      key: uniqueKey,
      fileName,
      contentType,
      size,
      expiresIn: 3600,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Upload API error:", error);

    return NextResponse.json(
      {
        error: "Failed to generate presigned URL",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
};
