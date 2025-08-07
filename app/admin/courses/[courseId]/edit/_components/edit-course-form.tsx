"use client";

import { Button } from "@/components/ui/button";
import React, { useEffect, useState, useTransition } from "react";
import { Loader } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { courseCreateSchema } from "@/lib/zod-schems";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Categories, levels, status } from "@/demoData";
import { FileUpload } from "@/components/ui/file-upload";
import { redirect, useRouter } from "next/navigation";
import { FetchedCourseData } from "../page";
import Editor from "@/components/adminsidebar/rich-editor";
import { tryCatch } from "@/hooks/try-catch";
import { updateCourse } from "../action";
import { toast } from "sonner";
interface CourseFormData extends z.infer<typeof courseCreateSchema> {}
interface EditCourseFormProps {
  courseData: FetchedCourseData;
}

const EditCourseForm: React.FC<EditCourseFormProps> = ({ courseData }) => {
  const [pendingTransition, startTransition] = useTransition();
  const formSchema = courseCreateSchema;

  const form = useForm<CourseFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: courseData.title,
      category: courseData.category,
      description: courseData.description,
      duration: courseData.duration,
      fileKey: courseData.fileKey,
      level: courseData.level,
      price: courseData.price,
      status: courseData.status,
    },
  });

  const [editorContent, setEditorContent] = useState(courseData.description);
  useEffect(() => {
    form.setValue("description", editorContent);
  }, [editorContent, form]);

  async function onSubmit(values: CourseFormData) {
    startTransition(async () => {
      const { data, error } = await tryCatch(
        updateCourse(courseData.id, values)
      );
      if (error) {
        toast.error("An unexpected error occured. Please try again");
        return;
      }

      if (data.status === "success") {
        toast.success(data.message);
        form.reset();
        redirect("/admin/courses");
      } else {
        toast.error(data.message);
      }
    });
  }

  return (
    <Card className=" py-7">
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="fileKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Thumbnail</FormLabel>
                  <FormControl>
                    <FileUpload
                      initialFileUrl={courseData.fileKey}
                      onUploadComplete={(result) => {
                        form.setValue("fileKey", result?.url!);
                        setEditorContent(form.getValues("description"));
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category and Level */}
            <div className="flex flex-col md:flex-row items-center gap-x-2 w-full">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem className="md:w-1/2 w-full">
                    <FormLabel className="text-white">Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value} // Use defaultValue for initial value
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {Categories.map((cate, index) => (
                            <SelectItem value={cate} key={index}>
                              {cate}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Level */}
              <FormField
                control={form.control}
                name="level"
                render={({ field }) => (
                  <FormItem className="md:w-1/2 w-full mt-5 md:mt-auto">
                    <FormLabel className="text-white">Level</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value} // Use defaultValue for initial value
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {levels.map((level, index) => (
                            <SelectItem value={level} key={index}>
                              {level}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Duration and Price */}
            <div className="flex flex-col md:flex-row items-center gap-x-2 w-full">
              {/* Duration */}
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem className="md:w-1/2 w-full">
                    <FormLabel className="text-white">
                      Duration (hours)
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field} // Spread field props
                        type="number"
                        value={field.value ?? ""} // Handle potential null/undefined for number inputs
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          field.onChange(isNaN(value) ? 0 : value); // Ensure it's a number
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Price */}
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem className="md:w-1/2 w-full mt-5 md:mt-auto">
                    <FormLabel className="text-white">Price ($)</FormLabel>
                    <FormControl>
                      <Input
                        {...field} // Spread field props
                        type="number"
                        value={field.value ?? ""} // Handle potential null/undefined for number inputs
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          field.onChange(isNaN(value) ? 0 : value); // Ensure it's a number
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Status */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value} // Use defaultValue for initial value
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {status.map((data, index) => (
                          <SelectItem value={data} key={index}>
                            {data}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description - Assuming Editor component takes value and onChange */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Description</FormLabel>
                  <FormControl>
                    <div className="w-full">
                      <Editor
                        value={editorContent}
                        onChange={setEditorContent}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Preview Area */}
            <div className="mt-8 w-full p-4 rounded bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
              <h2 className="text-lg font-semibold mb-2">Preview:</h2>
              <div dangerouslySetInnerHTML={{ __html: editorContent }} />
            </div>

            {/* Submit Button */}
            <Button
              disabled={pendingTransition}
              type="submit"
              className="w-full"
            >
              {pendingTransition ? (
                <Loader size={16} className="animate-spin" />
              ) : (
                "Update Course"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default EditCourseForm;
