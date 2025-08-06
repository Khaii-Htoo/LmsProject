// app/api/delete/route.ts
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import { S3 } from "@/lib/s3-client";
import { z } from "zod";
import { auth } from "@/lib/auth";
import arcjet, { detectBot, fixedWindow } from "@/lib/arcjet";
import { headers } from "next/headers";
const deleteSchema = z.object({
  key: z.string().min(1, "File key is required"),
});

export const DELETE = async (request: Request) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const aj = arcjet
    .withRule(
      detectBot({
        mode: "LIVE",
        allow: [],
      })
    )
    .withRule(
      fixedWindow({
        mode: "LIVE",
        window: "1m",
        max: 5,
      })
    );
  try {
    const decision = await aj.protect(request, {
      fingerprint: session?.user.id!,
    });
    if (decision.isDenied()) {
      return NextResponse.json({ error: "Not good" }, { status: 429 });
    }
    const body = await request.json();

    const validation = deleteSchema.safeParse(body);
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

    const { key } = validation.data;
    console.log("Deleting file with key:", key);

    // Delete from S3
    const deleteCommand = new DeleteObjectCommand({
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
      Key: key,
    });

    await S3.send(deleteCommand);
    console.log("File deleted successfully from S3");

    return NextResponse.json(
      {
        success: true,
        message: "File deleted successfully",
        key,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete API error:", error);

    return NextResponse.json(
      {
        error: "Failed to delete file",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
};
