import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();

    const file = data.get("video") as unknown as File | null;
    const title = data.get("title") as string | null;
    const description = data.get("description") as string | null;

    if (!file) {
      return NextResponse.json(
        { message: "No video file uploaded." },
        { status: 400 }
      );
    }

    // Convert the file stream to a Buffer
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    const s3 = new S3Client({
      region: "auto",
      endpoint: process.env.AWS_ENDPOINT_URL_S3,
      credentials: {
        // Use the correct environment variables for accessKeyId and secretAccessKey
        accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
      },
      forcePathStyle: true,
    });

    const objectKey = `videos/${Date.now()}-${file.name}`;

    const uploadParams = {
      Bucket: "lms-demo-file-upload",
      Key: objectKey,
      // Pass the Buffer directly to the Body
      Body: fileBuffer,
      ContentType: file.type || "application/octet-stream",
      Metadata: {
        title: title || "",
        description: description || "",
      },
    };

    await s3.send(new PutObjectCommand(uploadParams));

    // Construct the video URL correctly using the endpoint and bucket name
    const videoUrl = `${process.env.AWS_ENDPOINT_URL_S3}/lms-demo-file-upload/${objectKey}`;

    return NextResponse.json({ success: true, videoUrl }, { status: 200 });
  } catch (error: any) {
    console.error("Tigris upload failed:", error);
    const errorMessage = error.message || "Unknown error";
    return NextResponse.json(
      { message: "Upload failed", error: errorMessage },
      { status: 500 }
    );
  }
}
