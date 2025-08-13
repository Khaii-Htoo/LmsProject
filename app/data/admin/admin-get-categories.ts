import { prisma } from "@/lib/db";
import { requireAdmin } from "./require-admin";

export const getCategories = async () => {
  await requireAdmin();

  const data = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
    select: {
      id: true,
      name: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          courses: true,
        },
      },
    },
  });

  return data;
};

export type CategoryType = Awaited<ReturnType<typeof getCategories>>[0];