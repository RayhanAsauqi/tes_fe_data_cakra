import { useEffect, useState } from "react";

import ArticleCard from "@/components/container/card-article";
import useDebounce from "@/hooks/use-debounce";
import DefaultLayout from "@/layouts/default";
import { Pagination } from "@/components/ui/pagination";
import { useArticleStore } from "@/lib/store/article-store";

import DeleteArticleModal from "@/components/container/modal/articels/delete-articel";
import { useDisclosure } from "@/hooks/use-disclosure";
import AddArticleModal from "@/components/container/modal/articels/add-articel";
import { useCookies } from "react-cookie";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import EditArticleModal from "@/components/container/modal/articels/edit-articel";

export default function ArticlePage() {
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const [cookies] = useCookies(["token"]);
  const isAuthenticated = Boolean(cookies.token);

  const [selectedArticle, setSelectedArticle] = useState<{
    documentId: string;
    title: string;
    description?: string;
    cover_image_url?: string;
    category?: number;
  }>({
    documentId: "",
    title: "",
    description: "",
    cover_image_url: "",
    category: 0,
  });

  const { articles, currentPage, totalPages, total, loading, fetchArticles } =
    useArticleStore();
  const [debouncedSearch, search, setSearch] = useDebounce("", 800);

  useEffect(() => {
    fetchArticles(1, 6, debouncedSearch, true);
  }, [debouncedSearch, fetchArticles]);

  return (
    <DefaultLayout
      pageTitle="Articles"
      subTitle="Overview of your activities"
      search={{
        placeholder: "Search article by title...",
        value: search,
        onChange: (value) => setSearch(value.trim()),
      }}
      button={
        isAuthenticated ? (
          <AddArticleModal />
        ) : (
          <Link to="/auth">
            <Button className="bg-slate-800 hover:bg-slate-700 text-white">
              Add Article
            </Button>
          </Link>
        )
      }
    >
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2  gap-6">
        {loading ? (
          <>
            {[...Array(6)].map((_, index) => (
              <ArticleCard key={`skeleton-${index}`} isLoading />
            ))}
          </>
        ) : (
          <>
            {articles.map((article) => (
              <div key={article.id}>
                <ArticleCard
                  article={{
                    ...article,
                    comments: article.comments ?? [],
                    user: article.user ?? {},
                    category: article.category ?? {},
                  }}
                  onDelete={() => {
                    setSelectedArticle({
                      documentId: article.documentId,
                      title: article.title,
                    });
                    onDeleteOpen();
                  }}
                  onEdit={() => {
                    setSelectedArticle({
                      documentId: article.documentId,
                      title: article.title,
                      description: article.description ?? "",
                      cover_image_url: article.cover_image_url ?? "",
                      category: article.category?.id ?? 0,
                    });
                    onEditOpen();
                  }}
                />
              </div>
            ))}
          </>
        )}
      </div>
      <div className="my-6">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={6}
          total={total}
          onPageChange={(page) => fetchArticles(page, 6, debouncedSearch, true)}
        />
      </div>

      <DeleteArticleModal
        isOpen={isDeleteOpen}
        setIsOpen={onDeleteClose}
        data={{
          documentId: selectedArticle.documentId,
          title: selectedArticle.title,
        }}
      />

      <EditArticleModal
        isOpen={isEditOpen}
        setIsOpen={onEditClose}
        data={{
          documentId: selectedArticle.documentId,
          title: selectedArticle.title,
          description: selectedArticle.description ?? "",
          cover_image_url: selectedArticle.cover_image_url ?? "",
          category: selectedArticle.category ?? 0,
        }}
      />
    </DefaultLayout>
  );
}
