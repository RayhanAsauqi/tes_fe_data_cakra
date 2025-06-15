import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useDisclosure } from "@/hooks/use-disclosure";
import { useArticleCategoryStore } from "@/lib/store/category-store";
import { CategoryFormValidation } from "@/lib/validation/category";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function AddCategory() {
  const { isOpen, setIsOpen, onClose } = useDisclosure();

  const { createCategory } = useArticleCategoryStore();

  const form = useForm<z.infer<typeof CategoryFormValidation>>({
    resolver: zodResolver(CategoryFormValidation),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const submitForm = async (values: z.infer<typeof CategoryFormValidation>) => {
    await createCategory({
      name: values.name,
      description: values.description,
    });
    onClose();
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="default"
          size="lg"
          className="bg-slate-800 hover:bg-slate-700"
        >
          <p className="hidden md:block">Add Category Article</p>
          <Plus />
        </Button>
      </DialogTrigger>

      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Add New Category</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            id="add-category-form"
            onSubmit={form.handleSubmit(submitForm)}
            className="space-y-3 max-h-96 overflow-y-auto px-2"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name}>Name</FormLabel>
                  <Input
                    {...field}
                    id={field.name}
                    placeholder="Enter category name"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name}>Description</FormLabel>
                  <Textarea
                    {...field}
                    id={field.name}
                    placeholder="Enter category description"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter>
          <Button
            form="add-category-form"
            type="submit"
            className="mt-4 bg-slate-800 hover:bg-slate-700"
          >
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
