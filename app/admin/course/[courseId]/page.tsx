import { adminGetCourseWithRelatedData } from "@/app/data/admin/admin-get-course";
import React from "react";
import CourseDetail from "./_components/course-detail";
import Loading from "../../courses/[courseId]/edit/loading";

const page = async ({ params }: { params: { courseId: string } }) => {
  const { courseId } = params;

  const data = await adminGetCourseWithRelatedData(courseId);
  console.log(data);

  return <div>{data ? <CourseDetail courseData={data} /> : <Loading />}</div>;
};

export default page;
