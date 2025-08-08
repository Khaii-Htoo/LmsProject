"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  Active,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  GripVertical,
  Trash2,
  ChevronDown,
  ChevronRight,
  Book,
  GraduationCap,
  TvMinimalPlay,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import CreateNewChapter from "./create-new-chapter";
import CreateNewLesson from "./create-new-lesson";
import { ChapterWithLessonsType, LessonType } from "@/type"; // Assuming your types are in @/types

// Helper function to find the chapter that a lesson belongs to
function findChapterByLessonId(
  chapters: ChapterWithLessonsType[],
  lessonId: string
) {
  return chapters.find((chapter) =>
    chapter.lesson.some((lesson: LessonType) => lesson.id === lessonId)
  );
}

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
          <SortableLesson key={lesson.id} lesson={lesson} />
        ))}
      </SortableContext>
      <CreateNewLesson chapterId={chapter.id} courseId={courseId} />
    </div>
  );
}

// === SORTABLE LESSON COMPONENT ===
function SortableLesson({ lesson }: { lesson: LessonType }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: lesson.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
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
      <button
        className="text-zinc-500 hover:text-red-500 p-1 rounded"
        onPointerDown={(e) => e.stopPropagation()}
      >
        <Trash2 size={16} />
      </button>
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
    useSortable({ id: chapter.id }); // Use chapter.id instead of chapterId

  const [isExpanded, setIsExpanded] = useState(true);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
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
        <button
          className="text-zinc-500 hover:text-red-500 p-1 rounded"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <Trash2 size={16} />
        </button>
      </div>
      <LessonList
        chapter={chapter}
        isExpanded={isExpanded}
        courseId={courseId}
      />
    </div>
  );
}

// === MAIN COURSE STRUCTURE COMPONENT ===
export default function CourseStructure({
  courseId,
  chapters: initialChapters, // Rename prop for clarity
}: {
  courseId: string;
  chapters: ChapterWithLessonsType[];
}) {
  const [chapters, setChapters] = useState(initialChapters);
  const [activeItem, setActiveItem] = useState<Active | null>(null);
  const [activeChapter, setActiveChapter] =
    useState<ChapterWithLessonsType | null>(null);
  const [activeLesson, setActiveLesson] = useState<LessonType | null>(null);

  // Sync state if the initial prop changes from the parent
  useEffect(() => {
    setChapters(initialChapters);
  }, [initialChapters]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragStart = (event: { active: Active }) => {
    const { active } = event;
    setActiveItem(active);

    // Find and set the active chapter or lesson for the DragOverlay
    const isChapter = chapters.some((c) => c.id === active.id);
    if (isChapter) {
      setActiveChapter(chapters.find((c) => c.id === active.id) || null);
      setActiveLesson(null);
    } else {
      const chapter = findChapterByLessonId(chapters, active.id as string);
      const lesson = chapter?.lesson.find((l) => l.id === active.id);
      setActiveLesson(lesson || null);
      setActiveChapter(null);
    }
  };

  const handleDragEnd = (event: { active: Active; over: Active | null }) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      setActiveItem(null);
      return;
    }

    const isDraggingChapter = chapters.some((c) => c.id === active.id);

    // --- CASE 1: Reordering Chapters ---
    if (isDraggingChapter) {
      const oldIndex = chapters.findIndex((c) => c.id === active.id);
      const newIndex = chapters.findIndex((c) => c.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        setChapters((prev) => arrayMove(prev, oldIndex, newIndex));
      }
    }

    // --- CASE 2: Reordering Lessons ---
    else {
      const activeChapter = findChapterByLessonId(
        chapters,
        active.id as string
      );
      const overChapter = findChapterByLessonId(chapters, over.id as string);

      if (!activeChapter || !overChapter) return;

      // Reordering within the same chapter
      if (activeChapter.id === overChapter.id) {
        setChapters((prev) =>
          prev.map((chapter) => {
            if (chapter.id === activeChapter.id) {
              const oldIndex = chapter.lesson.findIndex(
                (l) => l.id === active.id
              );
              const newIndex = chapter.lesson.findIndex(
                (l) => l.id === over.id
              );
              return {
                ...chapter,
                lesson: arrayMove(chapter.lesson, oldIndex, newIndex),
              };
            }
            return chapter;
          })
        );
      } else {
        // Moving a lesson to a different chapter
        setChapters((prev) => {
          const newChapters = [...prev];
          const activeChapterIndex = newChapters.findIndex(
            (c) => c.id === activeChapter.id
          );
          const overChapterIndex = newChapters.findIndex(
            (c) => c.id === overChapter.id
          );

          const activeLessonIndex = activeChapter.lesson.findIndex(
            (l) => l.id === active.id
          );
          const [movedLesson] = newChapters[activeChapterIndex].lesson.splice(
            activeLessonIndex,
            1
          );

          const overLessonIndex = overChapter.lesson.findIndex(
            (l) => l.id === over.id
          );
          newChapters[overChapterIndex].lesson.splice(
            overLessonIndex,
            0,
            movedLesson
          );

          return newChapters;
        });
      }
    }
    setActiveItem(null);
    setActiveChapter(null);
    setActiveLesson(null);
  };

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

      {activeChapter ? (
        <div className="bg-white dark:bg-zinc-900 rounded-md p-2 my-2 shadow-md opacity-80 border cursor-grab">
          <div className="flex items-center">
            <GripVertical size={20} className="text-zinc-500" />
            <div className="flex-grow font-semibold ml-2">
              {activeChapter.title}
            </div>
          </div>
        </div>
      ) : activeLesson ? (
        <div className="bg-gray-100 dark:bg-zinc-800 rounded-md p-2 my-1 shadow-sm opacity-80 border">
          <div className="flex items-center">
            <GripVertical size={20} className="text-zinc-500" />
            <div className="flex-grow ml-2">{activeLesson.title}</div>
          </div>
        </div>
      ) : null}
    </Card>
  );
}
