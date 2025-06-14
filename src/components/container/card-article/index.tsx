import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import {
  ArrowRight,
  Calendar,
  Loader2,
  MessageSquare,
  Pencil,
  Send,
  Trash,
} from "lucide-react";
import { Link } from "react-router-dom";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import type { Article } from "@/lib/types/article";
import { useCommentStore } from "@/lib/store/comment-store";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/utils/format/date";
import DeleteCommentModal from "../modal/comment/delete-commet";
import { useDisclosure } from "@/hooks/use-disclosure";
import ImageWithFallback from "../image-with-fallback";

interface ArticleCardProps {
  article?: Article;
  isLoading?: boolean;
  onDelete?: () => void;
}

export default function ArticleCard(props: ArticleCardProps) {
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    setIsOpen: setIsDeleteOpen,
  } = useDisclosure();
  const [cookies] = useCookies(["token"]);
  const isAuthenticated = Boolean(cookies.token);
  const [showAllComments, setShowAllComments] = useState<boolean>(false);
  const [newComment, setNewComment] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [commentToDelete, setCommentToDelete] = useState<{
    commentId: string;
    title: string;
  } | null>(null);

  const {
    comments,
    loading: commentsLoading,
    error: commentsError,
    openCommentsCardId,
    fetchComments,
    addComment,
    clearComments,
    updateComment,
    setComments,
    setOpenCommentsCard,
  } = useCommentStore();

  const showComments = openCommentsCardId === props.article?.documentId;

  useEffect(() => {
    if (props.article) {
      if (showComments) {
        setComments(props.article.comments || []);
      }
    }
  }, [props.article, showComments, setComments]);

  const handleToggleComments = async () => {
    if (!props.article) return;

    if (showComments) {
      setOpenCommentsCard(null);
      clearComments();
    } else {
      setOpenCommentsCard(props.article.documentId);
      await fetchComments(props.article.documentId);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !props.article || !isAuthenticated) return;

    setIsSubmitting(true);
    try {
      await addComment(
        newComment.trim(),
        props.article.id,
        props.article.documentId
      );
      setNewComment("");
    } catch (error) {
      console.error("Failed to add comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditComment = (commentId: string, currentContent: string) => {
    setEditingCommentId(commentId);
    setEditingContent(currentContent);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditingContent("");
  };

  const handleUpdateComment = async (commentId: string) => {
    if (!editingContent.trim()) return;

    setIsUpdating(true);
    try {
      await updateComment(commentId, editingContent.trim());
      setEditingCommentId(null);
      setEditingContent("");
    } catch (error) {
      console.error("Failed to update comment:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (props.isLoading) {
    return (
      <Card className="overflow-hidden">
        <CardHeader className="p-0">
          <Skeleton className="h-48 w-full" />
        </CardHeader>
        <CardContent className="p-4">
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full" />
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </CardFooter>
      </Card>
    );
  }

  if (!props.article) return null;

  const commentsCount = props.article.comments?.length || 0;
  const displayedComments = showAllComments ? comments : comments.slice(0, 3);
  const userInitial =
    props.article?.user?.username?.charAt(0).toUpperCase() || "?";

  return (
    <Card className="group overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300 border-0 ring-1 ring-slate-200 hover:ring-slate-300">
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
        <ImageWithFallback
          src={props.article?.cover_image_url || "/placeholder.svg"}
          validateUrl={true}
          alt={props.article?.title || "Article cover"}
          className="w-full h-48 object-cover rounded-lg"
          loadingIndicator={
            <div className="w-full h-48 flex items-center justify-center bg-slate-100">
              <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            </div>
          }
          fallbackElement={
            <div className="w-full h-48 flex gap-2 items-center justify-center">
              <Avatar className="h-10 w-10 ring-2 ring-slate-100">
                <AvatarFallback className="bg-gradient-to-br from-slate-400 to-slate-600 text-white text-xs font-semibold">
                  {userInitial}
                </AvatarFallback>
              </Avatar>
              <span>No Image</span>
            </div>
          }
          width={800}
          height={450}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-3">
          <Badge variant="outline" className="font-medium">
            {props.article.category?.name || "Uncategorized"}
          </Badge>
          <div className="flex items-center text-xs text-slate-500">
            <Calendar className="h-3 w-3 mr-1" />
            {formatDate(props.article.createdAt)}
          </div>
        </div>

        <div className="mb-4">
          <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-slate-700 transition-colors">
            {props.article.title}
          </h3>
          <p className="text-slate-600 text-sm line-clamp-3 leading-relaxed">
            {props.article.description}
          </p>
        </div>

        {isAuthenticated && props.article.user && (
          <div className="flex flex-col md:flex-row items-start gap-5 md:justify-between pb-4 border-b border-slate-100 mb-4">
            <div className="flex md:flex-row items-center gap-3">
              <Avatar className="h-8 w-8 ring-2 ring-slate-100">
                <AvatarFallback className="bg-gradient-to-br from-slate-400 to-slate-600 text-white text-xs font-semibold">
                  {userInitial}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-slate-900">
                  {props.article.user.username || "Anonymous"}
                </p>
                <p className="text-xs text-slate-500">Author</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {props.onDelete && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={props.onDelete}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              )}
              <Button variant="outline" size="sm">
                <Pencil />
              </Button>

              <Link to={`/detail/${props.article.documentId}`}>
                <Button
                  size="sm"
                  className="bg-slate-900 hover:bg-slate-800 text-white group/btn"
                >
                  Read More
                  <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover/btn:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        )}

        {!isAuthenticated && (
          <div className="flex justify-between pb-4 border-b border-slate-100 mb-4">
            <Link to="/auth">
              <Button
                size="sm"
                className="bg-slate-900 hover:bg-slate-800 text-white group/btn"
              >
                Read More
                <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover/btn:translate-x-1" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Link to="/auth">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </Link>
              <Button variant="outline" size="sm">
                <Pencil />
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleComments}
              className={`flex items-center gap-2 p-0 h-auto transition-colors ${
                showComments
                  ? "text-slate-900 font-medium"
                  : "text-slate-700 hover:text-slate-900"
              }`}
            >
              <MessageSquare
                className={`h-4 w-4 ${showComments ? "text-blue-600" : ""}`}
              />
              <span className="text-sm font-medium">
                {commentsCount} {commentsCount === 1 ? "Comment" : "Comments"}
              </span>
              {showComments && (
                <span className="text-xs text-blue-600 ml-1">(Open)</span>
              )}
            </Button>
            {showComments && comments.length > 3 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAllComments(!showAllComments)}
                className="text-xs text-slate-500 hover:text-slate-700"
              >
                {showAllComments
                  ? "Show Less"
                  : `Show All (${comments.length})`}
              </Button>
            )}
          </div>

          {showComments && (
            <>
              {commentsLoading && (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-4 w-4 animate-spin text-slate-500" />
                  <span className="ml-2 text-sm text-slate-500">
                    Loading comments...
                  </span>
                </div>
              )}

              {commentsError && (
                <div className="text-center py-4 text-red-500 text-sm">
                  {commentsError}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      fetchComments(props.article?.documentId ?? "")
                    }
                    className="ml-2 text-xs"
                  >
                    Try Again
                  </Button>
                </div>
              )}

              {!commentsLoading && !commentsError && comments.length > 0 && (
                <div className="relative">
                  <div className="space-y-3 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 hover:scrollbar-thumb-slate-400 pr-2">
                    {displayedComments.map((comment) => (
                      <div
                        key={comment.documentId}
                        className="bg-slate-50 p-3 rounded-lg border border-slate-100 hover:bg-slate-100 transition-colors duration-200"
                      >
                        <div className="flex items-start gap-2">
                          <Avatar className="h-6 w-6 flex-shrink-0">
                            <AvatarFallback className="bg-gradient-to-br from-slate-400 to-slate-600 text-white text-xs">
                              {comment.user?.username
                                ?.charAt(0)
                                .toUpperCase() || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="text-xs font-medium text-slate-700 truncate">
                                  {comment.user?.username || "Anonymous"}
                                </span>
                                <span className="text-xs text-slate-500 flex-shrink-0">
                                  {formatDate(comment.createdAt)}
                                </span>
                              </div>
                              {comment.user && isAuthenticated && (
                                <div className="flex items-center gap-1 ml-2">
                                  {editingCommentId === comment.documentId ? (
                                    <>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                          setCommentToDelete({
                                            commentId: comment.documentId,
                                            title: editingContent,
                                          });
                                          onDeleteOpen();
                                        }}
                                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 flex-shrink-0"
                                        disabled={isUpdating}
                                      >
                                        <Trash className="h-3 w-3" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                          handleUpdateComment(
                                            comment.documentId
                                          )
                                        }
                                        className="h-6 w-6 p-0 text-slate-800 hover:text-slate-500 hover:bg-blue-50 flex-shrink-0"
                                        disabled={isUpdating}
                                      >
                                        <Send size={40} />
                                      </Button>
                                    </>
                                  ) : (
                                    <>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                          handleEditComment(
                                            comment.documentId,
                                            comment.content || ""
                                          )
                                        }
                                        className="h-6 w-6 p-0 text-blue-500 hover:text-blue-700 hover:bg-blue-50 flex-shrink-0"
                                        disabled={commentsLoading}
                                      >
                                        <Pencil className="h-3 w-3" />
                                      </Button>
                                    </>
                                  )}
                                </div>
                              )}
                            </div>
                            {editingCommentId === comment.documentId ? (
                              <div className="mt-2">
                                <Input
                                  value={editingContent}
                                  onChange={(e) =>
                                    setEditingContent(e.target.value)
                                  }
                                  className="text-sm bg-white border-slate-200 focus:border-slate-400"
                                  disabled={isUpdating}
                                  autoFocus
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                      e.preventDefault();
                                      handleUpdateComment(comment.documentId);
                                    } else if (e.key === "Escape") {
                                      handleCancelEdit();
                                    }
                                  }}
                                />
                                <div className="text-xs text-slate-500 mt-1">
                                  Press Enter to save, Escape to cancel
                                </div>
                              </div>
                            ) : (
                              <p className="text-sm text-slate-700 break-words">
                                {comment.content}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!commentsLoading && !commentsError && comments.length === 0 && (
                <div className="text-center py-4 text-slate-500 text-sm">
                  No comments yet. Be the first to comment!
                </div>
              )}

              {isAuthenticated && (
                <form onSubmit={handleSubmitComment} className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Write a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="flex-1 bg-white border-slate-200 focus:border-slate-400"
                      disabled={isSubmitting || commentsLoading}
                    />
                    <Button
                      type="submit"
                      size="sm"
                      disabled={
                        !newComment.trim() || isSubmitting || commentsLoading
                      }
                      className="bg-slate-900 hover:bg-slate-800 text-white"
                    >
                      {isSubmitting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </form>
              )}

              {!isAuthenticated && (
                <div className="text-center py-3 text-slate-500 text-sm">
                  Please log in to add comments.
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>

      {commentToDelete && (
        <DeleteCommentModal
          isOpen={isDeleteOpen}
          setIsOpen={() => {
            setIsDeleteOpen(true);
            setCommentToDelete(null);
          }}
          data={commentToDelete}
        />
      )}
    </Card>
  );
}
