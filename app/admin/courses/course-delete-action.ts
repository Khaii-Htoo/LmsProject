"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import arcjet from "@/lib/arcjet";
import { prisma } from "@/lib/db";
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
      max: 10,
    })
  );

export const deleteCourse = async (courseId: string): Promise<ApiResponse> => {
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

    const existingCourse = await prisma.course.findUnique({
      where: { id: courseId },
      select: {
        id: true,
        title: true,
        fileKey: true,
      },
    });

    if (!existingCourse) {
      return {
        status: "error",
        message: "Course not found",
      };
    }

    await prisma.course.delete({
      where: { id: courseId },
    });

    if (existingCourse.fileKey) {
      try {
        const deleteResponse = await fetch(
          `${process.env.NEXTAUTH_URL}/api/s3/delete`,
          {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ key: existingCourse.fileKey }),
          }
        );

        if (!deleteResponse.ok) {
          console.warn(`Failed to delete S3 file: ${existingCourse.fileKey}`);
        }
      } catch (s3Error) {
        console.warn("S3 deletion error:", s3Error);
      }
    }

    return {
      status: "success",
      message: "Course deleted successfully",
    };
  } catch (error) {
    console.log(error);
    return {
      status: "error",
      message: "Failed to delete course",
    };
  }
};
