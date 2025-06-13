"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { Trash2 } from "lucide-react";
import { useState } from "react";
import { useCommentStore } from "@/lib/store/comment-store";
import { useArticleStore } from "@/lib/store/article-store";
import type { Comment } from "@/lib/types/article";


interface CommentListProps {
  comments: Comment[];
  articleId: number;
  currentUserId?: number;
}

export default function CommentList({
  comments,
  currentUserId,
}: CommentListProps) {
  const { deleteComment } = useCommentStore();
  const { fetchArticles } = useArticleStore();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (commentId: string) => {
    setDeletingId(commentId);
    try {
      await deleteComment(commentId);
      fetchArticles();
    } catch (error) {
      console.error("Error deleting comment:", error);
    } finally {
      setDeletingId(null);
    }
  };

  if (comments.length === 0) {
    return (
      <p className="text-muted-foreground text-sm italic">
        No comments yet. Be the first to comment!
      </p>
    );
  }

  function formatDistanceToNow(
    date: Date,
    options: { addSuffix: boolean }
  ): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    let result: string;
    if (diffSec < 60) {
      result = `${diffSec} second${diffSec !== 1 ? "s" : ""}`;
    } else if (diffMin < 60) {
      result = `${diffMin} minute${diffMin !== 1 ? "s" : ""}`;
    } else if (diffHour < 24) {
      result = `${diffHour} hour${diffHour !== 1 ? "s" : ""}`;
    } else {
      result = `${diffDay} day${diffDay !== 1 ? "s" : ""}`;
    }

    if (options.addSuffix) {
      result += diffMs < 0 ? " from now" : " ago";
    }

    return result;
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div
          key={comment.documentId}
          className="flex gap-3 p-3 rounded-lg bg-muted/50"
        >
          <Avatar className="h-8 w-8">
            <AvatarFallback>
              {comment.user.username.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-sm">{comment.user.username}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(comment.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>
              {currentUserId === comment.user.id && (
                <button
                  onClick={() => handleDelete(comment.documentId)}
                  disabled={deletingId === comment.documentId}
                  className="text-muted-foreground hover:text-destructive transition-colors"
                  aria-label="Delete comment"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
            <p className="mt-1 text-sm">{comment.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
