import { adminGetCourseWithRelatedData } from "@/app/data/admin/admin-get-course";
import React from "react";
import CourseDetail from "./_components/course-detail";
import Loading from "../../courses/[courseId]/edit/loading";

interface PageProps {
  params: Promise<{ courseId: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { courseId } = await params; // Await here because params is Promise
  try {
    const data = await adminGetCourseWithRelatedData(courseId);

    return <div>{data ? <CourseDetail courseData={data} /> : <Loading />}</div>;
  } catch (error) {
    console.error("Failed to fetch course data:", error);
    return <div>Error: Failed to load course</div>;
  }
};

export default Page;
