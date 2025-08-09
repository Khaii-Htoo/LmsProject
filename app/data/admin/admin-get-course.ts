import { prisma } from "@/lib/db";
import { requireAdmin } from "./require-admin";
import { notFound } from "next/navigation";

export const adminGetCourse = async (id: string) => {
  await requireAdmin();
  const data = await prisma.course.findUnique({
    where: { id: id },
    select: {
      id: true,
      title: true,
      description: true,
      fileKey: true,
      price: true,
      duration: true,
      level: true,
      status: true,
      slug: true,
      category: true,
    },
  });

  if (!data) {
    return notFound();
  }

  return data;
};

export const adminGetCourseWithRelatedData = async (id: string) => {
  // await requireAdmin();

  const data = await prisma.course.findUnique({
    where: { id: id },
    select: {
      id: true,
      title: true,
      description: true,
      fileKey: true,
      price: true,
      duration: true,
      level: true,
      status: true,
      slug: true,
      category: true,
      // Include the related Chapter data
      chapter: {
        select: {
          id: true,
          title: true,
          position: true,
          createdAt: true,
          updatedAt: true,
          // Include the related Lesson data for each Chapter
          lesson: {
            select: {
              id: true,
              title: true,
              description: true,
              videoUrl: true,
              createdAt: true,
              updatedAt: true,
            },
            orderBy: {
              // You might want to order lessons, e.g., by creation date or a specific order field if you add one
              createdAt: "asc",
            },
          },
        },
        orderBy: {
          // It's good practice to order chapters, e.g., by position
          position: "asc",
        },
      },
    },
  });

  if (!data) {
    // If no course is found with the given ID, return a 404
    return notFound();
  }

  return data;
};
