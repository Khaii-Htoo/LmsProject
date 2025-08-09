import { adminGetCourseWithRelatedData } from "@/app/data/admin/admin-get-course";
import React from "react";
import CourseDetail from "./_components/course-detail";
import Loading from "../../courses/[courseId]/edit/loading";

interface PageProps {
  params: { courseId: string };
}

const Page = async ({ params }: PageProps) => {
  const { courseId } = params;
  const data = await adminGetCourseWithRelatedData(courseId);

  return <div>{data ? <CourseDetail courseData={data} /> : <Loading />}</div>;
};

export default Page;
