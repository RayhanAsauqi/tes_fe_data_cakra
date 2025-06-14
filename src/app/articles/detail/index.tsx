import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, Globe } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import DefaultLayout from "@/layouts/default";
import { useArticleStore } from "@/lib/store/article-store";
import { formatDate, formatRelativeTime } from "@/utils/format/date";

export default function ArticleDetailPage() {
  const { documentId } = useParams<{ documentId: string }>();

  const { fetchArticlesByDocumentId, selectedArticle } = useArticleStore();
  useEffect(() => {
    if (documentId) {
      fetchArticlesByDocumentId(documentId);
    }
  }, [documentId, fetchArticlesByDocumentId]);

  return (
    <DefaultLayout pageTitle="Article Detail">
      <Link to="/">
        <Button
          size="lg"
          className="bg-slate-900 hover:bg-slate-800 text-white group/btn"
        >
          <ArrowLeft className="h-4 w-4 ml-1 transition-transform group-hover/btn:-translate-x-1" />
          <span className="ml-2">Back to Articles</span>
        </Button>
      </Link>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6"></div>
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="secondary" className="text-xs">
              Article #{selectedArticle?.id}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {selectedArticle?.documentId}
            </Badge>
          </div>

          <h1 className="text-4xl font-bold mb-4 leading-tight">
            {selectedArticle?.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>
                Published{" "}
                {formatRelativeTime(selectedArticle?.publishedAt || "")}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>
                Updated {formatRelativeTime(selectedArticle?.updatedAt || "")}
              </span>
            </div>
            {selectedArticle?.locale && (
              <div className="flex items-center gap-1">
                <Globe className="w-4 h-4" />
                <span>{selectedArticle?.locale}</span>
              </div>
            )}
          </div>
        </div>
        <div className="mb-8">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
            <img
              src={selectedArticle?.cover_image_url || "/placeholder.svg"}
              alt={selectedArticle?.title}
              className="object-cover"
            />
          </div>
        </div>
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Description</h2>
            <p className="text-muted-foreground leading-relaxed">
              {selectedArticle?.description}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Article Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-1">
                  Created
                </h4>
                <p className="text-sm">
                  {formatDate(selectedArticle?.createdAt || "")}
                </p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-1">
                  Last Updated
                </h4>
                <p className="text-sm">
                  {formatDate(selectedArticle?.updatedAt || "")}
                </p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-1">
                  Published
                </h4>
                <p className="text-sm">
                  {formatDate(selectedArticle?.publishedAt || "")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DefaultLayout>
  );
}
