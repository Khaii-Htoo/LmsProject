import { adminGetCourses } from "@/app/data/admin/admin-get-courses";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import Link from "next/link";
import React from "react";
import AdminCourseCard from "./_components/AdminCourseCard";

const page = async () => {
  const data = await adminGetCourses();
  console.log(data);
  return (
    <div>
      <div className=" flex justify-between items-center">
        <h1>Your Courses</h1>
        <Link
          href={"/admin/courses/create"}
          className={cn(
            buttonVariants({
              variant: "default",
            })
          )}
        >
          <Plus />
          Create Course
        </Link>
      </div>
      <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
        {data.map((course) => (
          <AdminCourseCard key={course.id} data={course} />
        ))}
      </div>
    </div>
  );
};

export default page;
