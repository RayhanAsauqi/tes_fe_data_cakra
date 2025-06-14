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
import { SignInFormSchema } from "@/lib/validation/auth";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const signIn = AuthStore((state) => state.signIn);
  const submitLoading = AuthStore((state) => state.loading);

  const form = useForm<z.infer<typeof SignInFormSchema>>({
    resolver: zodResolver(SignInFormSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const submitSignIn = async (values: z.infer<typeof SignInFormSchema>) => {
    await signIn(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submitSignIn)} className="space-y-4">
        <FormField
          control={form.control}
          name="identifier"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor={field.name}>Email or Username</FormLabel>
              <Input
                {...field}
                id={field.name}
                placeholder="Enter your email or username"
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
          className="w-full bg-slate-800 hover:bg-slate-700 text-white"
          disabled={submitLoading}
        >
          Login
        </Button>
      </form>
    </Form>
  );
}
