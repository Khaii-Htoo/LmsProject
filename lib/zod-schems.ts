import z from "zod";

//  course create zod validation
export const courseStatus = ["Draft", "Published", "Archived"];
export const courseCreateSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(3, {
    message: "Description must be at least 3 characters",
  }),
  fileKey: z.string().min(1, {
    message: "file is required",
  }),
  price: z.string().min(1, {
    message: "Price is required",
  }),
  duration: z.string().min(1, {
    message: "Video duration is required",
  }),
  level: z.string().min(1, {
    message: "Course level is required",
  }),
  category: z.string().min(3, {
    message: "Category must be at least 3 characters",
  }),
  status: z.enum(courseStatus),
});
