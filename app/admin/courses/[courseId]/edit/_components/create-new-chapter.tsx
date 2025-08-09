import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader, Plus } from "lucide-react";
import React, { useState, useTransition } from "react";
import { chapterCreateSchema } from "@/lib/zod-schems";
import { AlertDialogDescription } from "@radix-ui/react-alert-dialog";
import { tryCatch } from "@/hooks/try-catch";
import { createChapter } from "../action/chapter-action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const CreateNewChapter = ({ courseId }: { courseId: string }) => {
  const [pendingTransition, startTransition] = useTransition();
  const router = useRouter();
  const form = useForm<z.infer<typeof chapterCreateSchema>>({
    resolver: zodResolver(chapterCreateSchema),
    defaultValues: {
      title: "",
    },
  });
  const [open, setOpen] = useState(false);
  function onSubmit(values: z.infer<typeof chapterCreateSchema>) {
    startTransition(async () => {
      const { data, error } = await tryCatch(createChapter(values, courseId));
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
        <Button variant={"outline"}>
          <Plus size={16} className="mr-2" /> Create Chapter
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Add new chapter</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => {
                  form.reset();
                  setOpen(false);
                }}
              >
                Cancel
              </AlertDialogCancel>
              <Button disabled={pendingTransition}>
                {pendingTransition ? (
                  <Loader size={4} className=" animate-spin" />
                ) : (
                  "Submit"
                )}
              </Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CreateNewChapter;
