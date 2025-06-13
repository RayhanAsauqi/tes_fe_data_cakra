import { z } from "zod";

export const SignInFormSchema = z
  .object({
    identifier: z.string(),
    password: z.string(),
  })
  .superRefine((data, ctx) => {
    const isValidIdentifier =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.identifier) ||
      /^[a-zA-Z0-9_]+$/.test(data.identifier);

    const isValidPassword = data.password.length >= 6;

    if (!isValidIdentifier || !isValidPassword) {
      ctx.addIssue({
        code: "custom",
        path: ["identifier"],
        message: "Identifier or password is incorrect",
      });
      ctx.addIssue({
        code: "custom",
        path: ["password"],
        message: "Identifier or password is incorrect",
      });
    }
  });

export const SignUpFormSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters" })
    .max(20, { message: "Username must be at most 20 characters" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});
