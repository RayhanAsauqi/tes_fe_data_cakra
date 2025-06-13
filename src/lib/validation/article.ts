import { z } from "zod";

export const ArticleFormValidation = z.object({
    title: z
        .string({ required_error: "Title is required" })
        .min(2, { message: "Title must be at least 2 characters long" })
        .max(100, { message: "Title must not exceed 100 characters" }),

    description: z
        .string({ required_error: "Description is required" })
        .min(10, { message: "Description must be at least 10 characters long" })
        .max(3200, { message: "Description must not exceed 3200 characters" }),

    cover_image_url: z
        .string()
        .url({ message: "Cover image must be a valid URL" })
        .optional(),

    category: z
        .number({ required_error: "Category is required" })
        .int({ message: "Category must be a whole number" })
        .min(1, { message: "Category is required" }),
});
