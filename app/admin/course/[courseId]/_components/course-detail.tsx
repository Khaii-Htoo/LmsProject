"use client";
import Loading from "@/app/admin/courses/[courseId]/edit/loading";
import React, { useState, useEffect } from "react";
import ReactPlayer from "react-player";

// Define the data structures based on your Prisma models
interface Lesson {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Chapter {
  id: string;
  title: string;
  position: number;
  createdAt: Date;
  updatedAt: Date;
  lesson: Lesson[];
}

interface CourseData {
  id: string;
  title: string;
  description: string;
  fileKey: string;
  price: number;
  duration: number;
  level: string;
  status: string;
  slug: string;
  category: string;
  chapter: Chapter[];
}

interface CourseDetailProps {
  courseData: CourseData;
}

const CourseDetail: React.FC<CourseDetailProps> = ({ courseData }) => {
  // const [course, setCourse] = useState<CourseData | null>(null);
  // const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [activeChapterId, setActiveChapterId] = useState<string | null>(null); // State for collapsible chapters

  useEffect(() => {
    // setCourse(courseData);
    if (
      courseData.chapter.length > 0 &&
      courseData.chapter[0].lesson.length > 0
    ) {
      setSelectedLesson(courseData.chapter[0].lesson[0]); // Select the first lesson by default
      setActiveChapterId(courseData.chapter[0].id); // Open the first chapter by default
    }
    // setLoading(false);
  }, [courseData]);

  const formatDuration = (totalMinutes: number) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m`;
  };

  const calculateTotalLessons = (chapters: Chapter[]) => {
    return chapters.reduce(
      (count, chapter) => count + chapter.lesson.length,
      0
    );
  };

  const toggleChapter = (chapterId: string) => {
    setActiveChapterId(activeChapterId === chapterId ? null : chapterId);
  };

  // if (loading) {
  //   <Loading />;
  // }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-red-500">
        <p className="text-xl">{error}</p>
      </div>
    );
  }

  if (!courseData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <p className="text-xl">Course not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-950 dark:to-gray-800 font-inter text-gray-900 dark:text-gray-100 p-2 sm:p-8 transition-colors duration-500">
      <div className="w-full mx-auto rounded-xl shadow-xl overflow-hidden bg-white dark:bg-gray-850 transform transition-all duration-500 hover:shadow-2xl">
        <div className="flex flex-col lg:flex-row">
          {/* Main Content Area */}
          <div className="lg:w-2/3 p-2 bg-gray-200 dark:bg-gray-900">
            {/* Video Player Section */}
            <div className="relative w-full aspect-video bg-gray-200 dark:bg-gray-700 rounded-2xl overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-[1.005] animate-fade-in-up">
              {/* <VideoPlayer
                videoUrl={selectedLesson?.videoUrl}
                title={selectedLesson?.title}
              /> */}
              <ReactPlayer
                src={selectedLesson?.videoUrl}
                width="100%"
                height="100%"
                controls
              />
            </div>
            <h1 className="text-3xl mt-5 sm:text-4xl font-extrabold mb-4 leading-tight text-gray-800 dark:text-gray-50 animate-fade-in-down">
              {courseData.title}
            </h1>
            {/* Course Overview Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl shadow-sm flex items-center space-x-3 transition-transform duration-300 hover:scale-105 animate-fade-in-left">
                <span className="text-blue-600 dark:text-blue-400 text-2xl">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                </span>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Duration
                  </p>
                  <p className="font-semibold text-gray-800 dark:text-gray-100">
                    {formatDuration(courseData.duration)}
                  </p>
                </div>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl shadow-sm flex items-center space-x-3 transition-transform duration-300 hover:scale-105 animate-fade-in-left delay-100">
                <span className="text-green-600 dark:text-green-400 text-2xl">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 13.5l10.5-11.25L12 10.5h8.25L13.5 21.75 15 13.5h-5.25Z"
                    />
                  </svg>
                </span>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Level
                  </p>
                  <p className="font-semibold text-gray-800 dark:text-gray-100">
                    {courseData.level}
                  </p>
                </div>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl shadow-sm flex items-center space-x-3 transition-transform duration-300 hover:scale-105 animate-fade-in-left delay-200">
                <span className="text-purple-600 dark:text-purple-400 text-2xl">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25h-2.25a2.25 2.25 0 0 1-2.25-2.25v-2.25Z"
                    />
                  </svg>
                </span>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Category
                  </p>
                  <p className="font-semibold text-gray-800 dark:text-gray-100">
                    {courseData.category}
                  </p>
                </div>
              </div>
            </div>
            <div
              className="text-lg text-gray-600 dark:text-gray-300 mb-6 animate-fade-in mt-5"
              dangerouslySetInnerHTML={{
                __html: courseData.description.replace(/<\/?p>/g, ""),
              }}
            ></div>

            {/* Current Lesson Details */}
            {selectedLesson && (
              <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-md transition-all duration-300 animate-slide-in-bottom">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-50 mb-2">
                  {selectedLesson.title}
                </h3>
                <div
                  className="text-lg text-gray-600 dark:text-gray-300 mb-6 animate-fade-in mt-5"
                  dangerouslySetInnerHTML={{
                    __html: courseData.description.replace(/<\/?p>/g, ""),
                  }}
                ></div>
              </div>
            )}

            {/* <div className="mt-8 flex items-center justify-between p-4 bg-indigo-600 text-white rounded-xl shadow-lg transform transition-transform duration-300 hover:scale-[1.01] animate-fade-in-up">
              <span className="text-2xl sm:text-3xl font-bold">
                Price: ${course.price}
              </span>
              <button className="px-6 py-3 bg-white text-indigo-700 font-bold rounded-full shadow-md hover:bg-indigo-100 transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-75">
                Enroll Now
              </button>
            </div> */}
          </div>

          {/* Chapters and Lessons Sidebar */}
          <div className="lg:w-1/3 bg-gray-50 dark:bg-gray-900 border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-700 p-6 sm:p-8 animate-fade-in-right">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
              Course Content ({calculateTotalLessons(courseData.chapter)}{" "}
              Lessons)
            </h2>
            <div className="space-y-4">
              {courseData.chapter.map((chapter) => (
                <div
                  key={chapter.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-300 ease-in-out transform hover:scale-[1.01]"
                >
                  <button
                    onClick={() => toggleChapter(chapter.id)}
                    className="flex justify-between items-center w-full p-4 text-left font-semibold text-lg text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 rounded-t-lg focus:outline-none"
                  >
                    <span>
                      {chapter.position + 1}. {chapter.title}
                    </span>
                    <span
                      className={`transform transition-transform duration-300 ${activeChapterId === chapter.id ? "rotate-180" : ""}`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m19.5 8.25-7.5 7.5-7.5-7.5"
                        />
                      </svg>
                    </span>
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${
                      activeChapterId === chapter.id
                        ? "max-h-screen opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                      {chapter.lesson.map((lesson) => (
                        <li key={lesson.id}>
                          <button
                            onClick={() => setSelectedLesson(lesson)}
                            className={`flex items-center w-full p-3 pl-6 text-left text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors duration-200 ${
                              selectedLesson?.id === lesson.id
                                ? "bg-blue-100 dark:bg-blue-900 font-medium text-blue-800 dark:text-blue-50"
                                : ""
                            } focus:outline-none`}
                          >
                            <span className="mr-2">
                              {selectedLesson?.id === lesson.id ? (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                  className="w-5 h-5 text-blue-600 dark:text-blue-400"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              ) : (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={1.5}
                                  stroke="currentColor"
                                  className="w-5 h-5"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.604 3.69A.375.375 0 0 1 9.75 15.262V8.738a.375.375 0 0 1 .559-.327l5.604 3.69Z"
                                  />
                                </svg>
                              )}
                            </span>
                            {lesson.title}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Footer or additional content */}
      <div className="mt-12 text-center text-gray-600 dark:text-gray-400 text-sm">
        <p>&copy; 2025 Khai Htoo Lay Coder. All rights reserved.</p>
      </div>
    </div>
  );
};

export default CourseDetail;
