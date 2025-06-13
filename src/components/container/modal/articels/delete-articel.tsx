import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useArticleStore } from "@/lib/store/article-store";
import { CircleX, TriangleAlert } from "lucide-react";

type FormState = {
  documentId: string;
  title: string;
};

type DeleteArticleModalProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  data: FormState;
};

export default function DeleteArticleModal(props: DeleteArticleModalProps) {
  const deleteArticle = useArticleStore((state) => state.deleteArticle);
  const submitLoading = useArticleStore((state) => state.loading);

  const submitDelete = async () => {
    await deleteArticle(props.data?.documentId);
    props.setIsOpen(false);
    props.data = { documentId: "", title: "" };
  };

  return (
    <Dialog open={props.isOpen} onOpenChange={props.setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <p className="font-bold">Delete Article</p>
          </DialogTitle>
        </DialogHeader>
        <div className="text-red-500 font-semibold">
          Are you sure you want to delete this article?
          <p className="font-bold">{props.data.title}</p>
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
