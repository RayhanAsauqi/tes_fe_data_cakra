import { ScrollArea } from "@/components/ui/scroll-area";
import CommentForm from "./comment-form";
import CommentList from "./comment-list";
import type { Comment } from "@/lib/types/article";

interface CommentSectionProps {
  comments: Comment[];
  articleId: number;
  isLoggedIn: boolean;
  currentUserId?: number;
  
}

export default function CommentSection({
  comments,
  articleId,
  isLoggedIn,
  currentUserId,
}: CommentSectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <ScrollArea className="max-h-56 overflow-y-auto pr-4">
          <CommentList
            comments={comments}
            articleId={articleId}
            currentUserId={currentUserId}
          />
        </ScrollArea>
        <h5 className="text-sm font-semibold my-4">
          Comments ({comments.length})
        </h5>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-4">Leave a comment</h3>
        <CommentForm articleId={articleId} isLoggedIn={isLoggedIn} />
      </div>
    </div>
  );
}
