import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { useArticleCategoryStore } from "@/lib/store/category-store";
import { CategoryFormValidation } from "@/lib/validation/category";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

type FormState = {
  documentId: string;
  name: string;
  description: string;
};

type EditCategoryModalProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  data: FormState;
};

export default function EditCategoryModal(props: EditCategoryModalProps) {
  const {
    editCategory,
    fetchDetailCategory,
    selectedCategory,
    isLoading: submitLoading,
  } = useArticleCategoryStore();

  const form = useForm<z.infer<typeof CategoryFormValidation>>({
    resolver: zodResolver(CategoryFormValidation),
    defaultValues: {
      name: props.data.name || "",
      description: props.data.description || "",
    },
  });

  useEffect(() => {
    if (props.isOpen && props.data.documentId) {
      fetchDetailCategory(props.data.documentId);
    }
  }, [props.isOpen, props.data.documentId, fetchDetailCategory]);

  useEffect(() => {
    if (selectedCategory) {
      form.reset({
        name: selectedCategory.name || "",
        description: selectedCategory.description || "",
      });
    }
  }, [selectedCategory, form]);

  const submitForm = async (values: z.infer<typeof CategoryFormValidation>) => {
    await editCategory(props.data?.documentId, {
      name: values.name,
      description: values.description,
    });
    props.setIsOpen(false);
    form.reset();
  };

  return (
    <Dialog open={props.isOpen} onOpenChange={props.setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            id="edit-category-form"
            onSubmit={form.handleSubmit(submitForm)}
            className="space-y-3  max-h-96 overflow-y-auto p-2"
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
            form="edit-category-form"
            type="submit"
            disabled={submitLoading}
            className="mt-4 bg-slate-800 hover:bg-slate-700"
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
