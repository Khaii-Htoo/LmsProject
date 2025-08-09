"use client";

import React, { useState, useRef, useEffect, useTransition } from "react";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Trash2,
  ChevronDown,
  ChevronRight,
  Book,
  TvMinimalPlay,
  LoaderIcon,
  Pen,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import CreateNewChapter from "./create-new-chapter";
import CreateNewLesson from "./create-new-lesson";
import { ChapterWithLessonsType, LessonType } from "@/type";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { tryCatch } from "@/hooks/try-catch";
import { deleteLesson } from "../action/lesson-action";
import { toast } from "sonner";
import { redirect, useRouter } from "next/navigation";
import { deleteChapter } from "../action/chapter-action";
import { Button } from "@/components/ui/button";
import EditLesson from "./edit-lesson";

// === LESSON LIST COMPONENT ===
function LessonList({
  chapter,
  isExpanded,
  courseId,
}: {
  chapter: ChapterWithLessonsType;
  isExpanded: boolean;
  courseId: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [maxHeight, setMaxHeight] = useState("0px");

  useEffect(() => {
    if (ref.current) {
      setMaxHeight(isExpanded ? `${ref.current.scrollHeight}px` : "0px");
    }
  }, [isExpanded, chapter.lesson.length]); // Use chapter.lesson (singular)

  return (
    <div
      ref={ref}
      style={{ maxHeight }}
      className="overflow-hidden transition-all duration-300 ease-in-out md:pl-8 pt-2 mb-7"
    >
      <SortableContext
        items={chapter.lesson.map((lesson) => lesson.id)} // Use chapter.lesson
        strategy={verticalListSortingStrategy}
      >
        {chapter.lesson.map((lesson) => (
          <SortableLesson
            key={lesson.id}
            lesson={lesson}
            courseId={courseId}
            chaperId={chapter.id}
          />
        ))}
      </SortableContext>
      <CreateNewLesson chapterId={chapter.id} courseId={courseId} />
    </div>
  );
}

// === SORTABLE LESSON COMPONENT ===

type LessonProps = {
  lesson: LessonType;
  courseId: string;
  chaperId: string;
};
function SortableLesson({ lesson, courseId, chaperId }: LessonProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: lesson.id });

  const [pendingTransition, startTransition] = useTransition();

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleDeleteLesson = async (id: string) => {
    startTransition(async () => {
      const { data: response, error } = await tryCatch(deleteLesson(id));
      if (error) {
        toast.error("An unexpected error occured. Please try again");
        return;
      }

      if (response.status === "success") {
        toast.success(response.message);

        redirect("/admin/courses");
      } else {
        toast.error(response.message);
      }
    });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center border bg-gray-100 dark:bg-zinc-800 rounded-md p-2 my-1"
    >
      <div
        className="w-8 h-8 flex items-center justify-center  text-zinc-500"
        {...attributes}
        {...listeners}
      >
        <TvMinimalPlay size={20} />
      </div>
      <div className="flex-grow ml-2">{lesson.title}</div>
      <div className=" flex items-center">
        {/* eidt */}
        <EditLesson
          initialLessonData={{
            ...lesson,
            description: lesson.description ?? "",
            videoUrl: lesson.videoUrl ?? "",
            id: lesson.id,
          }}
          chapterId={chaperId}
          courseId={courseId}
        />
      </div>
      {/* delete */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant={"outline"}>
            <Trash2 size={16} className=" cursor-pointer hover:text-red-500 " />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleDeleteLesson(lesson.id)}>
              {pendingTransition ? (
                <LoaderIcon className=" animate-spin" />
              ) : (
                "Continue"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// === SORTABLE CHAPTER COMPONENT ===
function SortableChapter({
  chapter,
  courseId,
}: {
  chapter: ChapterWithLessonsType;
  courseId: string;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: chapter.id });

  const [isExpanded, setIsExpanded] = useState(true);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const [open, setOpen] = useState(false);
  const [pendingTransition, startTransition] = useTransition();
  const router = useRouter();
  const handleDeleteChapter = async (id: string) => {
    startTransition(async () => {
      const { data: response, error } = await tryCatch(deleteChapter(id));
      if (error) {
        toast.error("An unexpected error occured. Please try again");
        return;
      }

      if (response.status === "success") {
        toast.success(response.message);

        router.push(`/admin/courses/${courseId}/edit`);
        setOpen(false);
      } else {
        toast.error(response.message);
      }
    });
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="rounded-md p-2 my-2 mb-3 border  bg-white dark:bg-zinc-800"
    >
      <div className="flex items-center">
        <div className="w-8 h-8 flex items-center justify-center text-zinc-500">
          <Book size={20} />
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex-grow font-semibold flex items-center ml-2 p-1 rounded"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <span>{chapter.title}</span>
          {isExpanded ? (
            <ChevronDown className="ml-2" size={16} />
          ) : (
            <ChevronRight className="ml-2" size={16} />
          )}
        </button>
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogTrigger asChild>
            <Trash2 size={16} className=" cursor-pointer hover:text-red-500 " />
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setOpen(false)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => handleDeleteChapter(chapter.id)}
              >
                {pendingTransition ? (
                  <LoaderIcon className=" animate-spin" />
                ) : (
                  "Continue"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <LessonList
        chapter={chapter}
        isExpanded={isExpanded}
        courseId={courseId}
      />
    </div>
  );
}

export default function CourseStructure({
  courseId,
  chapters: initialChapters, // Rename prop for clarity
}: {
  courseId: string;
  chapters: ChapterWithLessonsType[];
}) {
  const [chapters, setChapters] = useState(initialChapters);
  useState<ChapterWithLessonsType | null>(null);

  // Sync state if the initial prop changes from the parent
  useEffect(() => {
    setChapters(initialChapters);
  }, [initialChapters]);

  return (
    <Card>
      <div className="w-full p-4">
        <CardHeader className="md:flex flex-row justify-between items-center space-y-0 pb-2">
          <h1 className="md:text-3xl font-extrabold ">Course Structure</h1>
          <CreateNewChapter courseId={courseId} />
        </CardHeader>
        <CardContent>
          <SortableContext
            items={chapters.map((chapter) => chapter.id)}
            strategy={verticalListSortingStrategy}
          >
            {chapters.map((chapter) => (
              <SortableChapter
                key={chapter.id}
                chapter={chapter}
                courseId={courseId}
              />
            ))}
          </SortableContext>
        </CardContent>
      </div>
    </Card>
  );
}
