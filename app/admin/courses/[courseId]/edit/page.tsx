import { adminGetCourse } from "@/app/data/admin/admin-get-course";
import { ChevronsLeft, Link } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import EditCourseForm from "./_components/edit-course-form";
export interface FetchedCourseData {
  id: string;
  title: string;
  category: string;
  description: string;
  duration: number;
  fileKey: string;
  level: string;
  price: number;
  status: string;
}

const EditCoursePage = async ({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) => {
  const { courseId } = await params;

  let courseData: FetchedCourseData | null = null;
  let error: string | null = null;

  try {
    courseData = await adminGetCourse(courseId);
    if (!courseData) {
      error = "Course not found.";
    }
  } catch (e) {
    console.error("Error fetching course:", e);
    error = "Failed to load course data.";
  }

  if (error || !courseData) {
    return (
      <div className="p-8 text-center text-red-500">
        <h1>Error</h1>
        <p>{error}</p>
        {/* Optionally add a link back */}
        <Link href="/admin/courses" className="text-blue-500 underline">
          Go back to courses
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center space-x-3 mb-5">
        <Link
          href={"/admin/courses"}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "inline-flex items-center justify-center"
          )}
        >
          <ChevronsLeft />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Edit Course
        </h1>
      </div>
      <EditCourseForm courseData={courseData} />
    </div>
  );
};

export default EditCoursePage;
