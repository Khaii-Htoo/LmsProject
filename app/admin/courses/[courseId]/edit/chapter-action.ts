"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import arcjet from "@/lib/arcjet";
import { prisma } from "@/lib/db";
import { chapterCreateSchema, chapterSchemaType } from "@/lib/zod-schems";
import { ApiResponse, ChapterWithLessonsType } from "@/type"; // Ensure ApiResponse and ChapterWithLessonsType are correctly imported and defined
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

// Create Chapter Server Action
// =============================================>
export const createChapter = async (
  payload: chapterSchemaType,
  id: string
): Promise<ApiResponse> => {
  const session = await requireAdmin();
  if (session.user.role !== "admin") {
    return redirect("/"); // Redirect if user is not an admin
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
          message: "Failed to create: rate limit exceeded.",
        };
      } else {
        return {
          status: "error",
          message: "Bot detected!",
        };
      }
    }

    const validation = chapterCreateSchema.safeParse(payload);
    if (!validation.success) {
      return {
        status: "error",
        message: "Invalid form data provided.",
      };
    }

    const { title } = validation.data;

    // Determine the next position for the new chapter
    const lastChapter = await prisma.chapter.findFirst({
      where: {
        courseId: id,
      },
      orderBy: {
        position: "desc",
      },
      select: {
        position: true,
      },
    });

    const newPosition = lastChapter ? lastChapter.position + 1 : 0;

    // Create the new chapter in the database
    await prisma.chapter.create({
      data: {
        title,
        courseId: id,
        position: newPosition,
      },
    });

    return {
      status: "success",
      message: "Chapter created successfully.",
    };
  } catch (error) {
    console.error("Error creating chapter:", error);
    return {
      status: "error",
      message: "Failed to create chapter.",
    };
  }
};

// Get Chapters with Lessons
// =============================================>
export const getChaptersWithLessons = async (
  courseId: string
): Promise<ApiResponse | ChapterWithLessonsType[]> => {
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
          message: "Request blocked: rate limit exceeded.",
        };
      } else {
        return {
          status: "error",
          message: "Bot detected!",
        };
      }
    }

    // Fetch chapters including their associated lessons
    const chapters = await prisma.chapter.findMany({
      where: {
        courseId: courseId,
      },
      include: {
        lesson: {
          orderBy: {
            createdAt: "asc", // Order lessons by creation time
          },
        },
      },
      orderBy: {
        position: "asc", // Order chapters by their position
      },
    });

    return chapters as ChapterWithLessonsType[];
  } catch (error) {
    console.error("Error fetching chapters and lessons:", error);
    return {
      status: "error",
      message: "Failed to fetch chapters and lessons.",
    };
  }
};

export const deleteChapter = async (
  chapterId: string
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
          message: "Failed to delete chapter: rate limit exceeded.",
        };
      } else {
        return {
          status: "error",
          message: "Bot detected!",
        };
      }
    }

    const existingChapter = await prisma.chapter.findUnique({
      where: { id: chapterId },
    });

    if (!existingChapter) {
      return {
        status: "error",
        message: "Chapter not found.",
      };
    }

    await prisma.chapter.delete({
      where: {
        id: chapterId,
      },
    });

    return {
      status: "success",
      message: "Chapter deleted successfully.",
    };
  } catch (error) {
    console.error("Error deleting chapter:", error);
    return {
      status: "error",
      message: "Failed to delete chapter.",
    };
  }
};
