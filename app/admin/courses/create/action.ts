"use server";

import { prisma } from "@/lib/db";
import { courseCreateSchema } from "@/lib/zod-schems";
import { ApiResponse, courseSchemaType } from "@/type";
import slugify from "slugify";

export const createCourse = async (
  payload: courseSchemaType
): Promise<ApiResponse> => {
  try {
    const validation = courseCreateSchema.safeParse(payload);
    if (!validation.success) {
      return {
        status: "error",
        message: "Invalid from data",
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

    const newCourse = await prisma.course.create({
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
        userId: "DvdzD6xmE8sNB61oKL732siMB3GiqRSX",
      },
    });
    return {
      status: "success",
      message: "Course created successfully",
    };
  } catch (error) {
    console.log(error);
    return {
      status: "error",
      message: "Failed course create",
    };
  }
};
