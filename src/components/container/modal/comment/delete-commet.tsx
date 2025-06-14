import { CircleX, TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCommentStore } from "@/lib/store/comment-store";

type FormState = {
  commentId: string;
  title: string;
};

type DeleteCommentModalProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  data: FormState;
};

export default function DeleteCommentModal(props: DeleteCommentModalProps) {
  const deleteComment = useCommentStore((state) => state.deleteComment);
  const submitLoading = useCommentStore((state) => state.loading);
  const submitDelete = async () => {
    await deleteComment(props.data.commentId, );
  };

  return (
    <Dialog open={props.isOpen} onOpenChange={props.setIsOpen}>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>
            <p className="font-bold">Delete Comment</p>
          </DialogTitle>
        </DialogHeader>
        <div className="text-red-500 font-semibold">
          Are you sure you want to delete this comment?
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
