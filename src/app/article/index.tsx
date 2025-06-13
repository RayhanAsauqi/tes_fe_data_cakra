import { useEffect, useState } from "react";

import ArticleCard from "@/components/container/card-article";
import useDebounce from "@/hooks/use-debounce";
import DefaultLayout from "@/layouts/default";
import { Pagination } from "@/components/ui/pagination";
import { useArticleStore } from "@/lib/store/article-store";

import DeleteArticleModal from "@/components/container/modal/articels/delete-articel";
import { useDisclosure } from "@/hooks/use-disclosure";
import AddArticleModal from "@/components/container/modal/articels/add-articel";

export default function ArticlePage() {
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  const [selectedArticle, setSelectedArticle] = useState<{
    documentId: string;
    title: string;
  }>({ documentId: "", title: "" });

  const { articles, currentPage, totalPages, total, loading, fetchArticles } =
    useArticleStore();
  const [debouncedSearch, search, setSearch] = useDebounce("", 800);

  useEffect(() => {
    fetchArticles(1, 6, debouncedSearch);
  }, [debouncedSearch, fetchArticles]);

  const handleDelete = (id: string, title: string) => {
    setSelectedArticle({ documentId: id, title });
    onDeleteOpen();
  };

  useEffect(() => {
    console.log("Articles fetched:", articles);
  }, [articles]);

  return (
    <DefaultLayout
      pageTitle="Articles"
      subTitle="Overview of your activities"
      search={{
        placeholder: "Search article by title...",
        value: search,
        onChange: (value) => setSearch(value),
      }}
      button={<AddArticleModal />}
    >
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <>
            {[...Array(6)].map((_, index) => (
              <ArticleCard key={`skeleton-${index}`} isLoading />
            ))}
          </>
        ) : (
          <>
            {articles.map((article) => (
              <ArticleCard
                key={article.id}
                article={{
                  ...article,
                  comments: article.comments ?? [],
                  user: article.user ?? {},
                  category: article.category ?? {},
                }}
                onDelete={() => handleDelete(article.documentId, article.title)}
              />
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
          onPageChange={(page) => fetchArticles(page, 6, debouncedSearch)}
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
    </DefaultLayout>
  );
}
