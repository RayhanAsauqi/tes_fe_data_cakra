import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

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
import { useDisclosure } from "@/hooks/use-disclosure";
import { useArticleStore } from "@/lib/store/article-store";
import { useArticleCategoryStore } from "@/lib/store/category-store";
import { ArticleFormValidation } from "@/lib/validation/article";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function AddArticleModal() {
  const { isOpen, setIsOpen, onClose } = useDisclosure();
  const { articleCategories, fetchArticleCategories } =
    useArticleCategoryStore();
  const createArticle = useArticleStore((state) => state.createArticle);
  const submitLoading = useArticleStore((state) => state.loading);

  const form = useForm<z.infer<typeof ArticleFormValidation>>({
    resolver: zodResolver(ArticleFormValidation),
    defaultValues: {
      title: "",
      description: "",
      cover_image_url: "",
      category: 0,
    },
  });

  useEffect(() => {
    fetchArticleCategories(1, 10000);
  }, [fetchArticleCategories]);

  const submitForm = async (values: z.infer<typeof ArticleFormValidation>) => {
    await createArticle({
      ...values,
      cover_image_url: values.cover_image_url ?? "",
    });
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="bg-slate-800 hover:bg-slate-700">
          Add Article
        </Button>
      </DialogTrigger>

      <DialogContent className="" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Add New Article</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            id="add-article-form"
            onSubmit={form.handleSubmit(submitForm)}
            className="space-y-3  max-h-96 overflow-y-auto px-2"
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
                    onValueChange={(val) => {
                      const parsed = Number(val);
                      if (!isNaN(parsed)) {
                        field.onChange(parsed);
                      } else {
                        field.onChange(0);
                      }
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Categories</SelectLabel>
                        {articleCategories.map((category) => (
                          <SelectItem
                            key={category.id}
                            value={category.id.toString()}
                          >
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <Link to="/category" className="flex justify-end">
                    <Button
                      size="sm"
                      className="bg-slate-900 hover:bg-slate-800 text-white group/btn"
                    >
                      <span className="ml-2">add new category</span>
                      <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover/btn:translate-x-1" />
                    </Button>
                  </Link>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button
            form="add-article-form"
            type="submit"
            disabled={submitLoading}
            className="mt-4 bg-slate-800 hover:bg-slate-700"
          >
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
