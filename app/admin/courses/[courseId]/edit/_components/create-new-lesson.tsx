import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogOverlay,
} from "@/components/ui/alert-dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader, Plus } from "lucide-react";
import React, { useTransition, useEffect, useState } from "react";
import { lessonCreateSchema, lessonSchemaType } from "@/lib/zod-schems";
import { AlertDialogDescription } from "@radix-ui/react-alert-dialog";
import { tryCatch } from "@/hooks/try-catch";
import { toast } from "sonner";
import YouTubeUpload from "./youtube-upload";
import { createLesson } from "../lesson-action";
import { redirect } from "next/navigation";
import Editor from "@/components/adminsidebar/rich-editor";

const CreateNewLesson = ({
  chapterId,
  courseId,
}: {
  chapterId: string;
  courseId: string;
}) => {
  const [pendingTransition, startTransition] = useTransition();
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");

  const form = useForm<lessonSchemaType>({
    resolver: zodResolver(lessonCreateSchema),
    defaultValues: {
      title: "",
      description: "",
      videoUrl: "",
      chapterId: chapterId,
    },
  });
  const [content, setContent] = useState(form.getValues("description"));

  useEffect(() => {
    form.setValue("description", content);
  }, [content, setContent]);

  useEffect(() => {
    form.setValue("chapterId", chapterId);
  }, [chapterId, form]);

  useEffect(() => {
    form.setValue("videoUrl", videoUrl);
  }, [videoUrl, setVideoUrl]);

  async function onSubmit(values: lessonSchemaType) {
    startTransition(async () => {
      const { data, error } = await tryCatch(createLesson(values));
      if (error) {
        toast.error("An unexpected error occured. Please try again");
        return;
      }

      if (data.status === "success") {
        toast.success(data.message);
        form.reset();
        redirect(`/admin/courses/${courseId}/edit`);
      } else {
        toast.error(data.message);
      }
    });
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant={"outline"}
          onPointerDown={(e: any) => e.stopPropagation()}
        >
          <Plus size={16} className="mr-2" /> New Lesson
        </Button>
      </AlertDialogTrigger>
      {/* <--- Added AlertDialogOverlay */}
      <AlertDialogOverlay />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Add New Lesson</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription>
          Fill in the details for your new lesson.
        </AlertDialogDescription>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Lesson Title"
                      {...field}
                      onKeyDown={(e: any) => {
                        if (e.key === " ") {
                          e.stopPropagation();
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />{" "}
            <YouTubeUpload videoUrl={videoUrl} setVideoUrl={setVideoUrl} />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <div className="w-full">
                      <Editor value={content} onChange={setContent} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="chapterId"
              render={({ field }) => (
                <FormItem className="hidden">
                  <FormControl>
                    <Input type="hidden" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={(e) => {
                  e.stopPropagation();
                  form.reset();
                }}
              >
                Cancel
              </AlertDialogCancel>
              <Button
                type="submit"
                disabled={pendingTransition || isUploadingVideo}
                onPointerDown={(e: any) => e.stopPropagation()}
              >
                {pendingTransition ? (
                  <Loader size={16} className="animate-spin" />
                ) : (
                  "Create Lesson"
                )}
              </Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CreateNewLesson;
