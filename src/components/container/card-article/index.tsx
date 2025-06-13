import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Article } from "@/lib/types/article";
import { ArrowRight, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

type ArticleCardProps = {
  article?: Article;
  isLoading?: boolean;
  onDelete?: () => void;
};

export default function ArticleCard(props: ArticleCardProps) {
  const truncateText = (text: string, maxLength: number = 120): string => {
    if (!text) return "";
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  if (props.isLoading || !props.article) {
    return (
      <div className="bg-white rounded-xl overflow-hidden shadow-sm border h-full">
        <Skeleton className="h-48 w-full rounded-none" />

        <div className="p-6 flex-grow flex flex-col">
          <Skeleton className="h-4 w-1/2 mb-3" />
          <Skeleton className="h-6 w-full mb-3" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4 mb-4" />

          <div className="flex justify-between items-center">
            <Skeleton className="h-8 w-24" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border hover:shadow-md transition-all duration-300  h-full group  ">
      <div className="relative h-48 w-full overflow-hidden">
        {props.article.cover_image_url ? (
          <img
            src={props.article.cover_image_url || "/placeholder.svg"}
            alt={props.article.title}
            className="aspect-video transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
            <span className="text-white text-lg font-medium">
              {props.article.title.charAt(0)}
            </span>
          </div>
        )}
      </div>

      <div className="p-6 flex-grow flex flex-col">
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />

            {new Date(props.article.publishedAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>

        <h2 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-purple-700 transition-colors">
          {props.article.title}
        </h2>

        <p className="text-gray-600 mb-4 line-clamp-3">
          {truncateText(props.article.description) ||
            "No description available"}
        </p>

        <div className="flex justify-between items-center">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-purple-700 hover:text-purple-800 hover:bg-purple-50 p-0 group"
          >
            <Link
              to={`/blog/${props.article.id}`}
              className="flex items-center gap-1"
            >
              Read more
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          <Button className="bg-slate-800" onClick={props.onDelete}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
