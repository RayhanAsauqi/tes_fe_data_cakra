import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CommentSection from "../../comments/comment-section";
import type { Comment } from "@/lib/types/article";

interface ArticleCommentsModalProps {
  article: {
    id: number;
    title: string;
    comments: Comment[];
  };
  isLoggedIn: boolean;
  currentUserId?: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function ArticleCommentsModal(props: ArticleCommentsModalProps) {
  return (
    <Dialog
      open={props.isOpen}
      onOpenChange={(open) => !open && props.onClose()}
    >
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Comments - {props.article.title}</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <CommentSection
            comments={props.article.comments}
            articleId={props.article.id}
            isLoggedIn={props.isLoggedIn}
            currentUserId={props.currentUserId}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
