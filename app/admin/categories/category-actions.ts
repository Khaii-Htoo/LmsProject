"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import arcjet from "@/lib/arcjet";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/type";
import { detectBot, fixedWindow, request } from "@arcjet/next";
import { redirect } from "next/navigation";
import { z } from "zod";

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

const categorySchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
});

export const createCategory = async (formData: FormData): Promise<ApiResponse> => {
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

    const name = formData.get("name") as string;
    
    const validationResult = categorySchema.safeParse({ name });
    
    if (!validationResult.success) {
      return {
        status: "error",
        message: validationResult.error.format().name?._errors[0] || "Invalid input",
      };
    }

    // Check if category with this name already exists
    const existingCategory = await prisma.category.findUnique({
      where: { name },
    });

    if (existingCategory) {
      return {
        status: "error",
        message: "A category with this name already exists",
      };
    }

    await prisma.category.create({
      data: {
        name,
      },
    });

    return {
      status: "success",
      message: "Category created successfully",
    };
  } catch (error) {
    console.log(error);
    return {
      status: "error",
      message: "Failed to create category",
    };
  }
};

export const updateCategory = async (categoryId: string, formData: FormData): Promise<ApiResponse> => {
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

    const name = formData.get("name") as string;
    
    const validationResult = categorySchema.safeParse({ name });
    
    if (!validationResult.success) {
      return {
        status: "error",
        message: validationResult.error.format().name?._errors[0] || "Invalid input",
      };
    }

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!existingCategory) {
      return {
        status: "error",
        message: "Category not found",
      };
    }

    // Check if another category with the same name exists
    const duplicateCategory = await prisma.category.findFirst({
      where: {
        name,
        id: { not: categoryId },
      },
    });

    if (duplicateCategory) {
      return {
        status: "error",
        message: "A category with this name already exists",
      };
    }

    await prisma.category.update({
      where: { id: categoryId },
      data: {
        name,
      },
    });

    return {
      status: "success",
      message: "Category updated successfully",
    };
  } catch (error) {
    console.log(error);
    return {
      status: "error",
      message: "Failed to update category",
    };
  }
};

export const deleteCategory = async (categoryId: string): Promise<ApiResponse> => {
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

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id: categoryId },
      include: {
        courses: true,
      },
    });

    if (!existingCategory) {
      return {
        status: "error",
        message: "Category not found",
      };
    }

    // Check if category has courses
    if (existingCategory.courses.length > 0) {
      return {
        status: "error",
        message: "Cannot delete category with associated courses",
      };
    }

    await prisma.category.delete({
      where: { id: categoryId },
    });

    return {
      status: "success",
      message: "Category deleted successfully",
    };
  } catch (error) {
    console.log(error);
    return {
      status: "error",
      message: "Failed to delete category",
    };
  }
};

export const getCategory = async (categoryId: string) => {
  const session = await requireAdmin();
  if (session.user.role !== "admin") {
    return redirect("/");
  }

  try {
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new Error("Category not found");
    }

    return category;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch category");
  }
};