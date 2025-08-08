"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import arcjet from "@/lib/arcjet";
import { prisma } from "@/lib/db";
import { lessonCreateSchema, lessonSchemaType } from "@/lib/zod-schems";
import { ApiResponse } from "@/type";
import { detectBot, fixedWindow, request } from "@arcjet/next";
import { redirect } from "next/navigation";

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

// Create Lesson Server Action
// =============================================>
export const createLesson = async (
  payload: lessonSchemaType
): Promise<ApiResponse> => {
  const session = await requireAdmin();
  if (session.user.role !== "admin") {
    return redirect("/");
  }

  try {
    const req = await request();
    const decision = await aj.protect(req, {
      fingerprint: session.user.id,
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return {
          status: "error",
          message: "Failed to create lesson: rate limit exceeded.",
        };
      } else {
        return {
          status: "error",
          message: "Bot detected!",
        };
      }
    }

    const validation = lessonCreateSchema.safeParse(payload);
    if (!validation.success) {
      return {
        status: "error",
        message: "Invalid lesson data provided.",
      };
    }

    const { title, description, thumbnailKey, videoUrl, chapterId } =
      validation.data;

    // Create the new lesson in the database
    await prisma.lesson.create({
      data: {
        title,
        description,
        thumbnailKey,
        videoUrl,
        chapterId,
      },
    });

    return {
      status: "success",
      message: "Lesson created successfully.",
    };
  } catch (error) {
    console.error("Error creating lesson:", error);
    return {
      status: "error",
      message: "Failed to create lesson.",
    };
  }
};
