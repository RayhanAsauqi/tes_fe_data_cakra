import { create } from "zustand";
import type { Article, CreateArticlePayload } from "../types/article";
import { API_URL } from "../constants/api-url";
import toast from "react-hot-toast";
import { Cookies } from "react-cookie";

type ArticleState = {
    articles: Article[];
    selectedArticle?: Article | null;
    loading: boolean;
    error: string | null;
    currentPage: number;
    totalPages: number;
    total: number;

    fetchArticles: (
        page?: number,
        pageSize?: number,
        search?: string,
        withToken?: boolean
    ) => Promise<void>;
    fetchArticlesByDocumentId: (documentId: string) => Promise<void>;

    createArticle: (data: CreateArticlePayload) => Promise<void>;
    deleteArticle: (documentId: string) => Promise<void>;
    updateArticle: (
        documentId: string,
        data: CreateArticlePayload
    ) => Promise<void>;
};

const cookies = new Cookies();

export const useArticleStore = create<ArticleState>((set, get) => ({
    articles: [],
    selectedArticle: null,
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
    total: 0,

    fetchArticles: async (
        page = 1,
        pageSize = 10,
        search = "",
        withToken = false
    ) => {
        set({ loading: true, error: null });

        try {
            const token = cookies.get("token");
            const params = new URLSearchParams({
                "pagination[page]": page.toString(),
                "pagination[pageSize]": pageSize.toString(),
                populate: "*",
                ...(search && { "filters[title][$contains]": search }),
            });

            const headers: HeadersInit = {
                "Content-Type": "application/json",
            };

            if (withToken && token) {
                headers.Authorization = `Bearer ${atob(token)}`;
            }
            const res = await fetch(
                `${API_URL}/articles?${params.toString()}`,
                {
                    headers,
                }
            );

            if (!res.ok) {
                throw new Error(`Failed to fetch articles: ${res.status}`);
            }

            const json = await res.json();

            if (!json.data || !json.meta?.pagination) {
                throw new Error("Invalid API response structure");
            }

            set({
                articles: json.data,
                currentPage: json.meta.pagination.page,
                totalPages: json.meta.pagination.pageCount,
                total: json.meta.pagination.total,
                loading: false,
                error: null,
            });
        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Failed to fetch articles";

            set({
                loading: false,
                error: errorMessage,
                articles: [],
                currentPage: 1,
                totalPages: 1,
                total: 0,
            });

            toast.error(errorMessage, { position: "bottom-right" });
        }
    },

    fetchArticlesByDocumentId: async (documentId) => {
        set({ loading: true, error: null });

        const { articles } = get();
        const token = cookies.get("token");
        const matched = articles.find((a) => a.documentId === documentId);

        if (matched) {
            set({ selectedArticle: matched, loading: false });
            return;
        }

        try {
            const res = await fetch(`${API_URL}/articles/${documentId}`, {
                headers: {
                    Authorization: `Bearer ${atob(token)}`,
                },
            });

            if (!res.ok) {
                throw new Error(`Failed to fetch article: ${res.status}`);
            }

            const json = await res.json();

            if (!json.data) {
                throw new Error("Invalid API response structure");
            }

            set({
                selectedArticle: json.data,
                loading: false,
                error: null,
            });
        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Failed to fetch article";

            set({ loading: false, error: errorMessage });
            toast.error(errorMessage, { position: "bottom-right" });
        }
    },

    createArticle: async (data) => {
        set({ loading: true, error: null });
        const token = cookies.get("token");

        try {
            const res = await fetch(`${API_URL}/articles`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${atob(token)}`,
                },

                body: JSON.stringify({ data }),
            });

            if (!res.ok) {
                throw new Error(`Failed to create article: ${res.status}`);
            }

            await res.json();

            toast.success("Article created successfully", {
                position: "bottom-right",
            });

            const { currentPage } = get();
            await get().fetchArticles(currentPage);
        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Failed to create article";

            set({ loading: false, error: errorMessage });
            toast.error(errorMessage, { position: "bottom-right" });
        }
    },

    updateArticle: async (documentId, data) => {
        set({ loading: true, error: null });
        const token = cookies.get("token");

        try {
            const res = await fetch(`${API_URL}/articles/${documentId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${atob(token)}`,
                },
                body: JSON.stringify({ data }),
            });

            if (!res.ok) {
                throw new Error(`Failed to update article: ${res.status}`);
            }

            toast.success("Article updated successfully", {
                position: "bottom-right",
            });

            const { currentPage } = get();
            await get().fetchArticles(currentPage);
        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Failed to update article";

            set({ loading: false, error: errorMessage });
            toast.error(errorMessage, { position: "bottom-right" });
        }
    },

    deleteArticle: async (documentId) => {
        set({ loading: true, error: null });
        const token = cookies.get("token");

        try {
            const res = await fetch(`${API_URL}/articles/${documentId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${atob(token)}`,
                },
            });

            if (!res.ok) {
                throw new Error(`Failed to delete article: ${res.status}`);
            }

            toast.success("Article deleted successfully", {
                position: "bottom-right",
            });

            const { currentPage } = get();
            await get().fetchArticles(currentPage);
        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Failed to delete article";

            set({ loading: false, error: errorMessage });
            toast.error(errorMessage, { position: "bottom-right" });
        }
    },
}));
