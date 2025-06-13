import { useCookies } from "react-cookie";
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

export default function SignInForm() {
  const signIn = AuthStore((state) => state.signIn);
  const submitLoading = AuthStore((state) => state.loading);

  const form = useForm<z.infer<typeof SignInFormSchema>>({
    resolver: zodResolver(SignInFormSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });
  // const navigate = useNavigate();
  const [, setCookie] = useCookies(["token"]);

  const submitSignIn = async (values: z.infer<typeof SignInFormSchema>) => {
    await signIn(values, setCookie);
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
              <Input
                {...field}
                id={field.name}
                placeholder=""
                type="password"
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={submitLoading}>
          Login
        </Button>
      </form>
    </Form>
  );
}
