"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import React from "react";
import { ChevronsLeft } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { courseCreateSchema } from "@/lib/zod-schems";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import slugify from "slugify";
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
import { Textarea } from "@/components/ui/textarea";
import { Categories, levels, status } from "@/demoData";

const page = () => {
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
      slug: "",
      status: "",
    },
  });

  function onSubmit(values: z.infer<typeof courseCreateSchema>) {
    console.log(values);
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

      <Card>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
              {/* slug */}
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <>
                    <div className=" flex items-end space-x-1">
                      <FormItem className=" flex-1">
                        <FormLabel className=" text-white">Slug</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                      <Button
                        type="button"
                        className=" md:w-1/6"
                        onClick={() => {
                          form.setValue(
                            "slug",
                            slugify(form.getValues("title")),
                            {
                              shouldValidate: true,
                            }
                          );
                        }}
                      >
                        ✨ Generate Slug
                      </Button>
                    </div>
                    <FormMessage className=" -mt-5" />
                  </>
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
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* thumbnail */}
              <FormField
                control={form.control}
                name="fileKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className=" text-white">Thumbnail Url</FormLabel>
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
                {/* dyration */}
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem className="md:w-1/2 w-full">
                      <FormLabel className=" text-white">
                        Duration (hours)
                      </FormLabel>
                      <FormControl>
                        <Input {...field} type="number" />
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
                        <Input {...field} type="number" />
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
                        <SelectValue placeholder="Select a category" />
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

              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
