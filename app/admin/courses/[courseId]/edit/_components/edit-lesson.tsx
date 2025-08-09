import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
  AlertDialogOverlay,
  AlertDialogDescription,
  AlertDialogTitle,
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
import { Loader, Pen } from "lucide-react";
import React, { useTransition, useEffect, useState } from "react";
import { lessonCreateSchema, lessonSchemaType } from "@/lib/zod-schems";
import { tryCatch } from "@/hooks/try-catch";
import { toast } from "sonner";

import { useRouter } from "next/navigation";
import Editor from "@/components/adminsidebar/rich-editor";
import { updateLesson } from "../action/lesson-action";
interface EditLessonFormProps {
  initialLessonData: lessonSchemaType & { id: string };
  courseId: string;
  chapterId: string;
}

const EditLesson = ({
  initialLessonData,
  courseId,
  chapterId,
}: EditLessonFormProps) => {
  const [pendingTransition, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const form = useForm<lessonSchemaType>({
    resolver: zodResolver(lessonCreateSchema),
    defaultValues: {
      title: initialLessonData.title || "",
      description: initialLessonData.description || "",
      videoUrl: initialLessonData.videoUrl || "",
      chapterId: initialLessonData.chapterId || chapterId,
    },
  });

  const [content, setContent] = useState(initialLessonData.description || "");
  useEffect(() => {
    form.setValue("description", content);
  }, [content, form]);

  useEffect(() => {
    if (initialLessonData.chapterId) {
      form.setValue("chapterId", initialLessonData.chapterId);
    } else {
      form.setValue("chapterId", chapterId);
    }
  }, [chapterId, form, initialLessonData.chapterId]);

  useEffect(() => {
    form.setValue("videoUrl", initialLessonData.videoUrl || "");
  }, [initialLessonData.videoUrl, form]);
  async function onSubmit(values: lessonSchemaType) {
    startTransition(async () => {
      const { data, error } = await tryCatch(
        updateLesson(initialLessonData.id, values)
      );
      if (error) {
        toast.error("An unexpected error occured. Please try again");
        return;
      }

      if (data.status === "success") {
        toast.success(data.message);
        form.reset();
        router.push(`/admin/courses/${courseId}/edit`);
        setOpen(false);
      } else {
        toast.error(data.message);
      }
    });
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant={"outline"} className=" mr-2">
          <Pen size={16} className=" cursor-pointer hover:text-red-500 " />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogOverlay />
      <AlertDialogContent>
        <AlertDialogHeader>
          {" "}
          <AlertDialogTitle>Edit Your Lesson</AlertDialogTitle>
        </AlertDialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Lesson Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <div className="w-full">
                      {/* Editor now initializes with content from initialLessonData */}
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
                onClick={() => {
                  setOpen(false);
                }}
              >
                Cancel
              </AlertDialogCancel>
              <Button
                type="submit"
                disabled={pendingTransition} // isUploadingVideo is removed
              >
                {pendingTransition ? (
                  <Loader size={16} className="animate-spin" />
                ) : (
                  "Save Changes" // Changed button text
                )}
              </Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default EditLesson;
