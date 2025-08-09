"use client";

import React, { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { AdminCourseType } from "@/app/data/admin/admin-get-courses";
import { Button, buttonVariants } from "@/components/ui/button";
import { Eye, Pen, Trash, Trash2 } from "lucide-react";
import { redirect } from "next/navigation";
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
import { deleteCourse } from "../course-delete-action";
import { toast } from "sonner";

interface AdminCourseCardProps {
  data: AdminCourseType;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
}

const AdminCourseCard: React.FC<AdminCourseCardProps> = ({
  data,
  onDelete,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const [cardRotation, setCardRotation] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const rotateX = (y / 20) * -1;
    const rotateY = x / 20;

    setCardRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setCardRotation({ x: 0, y: 0 });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    redirect(`/admin/courses/${data.id}/edit`);
  };

  const handleDeleteCourse = async () => {
    const { data: response, error } = await tryCatch(deleteCourse(data.id));
    if (error) {
      toast.error("An unexpected error occured. Please try again");
      return;
    }

    if (response.status === "success") {
      toast.success(response.message);

      try {
        const deleteResponse = await fetch("/api/s3/delete", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: data.fileKey }),
        });

        if (!deleteResponse.ok) {
          const errorData = await deleteResponse.json();
          throw new Error(errorData.message || "Failed to delete file");
        }

        await deleteResponse.json();
      } catch (error) {
        console.error("Delete error:", error);
        toast.error(
          `Failed to delete file: ${error instanceof Error ? error.message : "Unknown error"}`
        );
      }
      redirect("/admin/courses");
    } else {
      toast.error(response.message);
    }
  };

  const card3DStyles = {
    transform: `perspective(1000px) rotateX(${cardRotation.x}deg) rotateY(${cardRotation.y}deg) scale3d(${isHovered ? 1.02 : 1}, ${isHovered ? 1.02 : 1}, 1)`,
    transition: "transform 0.3s ease-out",
  };

  return (
    <Card
      ref={cardRef}
      className={cn(
        "relative flex-1 rounded-xl overflow-hidden shadow-lg border-none transition-all duration-500 "
      )}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      style={card3DStyles}
    >
      {/* Course Image Area */}
      <div className="relative w-full h-56  overflow-hidden bg-gray-200 dark:bg-gray-700">
        <Image
          src={data.fileKey}
          alt={data.title}
          layout="fill"
          objectFit="cover"
          className="transition-transform h-full duration-300 ease-out"
          priority
        />
      </div>

      {/* Card Content - Always Visible */}
      <CardContent className="p-5 space-y-4 bg-white dark:bg-gray-800">
        <div className="flex justify-between items-center mb-3">
          {" "}
          {/* Added margin-bottom */}
          <div className="flex items-center text-gray-600 dark:text-gray-300 text-sm">
            <svg
              className="w-5 h-5 mr-1 text-orange-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span>{data.duration}h</span>
          </div>
          <div className="flex items-center text-gray-600 dark:text-gray-300 text-sm">
            <svg
              className="w-5 h-5 mr-1 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 15a4 4 0 008 0c0 1.1.9 2 2 2s2-0.9 2-2a4 4 0 008 0c0-4.4-4.5-8-10-8s-10 3.6-10 8z"
              ></path>
            </svg>
            <span>{data.level}</span>
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
          {data.title}
        </h3>

        <div className=" flex flex-col space-y-3">
          <div className=" flex justify-between items-center">
            <div className="flex space-x-2">
              <Button
                variant={"outline"}
                onClick={handleEditClick}
                className="group"
              >
                <Pen className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                Edit
              </Button>
              <AlertDialog>
                <AlertDialogTrigger
                  className={cn(
                    buttonVariants({
                      variant: "destructive",
                    })
                  )}
                >
                  <Trash2 /> Delete
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      You won't be able to revert this!
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteCourse}>
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>

        <button
          onClick={handleEditClick}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 px-5 rounded-lg font-bold flex items-center justify-center shadow-md transition-all duration-300 ease-in-out transform hover:scale-105"
        >
          Preview Course
          <Eye className=" mx-3" />
        </button>
      </CardContent>
    </Card>
  );
};

export default AdminCourseCard;
