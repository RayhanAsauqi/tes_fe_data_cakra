import { create } from "zustand";
import type { Category } from "../types/category";
import { API_URL } from "../constants/api-url";
import toast from "react-hot-toast";
import { Cookies } from "react-cookie";

type Pagination = {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
};
type ArticleCategoryState = {
    articleCategories: Category[];
    selectedCategory?: Category | null;
    pagination: Pagination | null;
    isLoading: boolean;
    error: string | null;
    fetchArticleCategories: (page: number, pageSize: number) => Promise<void>;
    fetchDetailCategory: (documentId: string) => Promise<Category | null>;
    createCategory: (data: {
        name: string;
        description?: string;
    }) => Promise<void>;
    editCategory: (
        documentId: string,
        data: { name: string; description?: string }
    ) => Promise<void>;
    deleteCategory?: (documentId: string) => Promise<void>;
};

const cookies = new Cookies();

export const useArticleCategoryStore = create<ArticleCategoryState>(
    (set, get) => ({
        articleCategories: [],
        selectedCategory: null,
        pagination: null,
        isLoading: false,
        error: null,
        fetchArticleCategories: async (page = 1, pageSize = 10) => {
            set({ isLoading: true, error: null });
            const token = cookies.get("token");

            try {
                const res = await fetch(
                    `${API_URL}/categories?pagination[page]=${page}&pagination[pageSize]=${pageSize}`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${atob(token)}`,
                        },
                    }
                );

                if (!res.ok) {
                    throw new Error(
                        `Failed to fetch categories: ${res.status}`
                    );
                }

                const json = await res.json();

                if (!json.data || !json.meta?.pagination) {
                    throw new Error("Invalid API response structure");
                }

                set({
                    articleCategories: json.data,
                    pagination: json.meta.pagination,
                    isLoading: false,
                    error: null,
                });
            } catch (error) {
                const errorMessage =
                    error instanceof Error
                        ? error.message
                        : "Failed to fetch articles";

                set({
                    isLoading: false,
                    error: errorMessage,
                    articleCategories: [],
                });

                toast.error(errorMessage, { position: "bottom-right" });
            }
        },
        fetchDetailCategory: async (documentId: string) => {
            set({ isLoading: true, error: null });
            const token = cookies.get("token");

            try {
                const res = await fetch(`${API_URL}/categories/${documentId}`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${atob(token)}`,
                    },
                });

                if (!res.ok) {
                    throw new Error(`Failed to fetch category: ${res.status}`);
                }

                const json = await res.json();

                if (!json.data) {
                    throw new Error("Invalid API response structure");
                }

                set({
                    selectedCategory: json.data,
                    isLoading: false,
                    error: null,
                });

                return json.data;
            } catch (error) {
                const errorMessage =
                    error instanceof Error
                        ? error.message
                        : "Failed to fetch category";

                set({ isLoading: false, error: errorMessage });
                toast.error(errorMessage, { position: "bottom-right" });
                return null;
            }
        },
        createCategory: async (data: {
            name: string;
            description?: string;
        }) => {
            set({ isLoading: true, error: null });
            const token = cookies.get("token");

            try {
                const res = await fetch(`${API_URL}/categories`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${atob(token)}`,
                    },
                    body: JSON.stringify({
                        data: {
                            name: data.name,
                            description: data.description || "",
                        },
                    }),
                });

                await res.json();

                toast.success("Article created successfully", {
                    position: "bottom-right",
                });

                const { pagination } = get();
                const currentPage = pagination?.page ?? 1;
                const pageSize = pagination?.pageSize ?? 10;
                await get().fetchArticleCategories(currentPage, pageSize);
            } catch (error) {
                const errorMessage =
                    error instanceof Error
                        ? error.message
                        : "Failed to create category";

                set({ isLoading: false, error: errorMessage });
                toast.error(errorMessage, { position: "bottom-right" });
                return;
            }
        },
        editCategory: async (
            documentId: string,
            data: { name: string; description?: string }
        ) => {
            set({ isLoading: true, error: null });
            const token = cookies.get("token");

            try {
                const res = await fetch(`${API_URL}/categories/${documentId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${atob(token)}`,
                    },
                    body: JSON.stringify({
                        data: {
                            name: data.name,
                            description: data.description || "",
                        },
                    }),
                });

                if (!res.ok) {
                    throw new Error(`Failed to update category: ${res.status}`);
                }

                toast.success("Category updated successfully", {
                    position: "bottom-right",
                });

                const { pagination } = get();
                const currentPage = pagination?.page ?? 1;
                const pageSize = pagination?.pageSize ?? 10;
                await get().fetchArticleCategories(currentPage, pageSize);

                set({ isLoading: false });
            } catch (error) {
                const errorMessage =
                    error instanceof Error
                        ? error.message
                        : "Failed to update category";

                set({ isLoading: false, error: errorMessage });
                toast.error(errorMessage, { position: "bottom-right" });
            }
        },

        deleteCategory: async (documentId: string) => {
            set({ isLoading: true, error: null });
            const token = cookies.get("token");

            try {
                const res = await fetch(`${API_URL}/categories/${documentId}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${atob(token)}`,
                    },
                });

                if (!res.ok) {
                    throw new Error(`Failed to delete category: ${res.status}`);
                }

                toast.success("Category deleted successfully", {
                    position: "bottom-right",
                });

                const { pagination } = get();
                const currentPage = pagination?.page ?? 1;
                const pageSize = pagination?.pageSize ?? 10;
                await get().fetchArticleCategories(currentPage, pageSize);
            } catch (error) {
                const errorMessage =
                    error instanceof Error
                        ? error.message
                        : "Failed to delete category";

                set({ isLoading: false, error: errorMessage });
                toast.error(errorMessage, { position: "bottom-right" });
            }
        },
    })
);
