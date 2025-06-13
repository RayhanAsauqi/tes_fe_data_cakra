"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageSquare, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import ArticleCommentsModal from "../modal/comment/list-comment";
import type { Article } from "@/lib/types/article";
import { useCookies } from "react-cookie";
import { useDisclosure } from "@/hooks/use-disclosure";

interface ArticleCardProps {
  article?: Article;
  isLoading?: boolean;
  onDelete?: () => void;
}

export default function ArticleCard({
  article,
  isLoading,
  onDelete,
}: ArticleCardProps) {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [cookies] = useCookies(["token"]);
  const isAuthenticated = Boolean(cookies.token);
  if (isLoading) {
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

  if (!article) return null;

  return (
    <Card className="overflow-hidden">
      <div className="bg-white rounded-t-xl overflow-hidden shadow-sm border hover:shadow-md transition-all duration-300  h-full group ">
        <div className="relative h-48 w-full overflow-hidden">
          {article.cover_image_url ? (
            <img
              src={article.cover_image_url || "/placeholder.svg"}
              alt={article.title}
              className="aspect-video transition-transform duration-500 group-hover:scale-105 "
            />
          ) : (
            <div className="h-48 w-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
              <span className="text-white text-lg font-medium">
                {article.title.charAt(0)}
              </span>
            </div>
          )}
        </div>
      </div>

      <CardContent className="">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold line-clamp-1">{article.title}</h3>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
          <span>{article.user.username}</span>
          <span>•</span>
          <span>
            {new Date(article.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {article.description || "No description provided."}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <div className="text-xs px-2 py-1 bg-muted rounded-full">
          {article.category?.name || "Uncategorized"}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1"
            onClick={onOpen}
          >
            <MessageSquare className="h-4 w-4" />
            <span>{article.comments.length}</span>
          </Button>
          <Button
            variant="destructive"
            size="icon"
            className="h-8 w-8"
            onClick={onDelete}
          >
            <Trash className="h-4 w-4" />
          </Button>
          <ArticleCommentsModal
            article={{
              id: article.id,
              title: article.title,
              comments: article.comments,
            }}
            isLoggedIn={isAuthenticated}
            currentUserId={article.user.id}
            isOpen={isOpen}
            onClose={onClose}
          />
        </div>
      </CardFooter>
    </Card>
  );
}
