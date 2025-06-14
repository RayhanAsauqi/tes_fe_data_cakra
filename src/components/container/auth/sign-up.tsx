import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthStore } from "@/lib/store/auth-store";
import { SignUpFormSchema } from "@/lib/validation/auth";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const signUp = AuthStore((state) => state.signUp);
  const submitLoading = AuthStore((state) => state.loading);

  const form = useForm<z.infer<typeof SignUpFormSchema>>({
    resolver: zodResolver(SignUpFormSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
    },
  });

  const submitSignUp = async (values: z.infer<typeof SignUpFormSchema>) => {
    await signUp(values);
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submitSignUp)} className="space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor={field.name}> Username</FormLabel>
              <Input
                {...field}
                id={field.name}
                placeholder="Enter your username"
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor={field.name}>Email</FormLabel>
              <Input
                {...field}
                id={field.name}
                placeholder="Enter your email"
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor={field.name}>Password</FormLabel>
              <div className="relative">
                <Input
                  {...field}
                  id={field.name}
                  placeholder=""
                  type={showPassword ? "text" : "password"}
                />
                <Button
                  variant="link"
                  className="absolute right-1 top-1/2 hover:bg-none -translate-y-1/2"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full bg-slate-800 hover:bg-slate-700"
          disabled={submitLoading}
        >
          Login
        </Button>
      </form>
    </Form>
  );
}
