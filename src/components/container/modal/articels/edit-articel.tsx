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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useArticleStore } from "@/lib/store/article-store";
import { useArticleCategoryStore } from "@/lib/store/category-store";
import { ArticleFormValidation } from "@/lib/validation/article";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

type FormState = {
  documentId: string;
  title: string;
  description: string;
  cover_image_url: string;
  category: number;
};

type EditArticleModalProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  data: FormState;
};

export default function EditArticleModal(props: EditArticleModalProps) {
  const {
    selectedArticle,
    loading: submitLoading,
    updateArticle,
    fetchArticlesByDocumentId,
  } = useArticleStore();
  const { articleCategories, fetchArticleCategories } =
    useArticleCategoryStore();
  const form = useForm<z.infer<typeof ArticleFormValidation>>({
    resolver: zodResolver(ArticleFormValidation),
    defaultValues: {
      title: props.data.title || "",
      description: props.data.description || "",
      cover_image_url: props.data.cover_image_url || "",
      category: props.data.category || 0,
    },
  });

  useEffect(() => {
    if (props.isOpen && props.data.documentId) {
      fetchArticlesByDocumentId(props.data.documentId);
      fetchArticleCategories(1, 10000);
    }
  }, [
    props.isOpen,
    props.data.documentId,
    fetchArticlesByDocumentId,
    fetchArticleCategories,
  ]);

  useEffect(() => {
    if (selectedArticle) {
      form.reset({
        title: selectedArticle.title || "",
        description: selectedArticle.description || "",
        cover_image_url: selectedArticle.cover_image_url || "",
        category: Number(selectedArticle.category?.id) || 0,
      });
    }
  }, [selectedArticle, form]);

  const submitForm = async (value: z.infer<typeof ArticleFormValidation>) => {
    await updateArticle(props.data.documentId, {
      title: value.title,
      description: value.description,
      cover_image_url: value.cover_image_url ?? "",
      category: value.category,
    });

    form.reset();
    props.setIsOpen(false);
  };

  console.log("Edit Article Modal", props.data);
  console.log("selectedArticle", selectedArticle?.category?.id);
  return (
    <Dialog open={props.isOpen} onOpenChange={props.setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Article</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            id="edit-article-form"
            onSubmit={form.handleSubmit(submitForm)}
            className="space-y-3  max-h-96 overflow-y-auto p-2"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name}>Title</FormLabel>
                  <Input
                    {...field}
                    id={field.name}
                    placeholder="Enter article title"
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
                    placeholder="Enter article description"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cover_image_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name}>Cover Image URL</FormLabel>
                  <Input
                    {...field}
                    id={field.name}
                    placeholder="Enter article cover image URL"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name}>Category</FormLabel>
                  <Select
                    value={field.value.toString()}
                    onValueChange={(val) => field.onChange(Number(val))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Categories</SelectLabel>
                        {articleCategories.map((category) => {
                          console.log("Category", category.id);
                          return (
                            <SelectItem
                              key={selectedArticle?.category.id || category.id}
                              value={category.id.toString()}
                            >
                              {category.name}
                            </SelectItem>
                          );
                        })}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button
            form="edit-article-form"
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
