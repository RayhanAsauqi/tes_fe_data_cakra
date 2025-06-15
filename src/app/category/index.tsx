import AddCategory from "@/components/container/modal/category/add-category";
import DeleteCategoryModal from "@/components/container/modal/category/delete-category";
import DetailModalCategory from "@/components/container/modal/category/detail-category";
import EditCategoryModal from "@/components/container/modal/category/edit-category";
import DataTable from "@/components/container/table";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { useDisclosure } from "@/hooks/use-disclosure";
import DefaultLayout from "@/layouts/default";
import { useArticleCategoryStore } from "@/lib/store/category-store";
import type { Category } from "@/lib/types/article";
import { formatDate } from "@/utils/format/date";
import { ArrowLeft, Eye, Pencil, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function CategoryPage() {
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();
  const {
    isOpen: isDetailOpen,
    onOpen: onDetailOpen,
    onClose: onDetailClose,
  } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  const {
    articleCategories,
    pagination,
    isLoading,
    error,
    fetchArticleCategories,
    fetchDetailCategory,
  } = useArticleCategoryStore();

  useEffect(() => {
    fetchArticleCategories(currentPage, pageSize);
  }, [currentPage, fetchArticleCategories]);

  const handleEditClick = async (documentId: string) => {
    try {
      const category = await fetchDetailCategory(documentId.toString());
      if (category) {
        setSelectedCategory(category);
        onEditOpen();
      }
    } catch (err) {
      console.error("Failed to fetch category details:", err);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <DefaultLayout pageTitle="Category" subTitle="Manage your categories">
      <div className="space-y-6">
        <Link to="/">
          <Button
            size="sm"
            className="bg-slate-900 hover:bg-slate-800 text-white group/btn"
          >
            <ArrowLeft className="h-4 w-4 ml-1 transition-transform group-hover/btn:-translate-x-1" />
            <span className="ml-2">Back to Articles</span>
          </Button>
        </Link>

        <div className="flex justify-end items-center">
          <AddCategory />
        </div>

        <DataTable
          columns={[
            { key: "no", title: "No." },
            { key: "name", title: "Name" },
            { key: "description", title: "Description" },
            { key: "createdAt", title: "Created At" },
            { key: "updatedAt", title: "Updated At" },
            { key: "action", title: "Action" },
          ]}
          rows={articleCategories.map((item, index) => ({
            no: (currentPage - 1) * pageSize + index + 1,
            id: item.id,
            name: item.name,
            description: item.description || "-",
            createdAt: formatDate(item.createdAt),
            updatedAt: formatDate(item.updatedAt),
            action: (
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => {
                    setSelectedCategory({
                      documentId: item.documentId ?? "",
                    });
                    onDetailOpen();
                  }}
                  className="bg-slate-800 hover:bg-slate-700"
                  size="sm"
                >
                  <Eye />
                </Button>
                <Button
                  onClick={() => handleEditClick(item.documentId)}
                  className="bg-slate-800 hover:bg-slate-700"
                  size="sm"
                >
                  <Pencil />
                </Button>
                <Button
                  className="bg-red-600 hover:bg-red-500"
                  size="sm"
                  onClick={() => {
                    setSelectedCategory({
                      documentId: item.documentId ?? "",
                      name: item.name ?? "",
                    });
                    onDeleteOpen();
                  }}
                >
                  <Trash />
                </Button>
              </div>
            ),
          }))}
          isLoading={isLoading}
          isError={!!error}
          errorMessages={error ?? ""}
          refreshCb={() => fetchArticleCategories(currentPage, pageSize)}
        />

        <div className="flex justify-center">
          <Pagination
            currentPage={pagination?.page ?? 1}
            totalPages={pagination?.pageCount ?? 1}
            pageSize={pagination?.pageSize ?? pageSize}
            total={pagination?.total ?? 0}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
      <EditCategoryModal
        isOpen={isEditOpen}
        setIsOpen={onEditClose}
        data={{
          documentId: selectedCategory?.documentId || "",
          name: selectedCategory?.name || "",
          description: selectedCategory?.description || "",
        }}
      />

      <DeleteCategoryModal
        isOpen={isDeleteOpen}
        setIsOpen={onDeleteClose}
        data={{
          documentId: selectedCategory?.documentId || "",
          name: selectedCategory?.name || "",
        }}
      />
      <DetailModalCategory
        isOpen={isDetailOpen}
        setIsOpen={onDetailClose}
        data={{
          documentId: selectedCategory?.documentId || "",
        }}
      />
    </DefaultLayout>
  );
}
