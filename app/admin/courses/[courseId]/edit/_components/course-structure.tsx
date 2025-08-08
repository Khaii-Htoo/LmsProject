"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
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
  Plus,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CreateNewChapter from "./create-new-chapter";
import CreateNewLesson from "./create-new-lesson";

interface Lesson {
  id: string;
  title: string;
}

interface Chapter {
  chapterId: string;
  title: string;
  lessons: Lesson[];
}

function findChapter(chapters: Chapter[], lessonId: string) {
  for (const chapter of chapters) {
    if (chapter.lessons.some((lesson) => lesson.id === lessonId)) {
      return chapter;
    }
  }
  return null;
}

function LessonList({
  chapter,
  isExpanded,
}: {
  chapter: Chapter;
  isExpanded: boolean;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [maxHeight, setMaxHeight] = useState("0px");

  useEffect(() => {
    if (ref.current) {
      if (isExpanded) {
        setMaxHeight(`${ref.current.scrollHeight}px`);
      } else {
        setMaxHeight("0px");
      }
    }
  }, [isExpanded, chapter.lessons.length]);

  return (
    <>
      <div
        ref={ref}
        style={{ maxHeight: maxHeight }}
        className="overflow-hidden transition-all duration-300 ease-in-out md:pl-8 pt-2 mb-7"
      >
        <SortableContext
          items={chapter.lessons.map((lesson) => lesson.id)}
          strategy={verticalListSortingStrategy}
        >
          {chapter.lessons.map((lesson) => (
            <SortableLesson key={lesson.id} lesson={lesson} />
          ))}
        </SortableContext>
      </div>
      <CreateNewLesson chapterId="hshbsh" />
    </>
  );
}

function SortableLesson({ lesson }: { lesson: Lesson }) {
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
      className="flex items-center border bg-gray-100 dark:bg-zinc-800 rounded-md p-2  my-0.5  transition-colors  text-zinc-900 dark:text-zinc-100"
    >
      <div
        className="w-8 h-8 flex items-center justify-center cursor-grab text-zinc-500 hover:text-zinc-300 transition-colors"
        {...attributes}
        {...listeners}
      >
        <GripVertical size={20} />
      </div>
      <div className="flex-grow ml-2">{lesson.title}</div>
      <button
        className="text-zinc-500 hover:text-red-500 transition-colors p-1 rounded"
        onPointerDown={(e) => e.stopPropagation()} // Stop event propagation
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}

function SortableChapter({ chapter }: { chapter: Chapter }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: chapter.chapterId });

  const [isExpanded, setIsExpanded] = useState(true);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className=" rounded-md p-2 my-2 mb-3 border cursor-grab"
    >
      <div className="flex items-center">
        <div className="w-8 h-8 flex items-center justify-center text-zinc-500 hover:text-zinc-300 transition-colors">
          <GripVertical size={20} />
        </div>
        <button
          onClick={toggleExpanded}
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
          className="text-zinc-500 hover:text-red-500 transition-colors p-1 rounded"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <Trash2 size={16} />
        </button>
      </div>
      <LessonList chapter={chapter} isExpanded={isExpanded} />
    </div>
  );
}

export default function CourseStructure({ courseId }: { courseId: string }) {
  const [chapters, setChapters] = useState<Chapter[]>([
    {
      chapterId: "chapter-1",
      title: "Chapter One",
      lessons: [
        { id: "lesson-1", title: "Lesson One" },
        { id: "lesson-2", title: "Lesson Two" },
      ],
    },
    {
      chapterId: "chapter-2",
      title: "Chapter Two",
      lessons: [
        { id: "lesson-3", title: "Lesson Three" },
        { id: "lesson-4", title: "Lesson Four" },
      ],
    },
  ]);

  const [activeItem, setActiveItem] = useState<any>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragStart = (event: any) => {
    const { active } = event;
    setActiveItem(active);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (!over) {
      setActiveItem(null);
      return;
    }

    if (active.id.toString().startsWith("chapter-")) {
      const oldIndex = chapters.findIndex(
        (chapter) => chapter.chapterId === active.id
      );
      const newIndex = chapters.findIndex(
        (chapter) => chapter.chapterId === over.id
      );

      if (oldIndex !== -1 && newIndex !== -1) {
        setChapters((prevChapters) =>
          arrayMove(prevChapters, oldIndex, newIndex)
        );
      }
    }

    if (active.id.toString().startsWith("lesson-")) {
      const activeChapter = findChapter(chapters, active.id);
      const overChapter = findChapter(chapters, over.id);

      if (activeChapter && overChapter) {
        const activeChapterId = activeChapter.chapterId;
        const overChapterId = overChapter.chapterId;

        if (activeChapterId === overChapterId) {
          setChapters((prevChapters) =>
            prevChapters.map((chapter) => {
              if (chapter.chapterId === activeChapterId) {
                const oldIndex = chapter.lessons.findIndex(
                  (lesson) => lesson.id === active.id
                );
                const newIndex = chapter.lessons.findIndex(
                  (lesson) => lesson.id === over.id
                );
                return {
                  ...chapter,
                  lessons: arrayMove(chapter.lessons, oldIndex, newIndex),
                };
              }
              return chapter;
            })
          );
        } else {
          setChapters((prevChapters) => {
            const newChapters = [...prevChapters];

            const activeChapterIndex = newChapters.findIndex(
              (chapter) => chapter.chapterId === activeChapterId
            );
            const activeLessonIndex = newChapters[
              activeChapterIndex
            ].lessons.findIndex((lesson) => lesson.id === active.id);
            const [movedLesson] = newChapters[
              activeChapterIndex
            ].lessons.splice(activeLessonIndex, 1);

            const overChapterIndex = newChapters.findIndex(
              (chapter) => chapter.chapterId === overChapterId
            );
            const overLessonIndex = newChapters[
              overChapterIndex
            ].lessons.findIndex((lesson) => lesson.id === over.id);
            newChapters[overChapterIndex].lessons.splice(
              overLessonIndex,
              0,
              movedLesson
            );

            return newChapters;
          });
        }
      }
    }

    setActiveItem(null);
  };

  return (
    <Card>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="w-full p-4">
          <CardHeader className="md:flex flex-row justify-between items-center space-y-0 pb-2">
            <h1 className="md:text-3xl font-extrabold ">Course Structure</h1>
            <CreateNewChapter courseId={courseId} />
          </CardHeader>
          <CardContent>
            <SortableContext
              items={chapters.map((chapter) => chapter.chapterId)}
              strategy={verticalListSortingStrategy}
            >
              {chapters.map((chapter) => (
                <SortableChapter key={chapter.chapterId} chapter={chapter} />
              ))}
            </SortableContext>
          </CardContent>
        </div>
        <DragOverlay>
          {activeItem &&
            (activeItem.id.toString().startsWith("chapter-") ? (
              <div className="bg-zinc-700 rounded-md p-2 my-2 shadow-md opacity-80">
                <div className="flex items-center">
                  <GripVertical size={20} className="text-zinc-500" />
                  <div className="flex-grow font-semibold ml-2">
                    {activeItem.id}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-zinc-800 rounded-md p-2 my-1 shadow-sm opacity-80">
                <div className="flex items-center">
                  <GripVertical size={20} className="text-zinc-500" />
                  <div className="flex-grow ml-2">{activeItem.id}</div>
                </div>
              </div>
            ))}
        </DragOverlay>
      </DndContext>
    </Card>
  );
}
