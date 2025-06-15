import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useArticleCategoryStore } from "@/lib/store/category-store";
import { CircleX, TriangleAlert } from "lucide-react";

type FormState = {
  documentId: string;
  name: string;
};

type DeleteCategoryModalProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  data: FormState;
};

export default function DeleteCategoryModal(props: DeleteCategoryModalProps) {
  const deleteCategory = useArticleCategoryStore(
    (state) => state.deleteCategory
  );
  const submitLoading = useArticleCategoryStore((state) => state.isLoading);

  const submitDelete = async () => {
    if (deleteCategory) {
      await deleteCategory(props.data?.documentId);
    }

    props.setIsOpen(false);
    props.data = { documentId: "", name: "" };
  };

  return (
    <Dialog open={props.isOpen} onOpenChange={props.setIsOpen}>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>
            <p className="font-bold">Delete Article</p>
          </DialogTitle>
        </DialogHeader>
        <div className="text-red-500 font-semibold">
          Are you sure you want to delete this article category?
          <p className="font-bold">{props.data.name}</p>
          <p>this action cannot be undone.</p>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">
              <CircleX />
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={submitDelete}
            disabled={submitLoading}
          >
            <TriangleAlert />
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
