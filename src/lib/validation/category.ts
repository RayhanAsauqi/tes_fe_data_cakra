import { z } from "zod";

export const CategoryFormValidation = z.object({
    name: z
        .string({ required_error: "Title is required" })
        .min(2, { message: "Title must be at least 2 characters long" })
        .max(40, { message: "Title must not exceed 40 characters" }),
    description: z
        .string()
        .max(1000, { message: "Description must not exceed 1000 characters" })
        .optional(),
});
