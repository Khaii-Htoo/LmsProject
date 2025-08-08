import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogOverlay, // <--- Imported AlertDialogOverlay
} from "@/components/ui/alert-dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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

const CreateNewLesson = ({ chapterId }: { chapterId: string }) => {
  const [pendingTransition, startTransition] = useTransition();
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const form = useForm<lessonSchemaType>({
    resolver: zodResolver(lessonCreateSchema),
    defaultValues: {
      title: "",
      description: "",
      thumbnailKey: "",
      videoUrl: "",
      chapterId: chapterId,
    },
  });

  useEffect(() => {
    form.setValue("chapterId", chapterId);
  }, [chapterId, form]);

  async function onSubmit(values: lessonSchemaType) {}

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
                    <Input placeholder="Lesson Description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <YouTubeUpload />
            <FormField
              control={form.control}
              name="thumbnailKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thumbnail Key (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., image-123.jpg (or link to uploaded thumbnail)"
                      {...field}
                    />
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
            {/* youtube */}
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
                {pendingTransition || isUploadingVideo ? (
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
