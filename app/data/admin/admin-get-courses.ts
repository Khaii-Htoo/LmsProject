import { prisma } from "@/lib/db";
import { requireAdmin } from "./require-admin";

export const adminGetCourses = async () => {
  await requireAdmin();

  const data = await prisma.course.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      title: true,
      description: true,
      duration: true,
      level: true,
      status: true,
      price: true,
      fileKey: true,
      slug: true,
    },
  });
  return data;
};

export type AdminCourseType = Awaited<ReturnType<typeof adminGetCourses>>[0];
