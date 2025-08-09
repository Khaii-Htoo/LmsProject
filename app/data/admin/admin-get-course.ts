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
