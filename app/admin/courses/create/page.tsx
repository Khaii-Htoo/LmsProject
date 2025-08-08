"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import React, { useEffect, useState, useTransition } from "react";
import { ChevronsLeft, Loader } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { courseCreateSchema } from "@/lib/zod-schems";
import z, { file, success } from "zod";
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
import Editor from "@/components/adminsidebar/rich-editor";
import { FileUpload } from "@/components/ui/file-upload";
import { tryCatch } from "@/hooks/try-catch";
import { createCourse } from "./course-create-action";
import { toast } from "sonner";
import { redirect } from "next/navigation";
const page = () => {
  const [pendingTransition, startTransition] = useTransition();
  const form = useForm<z.infer<typeof courseCreateSchema>>({
    resolver: zodResolver(courseCreateSchema),
    defaultValues: {
      title: "",
      category: "",
      description: "",
      duration: 0,
      fileKey: "",
      level: "",
      price: 0,
      status: "Draft",
    },
  });
  const [content, setContent] = useState(form.getValues("description"));
  useEffect(() => {
    form.setValue("description", content);
  }, [content, form]);

  function onSubmit(values: z.infer<typeof courseCreateSchema>) {
    startTransition(async () => {
      const { data, error } = await tryCatch(createCourse(values));
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
    <div>
      <div className=" flex items-center space-x-3 mb-5">
        <Link
          href={"/admin/courses"}
          className={buttonVariants({ variant: "outline" })}
        >
          <ChevronsLeft />
        </Link>
        <h1 className=" text-2xl">Create Course</h1>
      </div>

      <Card className=" py-7">
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* file upload */}
              <FormField
                control={form.control}
                name="fileKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className=" text-white">Thumbnail Url</FormLabel>
                    <FormControl>
                      <FileUpload
                        onUploadComplete={(result) =>
                          form.setValue("fileKey", result?.url!)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className=" text-white">Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* category and level */}
              <div className="flex flex-col md:flex-row items-center gap-x-2 w-full">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem className="md:w-1/2 w-full">
                      <FormLabel className="text-white">Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
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

                {/* level */}
                <FormField
                  control={form.control}
                  name="level"
                  render={({ field }) => (
                    <FormItem className="md:w-1/2 w-full mt-5 md:mt-auto">
                      {" "}
                      <FormLabel className="text-white">Level</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
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

              {/* duration and price */}
              <div className="flex flex-col md:flex-row items-center gap-x-2 w-full">
                {/* duration */}
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem className="md:w-1/2 w-full">
                      <FormLabel className=" text-white">
                        Duration (hours)
                      </FormLabel>
                      <FormControl>
                        <Input
                          onChange={(e) =>
                            form.setValue("duration", Number(e.target.value))
                          }
                          type="number"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* price */}
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem className="md:w-1/2 w-full mt-5 md:mt-auto">
                      <FormLabel className=" text-white">Price ($)</FormLabel>
                      <FormControl>
                        <Input
                          onChange={(e) =>
                            form.setValue("price", Number(e.target.value))
                          }
                          type="number"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* status */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
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

              {/* description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <div className="w-full">
                        <Editor value={content} onChange={setContent} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="mt-8 w-full p-4 rounded bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
                <h2 className="text-lg font-semibold mb-2">Preview:</h2>
                <div dangerouslySetInnerHTML={{ __html: content }} />
              </div>
              <Button disabled={pendingTransition} type="submit">
                {pendingTransition ? (
                  <Loader size={4} className=" animate-spin" />
                ) : (
                  "Submit"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
