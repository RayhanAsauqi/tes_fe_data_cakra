"use client";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useArticleStore } from "@/lib/store/article-store";
import { useCommentStore } from "@/lib/store/comment-store";

interface CommentFormProps {
  articleId: number;
  isLoggedIn: boolean;
}

export default function CommentForm({
  articleId,
  isLoggedIn,
}: CommentFormProps) {
  const [comment, setComment] = useState<string>("");
  const [posted, setPosted] = useState<boolean>(false);
  const { addComment, loading, error } = useCommentStore();
  const { fetchArticles } = useArticleStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      await addComment(comment, articleId);
      setComment("");
      //   fetchArticles();
      setPosted(true);
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  useEffect(() => {
    if (posted) {
      fetchArticles();
      setPosted(false); 
    }
  }, [posted, fetchArticles]);

  if (!isLoggedIn) {
    return (
      <div className="p-4 bg-muted/50 rounded-lg text-center">
        <p className="text-sm text-muted-foreground">
          Please log in to leave a comment.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Textarea
        placeholder="Write a comment..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="min-h-[100px]"
        disabled={loading}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" disabled={loading || !comment.trim()}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Posting...
          </>
        ) : (
          "Post Comment"
        )}
      </Button>
    </form>
  );
}
