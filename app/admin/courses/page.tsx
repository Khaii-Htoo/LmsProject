import { adminGetCourses } from "@/app/data/admin/admin-get-courses";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

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
    </div>
  );
};

export default page;
