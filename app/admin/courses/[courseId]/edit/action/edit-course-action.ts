"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import arcjet from "@/lib/arcjet";
import { prisma } from "@/lib/db";
import { courseCreateSchema } from "@/lib/zod-schems";
import { ApiResponse, courseSchemaType } from "@/type";
import { detectBot, fixedWindow, request } from "@arcjet/next";
import { redirect } from "next/navigation";
import slugify from "slugify";

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

export const updateCourse = async (
  courseId: string,
  payload: courseSchemaType
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
          message: "You have been blocked due to rate limiting",
        };
      } else {
        return {
          status: "error",
          message: "You are a bot!",
        };
      }
    }

    const validation = courseCreateSchema.safeParse(payload);
    if (!validation.success) {
      return {
        status: "error",
        message: "Invalid form data",
      };
    }

    const {
      title,
      description,
      fileKey,
      price,
      duration,
      level,
      category,
      status,
    } = validation.data;

    // Check if course exists and belongs to admin (optional security check)
    const existingCourse = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!existingCourse) {
      return {
        status: "error",
        message: "Course not found",
      };
    }

    await prisma.course.update({
      where: { id: courseId },
      data: {
        title,
        description,
        fileKey,
        price: Number(price),
        duration: Number(duration),
        level,
        category,
        status,
        slug: slugify(title, "_"),
      },
    });

    return {
      status: "success",
      message: "Course updated successfully",
    };
  } catch (error) {
    console.log(error);
    return {
      status: "error",
      message: "Failed to update course",
    };
  }
};
